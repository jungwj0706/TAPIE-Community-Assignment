import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../Auth/AuthContext';
import './MainBoard.css';

function MainBoard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const { loggedInUser } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = loggedInUser ? localStorage.getItem("token") : null;
                const headers = {
                    'Content-Type': 'application/json'
                };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch('https://community-api.tapie.kr/board/posts', {
                    headers: headers
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error! status: ${response.status}`);
                }
                const data = await response.json();
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setPosts(data);
            } catch (e) {
                setError(e);
                console.error("게시물을 불러오는데 실패했습니다.", e);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [loggedInUser]);

    const postFilter = activeTab === 'all'
        ? posts
        : posts.filter(post => post.author && loggedInUser && post.author.username === loggedInUser.username);

    const myPostCount = loggedInUser ? posts.filter(post => post.author && post.author.username === loggedInUser.username).length : 0;

    const handleWriteButtonClick = (e) => {
      if (!loggedInUser) {
        e.preventDefault();
      }
    };

    if (loading) {
        return <div className="main-board-message">게시글을 불러오는 중...</div>;
    }
    if (error) {
        return <div className="main-board-message main-board-error-message">게시글을 불러오지 못했습니다 : {error.message}</div>;
    }

    return (
        <div className="main-board-page-container">
            <div className="main-board-content-wrapper">
                <div className="header-section">
                    <div className="write-count-button-group">
                        <Link
                            to="/write"
                            className={`write-button ${!loggedInUser ? 'write-button--disabled' : ''}`}
                            onClick={handleWriteButtonClick}
                        >
                            글 작성하기
                        </Link>
                        <p className="post-count">
                            {loggedInUser ? `나의 글 ${myPostCount}개 작성됨` : `전체 글 ${posts.length}개`}
                        </p>
                    </div>
                </div>

                <div className="tabs">
                    <button
                        className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}>
                        전체
                    </button>
                    {loggedInUser && (
                        <button
                            className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('my');
                            }}>
                            나의 글
                        </button>
                    )}
                </div>

                <ul className="board-grid-card-list">
                    {postFilter.length > 0 ? (
                        postFilter.map(post => (
                            <Link to={`/board/${post.id}`} key={post.id} className="board-card-item">
                                <h3 className="card-title">{post.title}</h3>
                                <p className="card-info">
                                    <span className="card-username">username: {post.author ? post.author.username : '알 수 없음'}</span>
                                    <span className="card-date">{new Date(post.createdAt).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '')}</span>
                                </p>
                                <p className="card-content-preview">{post.content}</p>
                            </Link>
                        ))
                    ) : (
                        <p className="no-post-message">게시글이 없습니다.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default MainBoard;