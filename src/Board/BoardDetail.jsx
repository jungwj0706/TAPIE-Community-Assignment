import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BoardDetail.css';

const API_BASE_URL = 'https://community-api.tapie.kr';

function BoardDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = user ? localStorage.getItem("token") : null;
        const headers = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/board/posts/${postId}`, {
          headers: headers
        });
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          if (response.status === 404) {
              setError(new Error("게시글을 찾을 수 없습니다."));
          } else {
              throw new Error(`HTTP Error! status: ${response.status}`);
          }
        }
      } catch (e) {
        setError(e);
        console.error('게시글을 불러오는데 실패했습니다.', e);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, user]);

  if (loading) {
    return <div className="detail_container loading">게시글 로딩 중...</div>;
  }

  if (error) {
    return <div className="detail_container error_message">게시글을 불러오지 못했습니다: {error.message}</div>;
  }

  if (!post) {
    return <div className="detail_container no_post">게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="detail_container">
      <div className="detail_card">
        <h2 className="detail_title">{post.title}</h2>
        <div className="detail_meta">
          <span className="detail_username">username: {post.author ? post.author.username : '알 수 없음'}</span>
          <span className="detail_date">{new Date(post.createdAt).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '')}</span>
        </div>
        <div className="detail_content_wrapper">
          <p className="detail_content">{post.content}</p>
        </div>
      </div>
    </div>
  );
}

export default BoardDetail;