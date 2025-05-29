import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>TAPIE Board</h1>
      </div>
      <div className="header-right">
        {user ? (
          <>
            <span className="nickname">{user.nickname}</span>
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
