// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('loggedInUser');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse loggedInUser from localStorage", error);
            return null;
        }
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (loggedInUser) {
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        } else {
            localStorage.removeItem('loggedInUser');
        }
    }, [loggedInUser]);

    const login = async (username, password) => {
        try {
            const response = await fetch('https://community-api.tapie.kr/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 쿠키를 포함하여 요청을 보내기 위해 credentials 옵션을 'include'로 설정합니다.
                credentials: 'include', 
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                // 서버 응답 본문은 그대로 파싱 (사용자 정보 등)
                const data = await response.json(); 
                console.log('로그인 성공 서버 응답 본문 데이터:', data); // 본문 데이터 확인
                
                // HttpOnly 쿠키는 브라우저가 자동으로 처리하므로,
                // localStorage에 토큰을 직접 저장할 필요가 없습니다.
                // localStorage.setItem('token', tokenToStore); // <-- 이 라인 제거

                const user = { id: data.id, username: data.username, nickname: data.nickname };
                localStorage.setItem('loggedInUser', JSON.stringify(user)); // 사용자 정보는 localStorage에 저장
                setLoggedInUser(user);
                navigate('/');
                return { success: true, message: "로그인 성공" };
            } else {
                const errorData = await response.json();
                console.error("Login failed:", errorData.message);
                setLoggedInUser(null);
                localStorage.removeItem('loggedInUser'); // 로그인 실패 시 loggedInUser도 제거
                // localStorage.removeItem('token'); // HttpOnly 쿠키이므로 이 라인은 더 이상 필요 없습니다.
                return { success: false, message: errorData.message || '로그인 실패: 알 수 없는 오류' };
            }
        } catch (error) {
            console.error('Network error during login:', error);
            setLoggedInUser(null);
            localStorage.removeItem('loggedInUser'); // 네트워크 오류 시 loggedInUser도 제거
            // localStorage.removeItem('token'); // HttpOnly 쿠키이므로 이 라인은 더 이상 필요 없습니다.
            return { success: false, message: '네트워크 오류 또는 서버에 연결할 수 없습니다.' };
        }
    };

    const register = async (username, nickname, password) => {
        try {
            const response = await fetch('https://community-api.tapie.kr/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, nickname, password }),
            });

            if (response.ok) {
                return { success: true, message: "회원가입에 성공했습니다!" };
            } else {
                const errorData = await response.json();
                console.error("Registration failed:", errorData.message);
                return { success: false, message: errorData.message || '회원가입 실패: 알 수 없는 오류' };
            }
        } catch (error) {
            console.error('Network error during registration:', error);
            return { success: false, message: '네트워크 오류 또는 서버에 연결할 수 없습니다.' };
        }
    };

    const logout = () => {
        setLoggedInUser(null);
        // localStorage.removeItem('token'); // 이 라인 제거
        localStorage.removeItem('loggedInUser'); 
        // 쿠키는 서버가 만료시키거나, 브라우저 세션 종료 시 자동으로 제거될 수 있습니다.
        // 클라이언트에서 강제로 쿠키를 지우는 것은 복잡하며 HttpOnly 특성상 불가능합니다.
        // 서버에 로그아웃 API를 호출하여 서버 측 세션을 무효화하는 것이 가장 정확합니다.
        navigate('/login');
    };

    const value = {
        loggedInUser,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};