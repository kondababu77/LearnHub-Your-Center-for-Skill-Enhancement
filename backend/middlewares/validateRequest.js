const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// User registration validation
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  body('type')
    .optional()
    .isIn(['Student', 'Teacher']).withMessage('Type must be Student or Teacher'),
  handleValidationErrors,
];

// User login validation
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Course creation validation
const validateCourse = [
  body('C_title')
    .trim()
    .notEmpty().withMessage('Course title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('C_description')
    .trim()
    .notEmpty().withMessage('Course description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('C_categories')
    .notEmpty().withMessage('Category is required')
    .isIn([
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'Cloud Computing',
      'DevOps',
      'Cybersecurity',
      'UI/UX Design',
      'Digital Marketing',
      'Business',
      'Other',
    ]).withMessage('Invalid category'),
  body('C_price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  handleValidationErrors,
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors,
];

// Query validation for courses
const validateCourseQuery = [
  query('category').optional().trim(),
  query('search').optional().trim().escape(),
  query('sort')
    .optional()
    .isIn(['newest', 'popular', 'price-low', 'price-high']).withMessage('Invalid sort option'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCourse,
  validateObjectId,
  validateCourseQuery,
  handleValidationErrors,
};
