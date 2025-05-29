import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BoardWrite.css';

function BoardWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError(new Error('제목과 내용을 모두 입력해주세요.'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://community-api.tapie.kr/board/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `게시글 작성에 실패했습니다. 상태: ${response.status}`);
      }

      navigate('/');

    } catch (e) {
      setError(e);
      console.error('게시글 작성 중 오류가 발생했습니다: ', e);
      alert(`게시글 작성에 실패했습니다: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="board-write-container">
      <h2>글 작성</h2>
      <form onSubmit={handleSubmit} className="write-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 작성해주세요" 
            rows="10"
            required
            disabled={loading}
          ></textarea>
        </div>

        {error && <p className="error-message">{error.message}</p>}

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>등록하기</button>
        </div>
      </form>
    </div>
  );
}

export default BoardWrite;