import React from "react";

/* ===================================================
 * 출석체크 모달
 * 4개의 미니게임 버튼을 표시하고 완료 여부를 체크합니다.
 * =================================================== */
const GAMES = [
  { id: "balance", icon: "⚖️", name: "밸런스 게임", points: 10 },
  { id: "vs", icon: "🆚", name: "VS 결과 맞추기", points: 10 },
  { id: "fortune", icon: "🔮", name: "오늘의 투자 운세", points: 10 },
  { id: "chart", icon: "📊", name: "차트 스케치 퀴즈", points: 10 },
];

export default function AttendanceModal({ onClose, onSelectGame, completedGames }) {
  const totalCompleted = completedGames.length;
  const allCompleted = totalCompleted === GAMES.length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content attendance-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="modal-title">📅 출석체크</h2>
        <p className="modal-subtitle">
          미니게임을 완료하고 포인트를 받으세요!
        </p>
        <div className="attendance-status-badge">
          {totalCompleted} / {GAMES.length} 완료
        </div>

        <div className="attendance-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(totalCompleted / GAMES.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">{totalCompleted} / {GAMES.length} 완료</span>
        </div>

        <div className="attendance-games">
          {GAMES.map((game) => {
            const isCompleted = completedGames.includes(game.id);
            return (
              <button
                key={game.id}
                className={`attendance-game-btn ${isCompleted ? "completed" : ""}`}
                onClick={() => !isCompleted && onSelectGame(game.id)}
                disabled={isCompleted}
              >
                <span className="game-icon">{game.icon}</span>
                <div className="game-info">
                  <span className="game-name">{game.name}</span>
                  <span className="game-points">+{game.points}P</span>
                </div>
                {isCompleted && <span className="check-mark">✓</span>}
              </button>
            );
          })}
        </div>

        {allCompleted && (
          <div className="all-complete-message">
            🎉 오늘의 출석체크를 모두 완료했습니다!
          </div>
        )}
      </div>
    </div>
  );
}
