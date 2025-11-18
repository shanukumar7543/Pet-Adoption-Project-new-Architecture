const userRepository = require('../repositories/userRepository');
const generateToken = require('../utils/generateToken');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../utils/apiError');

/**
 * Auth Service - Handles authentication business logic
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User data with token
   */
  async register(userData) {
    const { name, email, password, phone, address, role } = userData;

    // Check if user already exists
    const userExists = await userRepository.existsByEmail(email);
    if (userExists) {
      throw new BadRequestError('User already exists');
    }

    // Create user
    const user = await userRepository.create({
      name,
      email,
      password,
      phone,
      address,
      role: role || 'user'
    });

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      token
    };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data with token
   */
  async login(email, password) {
    // Find user with password
    const user = await userRepository.findByEmail(email, true);
    
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      token
    };
  }

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(userId, updateData) {
    const { name, phone, address } = updateData;

    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update only allowed fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    const updatedUser = await user.save();

    // Return user data without sensitive fields
    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address
    };
  }
}

module.exports = new AuthService();

