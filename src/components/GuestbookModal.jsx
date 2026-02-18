import React, { useState, useEffect } from "react";

/* ===================================================
 * 팀 방명록 모달
 * 다른 팀들이 방문해서 방명록을 남길 수 있는 기능
 * =================================================== */

export default function GuestbookModal({ onClose }) {
  const [entries, setEntries] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);

  // localStorage에서 방명록 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("team-guestbook");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // 방명록 저장
  const saveEntries = (newEntries) => {
    localStorage.setItem("team-guestbook", JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!teamName.trim() || !message.trim()) return;

    const entry = {
      id: Date.now(),
      teamName: teamName.trim(),
      message: message.trim(),
      rating: rating,
      timestamp: new Date().toLocaleString("ko-KR"),
    };

    saveEntries([entry, ...entries]);
    setTeamName("");
    setMessage("");
    setRating(5);
  };

  const handleDeleteEntry = (entryId) => {
    saveEntries(entries.filter((e) => e.id !== entryId));
  };

  // 별점 렌더링
  const renderStars = (count) => {
    return "⭐".repeat(count) + "☆".repeat(5 - count);
  };

  // 평균 별점 계산
  const avgRating = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.rating, 0) / entries.length).toFixed(1)
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content guestbook-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="modal-title">📝 팀 방명록</h2>
        <p className="modal-subtitle">쏠-루션 팀을 방문해주셔서 감사합니다!</p>

        {/* 통계 */}
        <div className="guestbook-stats">
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <span className="stat-label">방문</span>
            <span className="stat-value">{entries.length}팀</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-label">평균 평점</span>
            <span className="stat-value">{avgRating}/5</span>
          </div>
        </div>

        {/* 방명록 입력 */}
        <form className="guestbook-form" onSubmit={handleSubmit}>
          {/* 팀 이름 입력 (첫 번째 줄) */}
          <div className="form-row">
            <input
              type="text"
              placeholder="팀 이름을 입력해주세요"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="guestbook-team-input full-width"
              maxLength={20}
            />
          </div>
          {/* 평점 선택 (두 번째 줄) */}
          <div className="form-row rating-row">
            <div className="rating-selector">
              <span className="rating-label">평점:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${rating >= star ? "active" : ""}`}
                  onClick={() => setRating(star)}
                >
                  {rating >= star ? "⭐" : "☆"}
                </button>
              ))}
            </div>
          </div>
          <textarea
            placeholder="방명록을 남겨주세요! (응원 메시지, 피드백 등)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="guestbook-message-input"
            maxLength={200}
            rows={3}
          />
          <button type="submit" className="guestbook-submit">방명록 남기기</button>
        </form>

        {/* 방명록 목록 */}
        <div className="guestbook-entries">
          {entries.length === 0 ? (
            <div className="no-entries">
              <p>아직 방명록이 없습니다.</p>
              <p>첫 번째 방명록을 남겨주세요! 🎉</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="guestbook-entry">
                <div className="entry-header">
                  <div className="entry-team">
                    <span className="entry-team-icon">🏆</span>
                    <span className="entry-team-name">{entry.teamName}</span>
                  </div>
                  <div className="entry-rating">{renderStars(entry.rating)}</div>
                </div>
                <p className="entry-message">{entry.message}</p>
                <div className="entry-footer">
                  <span className="entry-time">{entry.timestamp}</span>
                  <button
                    className="entry-delete"
                    onClick={() => handleDeleteEntry(entry.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
