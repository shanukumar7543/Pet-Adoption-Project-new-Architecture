const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Auth Controller - Handles HTTP requests for authentication
 */

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const userData = await authService.register(req.body);
    return ApiResponse.created(res, 'User registered successfully', userData);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await authService.login(email, password);
    return ApiResponse.success(res, 200, 'Login successful', userData);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    return ApiResponse.success(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const userData = await authService.updateProfile(req.user._id, req.body);
    return ApiResponse.success(res, 200, 'Profile updated successfully', userData);
  } catch (error) {
    next(error);
  }
};
