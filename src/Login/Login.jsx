// import React, { useState } from 'react';
// import { useAuth } from '../Auth/AuthContext';
// import './Login.css';

// const Login = () => {
//    const { login, register } = useAuth();

//    const [loginUsername, setLoginUsername] = useState('');
//    const [loginPassword, setLoginPassword] = useState('');
//    const [registerUsername, setRegisterUsername] = useState('');
//    const [registerNickname, setRegisterNickname] = useState('');
//    const [registerPassword, setRegisterPassword] = useState('');
//    const [message, setMessage] = useState('');

//    const handleLogin = async (e) => {
//      e.preventDefault();
//      setMessage('');
//      const result = await login(loginUsername, loginPassword);
//      if (!result.success) {
//        setMessage(result.message);
//      }
//    };

//    const handleRegister = async (e) => {
//      e.preventDefault();
//      setMessage('');
//      const result = await register(registerUsername, registerNickname, registerPassword);
//      if (result.success) {
//        setMessage('회원가입에 성공했습니다.');
//        setRegisterUsername('');
//        setRegisterNickname('');
//        setRegisterPassword('');
//      } else {
//        setMessage(result.message);
//      }
//    };

//    return (
//      <div className="login-page-container">
//        <div className="login-card-wrapper">
//          <div className="login-card">
//            <h2 className="login-title">로그인</h2>
//            <form onSubmit={handleLogin} className="login-form">
//              <div className="form-group">
//                <label htmlFor="login-username" className="form-label">유저이름</label>
//                <input
//                  id="login-username"
//                  type="text"
//                  value={loginUsername}
//                  onChange={(e) => setLoginUsername(e.target.value)}
//                  required
//                  className="form-input"
//                  autoComplete="username"
//                  placeholder="username1234"
//                />
//              </div>
//              <div className="form-group">
//                <label htmlFor="login-password" className="form-label">비밀번호</label>
//                <input
//                  id="login-password"
//                  type="password"
//                  value={loginPassword}
//                  onChange={(e) => setLoginPassword(e.target.value)}
//                  required
//                  className="form-input"
//                  autoComplete="current-password"
//                  placeholder="비밀번호를 입력해주세요"
//                />
//              </div>
//              <button type="submit" className="login-button">
//                로그인
//              </button>
//            </form>
//          </div>

//          <div className="register-card">
//            <h2 className="register-title">회원가입</h2>
//            <form onSubmit={handleRegister} className="register-form">
//              <div className="form-group">
//                <label htmlFor="register-username" className="form-label">유저이름</label>
//                <input
//                  id="register-username"
//                  type="text"
//                  value={registerUsername}
//                  onChange={(e) => setRegisterUsername(e.target.value)}
//                  required
//                  className="form-input"
//                  autoComplete="new-username"
//                  placeholder="myusername1234"
//                />
//              </div>
//              <div className="form-group">
//                <label htmlFor="register-nickname" className="form-label">닉네임</label>
//                <input
//                  id="register-nickname"
//                  type="text"
//                  value={registerNickname}
//                  onChange={(e) => setRegisterNickname(e.target.value)}
//                  required
//                  className="form-input"
//                  autoComplete="nickname"
//                  placeholder="JeeWonKwon"
//                />
//              </div>
//              <div className="form-group">
//                <label htmlFor="register-password" className="form-label">비밀번호</label>
//                <input
//                  id="register-password"
//                  type="password"
//                  value={registerPassword}
//                  onChange={(e) => setRegisterPassword(e.target.value)}
//                  required
//                  className="form-input"
//                  autoComplete="new-password"
//                  placeholder="비밀번호를 입력해주세요"
//                />
//              </div>
//              <button type="submit" className="register-button">
//                회원가입
//              </button>
//            </form>
//          </div>
//        </div>
//        {message && (
//          <div className="info-message">
//            {message}
//          </div>
//        )}
//      </div>
//    );
//  };

//  export default Login;

//==============수정본===============
// Login.jsx (수정)
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Link는 필요 없지만 남겨둠
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
   const [isRegistering, setIsRegistering] = useState(false); // 로그인/회원가입 전환 상태 추가

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
       setIsRegistering(false); // 회원가입 성공 후 로그인 화면으로 전환
     } else {
       setMessage(result.message);
     }
   };

   return (
     <div className="login-page-container">
       <div className="login-card-wrapper"> {/* 이 래퍼는 Login.css에서 flex로 두 카드를 가운데 정렬합니다. */}
         
         {/* isRegistering 상태에 따라 로그인 또는 회원가입 폼을 렌더링 */}
         {!isRegistering ? (
           // 로그인 카드
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
                   placeholder="username1234"
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
             <div className="toggle-form-link">
               <p onClick={() => setIsRegistering(true)}>계정이 없으신가요? <span>회원가입하기</span></p>
             </div>
           </div>
         ) : (
           // 회원가입 카드
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
                   placeholder="myusername1234"
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
                   placeholder="JeeWonKwon"
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
             <div className="toggle-form-link">
               <p onClick={() => setIsRegistering(false)}>이미 계정이 있으신가요? <span>로그인하기</span></p>
             </div>
           </div>
         )}
       </div> {/* login-card-wrapper */}
       {message && (
         <div className="info-message">
           {message}
         </div>
       )}
     </div>
   );
 };

 export default Login;