import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import './BoardWrite.css';

const API_BASE_URL = 'https://community-api.tapie.kr';

const BoardWrite = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!loggedInUser) {
      setError('로그인된 사용자만 글을 작성할 수 있습니다.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/board/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const newPost = await response.json();
        alert('게시글이 성공적으로 작성되었습니다.');
        navigate(`/board/${newPost.id}`);
      } else {
        const errorData = await response.json();
        console.error('게시글 작성 실패 서버 응답:', response.status, errorData);
        setError(errorData.message || '게시글 작성에 실패했습니다.');
        if (response.status === 401) {
            alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
            navigate('/login');
        }
      }
    } catch (err) {
      setError('네트워크 오류: 게시글을 작성할 수 없습니다.');
      console.error('게시글 작성 중 네트워크 오류:', err);
    }
  };

  if (!loggedInUser) {
    return (
      <div className="center-message">
        <p>글을 작성하려면 로그인해야 합니다.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-card">
        <h2 className="card-title">글 작성</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="label-hidden">제목</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="content" className="label-hidden">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 작성해주세요"
              required
              className="textarea-field"
            ></textarea>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">
            <svg className="button-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l.649-.186.936-2.428 1.498 1.498 1.054-.367L10 15.688l-1.895-.895 2.146-5.596 1.502 1.502.936-2.428.649-.186a1 1 0 001.169 1.409l-7 14z"></path>
            </svg>
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default BoardWrite;