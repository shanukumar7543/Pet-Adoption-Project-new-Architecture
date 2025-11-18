const express = require('express');
const router = express.Router();
const {
  getPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
  uploadPhotos,
  getStats
} = require('../controllers/petController');
const { protect, authorize } = require('../middleware/auth');
const { petValidation, validate } = require('../middleware/validator');
const upload = require('../middleware/upload');

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Get all pets
 *     description: Retrieve a paginated list of pets with optional filters. Public endpoint - no authentication required.
 *     tags: [Pets]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by pet name or breed
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *           enum: [Dog, Cat, Bird, Rabbit, Other]
 *         description: Filter by species
 *       - in: query
 *         name: breed
 *         schema:
 *           type: string
 *         description: Filter by breed
 *       - in: query
 *         name: minAge
 *         schema:
 *           type: integer
 *         description: Minimum age filter
 *       - in: query
 *         name: maxAge
 *         schema:
 *           type: integer
 *         description: Maximum age filter
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Available, Pending, Adopted]
 *         description: Filter by status (defaults to 'Available' for non-admin users)
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [Male, Female]
 *         description: Filter by gender
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           enum: [Small, Medium, Large]
 *         description: Filter by size
 *       - in: query
 *         name: adminView
 *         schema:
 *           type: boolean
 *         description: If true, shows pets with all statuses (admin only)
 *     responses:
 *       200:
 *         description: List of pets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   description: Number of pets in current page
 *                 total:
 *                   type: integer
 *                   description: Total number of pets matching filters
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 pages:
 *                   type: integer
 *                   description: Total number of pages
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Server error
 */
router.get('/', getPets);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Get single pet
 *     description: Retrieve details of a specific pet by ID. Public endpoint - no authentication required.
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pet ID
 *     responses:
 *       200:
 *         description: Pet details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Pet'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 */
router.get('/:id', getPet);

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Create new pet
 *     description: Add a new pet to the system. Admin only.
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - breed
 *               - age
 *               - gender
 *               - size
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 50
 *                 example: Buddy
 *               species:
 *                 type: string
 *                 enum: [Dog, Cat, Bird, Rabbit, Other]
 *                 example: Dog
 *               breed:
 *                 type: string
 *                 example: Golden Retriever
 *               age:
 *                 type: number
 *                 minimum: 0
 *                 example: 3
 *               gender:
 *                 type: string
 *                 enum: [Male, Female]
 *                 example: Male
 *               size:
 *                 type: string
 *                 enum: [Small, Medium, Large]
 *                 example: Large
 *               color:
 *                 type: string
 *                 example: Golden
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Friendly and energetic dog, great with kids
 *               medicalHistory:
 *                 type: string
 *                 maxLength: 500
 *                 example: Vaccinated, no known health issues
 *               vaccinated:
 *                 type: boolean
 *                 example: true
 *               neutered:
 *                 type: boolean
 *                 example: true
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["/uploads/pet-photo-1.jpg"]
 *               status:
 *                 type: string
 *                 enum: [Available, Pending, Adopted]
 *                 default: Available
 *                 example: Available
 *               adoptionFee:
 *                 type: number
 *                 minimum: 0
 *                 example: 150
 *               location:
 *                 type: string
 *                 example: New York, NY
 *     responses:
 *       201:
 *         description: Pet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Pet'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         description: Server error
 */
router.post('/', protect, authorize('admin'), petValidation, validate, createPet);

/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     summary: Update pet
 *     description: Update pet details. Admin only.
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *                 enum: [Dog, Cat, Bird, Rabbit, Other]
 *               breed:
 *                 type: string
 *               age:
 *                 type: number
 *               gender:
 *                 type: string
 *                 enum: [Male, Female]
 *               size:
 *                 type: string
 *                 enum: [Small, Medium, Large]
 *               color:
 *                 type: string
 *               description:
 *                 type: string
 *               medicalHistory:
 *                 type: string
 *               vaccinated:
 *                 type: boolean
 *               neutered:
 *                 type: boolean
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [Available, Pending, Adopted]
 *               adoptionFee:
 *                 type: number
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Pet'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 */
router.put('/:id', protect, authorize('admin'), updatePet);

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Delete pet
 *     description: Delete a pet from the system. Admin only.
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pet ID
 *     responses:
 *       200:
 *         description: Pet deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, authorize('admin'), deletePet);

/**
 * @swagger
 * /api/pets/{id}/photos:
 *   post:
 *     summary: Upload pet photos
 *     description: Upload one or more photos for a pet. Supports up to 10 images. Admin only.
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pet ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Pet photos (up to 10 images)
 *     responses:
 *       200:
 *         description: Photos uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Pet'
 *                 message:
 *                   type: string
 *                   example: Successfully uploaded 3 image(s)
 *       400:
 *         description: No photos uploaded
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 */
router.post('/:id/photos', protect, authorize('admin'), upload.array('photos', 10), uploadPhotos);

/**
 * @swagger
 * /api/pets/admin/stats:
 *   get:
 *     summary: Get pet statistics
 *     description: Get statistics about pets (status distribution, species distribution). Admin only.
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     statusStats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Status name
 *                             example: Available
 *                           count:
 *                             type: integer
 *                             description: Number of pets with this status
 *                             example: 15
 *                     speciesStats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Species name
 *                             example: Dog
 *                           count:
 *                             type: integer
 *                             description: Number of pets of this species
 *                             example: 20
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         description: Server error
 */
router.get('/admin/stats', protect, authorize('admin'), getStats);

module.exports = router;
