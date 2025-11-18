const applicationService = require('../services/applicationService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Application Controller - Handles HTTP requests for adoption applications
 */

/**
 * @desc    Create a new adoption application
 * @route   POST /api/applications
 * @access  Private
 */
exports.createApplication = async (req, res, next) => {
  try {
    const { pet, applicantInfo } = req.body;
    const application = await applicationService.createApplication(
      pet,
      req.user._id,
      applicantInfo
    );
    return ApiResponse.created(res, 'Application submitted successfully', application);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get applications (user's own or all for admin)
 * @route   GET /api/applications
 * @access  Private
 */
exports.getApplications = async (req, res, next) => {
  try {
    const result = await applicationService.getApplications(
      req.user._id,
      req.user.role,
      req.query
    );
    
    return ApiResponse.paginated(
      res,
      200,
      'Applications retrieved successfully',
      result.applications,
      result.pagination
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single application by ID
 * @route   GET /api/applications/:id
 * @access  Private
 */
exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await applicationService.getApplicationById(
      req.params.id,
      req.user._id,
      req.user.role
    );
    return ApiResponse.success(res, 200, 'Application retrieved successfully', application);
  } catch (error) {
    next(error);
  }
};

// Alias for backward compatibility
exports.getApplication = exports.getApplicationById;

/**
 * @desc    Update application status (approve/reject)
 * @route   PATCH /api/applications/:id/status
 * @access  Private (Admin only)
 */
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, reviewNotes } = req.body;
    const application = await applicationService.updateApplicationStatus(
      req.params.id,
      status,
      req.user._id,
      reviewNotes,
      req.user.role
    );
    return ApiResponse.success(res, 200, 'Application status updated successfully', application);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an application
 * @route   DELETE /api/applications/:id
 * @access  Private
 */
exports.deleteApplication = async (req, res, next) => {
  try {
    await applicationService.deleteApplication(
      req.params.id,
      req.user._id,
      req.user.role
    );
    return ApiResponse.success(res, 200, 'Application deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get application statistics
 * @route   GET /api/applications/stats
 * @access  Private (Admin only)
 */
exports.getStats = async (req, res, next) => {
  try {
    const Application = require('../models/Application');
    const { ForbiddenError } = require('../utils/apiError');

    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Only admins can view application statistics');
    }

    // Get application statistics by status
    const stats = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    return ApiResponse.success(res, 200, 'Statistics retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};
