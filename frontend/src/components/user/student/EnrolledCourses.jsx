import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosInstance, { API_URL } from '../../common/AxiosInstance';
import SchoolIcon from '@mui/icons-material/School';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CircularProgress from '@mui/material/CircularProgress';

const EnrolledCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await AxiosInstance.get('/users/enrolled');
      setEnrollments(response.data);
    } catch (error) {
      toast.error('Failed to fetch enrolled courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (filter === 'completed') return enrollment.isCompleted;
    if (filter === 'in-progress') return !enrollment.isCompleted;
    return true;
  });

  if (loading) {
    return (
      <div className="loader" style={{ minHeight: '80vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="page-header-simple">
        <h1>My Courses</h1>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All <span className="tab-count">{enrollments.length}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress <span className="tab-count">{enrollments.filter((e) => !e.isCompleted).length}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed <span className="tab-count">{enrollments.filter((e) => e.isCompleted).length}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredEnrollments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <SchoolIcon style={{ fontSize: 48 }} />
          </div>
          <h3>
            {filter === 'all'
              ? 'No courses enrolled yet'
              : filter === 'completed'
              ? 'No completed courses'
              : 'No courses in progress'}
          </h3>
          <p>
            {filter === 'all'
              ? 'Start your learning journey by exploring our courses.'
              : 'Keep learning to see your progress here.'}
          </p>
          <Link to="/courses" className="btn btn-primary">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredEnrollments.map((enrollment) => (
            <div key={enrollment._id} className="course-card enrolled">
              <div className="course-image">
                <img
                  src={
                    enrollment.courseID?.C_image
                      ? `${API_URL}${enrollment.courseID.C_image}`
                      : 'https://placehold.co/400x200?text=Course'
                  }
                  alt={enrollment.courseID?.C_title}
                />
                {enrollment.isCompleted && (
                  <span className="completion-badge">
                    <EmojiEventsIcon fontSize="small" />
                    Completed
                  </span>
                )}
              </div>
              <div className="course-content">
                <span className="course-category">{enrollment.courseID?.C_categories}</span>
                <h3 className="course-title">{enrollment.courseID?.C_title}</h3>
                <p className="course-instructor">By {enrollment.courseID?.C_educator}</p>

                {/* Progress */}
                <div className="course-progress">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span className="progress-percentage">{enrollment.completionPercentage}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar-fill ${enrollment.isCompleted ? 'completed' : ''}`}
                      style={{ width: `${enrollment.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="course-meta">
                  <span className="meta-item">
                    {enrollment.courseID?.sections?.length || 0} sections
                  </span>
                  <span className="meta-item">
                    Enrolled: {new Date(enrollment.enrolledDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="course-footer">
                <Link
                  to={`/course-content/${enrollment._id}`}
                  className="btn btn-primary w-100"
                >
                  <PlayCircleIcon className="me-2" fontSize="small" />
                  {enrollment.isCompleted ? 'Review Course' : 'Continue Learning'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
