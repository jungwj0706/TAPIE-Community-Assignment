// src/context/AuthContext.jsx
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

    // 로그인 함수 (API 호출 포함)
    const login = async (username, password) => {
        try {
            const response = await fetch('https://community-api.tapie.kr/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const user = { id: data.id, username: data.username, nickname: data.nickname };
                localStorage.setItem('token', data.token);
                setLoggedInUser(user);
                navigate('/'); // 로그인 성공 후 메인 페이지로 이동
                return { success: true, message: "로그인 성공" }; // 성공
            } else {
                const errorData = await response.json();
                console.error("Login failed:", errorData.message);
                setLoggedInUser(null);
                return { success: false, message: errorData.message || '로그인 실패: 알 수 없는 오류' }; // 실패
            }
        } catch (error) {
            console.error('Network error during login:', error);
            setLoggedInUser(null);
            return { success: false, message: '네트워크 오류 또는 서버에 연결할 수 없습니다.' }; // 실패
        }
    };

    // 회원가입 함수 (API 호출 포함)
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
                return { success: true, message: "회원가입에 성공했습니다!" }; // 성공
            } else {
                const errorData = await response.json();
                console.error("Registration failed:", errorData.message);
                return { success: false, message: errorData.message || '회원가입 실패: 알 수 없는 오류' }; // 실패
            }
        } catch (error) {
            console.error('Network error during registration:', error);
            return { success: false, message: '네트워크 오류 또는 서버에 연결할 수 없습니다.' }; // 실패
        }
    };

    // 로그아웃 함수
    const logout = () => {
        setLoggedInUser(null);
        localStorage.removeItem('token');
        navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    };

    const value = {
        loggedInUser,
        login,
        register, // register 함수도 컨텍스트 값으로 제공
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