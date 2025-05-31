import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);
const API_BASE_URL = 'https://community-api.tapie.kr';

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/check`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('AuthContext - checkLoginStatus userData:', userData);
          setLoggedInUser({ 
            id: userData.id, 
            username: userData.username, 
            nickname: userData.nickname || userData.username
          }); 
        } else {
          setLoggedInUser(null);
        }
      } catch (error) {
        console.error('로그인 상태 확인 실패:', error);
        setLoggedInUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // **필수**
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('AuthContext - Login successful userData:', userData);
        setLoggedInUser({ 
          id: userData.id, 
          username: userData.username, 
          nickname: userData.nickname || userData.username // 서버 응답 필드명 확인
        }); 
        navigate('/');
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || '로그인 실패' };
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      return { success: false, message: '네트워크 오류' };
    }
  };

  const register = async (username, nickname, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, nickname, password }),
        credentials: 'include', // **필수**
      });

      if (response.ok) {
        return { success: true, message: '회원가입에 성공했습니다.' };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || '회원가입 실패' };
      }
    } catch (error) {
      console.error('회원가입 요청 실패:', error);
      return { success: false, message: '네트워크 오류' };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // **필수**
      });
      if (response.ok) {
        setLoggedInUser(null);
        navigate('/login');
      } else {
        console.error('로그아웃 실패');
      }
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    }
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ loggedInUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);