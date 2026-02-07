import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosInstance, { API_URL } from '../../common/AxiosInstance';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CircularProgress from '@mui/material/CircularProgress';

const StudentHome = () => {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await AxiosInstance.get('/users/enrolled');
      setEnrollments(response.data);
    } catch (error) {
      toast.error('Failed to fetch enrollments');
    } finally {
      setLoading(false);
    }
  };

  const completedCourses = enrollments.filter((e) => e.isCompleted).length;
  const inProgressCourses = enrollments.filter((e) => !e.isCompleted).length;
  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((acc, e) => acc + e.completionPercentage, 0) /
            enrollments.length
        )
      : 0;

  if (loading) {
    return (
      <div className="loader" style={{ minHeight: '80vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner student">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1>Welcome back, {user?.name}</h1>
            <p>Continue your learning journey and achieve your goals.</p>
          </div>
          <div className="welcome-actions">
            <Link to="/courses" className="btn btn-light">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              Explore Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <BookIcon />
          </div>
          <div className="stat-info">
            <span className="stat-value">{enrollments.length}</span>
            <span className="stat-label">Enrolled Courses</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <TrendingUpIcon />
          </div>
          <div className="stat-info">
            <span className="stat-value">{inProgressCourses}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <EmojiEventsIcon />
          </div>
          <div className="stat-info">
            <span className="stat-value">{completedCourses}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">
            <SchoolIcon />
          </div>
          <div className="stat-info">
            <span className="stat-value">{averageProgress}%</span>
            <span className="stat-label">Avg. Progress</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/enrolled-courses" className="btn btn-outline-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="me-2">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
          </svg>
          My Courses
        </Link>
        <Link to="/courses" className="btn btn-outline-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="me-2">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          Browse Courses
        </Link>
      </div>

      {/* Continue Learning Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Continue Learning</h2>
        </div>
        
        {enrollments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <SchoolIcon style={{ fontSize: 48 }} />
            </div>
            <h3>No courses enrolled yet</h3>
            <p>Start your learning journey by exploring our courses.</p>
            <Link to="/courses" className="btn btn-primary">
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="courses-grid">
            {enrollments
              .filter((e) => !e.isCompleted)
              .slice(0, 4)
              .map((enrollment) => (
                <div key={enrollment._id} className="course-card">
                  <div className="course-image">
                    <img
                      src={
                        enrollment.courseID?.C_image
                          ? `${API_URL}${enrollment.courseID.C_image}`
                          : 'https://placehold.co/400x200?text=Course'
                      }
                      alt={enrollment.courseID?.C_title}
                    />
                  </div>
                  <div className="course-content">
                    <h3 className="course-title">{enrollment.courseID?.C_title}</h3>
                    <p className="course-instructor">{enrollment.courseID?.C_educator}</p>
                    <div className="course-progress">
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${enrollment.completionPercentage}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{enrollment.completionPercentage}% complete</span>
                    </div>
                  </div>
                  <div className="course-footer">
                    <Link
                      to={`/course-content/${enrollment._id}`}
                      className="btn btn-primary btn-sm w-100"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Completed Courses */}
      {completedCourses > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Completed Courses</h2>
            <span className="badge badge-success">{completedCourses} courses</span>
          </div>
          <div className="courses-grid">
            {enrollments
              .filter((e) => e.isCompleted)
              .map((enrollment) => (
                <div key={enrollment._id} className="course-card completed">
                  <div className="completed-badge">
                    <EmojiEventsIcon style={{ fontSize: 16 }} />
                    Completed
                  </div>
                  <div className="course-content">
                    <h3 className="course-title">{enrollment.courseID?.C_title}</h3>
                    <p className="course-instructor">
                      Completed on {new Date(enrollment.completedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="course-footer">
                    <Link
                      to={`/course-content/${enrollment._id}`}
                      className="btn btn-success btn-sm"
                    >
                      View Certificate
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StudentHome;
