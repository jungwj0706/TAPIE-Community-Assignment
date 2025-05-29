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
      // ✅ 로그인된 유저 가져오기
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }

      // ✅ 기존 게시글 불러오기
      const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");

      // ✅ 새 게시글 생성
      const newPost = {
        id: Date.now(),
        title,
        content,
        author: user.nickname,
        date: new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
      };

      // ✅ 게시글 추가 후 저장
      localStorage.setItem("posts", JSON.stringify([newPost, ...savedPosts]));

      // ✅ 성공 시 메인 페이지로 이동
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
          <button type="submit" className="submit-button" disabled={loading}>
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default BoardWrite;
