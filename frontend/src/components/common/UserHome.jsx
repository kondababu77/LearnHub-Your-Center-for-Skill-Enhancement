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
    <div className="container py-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-4">
            <div
              className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
              style={{ width: 80, height: 80, fontSize: 32 }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ms-3">
              <h3 className="mb-1">{user.name}</h3>
              <p className="text-muted mb-0">{user.email}</p>
              <span className={`badge bg-${user.type === 'Admin' ? 'danger' : user.type === 'Teacher' ? 'warning' : 'success'}`}>
                {user.type}
              </span>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-md-6">
              <h5>Account Information</h5>
              <table className="table">
                <tbody>
                  <tr>
                    <td className="text-muted">Name</td>
                    <td>{user.name}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Email</td>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Role</td>
                    <td>{user.type}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Status</td>
                    <td>
                      <span className="badge bg-success">Active</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
