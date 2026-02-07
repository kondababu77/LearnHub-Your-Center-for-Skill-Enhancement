import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosInstance from '../common/AxiosInstance';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [userFilter, searchTerm]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        AxiosInstance.get('/admin/stats'),
        AxiosInstance.get(`/admin/users?type=${userFilter}&search=${searchTerm}`),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await AxiosInstance.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await AxiosInstance.put(`/admin/users/${userId}`, {
        isActive: !currentStatus,
      });
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  if (loading && !stats) {
    return (
      <div className="loader" style={{ minHeight: '80vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner admin">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's what's happening on LearnHub.</p>
          </div>
          <div className="welcome-actions">
            <Link to="/admin/courses" className="btn btn-light">
              Manage Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <PeopleIcon />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalUsers || 0}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <SchoolIcon />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalStudents || 0}</span>
            <span className="stat-label">Total Students</span>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <PersonIcon />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalTeachers || 0}</span>
            <span className="stat-label">Total Teachers</span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">
            <BookIcon />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalCourses || 0}</span>
            <span className="stat-label">Total Courses</span>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="secondary-stats">
        <div className="secondary-stat-card">
          <div className="secondary-stat-icon success">
            <TrendingUpIcon />
          </div>
          <div className="secondary-stat-info">
            <span className="secondary-stat-label">Total Enrollments</span>
            <span className="secondary-stat-value">{stats?.totalEnrollments || 0}</span>
          </div>
        </div>
        <div className="secondary-stat-card">
          <div className="secondary-stat-icon primary">
            <AttachMoneyIcon />
          </div>
          <div className="secondary-stat-info">
            <span className="secondary-stat-label">Total Revenue</span>
            <span className="secondary-stat-value">${stats?.totalRevenue || 0}</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>User Management</h2>
          <div className="section-filters">
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-control form-select"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="All">All Users</option>
              <option value="Student">Students</option>
              <option value="Teacher">Teachers</option>
              <option value="Admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge badge-${user.type.toLowerCase()}`}>
                      {user.type}
                    </span>
                  </td>
                  <td>
                    <span className={`status-indicator ${user.isActive ? 'active' : 'inactive'}`}>
                      <span className="status-dot"></span>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className={`btn btn-sm btn-icon ${user.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                        onClick={() => handleToggleActive(user._id, user.isActive)}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <EditIcon fontSize="small" />
                      </button>
                      <button
                        className="btn btn-sm btn-icon btn-outline-danger"
                        onClick={() => handleDeleteUser(user._id)}
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="empty-state compact">
              <p>No users found</p>
            </div>
          )}
        </div>
      </section>

      {/* Activity Cards */}
      <div className="activity-grid">
        <div className="activity-card">
          <div className="activity-header">
            <h3>Recent Enrollments</h3>
          </div>
          <div className="activity-list">
            {stats?.recentEnrollments?.map((enrollment, index) => (
              <div key={index} className="activity-item">
                <div className="activity-content">
                  <span className="activity-title">{enrollment.userID?.name}</span>
                  <span className="activity-subtitle">
                    enrolled in {enrollment.courseID?.C_title}
                  </span>
                </div>
              </div>
            ))}
            {!stats?.recentEnrollments?.length && (
              <div className="activity-empty">No recent enrollments</div>
            )}
          </div>
        </div>
        <div className="activity-card">
          <div className="activity-header">
            <h3>Popular Courses</h3>
          </div>
          <div className="activity-list">
            {stats?.popularCourses?.map((course, index) => (
              <div key={index} className="activity-item">
                <div className="activity-content">
                  <span className="activity-title">{course.C_title}</span>
                  <span className="activity-subtitle">
                    {course.enrolled} students enrolled
                  </span>
                </div>
                <span className="activity-badge">
                  {course.C_price ? `$${course.C_price}` : 'Free'}
                </span>
              </div>
            ))}
            {!stats?.popularCourses?.length && (
              <div className="activity-empty">No courses yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
