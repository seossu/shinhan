import React, { useState, useEffect } from "react";

/* ===================================================
 * 다함께 쏠(SOL)아 올려! 컴포넌트
 * 여름/겨울 방학마다 열리는 팀 간 평균 수익률 경쟁 이벤트
 * =================================================== */

// 상품 정보
const PRIZES = {
  1: { icon: "✈️🗽", title: "미국 주요 기업 탐방 + 뉴욕 여행", desc: "실리콘밸리 & 월스트리트 탐방" },
  2: { icon: "🎒", title: "1인당 20만원 팀 우정여행 지원금", desc: "팀원들과 함께 떠나는 여행" },
  3: { icon: "🎫", title: "1인당 10만원 팀 우정여행 지원금", desc: "소중한 추억 만들기" },
};

// 참가 팀 데이터 (표시되는 상위 팀들)
const VISIBLE_TEAMS = [
  { id: 0, name: "우리 팀", icon: "🏠", color: "#6366F1", isOurs: true },
  { id: 1, name: "투자왕 팀", icon: "👑", color: "#FFD700", isOurs: false },
  { id: 2, name: "슈퍼개미 팀", icon: "🐜", color: "#8B4513", isOurs: false },
  { id: 3, name: "워렌버핏 팀", icon: "🎩", color: "#2C3E50", isOurs: false },
  { id: 4, name: "로켓주식 팀", icon: "🚀", color: "#E74C3C", isOurs: false },
  { id: 5, name: "안정투자 팀", icon: "🛡️", color: "#3498DB", isOurs: false },
  { id: 6, name: "가치투자 팀", icon: "💎", color: "#9B59B6", isOurs: false },
  { id: 7, name: "퀀트매니아 팀", icon: "🤖", color: "#1ABC9C", isOurs: false },
  { id: 8, name: "배당킹 팀", icon: "💰", color: "#F39C12", isOurs: false },
  { id: 9, name: "성장주헌터 팀", icon: "🎯", color: "#E91E63", isOurs: false },
];

// 총 참가 팀 수 (수백 개 팀)
const TOTAL_TEAMS = 347;

// 종목 카테고리별 데이터
const STOCK_CATEGORIES = {
  tech: {
    name: "테크/IT",
    icon: "💻",
    stocks: [
      { name: "삼성전자", code: "005930" },
      { name: "SK하이닉스", code: "000660" },
      { name: "NAVER", code: "035420" },
      { name: "카카오", code: "035720" },
    ],
  },
  auto: {
    name: "자동차/배터리",
    icon: "🚗",
    stocks: [
      { name: "현대차", code: "005380" },
      { name: "기아", code: "000270" },
      { name: "LG에너지솔루션", code: "373220" },
      { name: "삼성SDI", code: "006400" },
    ],
  },
  bio: {
    name: "바이오/헬스",
    icon: "🧬",
    stocks: [
      { name: "삼성바이오로직스", code: "207940" },
      { name: "셀트리온", code: "068270" },
      { name: "유한양행", code: "000100" },
      { name: "SK바이오팜", code: "326030" },
    ],
  },
  finance: {
    name: "금융/보험",
    icon: "🏦",
    stocks: [
      { name: "KB금융", code: "105560" },
      { name: "신한지주", code: "055550" },
      { name: "하나금융지주", code: "086790" },
      { name: "삼성화재", code: "000810" },
    ],
  },
  consumer: {
    name: "소비재/유통",
    icon: "🛒",
    stocks: [
      { name: "LG생활건강", code: "051900" },
      { name: "아모레퍼시픽", code: "090430" },
      { name: "CJ제일제당", code: "097950" },
      { name: "오리온", code: "271560" },
    ],
  },
  energy: {
    name: "에너지/화학",
    icon: "⚡",
    stocks: [
      { name: "LG화학", code: "051910" },
      { name: "SK이노베이션", code: "096770" },
      { name: "한화솔루션", code: "009830" },
      { name: "롯데케미칼", code: "011170" },
    ],
  },
};

