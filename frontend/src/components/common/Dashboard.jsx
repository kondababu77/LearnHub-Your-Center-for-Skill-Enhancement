import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect based on user type
    switch (user.type) {
      case 'Admin':
        navigate('/admin');
        break;
      case 'Teacher':
        navigate('/teacher');
        break;
      case 'Student':
        navigate('/student');
        break;
      default:
        navigate('/');
    }
  }, [navigate]);

  return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Redirecting to your dashboard...</p>
    </div>
  );
};

export default Dashboard;
