import React, { useState, useEffect } from 'react';

const CommentSystem = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // 로컬 스토리지에서 댓글 불러오기
  useEffect(() => {
    const savedComments = localStorage.getItem('comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
    
    // 관리자 상태 확인
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // 댓글 저장
  const saveComments = (newComments) => {
    localStorage.setItem('comments', JSON.stringify(newComments));
    setComments(newComments);
  };

  // 댓글 추가
  const addComment = () => {
    if (!newComment.trim() || !author.trim()) {
      alert('댓글과 작성자를 입력해주세요.');
      return;
    }

    const comment = {
      id: Date.now(),
      text: newComment,
      author: author,
      date: new Date().toLocaleString('ko-KR'),
      isUserComment: true
    };

    const updatedComments = [...comments, comment];
    saveComments(updatedComments);
    setNewComment('');
  };

  // 사용자 댓글 삭제
  const deleteUserComment = (commentId) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    saveComments(updatedComments);
  };

  // 관리자 로그인
  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') { // 실제 운영시에는 더 안전한 방법 사용
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      setShowAdminLogin(false);
      setAdminPassword('');
      alert('관리자로 로그인되었습니다.');
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  // 관리자 로그아웃
  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    alert('로그아웃되었습니다.');
  };

  // 관리자 댓글 삭제
  const deleteCommentAsAdmin = (commentId) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    saveComments(updatedComments);
  };

  // 모든 댓글 삭제 (관리자 전용)
  const deleteAllComments = () => {
    if (window.confirm('모든 댓글을 삭제하시겠습니까?')) {
      saveComments([]);
      alert('모든 댓글이 삭제되었습니다.');
    }
  };

  return (
    <div className="comment-system">
      <div className="comment-header">
        <h3>댓글 ({comments.length})</h3>
        {isAdmin && (
          <div className="admin-controls">
            <button 
              className="admin-btn delete-all-btn"
              onClick={deleteAllComments}
            >
              모든 댓글 삭제
            </button>
            <button 
              className="admin-btn logout-btn"
              onClick={handleAdminLogout}
            >
              로그아웃
            </button>
          </div>
        )}
        {!isAdmin && (
          <button 
            className="admin-login-btn"
            onClick={() => setShowAdminLogin(true)}
          >
            관리자
          </button>
        )}
      </div>

      {/* 관리자 로그인 모달 */}
      {showAdminLogin && (
        <div className="admin-login-modal">
          <div className="modal-content">
            <h4>관리자 로그인</h4>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <div className="modal-buttons">
              <button onClick={handleAdminLogin}>로그인</button>
              <button onClick={() => setShowAdminLogin(false)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 댓글 작성 폼 */}
      <div className="comment-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="작성자"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="author-input"
          />
        </div>
        <div className="form-row">
          <textarea
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-input"
            rows="3"
          />
        </div>
        <button onClick={addComment} className="submit-btn">
          댓글 작성
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">{comment.date}</span>
              </div>
              <div className="comment-text">{comment.text}</div>
              <div className="comment-actions">
                {comment.isUserComment && (
                  <button 
                    onClick={() => deleteUserComment(comment.id)}
                    className="delete-btn"
                  >
                    삭제
                  </button>
                )}
                {isAdmin && (
                  <button 
                    onClick={() => deleteCommentAsAdmin(comment.id)}
                    className="admin-delete-btn"
                  >
                    관리자 삭제
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSystem;
