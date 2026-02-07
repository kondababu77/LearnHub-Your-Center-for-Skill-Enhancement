import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosInstance from '../../common/AxiosInstance';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CircularProgress from '@mui/material/CircularProgress';
import Certificate from './Certificate';

const CourseContent = () => {
  const { enrollmentId } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    fetchEnrollmentData();
  }, [enrollmentId]);

  const fetchEnrollmentData = async () => {
    try {
      // Fetch only the specific enrollment (with server-side authorization)
      const response = await AxiosInstance.get(`/users/enrolled/${enrollmentId}`);
      setEnrollment(response.data);
      setCurrentSectionIndex(response.data.lastAccessedSection || 0);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('You are not authorized to access this course');
      } else if (error.response?.status === 404) {
        toast.error('Enrollment not found');
      } else {
        toast.error('Failed to fetch course data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = async (index) => {
    setCurrentSectionIndex(index);
    
    // Update last accessed section
    try {
      await AxiosInstance.put(`/users/progress/${enrollmentId}`, {
        lastAccessedSection: index,
      });
    } catch (error) {
      console.error('Failed to update progress');
    }
  };

  const handleMarkComplete = async (sectionId) => {
    setMarkingComplete(true);
    try {
      const response = await AxiosInstance.put(`/users/progress/${enrollmentId}`, {
        sectionId: sectionId.toString(),
        completed: true,
      });
      
      setEnrollment(response.data);
      toast.success('Section marked as complete!');
      
      // Move to next section if available
      const course = response.data.courseID;
      if (course && currentSectionIndex < course.sections.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
      }
      
      // Check if course is completed
      if (response.data.isCompleted) {
        toast.success('Congratulations! You have completed the course!');
        setShowCertificate(true);
      }
    } catch (error) {
      console.error('Mark complete error:', error);
      toast.error(error.response?.data?.message || 'Failed to update progress');
    } finally {
      setMarkingComplete(false);
    }
  };

  const isSectionCompleted = (sectionId) => {
    return enrollment?.progress?.find(
      (p) => p.sectionId?.toString() === sectionId?.toString() && p.completed
    );
  };

  if (loading) {
    return (
      <div className="loader" style={{ minHeight: '80vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="container py-5 text-center">
        <h4>Enrollment not found</h4>
        <Link to="/enrolled-courses" className="btn btn-primary mt-3">
          Back to My Courses
        </Link>
      </div>
    );
  }

  const course = enrollment.courseID;
  const currentSection = course.sections?.[currentSectionIndex];

  return (
    <div className="learning-page">
      {/* Header */}
      <div className="learning-header">
        <div className="learning-header-inner">
          <Link to="/enrolled-courses" className="form-back-link" style={{ marginBottom: 0 }}>
            <ArrowBackIcon fontSize="small" />
            Back to My Courses
          </Link>
          <div className="d-flex justify-content-between align-items-start mt-3">
            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--gray-900)', margin: 0 }}>
                {course.C_title}
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', margin: 'var(--space-1) 0 0' }}>
                By {course.C_educator}
              </p>
            </div>
            <div className="text-end">
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--primary-600)' }}>
                {enrollment.completionPercentage}%
              </div>
              <small style={{ color: 'var(--gray-500)', fontSize: 'var(--text-xs)' }}>Complete</small>
            </div>
          </div>
          <div className="learning-progress-bar">
            <div
              className="learning-progress-fill"
              style={{ width: `${enrollment.completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="learning-body">
        {/* Sidebar - Section List */}
        <div className="learning-sidebar">
          <div className="learning-section-list">
            <div className="learning-section-header">
              <h3>Course Content</h3>
              <span>{course.sections?.length || 0} sections</span>
            </div>
            {course.sections?.map((section, index) => (
              <div
                key={section._id}
                className={`learning-section-item ${
                  index === currentSectionIndex ? 'active' : ''
                } ${isSectionCompleted(section._id) ? 'completed' : ''}`}
                onClick={() => handleSectionClick(index)}
              >
                <div className="section-icon">
                  {isSectionCompleted(section._id) ? (
                    <CheckCircleIcon style={{ color: 'var(--success-600)', fontSize: 20 }} />
                  ) : (
                    <PlayCircleIcon style={{ color: 'var(--primary-500)', fontSize: 20 }} />
                  )}
                </div>
                <div className="section-details">
                  <div className="section-name">{section.title}</div>
                  {section.duration > 0 && (
                    <span className="section-duration">{section.duration} min</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Certificate Section */}
          {enrollment.isCompleted && (
            <div className="learning-certificate-card">
              <EmojiEventsIcon style={{ fontSize: 48, color: '#f59e0b' }} />
              <h4>Course Completed!</h4>
              <button
                className="btn btn-success btn-sm"
                onClick={() => setShowCertificate(true)}
              >
                <DownloadIcon fontSize="small" className="me-1" />
                View Certificate
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="learning-main">
          {showCertificate && enrollment.isCompleted ? (
            <Certificate
              studentName={JSON.parse(localStorage.getItem('user'))?.name}
              courseName={course.C_title}
              completedDate={enrollment.completedDate}
              certificateId={enrollment._id}
              instructorName={course.userID?.name || course.C_educator}
              onClose={() => setShowCertificate(false)}
            />
          ) : currentSection ? (
            <div className="learning-content-card">
              <div className="learning-content-body">
                <h2>{currentSection.title}</h2>
                <p className="description">{currentSection.description}</p>

                {/* Video Player */}
                {currentSection.videoUrl ? (
                  <div className="learning-video-container">
                    <video
                      controls
                      src={`http://localhost:5000${currentSection.videoUrl}`}
                      controlsList="nodownload"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="learning-video-placeholder">
                    <PlayCircleIcon style={{ fontSize: 80, color: 'var(--primary-500)', opacity: 0.5 }} />
                    <h3>Read the section content</h3>
                    <p>
                      This section contains text-based content. Read through the description and mark as complete when done.
                    </p>
                  </div>
                )}

                {/* Section Description */}
                {currentSection.description && (
                  <div className="learning-section-content">
                    <h4>Section Content</h4>
                    <p>{currentSection.description}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="learning-actions">
                  <button
                    className="btn btn-outline-secondary"
                    disabled={currentSectionIndex === 0}
                    onClick={() => handleSectionClick(currentSectionIndex - 1)}
                  >
                    Previous
                  </button>

                  {!isSectionCompleted(currentSection._id) ? (
                    <button
                      className="btn btn-success"
                      onClick={() => handleMarkComplete(currentSection._id)}
                      disabled={markingComplete}
                    >
                      {markingComplete ? (
                        <CircularProgress size={20} color="inherit" className="me-1" />
                      ) : (
                        <CheckCircleIcon className="me-1" />
                      )}
                      {markingComplete ? 'Updating...' : 'Mark as Complete'}
                    </button>
                  ) : (
                    <span className="completed-badge">
                      <CheckCircleIcon fontSize="small" />
                      Completed
                    </span>
                  )}

                  <button
                    className="btn btn-primary"
                    disabled={currentSectionIndex === course.sections.length - 1}
                    onClick={() => handleSectionClick(currentSectionIndex + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="learning-content-card">
              <div className="learning-content-body text-center py-5">
                <p style={{ color: 'var(--gray-500)' }}>
                  No content available for this course yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
