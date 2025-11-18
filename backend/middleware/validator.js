const { body, query, validationResult } = require('express-validator');

// Middleware to check validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// User login validation
exports.loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Pet validation
exports.petValidation = [
  body('name').trim().notEmpty().withMessage('Pet name is required'),
  body('species').isIn(['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']).withMessage('Invalid species'),
  body('breed').trim().notEmpty().withMessage('Breed is required'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a positive number'),
  body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
  body('size').isIn(['Small', 'Medium', 'Large']).withMessage('Invalid size'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

// Application validation
exports.applicationValidation = [
  body('pet').notEmpty().withMessage('Pet ID is required'),
  body('applicantInfo.phone').trim().notEmpty().withMessage('Phone number is required'),
  body('applicantInfo.address').trim().notEmpty().withMessage('Address is required'),
  body('applicantInfo.housingType').isIn(['House', 'Apartment', 'Condo', 'Other']).withMessage('Invalid housing type'),
  body('applicantInfo.experience').trim().notEmpty().withMessage('Pet experience is required'),
  body('applicantInfo.reason').trim().notEmpty().withMessage('Reason for adoption is required'),
];

