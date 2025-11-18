const Pet = require('../models/Pet');

/**
 * Pet Repository - Handles all database operations for Pet model
 */
class PetRepository {
  /**
   * Find pet by ID
   * @param {string} id - Pet ID
   * @returns {Promise<Object|null>} Pet document or null
   */
  async findById(id) {
    return await Pet.findById(id);
  }

  /**
   * Create a new pet
   * @param {Object} petData - Pet data
   * @returns {Promise<Object>} Created pet document
   */
  async create(petData) {
    return await Pet.create(petData);
  }

  /**
   * Update pet by ID
   * @param {string} id - Pet ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated pet document or null
   */
  async update(id, updateData) {
    return await Pet.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
  }

  /**
   * Delete pet by ID
   * @param {string} id - Pet ID
   * @returns {Promise<Object|null>} Deleted pet document or null
   */
  async delete(id) {
    return await Pet.findByIdAndDelete(id);
  }

  /**
   * Find pets with pagination and filtering
   * @param {Object} query - Query filter
   * @param {number} skip - Number of documents to skip
   * @param {number} limit - Number of documents to return
   * @param {Object} sort - Sort criteria
   * @returns {Promise<Array>} Array of pet documents
   */
  async findWithPagination(query = {}, skip = 0, limit = 10, sort = { createdAt: -1 }) {
    return await Pet.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  /**
   * Count pets matching query
   * @param {Object} query - Query filter
   * @returns {Promise<number>} Count of pets
   */
  async count(query = {}) {
    return await Pet.countDocuments(query);
  }

  /**
   * Find all pets (no pagination)
   * @param {Object} query - Query filter
   * @param {Object} sort - Sort criteria
   * @returns {Promise<Array>} Array of pet documents
   */
  async findAll(query = {}, sort = { createdAt: -1 }) {
    return await Pet.find(query).sort(sort);
  }

  /**
   * Update pet status
   * @param {string} id - Pet ID
   * @param {string} status - New status
   * @returns {Promise<Object|null>} Updated pet document or null
   */
  async updateStatus(id, status) {
    return await Pet.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  /**
   * Check if pet exists by ID
   * @param {string} id - Pet ID
   * @returns {Promise<boolean>} True if pet exists
   */
  async exists(id) {
    const count = await Pet.countDocuments({ _id: id });
    return count > 0;
  }

  /**
   * Get distinct values for a field
   * @param {string} field - Field name
   * @param {Object} query - Query filter
   * @returns {Promise<Array>} Array of distinct values
   */
  async getDistinct(field, query = {}) {
    return await Pet.distinct(field, query);
  }
}

module.exports = new PetRepository();

