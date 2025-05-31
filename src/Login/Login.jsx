import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../Auth/AuthContext';
import './Login.css';

const Login = () => {
   const { login, register } = useAuth();

   const [loginUsername, setLoginUsername] = useState('');
   const [loginPassword, setLoginPassword] = useState('');
   const [registerUsername, setRegisterUsername] = useState('');
   const [registerNickname, setRegisterNickname] = useState('');
   const [registerPassword, setRegisterPassword] = useState('');
   const [message, setMessage] = useState('');
   const [isRegistering, setIsRegistering] = useState(false); 

   const handleLogin = async (e) => {
     e.preventDefault();
     setMessage('');
     const result = await login(loginUsername, loginPassword);
     if (!result.success) {
       setMessage(result.message);
     }
   };

   const handleRegister = async (e) => {
     e.preventDefault();
     setMessage('');
     const result = await register(registerUsername, registerNickname, registerPassword);
     if (result.success) {
       setMessage('회원가입에 성공했습니다. 로그인해주세요.');
       setRegisterUsername('');
       setRegisterNickname('');
       setRegisterPassword('');
       setIsRegistering(false);
     } else {
       setMessage(result.message);
     }
   };

   return (
     <div className="login-page-container">
       <div className="login-card-wrapper">
         
         {!isRegistering ? (
           <div className="login-card">
             <h2 className="login-title">로그인</h2>
             <form onSubmit={handleLogin} className="login-form">
               <div className="form-group">
                 <label htmlFor="login-username" className="form-label">유저이름</label>
                 <input
                   id="login-username"
                   type="text"
                   value={loginUsername}
                   onChange={(e) => setLoginUsername(e.target.value)}
                   required
                   className="form-input"
                   autoComplete="username"
                   placeholder="유저이름을 입력해주세요"
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="login-password" className="form-label">비밀번호</label>
                 <input
                   id="login-password"
                   type="password"
                   value={loginPassword}
                   onChange={(e) => setLoginPassword(e.target.value)}
                   required
                   className="form-input"
                   autoComplete="current-password"
                   placeholder="비밀번호를 입력해주세요"
                 />
               </div>
               <button type="submit" className="login-button">
                 로그인
               </button>
             </form>
             <div className="sign-form-link">
               <p onClick={() => setIsRegistering(true)}>계정이 없으신가요? <span>회원가입하기</span></p>
             </div>
           </div>
         ) : (
           <div className="register-card">
             <h2 className="register-title">회원가입</h2>
             <form onSubmit={handleRegister} className="register-form">
               <div className="form-group">
                 <label htmlFor="register-username" className="form-label">유저이름</label>
                 <input
                   id="register-username"
                   type="text"
                   value={registerUsername}
                   onChange={(e) => setRegisterUsername(e.target.value)}
                   required
                   className="form-input"
                   autoComplete="new-username"
                   placeholder="본인의 이름을 입력하세요"
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="register-nickname" className="form-label">닉네임</label>
                 <input
                   id="register-nickname"
                   type="text"
                   value={registerNickname}
                   onChange={(e) => setRegisterNickname(e.target.value)}
                   required
                   className="form-input"
                   autoComplete="nickname"
                   placeholder="사용할 닉네임을 입력하세요"
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="register-password" className="form-label">비밀번호</label>
                 <input
                   id="register-password"
                   type="password"
                   value={registerPassword}
                   onChange={(e) => setRegisterPassword(e.target.value)}
                   required
                   className="form-input"
                   autoComplete="new-password"
                   placeholder="비밀번호를 입력해주세요"
                 />
               </div>
               <button type="submit" className="register-button">
                 회원가입
               </button>
             </form>
             <div className="sign-form-link">
               <p onClick={() => setIsRegistering(false)}>이미 계정이 있으신가요? <span>로그인하기</span></p>
             </div>
           </div>
         )}
       </div>
       {message && (
         <div className="info-message">
           {message}
         </div>
       )}
     </div>
   );
 };

 export default Login;