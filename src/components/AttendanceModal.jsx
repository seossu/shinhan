import React, { useState, useEffect } from "react";

/* ===================================================
 * 출석체크 모달
 * 룰렛을 돌려 랜덤하게 하나의 미니게임이 선택됩니다.
 * =================================================== */
const GAMES = [
  { id: "balance", icon: "⚖️", name: "밸런스 게임", points: 10 },
  { id: "vs", icon: "🆚", name: "VS 결과 맞추기", points: 10 },
  { id: "fortune", icon: "🔮", name: "오늘의 투자 운세", points: 10 },
  { id: "chart", icon: "📊", name: "차트 스케치 퀴즈", points: 10 },
];

export default function AttendanceModal({ onClose, onSelectGame, completedGames }) {
  const isCompleted = completedGames.length > 0;
  const [spinning, setSpinning] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(null);
  const [resultIdx, setResultIdx] = useState(null);

  const spin = () => {
    if (spinning || resultIdx !== null) return;

    setSpinning(true);
    const finalIdx = Math.floor(Math.random() * GAMES.length);

    let pos = -1;
    let step = 0;
    const TOTAL_STEPS = 24;

    const next = () => {
      pos = (pos + 1) % GAMES.length;
      setHighlightIdx(pos);
      step++;

      if (step < TOTAL_STEPS) {
        const progress = step / TOTAL_STEPS;
        let delay;
        if (progress < 0.4) delay = 80;
        else if (progress < 0.7) delay = 130;
        else if (progress < 0.85) delay = 210;
        else delay = 340;
        setTimeout(next, delay);
      } else {
        const stepsToFinal = (finalIdx - pos + GAMES.length) % GAMES.length;

        const land = (remaining) => {
          if (remaining === 0) {
            setResultIdx(finalIdx);
            setSpinning(false);
            return;
          }
          pos = (pos + 1) % GAMES.length;
          setHighlightIdx(pos);
          setTimeout(() => land(remaining - 1), 450);
        };

        if (stepsToFinal === 0) {
          setResultIdx(finalIdx);
          setSpinning(false);
        } else {
          setTimeout(() => land(stepsToFinal), 450);
        }
      }
    };

    setTimeout(next, 80);
  };

  const completedGame = GAMES.find((g) => completedGames.includes(g.id));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content attendance-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="modal-title">📅 출석체크</h2>

        {isCompleted ? (
          <div className="attendance-done">
            <div className="attendance-done-icon">🎉</div>
            <p className="attendance-done-title">오늘의 출석체크 완료!</p>
            <p className="attendance-done-sub">
              {completedGame?.icon} {completedGame?.name}
            </p>
            <p className="attendance-done-points">+10P 획득</p>
          </div>
        ) : (
          <>
            <p className="modal-subtitle">룰렛을 돌려 오늘의 미니게임을 뽑으세요!</p>

            <div className="roulette-slots">
              {GAMES.map((game, idx) => (
                <div
                  key={game.id}
                  className={`roulette-slot${highlightIdx === idx ? " roulette-slot--active" : ""}${resultIdx === idx ? " roulette-slot--result" : ""}`}
                >
                  <span className="roulette-slot-icon">{game.icon}</span>
                  <span className="roulette-slot-name">{game.name}</span>
                </div>
              ))}
            </div>

            {resultIdx === null ? (
              <button
                className="roulette-spin-btn"
                onClick={spin}
                disabled={spinning}
              >
                {spinning ? "🎰 돌아가는 중..." : "🎰 룰렛 돌리기"}
              </button>
            ) : (
              <div className="roulette-result">
                <p className="roulette-result-text">
                  오늘의 미션: <strong>{GAMES[resultIdx].name}</strong>
                </p>
                <button
                  className="roulette-start-btn"
                  onClick={() => onSelectGame(GAMES[resultIdx].id)}
                >
                  게임 시작하기 🚀
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
