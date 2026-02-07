const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const { protect, teacherOnly, studentOnly } = require('../middlewares/authMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addSection,
  updateSection,
  deleteSection,
  getTeacherCourses,
  enrollInCourse,
  getEnrolledCourses,
  getEnrollmentById,
  updateProgress,
  getCertificate,
} = require('../controllers/userControllers');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/courses', getAllCourses);
router.get('/courses/:id', getCourseById);

// Protected routes (all authenticated users)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Teacher routes
router.get('/my-courses', protect, teacherOnly, getTeacherCourses);
router.post('/courses', protect, teacherOnly, upload.single('image'), createCourse);
router.put('/courses/:id', protect, teacherOnly, updateCourse);
router.delete('/courses/:id', protect, teacherOnly, deleteCourse);
router.post('/courses/:id/sections', protect, teacherOnly, upload.single('video'), addSection);
router.put('/courses/:id/sections/:sectionId', protect, teacherOnly, upload.single('video'), updateSection);
router.delete('/courses/:id/sections/:sectionId', protect, teacherOnly, deleteSection);

// Student routes
router.post('/enroll/:courseId', protect, studentOnly, enrollInCourse);
router.get('/enrolled', protect, studentOnly, getEnrolledCourses);
router.get('/enrolled/:enrollmentId', protect, studentOnly, getEnrollmentById);
router.put('/progress/:enrollmentId', protect, studentOnly, updateProgress);
router.get('/certificate/:enrollmentId', protect, studentOnly, getCertificate);

module.exports = router;
