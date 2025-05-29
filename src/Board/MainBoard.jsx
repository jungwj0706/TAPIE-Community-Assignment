import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './MainBoard.css';

function MainBoard() {
    const[posts, setPosts] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);
    const[activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://community-api.tapie.kr/board/posts', { 
                    headers: { 
                    'Content-Type': 'application/json' 
                    }
                });

                if(!response.ok) {
                    throw new Error(`HTTP Error! status: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data);
            } catch(e) {
                setError(e);
                console.error("게시물을 불러오는데 실패했습니다.", e);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [])

    const postFilter = activeTab === 'all'
        ? posts
        : posts.filter(post => post.author && post.author.username === '사용자ID');

    if (loading) {
        return <div className="main_board_container loading">게시글을 불러오는 중...</div>;
    }
    if (error) {
        return <div className="main_board_container error_message">게시글을 불러오지 못했습니다 : {error.message}</div>;
    }

    return (
        <div className="main_board_container">
            <div className="header_section">
                <div className="write_count_button">
                    <Link to="/write" className="write_button">글 작성하기</Link>
                    <p className="post_count">전체 글 {posts.length}개 작성됨</p>
                </div>
            </div>

            <div className="tabs">
                <button
                    className={`tab_button ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}>
                전체
                </button>
                <button
                    className={`tab_button ${activeTab === 'my' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my')}>
                나의 글
                </button>
            </div>

            <ul className="board_grid_card">
                {postFilter.length > 0 ? (
                    postFilter.map(post => (
                        <Link to={`/board/${post.id}`} key = {post.id} className="board_card_name">
                            <h3>{post.title}</h3>
                            <p className="card_info">
                                <span className="card_username">{post.author ? post.author.nickname : '알 수 없음'}</span>
                                <span className="card_date">{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                            </p>
                        </Link>
                    ))
                ) : (
                    <p className="no_post">게시글이 없습니다.</p>
                )}
            </ul>
        </div>
    );
}

export default MainBoard;