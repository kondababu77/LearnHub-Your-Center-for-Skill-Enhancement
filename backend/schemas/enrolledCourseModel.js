const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
});

const enrolledCourseSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    enrolledDate: {
      type: Date,
      default: Date.now,
    },
    progress: [progressSchema],
    completionPercentage: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedDate: {
      type: Date,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateUrl: {
      type: String,
      default: '',
    },
    lastAccessedSection: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate enrollments
enrolledCourseSchema.index({ userID: 1, courseID: 1 }, { unique: true });

const EnrolledCourse = mongoose.model('EnrolledCourse', enrolledCourseSchema);

module.exports = EnrolledCourse;
