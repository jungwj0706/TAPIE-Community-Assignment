import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import './BoardEdit.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = 'https://community-api.tapie.kr';

const BoardEdit = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { loggedInUser } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  useEffect(() => {
    const fetchPost = async () => {
      if (!loggedInUser) {
        setError('로그인된 사용자만 게시글을 수정할 수 있습니다. 로그인 페이지로 이동합니다.');
        setTimeout(() => navigate('/login'), 2000);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/board/posts/${postId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const postData = await response.json();
          if (postData.author && loggedInUser.id === postData.author.id) {
            setTitle(postData.title);
            setContent(postData.content);
            setIsAuthor(true);
          } else {
            setError('게시글을 수정할 권한이 없습니다.');
            setIsAuthor(false);
            setTimeout(() => navigate('/'), 2000);
          }
        } else {
          setError('게시글을 불러오는데 실패했습니다.');
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (err) {
        setError('네트워크 오류: 게시글을 불러올 수 없습니다. 메인 페이지로 이동합니다.');
        console.error(err);
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, loggedInUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!loggedInUser || !isAuthor) {
      setError('게시글을 수정할 권한이 없습니다.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/board/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        alert('게시글이 성공적으로 수정되었습니다.');
        navigate(`/board/${postId}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || '게시글 수정에 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류: 게시글을 수정할 수 없습니다.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="app-message">게시글 로딩 중...</div>;
  }

  if (error) {
    return <div className="app-message app-error-message">{error}</div>;
  }

  if (!isAuthor && !loading && !error) {
    return <div className="app-message app-error-message">이 게시글을 수정할 권한이 없습니다.</div>;
  }


  return (
    <div className="board-edit-container">
      <div className="board-edit-card">
        <h2 className="board-edit-title">글 수정</h2>
        <form onSubmit={handleSubmit} className="board-edit-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">제목</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="content" className="form-label">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="form-textarea"
            ></textarea>
          </div>
          <button type="submit" className="board-edit-button">
            <FontAwesomeIcon icon={faPen} />
            수정하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default BoardEdit;