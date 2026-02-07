import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from './AxiosInstance';

const UserHome = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await AxiosInstance.get('/users/profile');
      setUser((prev) => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  if (!user) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <span className="profile-role-badge">{user.type}</span>
        </div>

        {/* Account Information */}
        <div className="profile-info-card">
          <div className="profile-info-header">Account Information</div>
          <div className="profile-info-row">
            <span className="profile-info-label">Full Name</span>
            <span className="profile-info-value">{user.name}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Email Address</span>
            <span className="profile-info-value">{user.email}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Account Role</span>
            <span className="profile-info-value">{user.type}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Account Status</span>
            <span className="profile-status-active">
              <span className="profile-status-dot"></span>
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
