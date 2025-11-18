const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication,
  getStats
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const { applicationValidation, validate } = require('../middleware/validator');

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Create adoption application
 *     description: Submit a new adoption application for a pet. Authenticated users only.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pet
 *               - applicantInfo
 *             properties:
 *               pet:
 *                 type: string
 *                 description: Pet ID to apply for
 *                 example: 60d5f484f1b2c72b8c8e4f5b
 *               applicantInfo:
 *                 type: object
 *                 required:
 *                   - phone
 *                   - address
 *                   - housingType
 *                   - experience
 *                   - reason
 *                 properties:
 *                   phone:
 *                     type: string
 *                     description: Contact phone number
 *                     example: "+1234567890"
 *                   address:
 *                     type: string
 *                     description: Complete address
 *                     example: "123 Main St, City, State 12345"
 *                   housingType:
 *                     type: string
 *                     enum: [House, Apartment, Condo, Other]
 *                     description: Type of housing
 *                     example: House
 *                   hasYard:
 *                     type: boolean
 *                     description: Has a yard
 *                     example: true
 *                   hasPets:
 *                     type: boolean
 *                     description: Currently owns pets
 *                     example: false
 *                   petsDescription:
 *                     type: string
 *                     description: Description of current pets (if any)
 *                     example: "1 cat, indoor only"
 *                   experience:
 *                     type: string
 *                     description: Pet ownership experience
 *                     example: "Owned dogs for 10 years"
 *                   reason:
 *                     type: string
 *                     maxLength: 500
 *                     description: Reason for adoption
 *                     example: "Looking for a companion for my family"
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Validation error or pet not available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 */
router.post('/', protect, applicationValidation, validate, createApplication);

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get applications
 *     description: Get all applications. Admins see all applications, regular users see only their own.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
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
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Approved, Rejected]
 *         description: Filter by application status
 *     responses:
 *       200:
 *         description: List of applications retrieved successfully
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
 *                   description: Number of applications in current page
 *                 total:
 *                   type: integer
 *                   description: Total number of applications
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 pages:
 *                   type: integer
 *                   description: Total number of pages
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Server error
 */
router.get('/', protect, getApplications);

/**
 * @swagger
 * /api/applications/stats:
 *   get:
 *     summary: Get application statistics
 *     description: Get statistics about applications (status distribution). Admin only.
 *     tags: [Applications]
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Status name
 *                         example: Pending
 *                       count:
 *                         type: integer
 *                         description: Number of applications with this status
 *                         example: 10
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         description: Server error
 */
router.get('/stats', protect, authorize('admin'), getStats);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get single application
 *     description: Get details of a specific application. Users can only see their own applications, admins can see all.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized to access this application
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 */
router.get('/:id', protect, getApplication);

/**
 * @swagger
 * /api/applications/{id}/status:
 *   put:
 *     summary: Update application status
 *     description: Approve or reject an adoption application. Admin only. When approved, pet status changes to 'Adopted' and all other pending applications for that pet are automatically rejected.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Approved, Rejected]
 *                 description: New status (must be Approved or Rejected)
 *                 example: Approved
 *               notes:
 *                 type: string
 *                 description: Admin notes about the decision
 *                 example: "Good candidate, approved"
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid status or application already reviewed
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 */
router.put('/:id/status', protect, authorize('admin'), updateApplicationStatus);

/**
 * @swagger
 * /api/applications/{id}:
 *   delete:
 *     summary: Delete application
 *     description: Delete an adoption application. Users can delete their own pending applications, admins can delete any pending application. Reviewed applications cannot be deleted.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application deleted successfully
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
 *       400:
 *         description: Cannot delete reviewed application
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized to delete this application
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, deleteApplication);

module.exports = router;
