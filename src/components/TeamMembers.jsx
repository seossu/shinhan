import React from "react";

/* ===================================================
 * 팀원 버튼 컴포넌트
 * 4명의 팀원 버튼을 표시하고 클릭시 포트폴리오 모달 열기
 * =================================================== */
const TEAM_MEMBERS = [
  { id: 1, name: "팀원 1", avatar: "🧑‍💼", color: "#FF6B6B" },
  { id: 2, name: "팀원 2", avatar: "👩‍💻", color: "#4ECDC4" },
  { id: 3, name: "팀원 3", avatar: "🧑‍🎨", color: "#45B7D1" },
  { id: 4, name: "팀원 4", avatar: "👨‍🔬", color: "#96CEB4" },
];

export default function TeamMembers({ onSelectMember, onOpenChat, onOpenGuestbook }) {
  return (
    <div className="team-section">
      {/* 섹션 헤더 */}
      <div className="team-section-header">
        <span className="team-section-icon">👥</span>
        <span className="team-section-title">팀 커뮤니티</span>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="team-content">
        {/* 팀원 포트폴리오 카드 */}
        <div className="team-card">
          <div className="card-header">
            <span className="card-icon">💼</span>
            <span className="card-title">팀원 포트폴리오</span>
          </div>
          <div className="member-grid">
            {TEAM_MEMBERS.map((member) => (
              <button
                key={member.id}
                className="member-card"
                onClick={() => onSelectMember(member)}
                style={{ "--member-color": member.color }}
              >
                <div className="member-avatar-circle">
                  <span>{member.avatar}</span>
                </div>
                <span className="member-label">{member.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 소셜 기능 카드 */}
        <div className="social-card">
          <button className="social-btn chat" onClick={onOpenChat}>
            <span className="social-icon">💬</span>
            <div className="social-info">
              <span className="social-title">실시간 채팅</span>
              <span className="social-desc">팀원들과 대화하기</span>
            </div>
          </button>
          <button className="social-btn guestbook" onClick={onOpenGuestbook}>
            <span className="social-icon">📝</span>
            <div className="social-info">
              <span className="social-title">팀 방명록</span>
              <span className="social-desc">응원 메시지 남기기</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export { TEAM_MEMBERS };
