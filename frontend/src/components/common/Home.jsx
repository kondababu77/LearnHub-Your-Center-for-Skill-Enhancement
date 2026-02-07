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
              <p className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.8)' }}>
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
              <div className="hero-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="hero-stat">
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 text-center mt-5 mt-lg-0 d-none d-lg-block">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Learning"
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-section bg-white">
        <div className="home-container text-center">
          <p className="section-eyebrow">Features</p>
          <h2 className="section-title">Why Choose LearnHub?</h2>
          <p className="section-subtitle">
            Our platform provides everything you need to succeed in your learning journey.
          </p>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="home-section bg-gray">
        <div className="home-container text-center">
          <p className="section-eyebrow">Browse</p>
          <h2 className="section-title">Popular Categories</h2>
          <p className="section-subtitle">
            Explore our wide range of courses across various domains.
          </p>
          <div className="category-pills">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/courses?category=${encodeURIComponent(category)}`}
                className="category-pill"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-section bg-white">
        <div className="home-container">
          <div className="cta-grid">
            <div className="cta-card primary">
              <h3>Become a Student</h3>
              <p>
                Join thousands of learners and start your journey to mastering new skills.
                Enroll in courses, track your progress, and earn industry-recognized certificates.
              </p>
              <div className="cta-action">
                <Link to="/register" className="btn btn-light px-4">
                  Start Learning
                  <ArrowForwardIcon className="ms-2" style={{ fontSize: 18 }} />
                </Link>
              </div>
            </div>
            <div className="cta-card outline">
              <h3>Become an Instructor</h3>
              <p>
                Share your knowledge with the world. Create courses, reach students globally,
                and build your teaching career on our platform.
              </p>
              <div className="cta-action">
                <Link to="/register" className="btn btn-outline-primary px-4">
                  Start Teaching
                  <ArrowForwardIcon className="ms-2" style={{ fontSize: 18 }} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
