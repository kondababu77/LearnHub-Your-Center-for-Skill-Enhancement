import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosInstance, { API_URL } from './AxiosInstance';
import PaymentModal from './PaymentModal';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import InfoIcon from '@mui/icons-material/Info';
import CircularProgress from '@mui/material/CircularProgress';

const AllCourses = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('newest');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

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
  }, [category, sort]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);

      const response = await AxiosInstance.get(`/users/courses?${params}`);
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
    setSearchParams({ search, category, sort });
  };

  const handleEnroll = async (course) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
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
      setSelectedCourse(course);
      setShowPayment(true);
      return;
    }

    // Free course - enroll directly
    await processEnrollment(course._id, {
      paymentMethod: 'Free',
      transactionId: `FREE${Date.now()}`,
    });
  };

  const processEnrollment = async (courseId, paymentInfo) => {
    setEnrolling(courseId);
    try {
      await AxiosInstance.post(`/users/enroll/${courseId}`, paymentInfo);
      toast.success('Successfully enrolled in the course!');
      setShowPayment(false);
      setSelectedCourse(null);
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(null);
    }
  };

  const handlePaymentSuccess = async (paymentInfo) => {
    if (selectedCourse) {
      await processEnrollment(selectedCourse._id, paymentInfo);
    }
  };

  return (
    <div className="courses-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Explore Courses</h1>
          <p>Discover courses taught by world-class instructors</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="filter-bar">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <SearchIcon className="search-icon" />
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
          <div className="filter-controls">
            <div className="filter-select">
              <FilterListIcon className="filter-icon" />
              <select
                className="form-control form-select"
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
            <select
              className="form-control form-select sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="loader">
            <CircularProgress />
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <SearchIcon style={{ fontSize: 48 }} />
            </div>
            <h3>No courses found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-image">
                  <img
                    src={
                      course.C_image
                        ? `${API_URL}${course.C_image}`
                        : 'https://placehold.co/400x200?text=Course+Image'
                    }
                    alt={course.C_title}
                  />
                </div>
                <div className="course-content">
                  <span className="course-category">{course.C_categories}</span>
                  <h3 className="course-title">{course.C_title}</h3>
                  <p className="course-description">
                    {course.C_description.substring(0, 100)}...
                  </p>
                  <div className="course-meta">
                    <span className="meta-item">
                      <PersonIcon fontSize="small" />
                      {course.C_educator}
                    </span>
                    <span className="meta-item">
                      <GroupIcon fontSize="small" />
                      {course.enrolled} enrolled
                    </span>
                  </div>
                </div>
                <div className="course-footer">
                  <span className="course-price">
                    {course.C_price === 0 ? 'Free' : `$${course.C_price}`}
                  </span>
                  <div className="course-actions">
                    <Link
                      to={`/courses/${course._id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Details
                    </Link>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEnroll(course)}
                      disabled={enrolling === course._id}
                    >
                      {enrolling === course._id ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        'Enroll'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && selectedCourse && (
          <PaymentModal
            course={selectedCourse}
            onClose={() => {
              setShowPayment(false);
              setSelectedCourse(null);
            }}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default AllCourses;
