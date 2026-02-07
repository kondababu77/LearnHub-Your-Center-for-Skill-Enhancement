const User = require('../schemas/userModel');
const Course = require('../schemas/courseModel');
const EnrolledCourse = require('../schemas/enrolledCourseModel');
const CoursePayment = require('../schemas/coursePaymentModel');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = {};

    if (type && type !== 'All') {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.type = req.body.type || user.type;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      type: updatedUser.type,
      isActive: updatedUser.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's courses if teacher
    if (user.type === 'Teacher') {
      await Course.deleteMany({ userID: user._id });
    }

    // Delete user's enrollments if student
    if (user.type === 'Student') {
      await EnrolledCourse.deleteMany({ userID: user._id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all courses (Admin)
// @route   GET /api/admin/courses
// @access  Private (Admin)
const getAllCoursesAdmin = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.C_categories = category;
    }

    if (search) {
      query.$or = [
        { C_title: { $regex: search, $options: 'i' } },
        { C_educator: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query).populate('userID', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete course (Admin)
// @route   DELETE /api/admin/courses/:id
// @access  Private (Admin)
const deleteCourseAdmin = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete all enrollments for this course
    await EnrolledCourse.deleteMany({ courseID: req.params.id });

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ type: 'Student' });
    const totalTeachers = await User.countDocuments({ type: 'Teacher' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await EnrolledCourse.countDocuments();
    const totalPayments = await CoursePayment.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Get recent enrollments
    const recentEnrollments = await EnrolledCourse.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userID', 'name')
      .populate('courseID', 'C_title');

    // Get popular courses
    const popularCourses = await Course.find()
      .sort({ enrolled: -1 })
      .limit(5)
      .select('C_title enrolled C_price');

    res.json({
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
      totalRevenue: totalPayments[0]?.total || 0,
      recentEnrollments,
      popularCourses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all enrollments
// @route   GET /api/admin/enrollments
// @access  Private (Admin)
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await EnrolledCourse.find()
      .populate('userID', 'name email')
      .populate('courseID', 'C_title C_educator')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle course publish status
// @route   PUT /api/admin/courses/:id/toggle-publish
// @access  Private (Admin)
const toggleCoursePublish = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.json({
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      isPublished: course.isPublished,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllCoursesAdmin,
  deleteCourseAdmin,
  getDashboardStats,
  getAllEnrollments,
  toggleCoursePublish,
};
