const applicationRepository = require('../repositories/applicationRepository');
const petRepository = require('../repositories/petRepository');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../utils/apiError');

/**
 * Application Service - Handles adoption application business logic
 */
class ApplicationService {
  /**
   * Create a new adoption application
   * @param {string} petId - Pet ID
   * @param {string} userId - User ID
   * @param {Object} applicantInfo - Applicant information
   * @returns {Promise<Object>} Created application
   */
  async createApplication(petId, userId, applicantInfo) {
    // Check if pet exists
    const pet = await petRepository.findById(petId);
    if (!pet) {
      throw new NotFoundError('Pet not found');
    }

    // Check if pet is available
    if (pet.status !== 'Available') {
      throw new BadRequestError('This pet is not available for adoption');
    }

    // Check for existing application
    const existingApplication = await applicationRepository.exists({
      pet: petId,
      applicant: userId
    });

    if (existingApplication) {
      throw new BadRequestError('You have already applied for this pet');
    }

    // Create application
    const application = await applicationRepository.create({
      pet: petId,
      applicant: userId,
      applicantInfo
    });

    // Update pet status to Pending
    await petRepository.updateStatus(petId, 'Pending');

    return application;
  }

  /**
   * Get applications with filtering and pagination
   * @param {string} userId - User ID
   * @param {string} userRole - User role
   * @param {Object} queryParams - Query parameters
   * @returns {Promise<Object>} Applications with pagination
   */
  async getApplications(userId, userRole, queryParams) {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Non-admin users can only see their own applications
    if (userRole !== 'admin') {
      query.applicant = userId;
    }

    // Filter by status
    if (queryParams.status) {
      query.status = queryParams.status;
    }

    // Filter by pet ID (for admins viewing specific pet applications)
    if (queryParams.petId && userRole === 'admin') {
      query.pet = queryParams.petId;
    }

    const [applications, total] = await Promise.all([
      applicationRepository.findWithPagination(query, skip, limit),
      applicationRepository.count(query)
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get single application by ID
   * @param {string} applicationId - Application ID
   * @param {string} userId - User ID
   * @param {string} userRole - User role
   * @returns {Promise<Object>} Application data
   */
  async getApplicationById(applicationId, userId, userRole) {
    const application = await applicationRepository.findById(applicationId);
    
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Non-admin users can only view their own applications
    if (userRole !== 'admin' && application.applicant._id.toString() !== userId) {
      throw new ForbiddenError('Not authorized to view this application');
    }

    return application;
  }

  /**
   * Update application status (approve/reject)
   * @param {string} applicationId - Application ID
   * @param {string} status - New status
   * @param {string} adminId - Admin ID
   * @param {string} reviewNotes - Review notes
   * @param {string} userRole - User role
   * @returns {Promise<Object>} Updated application
   */
  async updateApplicationStatus(applicationId, status, adminId, reviewNotes, userRole) {
    if (userRole !== 'admin') {
      throw new ForbiddenError('Only admins can update application status');
    }

    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const application = await applicationRepository.findById(applicationId);
    
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Update application status
    const updatedApplication = await applicationRepository.updateStatus(
      applicationId,
      status,
      adminId,
      reviewNotes
    );

    // Update pet status based on application status
    if (status === 'Approved') {
      await petRepository.updateStatus(application.pet._id, 'Adopted');
      
      // Reject all other pending applications for this pet
      await this.rejectOtherApplications(application.pet._id, applicationId);
    } else if (status === 'Rejected') {
      // Check if there are other pending applications for this pet
      const otherPendingApps = await applicationRepository.count({
        pet: application.pet._id,
        status: 'Pending',
        _id: { $ne: applicationId }
      });

      // If no other pending applications, set pet status back to Available
      if (otherPendingApps === 0) {
        await petRepository.updateStatus(application.pet._id, 'Available');
      }
    }

    return updatedApplication;
  }

  /**
   * Reject all other applications for a pet
   * @param {string} petId - Pet ID
   * @param {string} excludeApplicationId - Application ID to exclude
   * @returns {Promise<void>}
   */
  async rejectOtherApplications(petId, excludeApplicationId) {
    const otherApplications = await applicationRepository.findAll({
      pet: petId,
      status: 'Pending',
      _id: { $ne: excludeApplicationId }
    });

    const updatePromises = otherApplications.map(app =>
      applicationRepository.updateStatus(
        app._id,
        'Rejected',
        null,
        'Pet adopted by another applicant'
      )
    );

    await Promise.all(updatePromises);
  }

  /**
   * Delete an application
   * @param {string} applicationId - Application ID
   * @param {string} userId - User ID
   * @param {string} userRole - User role
   * @returns {Promise<Object>} Deleted application
   */
  async deleteApplication(applicationId, userId, userRole) {
    const application = await applicationRepository.findById(applicationId);
    
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Users can delete their own pending applications, admins can delete any
    if (userRole !== 'admin' && application.applicant._id.toString() !== userId) {
      throw new ForbiddenError('Not authorized to delete this application');
    }

    // Only allow deletion of pending applications
    if (application.status !== 'Pending') {
      throw new BadRequestError('Can only delete pending applications');
    }

    const deletedApplication = await applicationRepository.delete(applicationId);

    // Check if there are other pending applications for this pet
    const otherPendingApps = await applicationRepository.count({
      pet: application.pet._id,
      status: 'Pending'
    });

    // If no other pending applications, set pet status back to Available
    if (otherPendingApps === 0) {
      await petRepository.updateStatus(application.pet._id, 'Available');
    }

    return deletedApplication;
  }
}

module.exports = new ApplicationService();

