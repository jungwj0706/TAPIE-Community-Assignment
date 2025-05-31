import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import './BoardDetail.css';

const API_BASE_URL = 'https://community-api.tapie.kr';

const BoardDetail = () => {
  const { id: postId } = useParams();
  console.log('BoardDetail - useParams postId:', postId);
  const navigate = useNavigate();
  const { loggedInUser, logout } = useAuth(); 
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoading(true);
      setError(null);

      if (!postId) {
        setError('게시글 ID가 유효하지 않습니다.');
        setLoading(false);
        navigate('/');
        return;
      }

      try {
        console.log(`--- 게시글 상세 불러오기 시작: ${postId} ---`);
        const response = await fetch(`${API_BASE_URL}/board/posts/${postId}`, {
          credentials: 'include',
        });

        console.log('게시글 상세 응답 상태:', response.status);
        console.log('게시글 상세 응답 OK 여부:', response.ok);

        const responseClone = response.clone();

        if (response.ok) {
          const postData = await responseClone.json();
          console.log('게시글 상세 데이터 (JSON):', postData);
          setPost(postData);
        } else {
          const errorData = await responseClone.json().catch(() => ({ message: '응답 본문 없음' }));
          console.error('게시글 상세 불러오기 실패 - 서버 응답:', response.status, errorData);
          if (response.status === 404) {
            setError('게시글을 찾을 수 없습니다.');
            navigate('/');
          } else if (response.status === 401) {
             setError('인증 오류: 로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
             logout();
             navigate('/login');
          }
          else {
            setError(errorData.message || '게시글 상세 정보를 불러오는데 실패했습니다.');
          }
        }
      } catch (err) {
        setError('네트워크 오류: 게시글을 불러올 수 없습니다. 인터넷 연결을 확인해주세요.');
        console.error('BoardDetail fetchPostDetail 네트워크 오류:', err);
      } finally {
        setLoading(false);
        console.log('--- 게시글 상세 불러오기 종료 ---');
      }
    };

    fetchPostDetail();
  }, [postId, navigate, logout]); 

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/board/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        alert('게시글이 삭제되었습니다.');
        navigate('/');
      } else {
        const errorData = await response.json().catch(() => ({ message: '게시글 삭제 실패' }));
        alert(`게시글 삭제 실패: ${errorData.message || response.status}`);
        if (response.status === 401) {
          logout();
          navigate('/login');
        }
      }
    } catch (error) {
      alert('네트워크 오류로 게시글을 삭제할 수 없습니다.');
      console.error('게시글 삭제 중 네트워크 오류:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${postId}`);
  };

  if (loading) {
    return <div className="board-detail-message">게시글을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="board-detail-message board-detail-error-message">오류: {error}</div>;
  }

  if (!post) {
    return <div className="board-detail-message">게시글을 찾을 수 없습니다.</div>;
  }

  const isAuthor = loggedInUser && post.author && String(loggedInUser.id) === String(post.author.id);

  return (
    <div className="board-detail-container">
      <div className="board-detail-content-wrapper">
        <h2 className="detail-title">{post.title}</h2>
        <div className="detail-meta">
          <span className="detail-author">작성자: {post.author ? post.author.nickname : '알 수 없음'}</span>
          <span className="card-date">작성일: {new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
          {post.createdAt !== post.updatedAt && (
            <span className="card-date">(수정일: {new Date(post.updatedAt).toLocaleDateString('ko-KR')})</span>
          )}
        </div>
        <div className="detail-content">
          <p>{post.content}</p>
        </div>
        
        {isAuthor && (
          <div className="detail-buttons">
            <button onClick={handleEdit} className="detail-edit-btn">수정</button>
            <button onClick={handleDelete} className="detail-delete-btn">삭제</button>
          </div>
        )}
        
        <button onClick={() => navigate('/')} className="detail-back-btn">목록으로</button>
      </div>
    </div>
  );
};

export default BoardDetail;