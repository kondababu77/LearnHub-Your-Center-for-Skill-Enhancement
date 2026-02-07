const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../schemas/userModel');
const Course = require('../schemas/courseModel');
const EnrolledCourse = require('../schemas/enrolledCourseModel');
const CoursePayment = require('../schemas/coursePaymentModel');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      type: type || 'Student',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is deactivated
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated. Please contact support.' });
    }

    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        type: updatedUser.type,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all courses
// @route   GET /api/users/courses
// @access  Public
const getAllCourses = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = { isPublished: true, isDeleted: { $ne: true } };

    if (category && category !== 'All') {
      query.C_categories = category;
    }

    if (search) {
      query.$or = [
        { C_title: { $regex: search, $options: 'i' } },
        { C_description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = {};
    if (sort === 'popular') {
      sortOption = { enrolled: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'price-low') {
      sortOption = { C_price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { C_price: -1 };
    }

    const courses = await Course.find(query).sort(sortOption).populate('userID', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/users/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('userID', 'name email');
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new course (Teacher)
// @route   POST /api/users/courses
// @access  Private (Teacher)
const createCourse = async (req, res) => {
  try {
    const { C_title, C_description, C_categories, C_price, sections } = req.body;

    // Parse sections if it's a string (from FormData)
    let parsedSections = [];
    if (sections) {
      try {
        parsedSections = typeof sections === 'string' ? JSON.parse(sections) : sections;
        // Ensure each section has an order
        parsedSections = parsedSections.map((section, index) => ({
          ...section,
          order: section.order || index + 1,
        }));
      } catch (e) {
        parsedSections = [];
      }
    }

    const course = await Course.create({
      userID: req.user._id,
      C_educator: req.user.name,
      C_title,
      C_description,
      C_categories,
      C_price: parseFloat(C_price) || 0,
      sections: parsedSections,
      C_image: req.file ? `/uploads/${req.file.filename}` : '',
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update course (Teacher)
// @route   PUT /api/users/courses/:id
// @access  Private (Teacher)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the course owner
    if (course.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete course (Teacher)
// @route   DELETE /api/users/courses/:id
// @access  Private (Teacher)
const deleteCourse = async (req, res) => {
  try {
    const { force } = req.query; // Allow force deletion
    
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the course owner
    if (course.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    // Check if any students are enrolled
    const enrolledCount = await EnrolledCourse.countDocuments({ courseID: req.params.id });
    const completedCount = await EnrolledCourse.countDocuments({ 
      courseID: req.params.id, 
      isCompleted: true 
    });
    const inProgressCount = enrolledCount - completedCount;
    
    if (enrolledCount > 0 && force !== 'true') {
      return res.status(400).json({ 
        message: 'Cannot delete course with enrolled students',
        enrolledCount,
        completedCount,
        inProgressCount,
        requiresForce: true
      });
    }

    // If force delete, only remove in-progress enrollments
    // Keep completed enrollments so students retain their certificates
    if (inProgressCount > 0) {
      await EnrolledCourse.deleteMany({ 
        courseID: req.params.id,
        isCompleted: false 
      });
    }

    // Mark the course as deleted but keep it for certificate records if there are completions
    if (completedCount > 0) {
      // Soft delete - mark course as unpublished/archived instead of deleting
      await Course.findByIdAndUpdate(req.params.id, { 
        isPublished: false,
        isDeleted: true,
        deletedAt: new Date()
      });
      res.json({ 
        message: `Course archived. ${inProgressCount} in-progress enrollment(s) removed. ${completedCount} completed student(s) retain their certificates.`
      });
    } else {
      // No completed students, safe to fully delete
      await EnrolledCourse.deleteMany({ courseID: req.params.id });
      await CoursePayment.deleteMany({ courseID: req.params.id });
      await Course.findByIdAndDelete(req.params.id);
      res.json({ 
        message: enrolledCount > 0 
          ? `Course and ${enrolledCount} enrollment(s) deleted successfully` 
          : 'Course deleted successfully' 
      });
    }
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add section to course (Teacher)
// @route   POST /api/users/courses/:id/sections
// @access  Private (Teacher)
const addSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, videoUrl, duration } = req.body;
    const newSection = {
      title,
      description,
      videoUrl: req.file ? `/uploads/${req.file.filename}` : videoUrl || '',
      duration: parseInt(duration) || 0,
      order: course.sections.length + 1,
    };

    course.sections.push(newSection);
    await course.save();

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update section in course (Teacher)
// @route   PUT /api/users/courses/:id/sections/:sectionId
// @access  Private (Teacher)
const updateSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const sectionIndex = course.sections.findIndex(
      (s) => s._id.toString() === req.params.sectionId
    );

    if (sectionIndex === -1) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const { title, description, duration } = req.body;
    
    if (title) course.sections[sectionIndex].title = title;
    if (description !== undefined) course.sections[sectionIndex].description = description;
    if (duration !== undefined) course.sections[sectionIndex].duration = parseInt(duration) || 0;
    
    if (req.file) {
      course.sections[sectionIndex].videoUrl = `/uploads/${req.file.filename}`;
    }

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete section from course (Teacher)
// @route   DELETE /api/users/courses/:id/sections/:sectionId
// @access  Private (Teacher)
const deleteSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const sectionIndex = course.sections.findIndex(
      (s) => s._id.toString() === req.params.sectionId
    );

    if (sectionIndex === -1) {
      return res.status(404).json({ message: 'Section not found' });
    }

    course.sections.splice(sectionIndex, 1);
    
    // Reorder remaining sections
    course.sections.forEach((section, index) => {
      section.order = index + 1;
    });

    await course.save();
    res.json({ message: 'Section deleted successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get teacher's courses
// @route   GET /api/users/my-courses
// @access  Private (Teacher)
const getTeacherCourses = async (req, res) => {
  try {
    // Exclude soft-deleted courses
    const courses = await Course.find({ 
      userID: req.user._id,
      isDeleted: { $ne: true }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Enroll in a course (Student)
// @route   POST /api/users/enroll/:courseId
// @access  Private (Student)
const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await EnrolledCourse.findOne({
      userID: req.user._id,
      courseID: req.params.courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Handle payment for paid courses
    if (course.C_price > 0) {
      const { paymentMethod, transactionId } = req.body;

      if (!paymentMethod || !transactionId) {
        return res.status(400).json({ message: 'Payment information required' });
      }

      await CoursePayment.create({
        userID: req.user._id,
        courseID: req.params.courseId,
        amount: course.C_price,
        paymentMethod,
        transactionId,
        status: 'Completed',
      });
    }

    // Create enrollment
    const enrollment = await EnrolledCourse.create({
      userID: req.user._id,
      courseID: req.params.courseId,
      progress: course.sections.map((section) => ({
        sectionId: section._id,
        completed: false,
      })),
    });

    // Update course enrollment count
    course.enrolled += 1;
    await course.save();

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get enrolled courses (Student)
// @route   GET /api/users/enrolled
// @access  Private (Student)
const getEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await EnrolledCourse.find({ userID: req.user._id })
      .populate({
        path: 'courseID',
        populate: {
          path: 'userID',
          select: 'name email'
        }
      });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update course progress (Student)
// @route   PUT /api/users/progress/:enrollmentId
// @access  Private (Student)
const updateProgress = async (req, res) => {
  try {
    const { sectionId, completed, lastAccessedSection } = req.body;
    const enrollment = await EnrolledCourse.findById(req.params.enrollmentId).populate('courseID');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update section progress
    if (sectionId) {
      const progressIndex = enrollment.progress.findIndex(
        (p) => p.sectionId.toString() === sectionId.toString()
      );

      if (progressIndex !== -1) {
        enrollment.progress[progressIndex].completed = completed;
        if (completed) {
          enrollment.progress[progressIndex].completedAt = new Date();
        }
      } else {
        // If section not found in progress, add it (for courses where sections were added after enrollment)
        enrollment.progress.push({
          sectionId: sectionId,
          completed: completed,
          completedAt: completed ? new Date() : undefined,
        });
      }
    }

    // Update last accessed section
    if (lastAccessedSection !== undefined) {
      enrollment.lastAccessedSection = lastAccessedSection;
    }

    // Calculate completion percentage
    const totalSections = enrollment.courseID?.sections?.length || enrollment.progress.length;
    const completedSections = enrollment.progress.filter((p) => p.completed).length;
    enrollment.completionPercentage = totalSections > 0 
      ? Math.round((completedSections / totalSections) * 100) 
      : 0;

    // Check if course is completed
    if (enrollment.completionPercentage === 100 && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedDate = new Date();
      enrollment.certificateIssued = true;
      enrollment.certificateUrl = `/certificates/${enrollment._id}`;
    }

    await enrollment.save();
    
    // Re-populate to return full data including teacher info
    const updatedEnrollment = await EnrolledCourse.findById(enrollment._id)
      .populate({
        path: 'courseID',
        populate: {
          path: 'userID',
          select: 'name email'
        }
      });
    res.json(updatedEnrollment);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single enrollment by ID (Student)
// @route   GET /api/users/enrolled/:enrollmentId
// @access  Private (Student)
const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await EnrolledCourse.findById(req.params.enrollmentId)
      .populate({
        path: 'courseID',
        populate: {
          path: 'userID',
          select: 'name email'
        }
      });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if user owns this enrollment
    if (enrollment.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this enrollment' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get certificate (Student)
// @route   GET /api/users/certificate/:enrollmentId
// @access  Private (Student)
const getCertificate = async (req, res) => {
  try {
    const enrollment = await EnrolledCourse.findById(req.params.enrollmentId)
      .populate('courseID')
      .populate('userID', 'name email');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if user owns this enrollment
    if (enrollment.userID._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this certificate' });
    }

    if (!enrollment.isCompleted) {
      return res.status(400).json({ message: 'Course not completed yet' });
    }

    res.json({
      studentName: enrollment.userID.name,
      courseName: enrollment.courseID.C_title,
      completedDate: enrollment.completedDate,
      certificateId: enrollment._id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
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
};
