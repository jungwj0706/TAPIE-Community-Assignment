import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    if (!username || !password || !nickname) {
      setMessage("모든 정보를 입력해주세요.");
      return;
    }
    const userData = { username, password, nickname };
    localStorage.setItem("user", JSON.stringify(userData));
    setMessage("회원가입 완료! 로그인 해주세요.");
    setIsLogin(true);
  };

  const handleLogin = () => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      setMessage("회원가입된 정보가 없습니다.");
      return;
    }

    const savedUser = JSON.parse(saved);
    if (username === savedUser.username && password === savedUser.password) {
      localStorage.setItem("loggedInUser", JSON.stringify(savedUser));
      navigate("/");
    } else {
      setMessage("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="card">
        <h2>{isLogin ? "로그인" : "회원가입"}</h2>

        <label>유저이름</label>
        <input
          type="text"
          placeholder="아이디를 입력해주세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {!isLogin && (
          <>
            <label>닉네임</label>
            <input
              type="text"
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </>
        )}

        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={isLogin ? handleLogin : handleSignup}>
          → {isLogin ? "로그인" : "회원가입"}
        </button>

        <div className="toggle">
          <p onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
            setUsername('');
            setPassword('');
            setNickname('');
          }}>
            {isLogin ? "회원가입 하러가기 →" : "← 로그인으로 돌아가기"}
          </p>
        </div>

        {message && <p style={{ color: "#666", textAlign: "center" }}>{message}</p>}
      </div>
    </div>
  );
}

export default Login;