export default function TeamBattle({ onClose }) {
  const [stage, setStage] = useState("select"); // select, battle, result
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [battleProgress, setBattleProgress] = useState(0);
  const [teamScores, setTeamScores] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [ourFinalRank, setOurFinalRank] = useState(0);

  // 배틀 진행 시뮬레이션
  useEffect(() => {
    if (stage === "battle") {
      // 초기 점수 설정
      const initialScores = VISIBLE_TEAMS.map((team) => ({
        ...team,
        score: 0,
        change: 0,
      }));
      setTeamScores(initialScores);

      const interval = setInterval(() => {
        setBattleProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // 최종 점수 계산 및 순위 결정
            setTeamScores((scores) => {
              const finalScores = scores.map((team) => ({
                ...team,
                score: team.isOurs
                  ? Math.random() * 40 - 10
                  : Math.random() * 40 - 10,
              }));
              const sorted = [...finalScores].sort((a, b) => b.score - a.score);

              // 우리 팀의 전체 순위 계산 (수백 개 팀 중)
              const ourScore = sorted.find(t => t.isOurs)?.score || 0;
              const ourVisibleRank = sorted.findIndex(t => t.isOurs) + 1;

              // 전체 순위 시뮬레이션 (상위 10팀 중 우리 순위 기반으로 전체 순위 추정)
              let finalRank;
              if (ourVisibleRank <= 3) {
                finalRank = ourVisibleRank; // 상위 3위는 그대로
              } else {
                // 4위 이하는 전체 순위에서 랜덤하게 배치
                finalRank = ourVisibleRank + Math.floor(Math.random() * 20);
              }
              setOurFinalRank(finalRank);

              sorted.forEach((team, idx) => {
                team.rank = idx + 1;
                team.totalRank = team.isOurs ? finalRank : (idx < 3 ? idx + 1 : idx + Math.floor(Math.random() * 30) + 1);
              });
              setRankings(sorted);
              return finalScores;
            });
            setStage("result");
            return 100;
          }
          // 진행 중 점수 업데이트
          setTeamScores((scores) =>
            scores.map((team) => ({
              ...team,
              score: (Math.random() * 40 - 10) * (prev / 100),
              change: Math.random() > 0.5 ? 1 : -1,
            }))
          );
          return prev + 5;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleToggleStock = (stock) => {
    setSelectedStocks((prev) => {
      if (prev.find((s) => s.code === stock.code)) {
        return prev.filter((s) => s.code !== stock.code);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, stock];
    });
  };

  const handleStartBattle = () => {
    if (selectedStocks.length >= 1) {
      setStage("battle");
      setBattleProgress(0);
    }
  };

  const handlePlayAgain = () => {
    setStage("select");
    setSelectedCategory(null);
    setSelectedStocks([]);
    setBattleProgress(0);
    setTeamScores([]);
    setRankings([]);
    setOurFinalRank(0);
  };

  // 종목 선택 화면
  if (stage === "select") {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content team-battle-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>✕</button>

          <h2 className="modal-title" style={{ fontSize: "1.3rem" }}>🚀 다함께 쏠(SOL)아 올려!</h2>
          <p className="battle-subtitle">여름/겨울 방학 특별 이벤트</p>
          <p className="battle-teams-count">🏆 총 {TOTAL_TEAMS}개 팀 참가 중!</p>

          {/* 상품 안내 */}
          <div className="prize-preview">
            <div className="prize-item gold">
              <span className="prize-rank">1등</span>
              <span className="prize-icon">{PRIZES[1].icon}</span>
              <span className="prize-title">미국 기업탐방 + 뉴욕여행</span>
            </div>
            <div className="prize-item silver">
              <span className="prize-rank">2등</span>
              <span className="prize-icon">{PRIZES[2].icon}</span>
              <span className="prize-title">1인당 20만원 지원금</span>
            </div>
            <div className="prize-item bronze">
              <span className="prize-rank">3등</span>
              <span className="prize-icon">{PRIZES[3].icon}</span>
              <span className="prize-title">1인당 10만원 지원금</span>
            </div>
          </div>

          {/* 참가 팀 미리보기 */}
          <div className="battle-teams-preview">
            {VISIBLE_TEAMS.slice(0, 6).map((team) => (
              <div
                key={team.id}
                className={`team-preview-chip ${team.isOurs ? "ours" : ""}`}
                style={{ "--team-color": team.color }}
              >
                <span>{team.icon}</span>
              </div>
            ))}
            <div className="team-preview-more">+{TOTAL_TEAMS - 6}</div>
          </div>

          {/* 종목 카테고리 선택 */}
          <div className="battle-section">
            <h3 className="section-title">📊 종목 카테고리</h3>
            <div className="category-grid">
              {Object.entries(STOCK_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  className={`category-btn ${selectedCategory === key ? "selected" : ""}`}
                  onClick={() => setSelectedCategory(key)}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 선택한 카테고리의 종목들 */}
          {selectedCategory && (
            <div className="battle-section">
              <h3 className="section-title">
                {STOCK_CATEGORIES[selectedCategory].icon} {STOCK_CATEGORIES[selectedCategory].name} 종목 (최대 5개)
              </h3>
              <div className="stock-selection">
                {STOCK_CATEGORIES[selectedCategory].stocks.map((stock) => (
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
            </div>
          )}

          {/* 선택된 종목 표시 */}
          {selectedStocks.length > 0 && (
            <div className="selected-stocks-display">
              <span className="selected-label">선택된 종목:</span>
              {selectedStocks.map((stock) => (
                <span key={stock.code} className="selected-stock-tag">
                  {stock.name}
                  <button
                    className="remove-stock"
                    onClick={() => handleToggleStock(stock)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 배틀 시작 버튼 */}
          <button
            className="battle-start-btn"
            onClick={handleStartBattle}
            disabled={selectedStocks.length < 1}
          >
            {selectedStocks.length < 1 ? "종목을 선택하세요" : `🚀 쏠아 올려! (${selectedStocks.length}개 종목)`}
          </button>
        </div>
      </div>
    );
  }

  // 배틀 진행 화면
  if (stage === "battle") {
    const sortedTeams = [...teamScores].sort((a, b) => b.score - a.score);

    return (
      <div className="modal-overlay">
        <div className="modal-content team-battle-modal battle-in-progress">
          <h2 className="modal-title">🚀 수익률 경쟁 중...</h2>
          <p className="battle-teams-count" style={{ marginTop: "-8px", marginBottom: "12px" }}>
            {TOTAL_TEAMS}개 팀 실시간 경쟁!
          </p>

          {/* 진행률 바 */}
          <div className="battle-progress-bar">
            <div className="progress-fill" style={{ width: `${battleProgress}%` }} />
            <span className="progress-label">{battleProgress}%</span>
          </div>

          {/* 실시간 순위 (상위 10팀만 표시) */}
          <div className="live-rankings">
            <p className="rankings-note">상위 10팀 실시간 현황</p>
            {sortedTeams.map((team, idx) => (
              <div
                key={team.id}
                className={`ranking-row ${team.isOurs ? "ours" : ""}`}
                style={{ "--team-color": team.color }}
              >
                <span className="rank-num">{idx + 1}</span>
                <span className="rank-icon">{team.icon}</span>
                <span className="rank-name">{team.name}</span>
                <span className={`rank-score ${team.score >= 0 ? "positive" : "negative"}`}>
                  {team.score >= 0 ? "+" : ""}{team.score.toFixed(2)}%
                  <span className={`change-arrow ${team.change > 0 ? "up" : "down"}`}>
                    {team.change > 0 ? "▲" : "▼"}
                  </span>
                </span>
              </div>
            ))}
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
  const ourTeam = rankings.find(t => t.isOurs);
  const isPrizeWinner = ourFinalRank <= 3;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content team-battle-modal battle-result" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className={`result-banner ${ourFinalRank <= 3 ? "win" : ourFinalRank <= 10 ? "draw" : "lose"}`}>
          {ourFinalRank === 1 && (
            <>
              <span className="result-icon">🏆</span>
              <h2 className="result-title">1등! 대상 수상!</h2>
            </>
          )}
          {ourFinalRank === 2 && (
            <>
              <span className="result-icon">🥈</span>
              <h2 className="result-title">2등! 최우수상!</h2>
            </>
          )}
          {ourFinalRank === 3 && (
            <>
              <span className="result-icon">🥉</span>
              <h2 className="result-title">3등! 우수상!</h2>
            </>
          )}
          {ourFinalRank >= 4 && (
            <>
              <span className="result-icon">{ourFinalRank <= 10 ? "🎖️" : "😢"}</span>
              <h2 className="result-title">{TOTAL_TEAMS}팀 중 {ourFinalRank}등</h2>
            </>
          )}
        </div>

        {/* 상품 안내 (수상 시) */}
        {isPrizeWinner && (
          <div className="prize-won">
            <div className="prize-won-icon">{PRIZES[ourFinalRank].icon}</div>
            <div className="prize-won-title">{PRIZES[ourFinalRank].title}</div>
            <div className="prize-won-desc">{PRIZES[ourFinalRank].desc}</div>
          </div>
        )}

        {/* 최종 순위표 (상위 10팀) */}
        <div className="final-rankings">
          <h3 className="rankings-title">📊 최종 순위 (상위 10팀 / {TOTAL_TEAMS}팀)</h3>
          {rankings.slice(0, 10).map((team) => (
            <div
              key={team.id}
              className={`final-rank-row ${team.isOurs ? "ours" : ""} ${team.rank <= 3 ? "top3" : ""}`}
              style={{ "--team-color": team.color }}
            >
              <span className="final-rank-num">
                {team.rank === 1 && "🥇"}
                {team.rank === 2 && "🥈"}
                {team.rank === 3 && "🥉"}
                {team.rank >= 4 && team.rank}
              </span>
              <span className="final-rank-icon">{team.icon}</span>
              <span className="final-rank-name">{team.name}</span>
              <span className={`final-rank-score ${team.score >= 0 ? "positive" : "negative"}`}>
                {team.score >= 0 ? "+" : ""}{team.score.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        <div className="result-message">
          {ourFinalRank === 1 && "축하합니다! 미국 기업 탐방 + 뉴욕 여행을 떠나세요!"}
          {ourFinalRank === 2 && "축하합니다! 1인당 20만원 팀 우정여행을 즐기세요!"}
          {ourFinalRank === 3 && "축하합니다! 1인당 10만원 팀 우정여행을 즐기세요!"}
          {ourFinalRank >= 4 && ourFinalRank <= 10 && "아쉽게 수상권을 놓쳤어요. 다음 방학에 다시 도전!"}
          {ourFinalRank > 10 && "다음 방학 이벤트에서는 꼭 상위권에 도전해보세요!"}
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
