const petRepository = require('../repositories/petRepository');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../utils/apiError');

/**
 * Pet Service - Handles pet management business logic
 */
class PetService {
  /**
   * Build query from request parameters
   * @param {Object} queryParams - Request query parameters
   * @returns {Object} MongoDB query object
   */
  buildQuery(queryParams) {
    const query = {};

    // Search by name or breed
    if (queryParams.search) {
      query.$or = [
        { name: { $regex: queryParams.search, $options: 'i' } },
        { breed: { $regex: queryParams.search, $options: 'i' } }
      ];
    }

    // Filter by species
    if (queryParams.species) {
      query.species = queryParams.species;
    }

    // Filter by breed
    if (queryParams.breed) {
      query.breed = { $regex: queryParams.breed, $options: 'i' };
    }

    // Filter by age range
    if (queryParams.minAge || queryParams.maxAge) {
      query.age = {};
      if (queryParams.minAge) query.age.$gte = parseInt(queryParams.minAge);
      if (queryParams.maxAge) query.age.$lte = parseInt(queryParams.maxAge);
    }

    // Filter by status
    if (queryParams.status) {
      query.status = queryParams.status;
    } else if (queryParams.adminView !== 'true') {
      query.status = 'Available';
    }

    // Filter by gender
    if (queryParams.gender) {
      query.gender = queryParams.gender;
    }

    // Filter by size
    if (queryParams.size) {
      query.size = queryParams.size;
    }

    return query;
  }

  /**
   * Get pets with pagination and filtering
   * @param {Object} queryParams - Query parameters
   * @returns {Promise<Object>} Paginated pets data
   */
  async getPets(queryParams) {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 12;
    const skip = (page - 1) * limit;

    const query = this.buildQuery(queryParams);

    const [pets, total] = await Promise.all([
      petRepository.findWithPagination(query, skip, limit),
      petRepository.count(query)
    ]);

    return {
      pets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get single pet by ID
   * @param {string} petId - Pet ID
   * @returns {Promise<Object>} Pet data
   */
  async getPetById(petId) {
    const pet = await petRepository.findById(petId);
    
    if (!pet) {
      throw new NotFoundError('Pet not found');
    }

    return pet;
  }

  /**
   * Create a new pet
   * @param {Object} petData - Pet data
   * @param {string} userRole - User role
   * @returns {Promise<Object>} Created pet
   */
  async createPet(petData, userRole) {
    if (userRole !== 'admin') {
      throw new ForbiddenError('Only admins can add pets');
    }

    const pet = await petRepository.create(petData);
    return pet;
  }

  /**
   * Update a pet
   * @param {string} petId - Pet ID
   * @param {Object} updateData - Data to update
   * @param {string} userRole - User role
   * @returns {Promise<Object>} Updated pet
   */
  async updatePet(petId, updateData, userRole) {
    if (userRole !== 'admin') {
      throw new ForbiddenError('Only admins can update pets');
    }

    const pet = await petRepository.findById(petId);
    
    if (!pet) {
      throw new NotFoundError('Pet not found');
    }

    const updatedPet = await petRepository.update(petId, updateData);
    return updatedPet;
  }

  /**
   * Delete a pet
   * @param {string} petId - Pet ID
   * @param {string} userRole - User role
   * @returns {Promise<Object>} Deleted pet
   */
  async deletePet(petId, userRole) {
    if (userRole !== 'admin') {
      throw new ForbiddenError('Only admins can delete pets');
    }

    const pet = await petRepository.findById(petId);
    
    if (!pet) {
      throw new NotFoundError('Pet not found');
    }

    const deletedPet = await petRepository.delete(petId);
    return deletedPet;
  }

  /**
   * Update pet status
   * @param {string} petId - Pet ID
   * @param {string} status - New status
   * @param {string} userRole - User role
   * @returns {Promise<Object>} Updated pet
   */
  async updatePetStatus(petId, status, userRole) {
    if (userRole !== 'admin') {
      throw new ForbiddenError('Only admins can update pet status');
    }

    const validStatuses = ['Available', 'Pending', 'Adopted'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const pet = await petRepository.findById(petId);
    
    if (!pet) {
      throw new NotFoundError('Pet not found');
    }

    const updatedPet = await petRepository.updateStatus(petId, status);
    return updatedPet;
  }
}

module.exports = new PetService();

