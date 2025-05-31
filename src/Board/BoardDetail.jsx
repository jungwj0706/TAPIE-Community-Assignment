// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import './BoardDetail.css';

// const API_BASE_URL = 'https://community-api.tapie.kr';

// function BoardDetail() {
//   const { postId } = useParams();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const user = JSON.parse(localStorage.getItem("loggedInUser"));

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const token = user ? localStorage.getItem("token") : null;
//         const headers = {
//           'Content-Type': 'application/json'
//         };
//         if (token) {
//           headers['Authorization'] = `Bearer ${token}`;
//         }

//         const response = await fetch(`${API_BASE_URL}/board/posts/${postId}`, {
//           headers: headers
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setPost(data);
//         } else {
//           if (response.status === 404) {
//               setError(new Error("게시글을 찾을 수 없습니다."));
//           } else {
//               throw new Error(`HTTP Error! status: ${response.status}`);
//           }
//         }
//       } catch (e) {
//         setError(e);
//         console.error('게시글을 불러오는데 실패했습니다.', e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (postId) {
//       fetchPost();
//     }
//   }, [postId, user]);

//   if (loading) {
//     return <div className="detail_container loading">게시글 로딩 중...</div>;
//   }

//   if (error) {
//     return <div className="detail_container error_message">게시글을 불러오지 못했습니다: {error.message}</div>;
//   }

//   if (!post) {
//     return <div className="detail_container no_post">게시글을 찾을 수 없습니다.</div>;
//   }

//   return (
//     <div className="detail_container">
//       <div className="detail_card">
//         <h2 className="detail_title">{post.title}</h2>
//         <div className="detail_meta">
//           <span className="detail_username">username: {post.author ? post.author.username : '알 수 없음'}</span>
//           <span className="detail_date">{new Date(post.createdAt).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace(/\.$/, '')}</span>
//         </div>
//         <div className="detail_content_wrapper">
//           <p className="detail_content">{post.content}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BoardDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext'; // AuthContext 임포트
import './BoardDetail.css'; // CSS 파일 임포트

const API_BASE_URL = 'https://community-api.tapie.kr';

const BoardDetail = () => {
  const { id: postId } = useParams(); // URL에서 'id' 파라미터를 'postId'로 가져옴
  const navigate = useNavigate(); // 리디렉션을 위한 useNavigate 훅
  // BoardDetail에서는 로그인된 유저 정보 (loggedInUser)와 로그아웃 함수 (logout)가 필요할 수 있습니다.
  // 예를 들어, 게시글 삭제/수정 버튼 표시 여부, 세션 만료 시 로그아웃 처리 등.
  const { loggedInUser, logout } = useAuth(); 
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoading(true);
      setError(null);

      if (!postId) {
        // postId가 없는 경우 (예: URL에 ID가 없을 때)
        setError('게시글 ID가 유효하지 않습니다.');
        setLoading(false);
        navigate('/'); // 메인 페이지로 리디렉션
        return;
      }

      try {
        console.log(`--- 게시글 상세 불러오기 시작: ${postId} ---`);
        const response = await fetch(`${API_BASE_URL}/board/posts/${postId}`, {
          credentials: 'include', // 쿠키 포함 (가장 중요!)
        });

        console.log('게시글 상세 응답 상태:', response.status);
        console.log('게시글 상세 응답 OK 여부:', response.ok);

        const responseClone = response.clone(); // 응답 본문을 여러 번 읽기 위해 복사

        if (response.ok) {
          const postData = await responseClone.json();
          console.log('게시글 상세 데이터 (JSON):', postData);
          setPost(postData);
        } else {
          // 응답 본문에서 에러 메시지를 파싱 시도
          const errorData = await responseClone.json().catch(() => ({ message: '응답 본문 없음' }));
          console.error('게시글 상세 불러오기 실패 - 서버 응답:', response.status, errorData);
          if (response.status === 404) {
            setError('게시글을 찾을 수 없습니다.');
            navigate('/'); // 없는 게시글이면 목록으로 돌아가기
          } else if (response.status === 401) {
             setError('인증 오류: 로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
             logout(); // 세션 만료시 AuthContext의 로그아웃 함수 호출
             navigate('/login'); // 로그인 페이지로 리디렉션
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
    // postId가 변경될 때마다 fetchPostDetail을 다시 실행합니다.
    // navigate와 logout은 useEffect 내부에서 사용되지만, 함수 자체는 리렌더링 시 변경되지 않으므로
    // 의존성 배열에 포함되어도 무한 루프를 유발하지 않으며, ESLint 경고를 피하기 위해 포함하기도 합니다.
  }, [postId, navigate, logout]); 

  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/board/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include', // 쿠키 포함
      });
      if (response.ok) {
        alert('게시글이 삭제되었습니다.');
        navigate('/'); // 삭제 후 메인 보드로 이동
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

  // 게시글 수정 페이지로 이동 핸들러
  const handleEdit = () => {
    navigate(`/edit/${postId}`); // 수정 페이지로 이동
  };

  if (loading) {
    return <div className="board-detail-message">게시글을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="board-detail-message board-detail-error-message">오류: {error}</div>;
  }

  if (!post) {
    // 게시글 로딩이 끝났는데 post가 null인 경우 (예: 404 후 에러 메시지 표시)
    return <div className="board-detail-message">게시글을 찾을 수 없습니다.</div>;
  }

  // 로그인된 사용자와 게시글 작성자가 동일한지 확인하여 수정/삭제 버튼 표시
  // ID 타입이 다를 수 있으므로 String()으로 변환하여 비교
  const isAuthor = loggedInUser && post.author && String(loggedInUser.id) === String(post.author.id);

  return (
    <div className="board-detail-container">
      <div className="board-detail-content-wrapper">
        <h2 className="detail-title">{post.title}</h2>
        <div className="detail-meta">
          <span className="detail-author">작성자: {post.author ? post.author.nickname : '알 수 없음'}</span>
          <span className="card-date">작성일: {new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
          {/* 생성일과 수정일이 다를 경우 수정일도 표시 */}
          {post.createdAt !== post.updatedAt && (
            <span className="card-date">(수정일: {new Date(post.updatedAt).toLocaleDateString('ko-KR')})</span>
          )}
        </div>
        <div className="detail-content">
          <p>{post.content}</p>
        </div>
        
        {/* 현재 로그인된 사용자가 게시글 작성자일 경우에만 수정/삭제 버튼 표시 */}
        {isAuthor && (
          <div className="detail-buttons">
            <button onClick={handleEdit} className="detail-edit-btn">수정</button>
            <button onClick={handleDelete} className="detail-delete-btn">삭제</button>
          </div>
        )}
        
        {/* 목록으로 돌아가는 버튼 */}
        <button onClick={() => navigate('/')} className="detail-back-btn">목록으로</button>
      </div>
    </div>
  );
};

export default BoardDetail;