import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../Auth/AuthContext';
import './MainBoard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

function MainBoard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const { loggedInUser } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://community-api.tapie.kr/board/posts', {
                    credentials: 'include' 
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP Error! status: ${response.status}`);
                }
                const data = await response.json();
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setPosts(data);
                console.log('MainBoard - Fetched All Posts:', data);
            } catch (e) {
                setError(e);
                console.error("게시물을 불러오는데 실패했습니다.", e);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filteredPosts = activeTab === 'all'
        ? posts
        : posts.filter(post => {
            const isMyPost = post.author && loggedInUser && post.author.username === loggedInUser.username;
            if (activeTab === 'my' && post.author && loggedInUser) {
                console.log(`Comparing post author: ${post.author.username} with loggedInUser: ${loggedInUser.username} -> Match: ${isMyPost}`);
            }
            return isMyPost;
        });

    const myPostsTotalCount = loggedInUser 
        ? posts.filter(post => post.author && post.author.username === loggedInUser.username).length 
        : 0;

    const handleWriteButtonClick = (e) => {
      if (!loggedInUser) {
        e.preventDefault();
        alert('로그인이 필요합니다.');
      }
    };

    const displayPostCountText = () => {
        if (activeTab === 'all') {
            return `전체 글 ${posts.length}개 작성됨`;
        } else if (activeTab === 'my' && loggedInUser) {
            return `나의 글 ${myPostsTotalCount}개 작성됨`;
        }
        return '';
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
                            <FontAwesomeIcon icon={faPen} />
                            <span className="button-text"> 글 작성하기</span>
                        </Link>
                        <p className="post-count">
                            {displayPostCountText()}
                        </p>
                    </div>
                </div>
                {loggedInUser && (
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
                )}

                <ul className="board-grid-card-list">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <li key={post.id} className="board-card-item">
                                <Link to={`/board/${post.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <h3 className="card-title">{post.title}</h3>
                                    <p className="card-info">
                                        <span className="card-username">username: {post.author ? post.author.username : '알 수 없음'}</span>
                                        <span className="card-date">{new Date(post.createdAt).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '')}</span>
                                    </p>
                                    <p className="card-content-preview">{post.content}</p>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <p className="no-post-message">
                            {activeTab === 'my' && loggedInUser ? '작성된 나의 게시글이 없습니다.' : '게시글이 없습니다.'}
                        </p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default MainBoard;