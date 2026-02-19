import React, { useState, useEffect } from "react";

/* ===================================================
 * 팀 대항전 컴포넌트
 * 다른 팀과의 모의 투자 배틀
 * =================================================== */

// 상대 팀 데이터
const OPPONENT_TEAMS = [
  { id: 1, name: "투자왕 팀", icon: "👑", color: "#FFD700", members: 5, avgReturn: 12.5 },
  { id: 2, name: "슈퍼개미 팀", icon: "🐜", color: "#8B4513", members: 4, avgReturn: 8.3 },
  { id: 3, name: "워렌버핏 팀", icon: "🎩", color: "#2C3E50", members: 6, avgReturn: 15.2 },
  { id: 4, name: "로켓주식 팀", icon: "🚀", color: "#E74C3C", members: 4, avgReturn: -2.1 },
  { id: 5, name: "안정투자 팀", icon: "🛡️", color: "#3498DB", members: 5, avgReturn: 5.8 },
];

// 배틀 종목 데이터
const BATTLE_STOCKS = [
  { name: "삼성전자", code: "005930" },
  { name: "SK하이닉스", code: "000660" },
  { name: "NAVER", code: "035420" },
  { name: "카카오", code: "035720" },
  { name: "현대차", code: "005380" },
  { name: "LG에너지솔루션", code: "373220" },
];

