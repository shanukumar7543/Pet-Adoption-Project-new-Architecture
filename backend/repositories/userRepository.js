const User = require('../models/User');

/**
 * User Repository - Handles all database operations for User model
 */
class UserRepository {
  /**
   * Find user by email
   * @param {string} email - User email
   * @param {boolean} includePassword - Include password field
   * @returns {Promise<Object|null>} User document or null
   */
  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email });
    if (includePassword) {
      query.select('+password');
    }
    return await query;
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User document or null
   */
  async findById(id) {
    return await User.findById(id);
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user document
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Update user by ID
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated user document or null
   */
  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  /**
   * Delete user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} Deleted user document or null
   */
  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  /**
   * Check if user exists by email
   * @param {string} email - User email
   * @returns {Promise<boolean>} True if user exists
   */
  async existsByEmail(email) {
    const count = await User.countDocuments({ email });
    return count > 0;
  }

  /**
   * Get all users with pagination
   * @param {number} skip - Number of documents to skip
   * @param {number} limit - Number of documents to return
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Array>} Array of user documents
   */
  async findAll(skip = 0, limit = 10, filter = {}) {
    return await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Count users matching filter
   * @param {Object} filter - Filter criteria
   * @returns {Promise<number>} Count of users
   */
  async count(filter = {}) {
    return await User.countDocuments(filter);
  }
}

module.exports = new UserRepository();

