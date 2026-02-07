import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import DevicesIcon from '@mui/icons-material/Devices';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Home = () => {
  const features = [
    {
      icon: <PlayCircleIcon style={{ fontSize: 40 }} />,
      title: 'Self-Paced Learning',
      description: 'Learn at your own pace with our flexible course structure and lifetime access.',
    },
    {
      icon: <CardMembershipIcon style={{ fontSize: 40 }} />,
      title: 'Certification',
      description: 'Receive verified digital certificates upon successful course completion.',
    },
    {
      icon: <DevicesIcon style={{ fontSize: 40 }} />,
      title: 'Multi-Device Support',
      description: 'Access courses seamlessly on desktop, tablet, or mobile devices.',
    },
    {
      icon: <GroupsIcon style={{ fontSize: 40 }} />,
      title: 'Expert Instructors',
      description: 'Learn from industry experts and experienced educators worldwide.',
    },
    {
      icon: <AutoStoriesIcon style={{ fontSize: 40 }} />,
      title: 'Rich Content',
      description: 'Access high-quality video lectures, assignments, and resources.',
    },
    {
      icon: <SchoolIcon style={{ fontSize: 40 }} />,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics and insights.',
    },
  ];

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cloud Computing',
    'Cybersecurity',
  ];

  const stats = [
    { value: '10K+', label: 'Active Learners' },
    { value: '500+', label: 'Expert Courses' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '50+', label: 'Industry Partners' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <p className="text-uppercase small fw-semibold mb-3" style={{ letterSpacing: '0.1em', opacity: 0.8 }}>
                Start your learning journey today
              </p>
              <h1>Unlock Your Full Potential with Expert-Led Courses</h1>
              <p className="lead mb-5">
                Join thousands of learners mastering new skills. Get access to world-class 
                education from industry experts and transform your career.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/courses" className="btn btn-light btn-lg px-4">
                  Explore Courses
                  <ArrowForwardIcon className="ms-2" style={{ fontSize: 20 }} />
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                  Get Started Free
                </Link>
              </div>
              
              {/* Stats Row */}
              <div className="row g-4 mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                {stats.map((stat, index) => (
                  <div key={index} className="col-6 col-md-3">
                    <h3 className="mb-1 fw-bold">{stat.value}</h3>
                    <p className="small mb-0" style={{ opacity: 0.7 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 text-center mt-5 mt-lg-0 d-none d-lg-block">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Learning"
                className="img-fluid rounded-4"
                style={{ 
                  maxHeight: '480px', 
                  objectFit: 'cover',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ background: 'white' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <p className="text-uppercase small fw-semibold mb-2" style={{ color: '#2563eb', letterSpacing: '0.1em' }}>
              Features
            </p>
            <h2 className="fw-bold" style={{ color: '#0f172a' }}>Why Choose LearnHub?</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Our platform provides everything you need to succeed in your learning journey.
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card h-100 p-4" style={{ 
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div className="d-flex align-items-center justify-content-center mb-4" 
                    style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                      color: '#2563eb'
                    }}>
                    {feature.icon}
                  </div>
                  <h5 className="fw-semibold mb-2" style={{ color: '#1e293b' }}>{feature.title}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9375rem', lineHeight: 1.7 }}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5" style={{ background: '#f8fafc' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <p className="text-uppercase small fw-semibold mb-2" style={{ color: '#2563eb', letterSpacing: '0.1em' }}>
              Browse
            </p>
            <h2 className="fw-bold" style={{ color: '#0f172a' }}>Popular Categories</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Explore our wide range of courses across various domains.
            </p>
          </div>
          <div className="row g-3 justify-content-center">
            {categories.map((category, index) => (
              <div key={index} className="col-auto">
                <Link
                  to={`/courses?category=${encodeURIComponent(category)}`}
                  className="btn btn-outline-primary btn-lg px-4"
                  style={{
                    borderWidth: '2px',
                    borderRadius: '50px',
                    fontWeight: 500
                  }}
                >
                  {category}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: 'white' }}>
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card h-100 p-5" style={{ 
                border: 'none',
                borderRadius: '1.5rem',
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                color: 'white'
              }}>
                <h3 className="fw-bold mb-3">Become a Student</h3>
                <p style={{ opacity: 0.9, lineHeight: 1.7 }}>
                  Join thousands of learners and start your journey to mastering new skills.
                  Enroll in courses, track your progress, and earn industry-recognized certificates.
                </p>
                <div className="mt-auto pt-3">
                  <Link to="/register" className="btn btn-light px-4">
                    Start Learning
                    <ArrowForwardIcon className="ms-2" style={{ fontSize: 18 }} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card h-100 p-5" style={{ 
                border: '2px solid #e2e8f0',
                borderRadius: '1.5rem',
                background: 'white'
              }}>
                <h3 className="fw-bold mb-3" style={{ color: '#1e293b' }}>Become an Instructor</h3>
                <p className="text-muted" style={{ lineHeight: 1.7 }}>
                  Share your knowledge with the world. Create courses, reach students globally,
                  and build your teaching career on our platform.
                </p>
                <div className="mt-auto pt-3">
                  <Link to="/register" className="btn btn-outline-primary px-4">
                    Start Teaching
                    <ArrowForwardIcon className="ms-2" style={{ fontSize: 18 }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: 'white' }} className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3">
                <SchoolIcon className="me-2" style={{ fontSize: 28, color: '#3b82f6' }} />
                <span className="h5 mb-0 fw-bold">LearnHub</span>
              </div>
              <p className="mb-0" style={{ color: '#94a3b8', fontSize: '0.9375rem' }}>
                Your trusted platform for skill enhancement and professional growth.
              </p>
            </div>
            <div className="col-md-6 text-md-end mt-4 mt-md-0">
              <p className="mb-0" style={{ color: '#64748b', fontSize: '0.875rem' }}>
                © {new Date().getFullYear()} LearnHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
