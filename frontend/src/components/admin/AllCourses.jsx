import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosInstance from '../common/AxiosInstance';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';

const AdminAllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = [
    'All',
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
  ];

  useEffect(() => {
    fetchCourses();
  }, [category]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);

      const response = await AxiosInstance.get(`/admin/courses?${params}`);
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await AxiosInstance.delete(`/admin/courses/${courseId}`);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleTogglePublish = async (courseId) => {
    try {
      const response = await AxiosInstance.put(`/admin/courses/${courseId}/toggle-publish`);
      toast.success(response.data.message);
      fetchCourses();
    } catch (error) {
      toast.error('Failed to update course status');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/admin" className="btn btn-outline-secondary mb-2">
            <ArrowBackIcon fontSize="small" className="me-1" />
            Back to Dashboard
          </Link>
          <h2>Course Management</h2>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FilterListIcon />
              </span>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loader">
          <CircularProgress />
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Enrolled</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            course.C_image
                              ? `http://localhost:5000${course.C_image}`
                              : 'https://placehold.co/60x40?text=Course'
                          }
                          alt={course.C_title}
                          style={{
                            width: 60,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 4,
                          }}
                          className="me-2"
                        />
                        <div>
                          <strong>{course.C_title}</strong>
                          <br />
                          <small className="text-muted">
                            {course.sections?.length || 0} sections
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{course.C_educator}</td>
                    <td>
                      <span className="badge bg-primary">{course.C_categories}</span>
                    </td>
                    <td>${course.C_price || 'Free'}</td>
                    <td>{course.enrolled}</td>
                    <td>
                      <span
                        className={`badge ${
                          course.isPublished ? 'bg-success' : 'bg-secondary'
                        }`}
                      >
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          course.isPublished
                            ? 'btn-outline-warning'
                            : 'btn-outline-success'
                        } me-2`}
                        onClick={() => handleTogglePublish(course._id)}
                        title={course.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {course.isPublished ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(course._id)}
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {courses.length === 0 && (
            <div className="text-center py-4 text-muted">No courses found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAllCourses;
