import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import './Header.css';

function Header() {
  const { loggedInUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1><Link to="/" style={{ textDecoration: 'none', color: 'white' }}>TAPIE Board</Link></h1>
      </div>
      <div className="header-right">
        {loggedInUser ? (
          <>
            <span className="nickname">{loggedInUser.nickname || loggedInUser.username}님</span>
            <button onClick={handleLogout} className="logout-button">
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login" className="login-button">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;