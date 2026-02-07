const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 0,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const courseSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    C_educator: {
      type: String,
      required: [true, 'Educator name is required'],
    },
    C_categories: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
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
      ],
    },
    C_title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    C_description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    sections: [sectionSchema],
    C_price: {
      type: Number,
      required: true,
      default: 0,
    },
    C_image: {
      type: String,
      default: '',
    },
    enrolled: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality (created only if needed)
courseSchema.index({ C_title: 1 });
courseSchema.index({ C_categories: 1 });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
