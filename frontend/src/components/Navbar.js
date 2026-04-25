import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          KnowYour<span>CA</span>
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-item">Home</Link>
          {user?.role === 'ca' ? (
            <Link to="/dashboard" className="nav-item">Dashboard</Link>
          ) : (
            <Link to="/experts" className="nav-item">Experts</Link>
          )}
          <Link to="/inbox" className="nav-item">Inbox</Link>
          {user ? (
            <div className="user-nav">
              <span className="user-name">{user.name}</span>
              <button onClick={logout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
