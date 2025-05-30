import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import './MyPage.css';

const API_BASE_URL = 'https://community-api.tapie.kr';

const MyPage = ({ setPage, setSelectedPostId }) => {
  const { loggedInUser } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!loggedInUser) {
        setLoading(false);
        setError('로그인해야 내 게시글을 볼 수 있습니다.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/board/posts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const allPosts = await response.json();
          const filteredPosts = allPosts.filter(
            (post) => post.author && loggedInUser && post.author.id === loggedInUser.id
          );
          filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setMyPosts(filteredPosts);
        } else {
          setError('내 게시글을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        setError('네트워크 오류: 내 게시글을 불러올 수 없습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [loggedInUser]);

  const handleEditClick = (e, postId) => {
    e.stopPropagation();
    setSelectedPostId(postId);
    setPage('boardEdit');
  };

  const handleDeleteClick = (e, postId) => {
    e.stopPropagation();
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/board/posts/${postToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setMyPosts(myPosts.filter(post => post.id !== postToDelete));
        alert('게시글이 성공적으로 삭제되었습니다.');
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('게시글 삭제 오류:', err);
      alert('네트워크 오류로 게시글을 삭제할 수 없습니다.');
    } finally {
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };

  if (loading) {
    return <div className="app-message">내 게시글 로딩 중...</div>;
  }

  if (error) {
    return <div className="app-message app-error-message">{error}</div>;
  }

  if (!loggedInUser) {
    return <div className="app-message app-info-message">로그인 후 이용해주세요.</div>;
  }

  return (
    <div className="mypage-container">
      <div className="mypage-header-actions">
        <button
          onClick={() => setPage('boardWrite')}
          className="mypage-write-btn"
        >
          <svg className="mypage-write-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.586 3.586l-7.5 7.5V17h2.328l7.5-7.5-2.328-2.328z"></path>
          </svg>
          글 작성하기
        </button>
        <p className="mypage-post-count">
          나의 글 <span className="mypage-post-count-num">{myPosts.length}</span>개 작성됨.
        </p>
      </div>

      <div className="mypage-tabs">
        <button className="mypage-tab-btn mypage-tab-btn--inactive" onClick={() => setPage('mainBoard')}>전체</button>
        <button className="mypage-tab-btn mypage-tab-btn--active">나의 글</button>
      </div>

      {myPosts.length === 0 ? (
        <p className="mypage-no-posts">아직 작성한 게시글이 없습니다.</p>
      ) : (
        <div className="mypage-grid">
          {myPosts.map((post) => (
            <div
              key={post.id}
              className="mypage-post-card"
              onClick={() => {
                setSelectedPostId(post.id);
                setPage('boardDetail');
              }}
            >
              <h3 className="mypage-post-card__title">{post.title}</h3>
              <p className="mypage-post-card__date">{new Date(post.createdAt).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '')}</p>
              <div className="mypage-post-card__actions">
                <button
                  onClick={(e) => handleEditClick(e, post.id)}
                  className="mypage-action-btn mypage-edit-btn"
                  title="수정"
                >
                  <svg className="mypage-action-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.586 3.586l-7.5 7.5V17h2.328l7.5-7.5-2.328-2.328z"></path>
                  </svg>
                </button>
                <button
                  onClick={(e) => handleDeleteClick(e, post.id)}
                  className="mypage-action-btn mypage-delete-btn"
                  title="삭제"
                >
                  <svg className="mypage-action-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-message">정말 이 게시글을 삭제하시겠습니까?</p>
            <div className="modal-actions">
              <button
                onClick={confirmDelete}
                className="modal-btn btn-danger"
              >
                삭제
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="modal-btn btn-secondary"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;