export default function TeamBattle({ onClose }) {
  const [stage, setStage] = useState("select"); // select, battle, result
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [battleProgress, setBattleProgress] = useState(0);
  const [ourScore, setOurScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [battleResult, setBattleResult] = useState(null);

  // 배틀 진행 시뮬레이션
  useEffect(() => {
    if (stage === "battle") {
      const interval = setInterval(() => {
        setBattleProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // 배틀 결과 계산
            const finalOurScore = Math.random() * 20 - 5;
            const finalOpponentScore = selectedTeam.avgReturn + (Math.random() * 10 - 5);
            setOurScore(finalOurScore);
            setOpponentScore(finalOpponentScore);
            setBattleResult(finalOurScore > finalOpponentScore ? "win" : finalOurScore < finalOpponentScore ? "lose" : "draw");
            setStage("result");
            return 100;
          }
          // 진행 중 점수 업데이트
          setOurScore((Math.random() * 20 - 5) * (prev / 100));
          setOpponentScore((selectedTeam.avgReturn + (Math.random() * 6 - 3)) * (prev / 100));
          return prev + 5;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [stage, selectedTeam]);

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
  };

  const handleToggleStock = (stock) => {
    setSelectedStocks((prev) => {
      if (prev.find((s) => s.code === stock.code)) {
        return prev.filter((s) => s.code !== stock.code);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, stock];
    });
  };

  const handleStartBattle = () => {
    if (selectedTeam && selectedStocks.length >= 1) {
      setStage("battle");
      setBattleProgress(0);
    }
  };

  const handlePlayAgain = () => {
    setStage("select");
    setSelectedTeam(null);
    setSelectedStocks([]);
    setBattleProgress(0);
    setOurScore(0);
    setOpponentScore(0);
    setBattleResult(null);
  };

  // 팀 선택 및 종목 선택 화면
  if (stage === "select") {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content team-battle-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>✕</button>

          <h2 className="modal-title">⚔️ 팀 대항전</h2>
          <p className="battle-subtitle">다른 팀과 모의 투자 배틀을 펼쳐보세요!</p>

          {/* 상대 팀 선택 */}
          <div className="battle-section">
            <h3 className="section-title">🎯 상대 팀 선택</h3>
            <div className="opponent-list">
              {OPPONENT_TEAMS.map((team) => (
                <button
                  key={team.id}
                  className={`opponent-card ${selectedTeam?.id === team.id ? "selected" : ""}`}
                  style={{ "--team-color": team.color }}
                  onClick={() => handleSelectTeam(team)}
                >
                  <span className="opponent-icon">{team.icon}</span>
                  <div className="opponent-info">
                    <span className="opponent-name">{team.name}</span>
                    <span className="opponent-stats">
                      {team.members}명 · 평균 {team.avgReturn >= 0 ? "+" : ""}{team.avgReturn}%
                    </span>
                  </div>
                  {selectedTeam?.id === team.id && <span className="check-icon">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* 종목 선택 */}
          <div className="battle-section">
            <h3 className="section-title">📊 배틀 종목 선택 (최대 3개)</h3>
            <div className="stock-selection">
              {BATTLE_STOCKS.map((stock) => (
                <button
                  key={stock.code}
                  className={`stock-chip ${selectedStocks.find((s) => s.code === stock.code) ? "selected" : ""}`}
                  onClick={() => handleToggleStock(stock)}
                >
                  {stock.name}
                  {selectedStocks.find((s) => s.code === stock.code) && <span className="chip-check">✓</span>}
                </button>
              ))}
            </div>
            <p className="selection-info">선택된 종목: {selectedStocks.length}/3</p>
          </div>

          {/* 배틀 시작 버튼 */}
          <button
            className="battle-start-btn"
            onClick={handleStartBattle}
            disabled={!selectedTeam || selectedStocks.length < 1}
          >
            {!selectedTeam ? "상대 팀을 선택하세요" :
             selectedStocks.length < 1 ? "종목을 선택하세요" :
             "⚔️ 배틀 시작!"}
          </button>
        </div>
      </div>
    );
  }

  // 배틀 진행 화면
  if (stage === "battle") {
    return (
      <div className="modal-overlay">
        <div className="modal-content team-battle-modal battle-in-progress">
          <h2 className="modal-title">⚔️ 배틀 진행 중...</h2>

          <div className="battle-arena">
            {/* 우리 팀 */}
            <div className="battle-team our-team">
              <div className="team-icon-large">🏠</div>
              <div className="team-name">우리 팀</div>
              <div className={`team-score ${ourScore >= 0 ? "positive" : "negative"}`}>
                {ourScore >= 0 ? "+" : ""}{ourScore.toFixed(2)}%
              </div>
            </div>

            {/* VS */}
            <div className="battle-vs">
              <div className="vs-text">VS</div>
              <div className="battle-progress-ring">
                <svg viewBox="0 0 100 100">
                  <circle className="progress-bg" cx="50" cy="50" r="45" />
                  <circle
                    className="progress-fill"
                    cx="50" cy="50" r="45"
                    style={{ strokeDashoffset: 283 - (283 * battleProgress) / 100 }}
                  />
                </svg>
                <span className="progress-text">{battleProgress}%</span>
              </div>
            </div>

            {/* 상대 팀 */}
            <div className="battle-team opponent-team" style={{ "--team-color": selectedTeam.color }}>
              <div className="team-icon-large">{selectedTeam.icon}</div>
              <div className="team-name">{selectedTeam.name}</div>
              <div className={`team-score ${opponentScore >= 0 ? "positive" : "negative"}`}>
                {opponentScore >= 0 ? "+" : ""}{opponentScore.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="battle-stocks-display">
            {selectedStocks.map((stock) => (
              <span key={stock.code} className="battle-stock-tag">{stock.name}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content team-battle-modal battle-result" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className={`result-banner ${battleResult}`}>
          {battleResult === "win" && (
            <>
              <span className="result-icon">🏆</span>
              <h2 className="result-title">승리!</h2>
            </>
          )}
          {battleResult === "lose" && (
            <>
              <span className="result-icon">😢</span>
              <h2 className="result-title">패배...</h2>
            </>
          )}
          {battleResult === "draw" && (
            <>
              <span className="result-icon">🤝</span>
              <h2 className="result-title">무승부!</h2>
            </>
          )}
        </div>

        <div className="result-scores">
          <div className="result-team">
            <span className="result-team-icon">🏠</span>
            <span className="result-team-name">우리 팀</span>
            <span className={`result-team-score ${ourScore >= 0 ? "positive" : "negative"}`}>
              {ourScore >= 0 ? "+" : ""}{ourScore.toFixed(2)}%
            </span>
          </div>
          <div className="result-vs">VS</div>
          <div className="result-team">
            <span className="result-team-icon">{selectedTeam.icon}</span>
            <span className="result-team-name">{selectedTeam.name}</span>
            <span className={`result-team-score ${opponentScore >= 0 ? "positive" : "negative"}`}>
              {opponentScore >= 0 ? "+" : ""}{opponentScore.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="result-message">
          {battleResult === "win" && "축하합니다! 우리 팀이 더 높은 수익률을 기록했습니다!"}
          {battleResult === "lose" && "아쉽네요. 다음에는 꼭 이길 수 있을 거예요!"}
          {battleResult === "draw" && "막상막하의 실력이네요! 다시 도전해보세요!"}
        </div>

        <div className="result-actions">
          <button className="result-btn play-again" onClick={handlePlayAgain}>
            🔄 다시 도전
          </button>
          <button className="result-btn close" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
