import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosInstance from './AxiosInstance';
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
      <div className="bg-dark text-white py-5">
        <div className="container">
          <Link to="/courses" className="btn btn-outline-light btn-sm mb-3">
            <ArrowBackIcon fontSize="small" className="me-1" />
            Back to Courses
          </Link>
          <div className="row">
            <div className="col-lg-8">
              <span className="badge bg-primary mb-3">{course.C_categories}</span>
              <h1 className="mb-3">{course.C_title}</h1>
              <p className="lead opacity-75">{course.C_description}</p>
              
              <div className="d-flex flex-wrap gap-4 mt-4">
                <div className="d-flex align-items-center">
                  <PersonIcon className="me-2" />
                  <span>{course.C_educator}</span>
                </div>
                <div className="d-flex align-items-center">
                  <GroupIcon className="me-2" />
                  <span>{course.enrolled} students</span>
                </div>
                <div className="d-flex align-items-center">
                  <PlayCircleIcon className="me-2" />
                  <span>{course.sections?.length || 0} sections</span>
                </div>
                <div className="d-flex align-items-center">
                  <AccessTimeIcon className="me-2" />
                  <span>{getTotalDuration()} min total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Course Content */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <SchoolIcon className="me-2" />
                  Course Content
                </h5>
                <small className="text-muted">
                  {course.sections?.length || 0} sections • {getTotalDuration()} min total length
                </small>
              </div>
              <div className="card-body p-0">
                {course.sections?.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {course.sections.map((section, index) => (
                      <div
                        key={section._id || index}
                        className="list-group-item d-flex align-items-center py-3"
                      >
                        <div className="me-3">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                            style={{ width: 40, height: 40 }}
                          >
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{section.title}</h6>
                          {section.description && (
                            <p className="text-muted small mb-0">
                              {section.description}
                            </p>
                          )}
                        </div>
                        <div className="text-muted small">
                          {section.duration > 0 ? `${section.duration} min` : 'N/A'}
                        </div>
                        {section.videoUrl && (
                          <PlayCircleIcon className="ms-3 text-primary" />
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
            </div>

            {/* What You'll Learn */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">What You'll Learn</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {course.sections?.slice(0, 6).map((section, index) => (
                    <div key={index} className="col-md-6 mb-2">
                      <div className="d-flex align-items-start">
                        <CheckCircleIcon
                          className="text-success me-2"
                          style={{ fontSize: 20, marginTop: 2 }}
                        />
                        <span>{section.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: 90 }}>
              <img
                src={
                  course.C_image
                    ? `http://localhost:5000${course.C_image}`
                    : 'https://placehold.co/400x300?text=Course+Image'
                }
                className="card-img-top"
                alt={course.C_title}
              />
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="mb-0">
                    {course.C_price === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      <span>${course.C_price}</span>
                    )}
                  </h2>
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

                <div className="text-muted small">
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <span>Sections</span>
                    <strong>{course.sections?.length || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <span>Duration</span>
                    <strong>{getTotalDuration()} min</strong>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <span>Enrolled</span>
                    <strong>{course.enrolled} students</strong>
                  </div>
                  <div className="d-flex justify-content-between py-2">
                    <span>Certificate</span>
                    <strong>Yes</strong>
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
