import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          🐾 Pet Adoption
        </Link>

        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <div className={isMobileMenuOpen ? 'bar bar1 active' : 'bar bar1'}></div>
          <div className={isMobileMenuOpen ? 'bar bar2 active' : 'bar bar2'}></div>
          <div className={isMobileMenuOpen ? 'bar bar3 active' : 'bar bar3'}></div>
        </div>

        <ul className={isMobileMenuOpen ? 'navbar-menu active' : 'navbar-menu'}>
          <li>
            <Link to="/" onClick={closeMobileMenu}>Home</Link>
          </li>
          <li>
            <Link to="/pets" onClick={closeMobileMenu}>Browse Pets</Link>
          </li>
          
          {user ? (
            <>
              <li>
                <Link to="/dashboard" onClick={closeMobileMenu}>
                  My Applications
                </Link>
              </li>
              {user.role === 'admin' && (
                <li>
                  <Link to="/admin" onClick={closeMobileMenu}>
                    Admin Dashboard
                  </Link>
                </li>
              )}
              <li>
                <span className="navbar-user">Hi, {user.name}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={closeMobileMenu}>Login</Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMobileMenu}>
                  <button className="btn-register">Register</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

