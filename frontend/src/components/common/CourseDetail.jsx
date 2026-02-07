import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosInstance, { API_URL } from './AxiosInstance';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import PaymentModal from './PaymentModal';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchCourse();
    if (user?.type === 'Student') {
      checkEnrollment();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await AxiosInstance.get(`/users/courses/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      toast.error('Failed to fetch course details');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await AxiosInstance.get('/users/enrolled');
      const enrollment = response.data.find(
        (e) => e.courseID?._id === courseId || e.courseID === courseId
      );
      if (enrollment) {
        setIsEnrolled(true);
        setEnrollmentId(enrollment._id);
      }
    } catch (error) {
      console.error('Failed to check enrollment');
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.info('Please login to enroll in courses');
      navigate('/login');
      return;
    }

    if (user.type !== 'Student') {
      toast.info('Only students can enroll in courses');
      return;
    }

    // Show payment modal for paid courses
    if (course.C_price > 0) {
      setShowPayment(true);
      return;
    }

    // Free course - enroll directly
    await processEnrollment({
      paymentMethod: 'Free',
      transactionId: `FREE${Date.now()}`,
    });
  };

  const processEnrollment = async (paymentInfo) => {
    setEnrolling(true);
    try {
      const response = await AxiosInstance.post(`/users/enroll/${courseId}`, paymentInfo);
      toast.success('Successfully enrolled in the course!');
      setIsEnrolled(true);
      setEnrollmentId(response.data._id);
      setShowPayment(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handlePaymentSuccess = async (paymentInfo) => {
    await processEnrollment(paymentInfo);
  };

  const getTotalDuration = () => {
    if (!course?.sections) return 0;
    return course.sections.reduce((acc, section) => acc + (section.duration || 0), 0);
  };

  if (loading) {
    return (
      <div className="loader" style={{ minHeight: '80vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-5 text-center">
        <h4>Course not found</h4>
        <Link to="/courses" className="btn btn-primary mt-3">
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      {/* Hero Section */}
      <div className="course-detail-hero">
        <div className="course-detail-container">
          <Link to="/courses" className="course-detail-breadcrumb">
            <ArrowBackIcon fontSize="small" />
            Back to Courses
          </Link>
          <div className="row">
            <div className="col-lg-8">
              <span className="course-detail-category">{course.C_categories}</span>
              <h1 className="course-detail-title">{course.C_title}</h1>
              <p className="course-detail-desc">{course.C_description}</p>
              
              <div className="course-detail-meta">
                <div className="course-meta-item">
                  <PersonIcon />
                  <span>{course.C_educator}</span>
                </div>
                <div className="course-meta-item">
                  <GroupIcon />
                  <span>{course.enrolled} students</span>
                </div>
                <div className="course-meta-item">
                  <PlayCircleIcon />
                  <span>{course.sections?.length || 0} sections</span>
                </div>
                <div className="course-meta-item">
                  <AccessTimeIcon />
                  <span>{getTotalDuration()} min total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="course-detail-body">
        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Course Content */}
            <div className="content-card">
              <div className="content-card-header">
                <h3>
                  <SchoolIcon />
                  Course Content
                </h3>
                <span className="subtitle">
                  {course.sections?.length || 0} sections • {getTotalDuration()} min total length
                </span>
              </div>
              {course.sections?.length > 0 ? (
                <div>
                  {course.sections.map((section, index) => (
                    <div
                      key={section._id || index}
                      className="section-list-item"
                    >
                      <div className="section-number">
                        {index + 1}
                      </div>
                      <div className="section-list-info">
                        <h4>{section.title}</h4>
                        {section.description && (
                          <p>{section.description}</p>
                        )}
                      </div>
                      <span className="section-list-duration">
                        {section.duration > 0 ? `${section.duration} min` : 'N/A'}
                      </span>
                      {section.videoUrl && (
                        <PlayCircleIcon style={{ color: 'var(--primary-500)', marginLeft: 8 }} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <PlayCircleIcon style={{ fontSize: 48, color: '#ccc' }} />
                  <p className="text-muted mt-2">No sections available yet</p>
                </div>
              )}
            </div>

            {/* What You'll Learn */}
            <div className="content-card">
              <div className="content-card-header">
                <h3>What You'll Learn</h3>
              </div>
              <div className="learn-grid">
                {course.sections?.slice(0, 6).map((section, index) => (
                  <div key={index} className="learn-item">
                    <CheckCircleIcon style={{ fontSize: 20 }} />
                    <span>{section.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="sidebar-card">
              <img
                src={
                  course.C_image
                    ? `${API_URL}${course.C_image}`
                    : 'https://placehold.co/400x300?text=Course+Image'
                }
                className="sidebar-card-image"
                alt={course.C_title}
              />
              <div className="sidebar-card-body">
                <div className={`sidebar-price ${course.C_price === 0 ? 'free' : ''}`}>
                  {course.C_price === 0 ? 'Free' : `$${course.C_price}`}
                </div>

                {isEnrolled ? (
                  <Link
                    to={`/course-content/${enrollmentId}`}
                    className="btn btn-success btn-lg w-100 mb-3"
                  >
                    <PlayCircleIcon className="me-2" />
                    Continue Learning
                  </Link>
                ) : (
                  <button
                    className="btn btn-primary btn-lg w-100 mb-3"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <SchoolIcon className="me-2" />
                        {course.C_price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                      </>
                    )}
                  </button>
                )}

                <div className="sidebar-details">
                  <div className="sidebar-detail-row">
                    <span className="label">Sections</span>
                    <span className="value">{course.sections?.length || 0}</span>
                  </div>
                  <div className="sidebar-detail-row">
                    <span className="label">Duration</span>
                    <span className="value">{getTotalDuration()} min</span>
                  </div>
                  <div className="sidebar-detail-row">
                    <span className="label">Enrolled</span>
                    <span className="value">{course.enrolled} students</span>
                  </div>
                  <div className="sidebar-detail-row">
                    <span className="label">Certificate</span>
                    <span className="value">Yes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          course={course}
          onClose={() => setShowPayment(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default CourseDetail;
