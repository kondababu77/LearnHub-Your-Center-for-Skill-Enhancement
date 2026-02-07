import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setUserMenuOpen(false);
    navigate('/');
    window.dispatchEvent(new Event('userLogin'));
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.type) {
      case 'Admin':
        return '/admin';
      case 'Teacher':
        return '/teacher';
      case 'Student':
        return '/student';
      default:
        return '/dashboard';
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
  ];

  if (user) {
    navLinks.push({ path: getDashboardLink(), label: 'Dashboard' });
  }

  return (
    <nav className={`navbar-premium ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link className="navbar-logo" to="/">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
          </div>
          <span className="logo-text">LearnHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="navbar-right">
          {user ? (
            <div className="user-dropdown">
              <button 
                className="user-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="user-avatar-nav">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name-nav">{user.name}</span>
                  <span className={`user-role ${user.type.toLowerCase()}`}>{user.type}</span>
                </div>
                <KeyboardArrowDownIcon className={`dropdown-arrow ${userMenuOpen ? 'open' : ''}`} />
              </button>
              
              {userMenuOpen && (
                <>
                  <div className="dropdown-backdrop" onClick={() => setUserMenuOpen(false)} />
                  <div className="user-dropdown-menu">
                    <div className="dropdown-user-header">
                      <div className="dropdown-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="dropdown-user-info">
                        <span className="dropdown-user-name">{user.name}</span>
                        <span className="dropdown-user-email">{user.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link 
                      to={getDashboardLink()} 
                      className="dropdown-menu-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <DashboardIcon fontSize="small" />
                      <span>Dashboard</span>
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-menu-item danger" onClick={handleLogout}>
                      <LogoutIcon fontSize="small" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-nav-login">
                Sign in
              </Link>
              <Link to="/register" className="btn-nav-signup">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {!user && (
            <div className="mobile-auth">
              <Link to="/login" className="btn-mobile-login" onClick={() => setMobileMenuOpen(false)}>
                Sign in
              </Link>
              <Link to="/register" className="btn-mobile-signup" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
