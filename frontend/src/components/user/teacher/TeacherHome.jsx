import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosInstance from '../../common/AxiosInstance';
import BookIcon from '@mui/icons-material/Book';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CircularProgress from '@mui/material/CircularProgress';

const TeacherHome = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await AxiosInstance.get('/users/my-courses');
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId, forceDelete = false) => {
    if (!courseId) {
      toast.error('Invalid course ID');
      return;
    }
    
    const course = courses.find(c => c._id === courseId);
    let confirmed;
    
    if (course?.enrolled > 0 && !forceDelete) {
      confirmed = window.confirm(
        `⚠️ WARNING: This course has ${course.enrolled} enrolled student(s).\n\n` +
        `When you delete this course:\n` +
        `• Students who COMPLETED the course will keep their certificates\n` +
        `• Students still in-progress will lose access\n` +
        `• The course will be archived (not shown to new students)\n\n` +
        `Are you sure you want to proceed?`
      );
    } else {
      confirmed = window.confirm('Are you sure you want to delete this course?');
    }
    
    if (!confirmed) return;

    try {
      const url = course?.enrolled > 0 
        ? `/users/courses/${courseId}?force=true`
        : `/users/courses/${courseId}`;
      const response = await AxiosInstance.delete(url);
      toast.success(response.data?.message || 'Course deleted successfully');
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const totalEnrollments = courses.reduce((acc, course) => acc + course.enrolled, 0);
  const totalRevenue = courses.reduce(
    (acc, course) => acc + course.C_price * course.enrolled,
    0
  );

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
      <div className="welcome-banner teacher">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1>Welcome back, {user?.name}</h1>
            <p>Create and manage your courses to share knowledge with the world.</p>
          </div>
          <div className="welcome-actions">
            <Link to="/add-course" className="btn btn-light">
              <AddIcon className="me-1" />
              Create Course
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid stats-grid-3">
        <div className="stat-card primary">
          <div className="stat-icon">
            <BookIcon />
          </div>
          <div className="stat-info">
            <span className="stat-value">{courses.length}</span>
            <span className="stat-label">Total Courses</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <GroupIcon />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalEnrollments}</span>
            <span className="stat-label">Total Students</span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">
            <AttachMoneyIcon />
          </div>
          <div className="stat-info">
            <span className="stat-value">${totalRevenue}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>My Courses</h2>
          <Link to="/add-course" className="btn btn-primary btn-sm">
            <AddIcon fontSize="small" className="me-1" />
            Add New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <BookIcon style={{ fontSize: 48 }} />
            </div>
            <h3>No courses yet</h3>
            <p>Create your first course and start teaching!</p>
            <Link to="/add-course" className="btn btn-primary">
              <AddIcon className="me-1" />
              Create Course
            </Link>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-image">
                  <img
                    src={
                      course.C_image
                        ? `http://localhost:5000${course.C_image}`
                        : 'https://placehold.co/400x200?text=Course'
                    }
                    alt={course.C_title}
                  />
                  <span className={`status-badge ${course.isPublished ? 'published' : 'draft'}`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="course-content">
                  <span className="course-category">{course.C_categories}</span>
                  <h3 className="course-title">{course.C_title}</h3>
                  <p className="course-description">
                    {course.C_description?.substring(0, 80)}...
                  </p>
                  <div className="course-meta">
                    <span className="meta-item">
                      <GroupIcon fontSize="small" />
                      {course.enrolled} students
                    </span>
                    <span className="meta-item">
                      {course.sections?.length || 0} sections
                    </span>
                  </div>
                  <div className="course-price">
                    {course.C_price === 0 ? 'Free' : `$${course.C_price}`}
                  </div>
                </div>
                <div className="course-actions">
                  <Link
                    to={`/manage-course/${course._id}`}
                    className="btn btn-outline-success btn-sm"
                  >
                    <VideoLibraryIcon fontSize="small" className="me-1" />
                    Content
                  </Link>
                  <Link
                    to={`/add-course?edit=${course._id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    <EditIcon fontSize="small" />
                  </Link>
                  <button
                    type="button"
                    className={`btn btn-sm ${course.enrolled > 0 ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => handleDeleteCourse(course._id)}
                    title={
                      course.enrolled > 0
                        ? `Delete course (${course.enrolled} enrolled - will remove enrollments)`
                        : 'Delete course'
                    }
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TeacherHome;
