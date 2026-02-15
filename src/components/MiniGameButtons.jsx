import React from "react";

/* ===================================================
 * 미니게임 버튼 4개
 * =================================================== */
const GAMES = [
  { id: "balance", icon: "⚖️", label: "밸런스 게임" },
  { id: "vs", icon: "🆚", label: "VS 결과 맞추기" },
  { id: "fortune", icon: "🔮", label: "오늘의 투자 운세" },
  { id: "chart", icon: "📈", label: "차트 스케치 퀴즈" },
];

export default function MiniGameButtons({ onSelect }) {
  return (
    <div className="minigame-buttons">
      {GAMES.map((game) => (
        <button
          key={game.id}
          className="minigame-btn"
          onClick={() => onSelect(game.id)}
        >
          <span className="minigame-icon">{game.icon}</span>
          <span className="minigame-label">{game.label}</span>
        </button>
      ))}
    </div>
  );
}
