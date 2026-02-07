const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllCoursesAdmin,
  deleteCourseAdmin,
  getDashboardStats,
  getAllEnrollments,
  toggleCoursePublish,
} = require('../controllers/adminController');

// All routes require admin authentication
router.use(protect);
router.use(adminOnly);

// Dashboard
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Course management
router.get('/courses', getAllCoursesAdmin);
router.delete('/courses/:id', deleteCourseAdmin);
router.put('/courses/:id/toggle-publish', toggleCoursePublish);

// Enrollment management
router.get('/enrollments', getAllEnrollments);

module.exports = router;
