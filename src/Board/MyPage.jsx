import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import './MyPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';


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
        const response = await fetch(`${API_BASE_URL}/board/posts`, {
          credentials: 'include',
        });

        if (response.ok) {
          const allPosts = await response.json();
          const filteredPosts = allPosts.filter(
            (post) => post.author && loggedInUser && post.author.id === loggedInUser.id
          );
          filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setMyPosts(filteredPosts);
        } else {
          if (response.status === 401) {
            setError('인증 오류: 로그인 세션이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.');
          } else {
            setError('내 게시글을 불러오는데 실패했습니다.');
          }
        }
      } catch (err) {
        setError('네트워크 오류: 내 게시글을 불러올 수 없습니다.');
        console.error('MyPage fetchMyPosts 오류:', err);
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
      const response = await fetch(`${API_BASE_URL}/board/posts/${postToDelete}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setMyPosts(myPosts.filter(post => post.id !== postToDelete));
        alert('게시글이 성공적으로 삭제되었습니다.');
      } else {
        if (response.status === 401) {
            alert('인증 오류: 로그인 세션이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.');
        } else {
            alert('게시글 삭제에 실패했습니다.');
        }
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
                >
                  <FontAwesomeIcon icon={faPenToSquare} /> 
                </button>
                <button
                  onClick={(e) => handleDeleteClick(e, post.id)}
                  className="mypage-action-btn mypage-delete-btn"
                >
                  <FontAwesomeIcon icon={faTrash} /> 
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