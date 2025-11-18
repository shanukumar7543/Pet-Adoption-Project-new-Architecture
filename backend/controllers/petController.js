const petService = require('../services/petService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Pet Controller - Handles HTTP requests for pet management
 */

/**
 * @desc    Get all pets with pagination and filtering
 * @route   GET /api/pets
 * @access  Public
 */
exports.getPets = async (req, res, next) => {
  try {
    const result = await petService.getPets(req.query);
    
    return ApiResponse.paginated(
      res,
      200,
      'Pets retrieved successfully',
      result.pets,
      result.pagination
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single pet by ID
 * @route   GET /api/pets/:id
 * @access  Public
 */
exports.getPetById = async (req, res, next) => {
  try {
    const pet = await petService.getPetById(req.params.id);
    return ApiResponse.success(res, 200, 'Pet retrieved successfully', pet);
  } catch (error) {
    next(error);
  }
};

// Alias for backward compatibility
exports.getPet = exports.getPetById;

/**
 * @desc    Create a new pet
 * @route   POST /api/pets
 * @access  Private (Admin only)
 */
exports.createPet = async (req, res, next) => {
  try {
    const pet = await petService.createPet(req.body, req.user.role);
    return ApiResponse.created(res, 'Pet created successfully', pet);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a pet
 * @route   PUT /api/pets/:id
 * @access  Private (Admin only)
 */
exports.updatePet = async (req, res, next) => {
  try {
    const pet = await petService.updatePet(req.params.id, req.body, req.user.role);
    return ApiResponse.success(res, 200, 'Pet updated successfully', pet);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a pet
 * @route   DELETE /api/pets/:id
 * @access  Private (Admin only)
 */
exports.deletePet = async (req, res, next) => {
  try {
    await petService.deletePet(req.params.id, req.user.role);
    return ApiResponse.success(res, 200, 'Pet deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update pet status
 * @route   PATCH /api/pets/:id/status
 * @access  Private (Admin only)
 */
exports.updatePetStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const pet = await petService.updatePetStatus(req.params.id, status, req.user.role);
    return ApiResponse.success(res, 200, 'Pet status updated successfully', pet);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload pet photos
 * @route   POST /api/pets/:id/photos
 * @access  Private (Admin only)
 */
exports.uploadPhotos = async (req, res, next) => {
  try {
    const petRepository = require('../repositories/petRepository');
    const { ForbiddenError, NotFoundError, BadRequestError } = require('../utils/apiError');

    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Only admins can upload pet photos');
    }

    if (!req.files || req.files.length === 0) {
      throw new BadRequestError('Please upload at least one photo');
    }

    const pet = await petRepository.findById(req.params.id);
    if (!pet) {
      throw new NotFoundError('Pet not found');
    }

    // Get photo paths
    const photoPaths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);
    
    // Add new photos to existing photos
    pet.photos = [...pet.photos, ...photoPaths];
    
    await pet.save();

    return ApiResponse.success(
      res,
      200,
      `Successfully uploaded ${req.files.length} image(s)`,
      pet
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get pet statistics
 * @route   GET /api/pets/admin/stats
 * @access  Private (Admin only)
 */
exports.getStats = async (req, res, next) => {
  try {
    const Pet = require('../models/Pet');
    const { ForbiddenError } = require('../utils/apiError');

    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Only admins can view pet statistics');
    }

    // Get status statistics
    const statusStats = await Pet.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Get species statistics
    const speciesStats = await Pet.aggregate([
      { $group: { _id: '$species', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return ApiResponse.success(res, 200, 'Statistics retrieved successfully', {
      statusStats,
      speciesStats
    });
  } catch (error) {
    next(error);
  }
};
