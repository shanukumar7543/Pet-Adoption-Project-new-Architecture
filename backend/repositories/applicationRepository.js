const Application = require('../models/Application');

/**
 * Application Repository - Handles all database operations for Application model
 */
class ApplicationRepository {
  /**
   * Find application by ID
   * @param {string} id - Application ID
   * @param {boolean} populate - Whether to populate references
   * @returns {Promise<Object|null>} Application document or null
   */
  async findById(id, populate = true) {
    let query = Application.findById(id);
    
    if (populate) {
      query = query
        .populate('pet')
        .populate('applicant', 'name email');
    }
    
    return await query;
  }

  /**
   * Create a new application
   * @param {Object} applicationData - Application data
   * @returns {Promise<Object>} Created application document
   */
  async create(applicationData) {
    const application = await Application.create(applicationData);
    return await application
      .populate('pet')
      .populate('applicant', 'name email');
  }

  /**
   * Update application by ID
   * @param {string} id - Application ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated application document or null
   */
  async update(id, updateData) {
    return await Application.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
      .populate('pet')
      .populate('applicant', 'name email');
  }

  /**
   * Delete application by ID
   * @param {string} id - Application ID
   * @returns {Promise<Object|null>} Deleted application document or null
   */
  async delete(id) {
    return await Application.findByIdAndDelete(id)
      .populate('pet')
      .populate('applicant', 'name email');
  }

  /**
   * Find applications with pagination and filtering
   * @param {Object} query - Query filter
   * @param {number} skip - Number of documents to skip
   * @param {number} limit - Number of documents to return
   * @param {Object} sort - Sort criteria
   * @returns {Promise<Array>} Array of application documents
   */
  async findWithPagination(query = {}, skip = 0, limit = 10, sort = { createdAt: -1 }) {
    return await Application.find(query)
      .populate('pet')
      .populate('applicant', 'name email')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  /**
   * Count applications matching query
   * @param {Object} query - Query filter
   * @returns {Promise<number>} Count of applications
   */
  async count(query = {}) {
    return await Application.countDocuments(query);
  }

  /**
   * Find one application by query
   * @param {Object} query - Query filter
   * @returns {Promise<Object|null>} Application document or null
   */
  async findOne(query) {
    return await Application.findOne(query)
      .populate('pet')
      .populate('applicant', 'name email');
  }

  /**
   * Find all applications (no pagination)
   * @param {Object} query - Query filter
   * @param {Object} sort - Sort criteria
   * @returns {Promise<Array>} Array of application documents
   */
  async findAll(query = {}, sort = { createdAt: -1 }) {
    return await Application.find(query)
      .populate('pet')
      .populate('applicant', 'name email')
      .sort(sort);
  }

  /**
   * Update application status
   * @param {string} id - Application ID
   * @param {string} status - New status
   * @param {string} reviewedBy - Admin ID who reviewed
   * @param {string} reviewNotes - Review notes
   * @returns {Promise<Object|null>} Updated application document or null
   */
  async updateStatus(id, status, reviewedBy = null, reviewNotes = null) {
    const updateData = { 
      status,
      reviewedAt: new Date()
    };
    
    if (reviewedBy) updateData.reviewedBy = reviewedBy;
    if (reviewNotes) updateData.reviewNotes = reviewNotes;
    
    return await Application.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
      .populate('pet')
      .populate('applicant', 'name email');
  }

  /**
   * Check if application exists
   * @param {Object} query - Query filter
   * @returns {Promise<boolean>} True if application exists
   */
  async exists(query) {
    const count = await Application.countDocuments(query);
    return count > 0;
  }

  /**
   * Count applications by status for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Object with status counts
   */
  async countByStatusForUser(userId) {
    const result = await Application.aggregate([
      { $match: { applicant: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    return result.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
  }
}

module.exports = new ApplicationRepository();

