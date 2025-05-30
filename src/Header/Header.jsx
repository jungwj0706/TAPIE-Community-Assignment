import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../Auth/AuthContext';
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const { loggedInUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 onClick={() => navigate("/")}>TAPIE Board</h1>
      </div>
      <div className="header-right">
        {loggedInUser ? (
          <>
            <span className="nickname">{loggedInUser.nickname}</span>
            <button className="logout-button" onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <button className="login-button" onClick={() => navigate("/login")}>
            → 로그인
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;