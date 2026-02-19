import React, { useState, useMemo, useEffect, useRef } from "react";
import AdminPanel from "./components/AdminPanel";
import AttendanceModal from "./components/AttendanceModal";
import BalanceGame from "./components/BalanceGame";
import VsQuiz from "./components/VsQuiz";
import FortuneGame from "./components/FortuneGame";
import ChartQuiz from "./components/ChartQuiz";
import StockChart from "./components/StockChart";
import TeamMembers from "./components/TeamMembers";
import PortfolioModal from "./components/PortfolioModal";
import ChatModal from "./components/ChatModal";
import GuestbookModal from "./components/GuestbookModal";
import GiftModal from "./components/GiftModal";
import TeamBattle from "./components/TeamBattle";
import GoalSetting from "./components/GoalSetting";
import "./App.css";

/* 섹터별 배경 이미지 매핑 */
const SECTOR_BG_MAP = {
  default: "/1.png",
  it: "/2.png",
  bio: "/3.png",
  energy: "/4.png",
  airport: "/5.png",
  finance: "/6.png",
};

/* 캐릭터 타입별 경험치 이미지 매핑 */
const CHARACTER_TYPES = {
  1: { name: "캐릭터 1", stages: ["/a.png", "/b.png", "/c.png", "/d.png", "/e.png"] },
  2: { name: "캐릭터 2", stages: ["/2-a.png", "/2-b.png", "/2-c.png", "/2-d.png", "/2-e.png"] },
  3: { name: "캐릭터 3", stages: ["/3-a.png", "/3-b.png", "/3-c.png", "/3-d.png", "/3-e.png"] },
};

/* 특별 캐릭터 이미지 */
const SPECIAL_CHARACTERS = {
  1: "/1-s.png",
  2: "/2-s.png",
  3: "/3-s.png",
};

/* 경험치 단계 (0~4) */
const EXP_THRESHOLDS = [0, 20, 40, 60, 80];

function getCharSrc(exp, charType = 1, isSpecial = false) {
  if (isSpecial) {
    return SPECIAL_CHARACTERS[charType] || SPECIAL_CHARACTERS[1];
  }
  const stages = CHARACTER_TYPES[charType]?.stages || CHARACTER_TYPES[1].stages;
  for (let i = EXP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (exp >= EXP_THRESHOLDS[i]) return stages[i];
  }
  return stages[0];
}

/* 캐릭터 레벨 계산 (0~4) */
function getCharLevel(exp) {
  for (let i = EXP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (exp >= EXP_THRESHOLDS[i]) return i;
  }
  return 0;
}

/* ===================================================
 * GrowIslandApp 메인 컴포넌트
 * =================================================== */
export default function GrowIslandApp() {
  const [profit, setProfit] = useState(5);
  const [sector, setSector] = useState("default");
  const [exp, setExp] = useState(0); // 경험치 0~100 (a~e 캐릭터 성장)
  const [activeGame, setActiveGame] = useState(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showStockChart, setShowStockChart] = useState(false);
  const [points, setPoints] = useState(0);
  const [completedGames, setCompletedGames] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showPanel, setShowPanel] = useState(false); // UI 패널 토글
  const [giftChances, setGiftChances] = useState(0); // 선물 교환권 개수
  const [receivedGifts, setReceivedGifts] = useState([]); // 받은 선물 목록
  const [showLevelUpAlert, setShowLevelUpAlert] = useState(false); // 레벨업 알림
  const [showTeamBattle, setShowTeamBattle] = useState(false); // 팀 대항전 모달
  const [speechBubble, setSpeechBubble] = useState(""); // 캐릭터 말풍선
  const [showBubble, setShowBubble] = useState(false); // 말풍선 표시 여부
  const [charType, setCharType] = useState(1); // 캐릭터 타입 (1, 2, 3)
  const [isSpecialChar, setIsSpecialChar] = useState(false); // 특별 캐릭터 모드
  const prevLevelRef = useRef(0); // 이전 레벨 추적

  /* 캐릭터 대사 목록 */
  const CHARACTER_SPEECHES = [
    "오늘 날씨 좋죠? 투자하기 딱 좋은 날이에요~",
    "와! 오늘 수익률이 좋은데요?",
    "신한투자증권을 사용하면 수익률이 오른다는 소문이...",
    "장기 투자가 답이에요! 조급해하지 마세요~",
    "분산 투자, 잊지 마세요!",
    "오늘도 화이팅! 좋은 하루 되세요~",
    "주식은 타이밍보다 시간이에요!",
    "혹시 출석체크 하셨나요?",
    "팀원들과 함께하면 투자도 즐거워요!",
    "목표 수익률 달성하면 선물이 있어요!",
    "저와 함께 성장해요! 경험치를 모아보세요~",
    "오늘의 미니게임, 도전해보세요!",
  ];

  /* 배경 이미지 및 캐릭터 */
  const bgSrc = useMemo(() => SECTOR_BG_MAP[sector] || SECTOR_BG_MAP.default, [sector]);
  const charSrc = useMemo(() => getCharSrc(exp, charType, isSpecialChar), [exp, charType, isSpecialChar]);
  const currentLevel = useMemo(() => getCharLevel(exp), [exp]);
  const isNegative = profit < 0;

  /* 캐릭터 레벨업 감지 및 선물 교환권 지급 */
  useEffect(() => {
    if (currentLevel > prevLevelRef.current) {
      // 레벨업 발생
      setGiftChances((prev) => prev + 1);
      setShowLevelUpAlert(true);
      // 3초 후 알림 닫기
      setTimeout(() => setShowLevelUpAlert(false), 3000);
    }
    prevLevelRef.current = currentLevel;
  }, [currentLevel]);

  /* 캐릭터 말풍선 주기적 표시 (15초마다 5초간) */
  const bubbleTimeoutRef = useRef(null);

  const showRandomSpeech = () => {
    // 이전 타임아웃 취소
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }
    const randomIndex = Math.floor(Math.random() * CHARACTER_SPEECHES.length);
    setSpeechBubble(CHARACTER_SPEECHES[randomIndex]);
    setShowBubble(true);
    // 5초 후 말풍선 숨기기
    bubbleTimeoutRef.current = setTimeout(() => setShowBubble(false), 5000);
  };

  useEffect(() => {
    // 처음 2초 후 첫 말풍선 표시
    const initialTimeout = setTimeout(showRandomSpeech, 2000);
    // 15초마다 말풍선 표시
    const interval = setInterval(showRandomSpeech, 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      if (bubbleTimeoutRef.current) {
        clearTimeout(bubbleTimeoutRef.current);
      }
    };
  }, []);

  /* 캐릭터 클릭 시 말풍선 표시 */
  const handleCharacterClick = () => {
    showRandomSpeech();
  };

  /* 선물 교환권 사용 */
  const handleUseGiftChance = (categoryId, gift) => {
    setGiftChances((prev) => Math.max(0, prev - 1));
    setReceivedGifts((prev) => [...prev, gift]);
  };

  /* 게임 완료 시 포인트 지급 */
  const handleGameComplete = (gameId) => {
    if (!completedGames.includes(gameId)) {
      setCompletedGames((prev) => [...prev, gameId]);
      setPoints((prev) => prev + 10);
    }
  };

  /* 게임 닫기 (완료 처리 포함) */
  const closeGame = (completed = false) => {
    if (completed && activeGame) {
      handleGameComplete(activeGame);
    }
    setActiveGame(null);
  };

  /* 출석체크 모달에서 게임 선택 */
  const handleSelectGameFromAttendance = (gameId) => {
    setShowAttendance(false);
    setActiveGame(gameId);
  };

  return (
    <div className="demo-wrapper">
      {/* 외부 시뮬레이션 패널 (데스크탑에서 앱 옆에 표시) */}
      <div className="sim-panel">
        <div className="sim-panel-header">
          <span className="sim-panel-icon">🎮</span>
          <span className="sim-panel-title">시뮬레이션 컨트롤</span>
        </div>

        <div className="sim-panel-content">
          {/* 수익률 조절 */}
          <div className="sim-control">
            <label className="sim-label">
              <span>📈 수익률</span>
              <span className={`sim-value ${profit >= 0 ? 'positive' : 'negative'}`}>
                {profit >= 0 ? '+' : ''}{profit.toFixed(1)}%
              </span>
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              step="0.5"
              value={profit}
              onChange={(e) => setProfit(parseFloat(e.target.value))}
              className="sim-slider"
            />
          </div>

          {/* 경험치 조절 */}
          <div className="sim-control">
            <label className="sim-label">
              <span>⭐ 경험치 (캐릭터 성장)</span>
              <span className="sim-value">{exp}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={exp}
              onChange={(e) => setExp(parseInt(e.target.value))}
              className="sim-slider exp"
            />
            <div className="sim-hint">0~19: 아기 | 20~39: 어린이 | 40~59: 청년 | 60~79: 장년 | 80~100: 노년</div>
          </div>

          {/* 섹터 선택 */}
          <div className="sim-control">
            <label className="sim-label">
              <span>🏢 섹터 (배경 변경)</span>
            </label>
            <div className="sim-sectors">
              {[
                { id: 'default', label: '🏝️ 기본', color: '#4F46E5' },
                { id: 'it', label: '💻 IT', color: '#0EA5E9' },
                { id: 'bio', label: '🧬 바이오', color: '#10B981' },
                { id: 'energy', label: '⚡ 에너지', color: '#F59E0B' },
                { id: 'airport', label: '✈️ 항공', color: '#8B5CF6' },
                { id: 'finance', label: '🏦 금융', color: '#EF4444' },
              ].map((s) => (
                <button
                  key={s.id}
                  className={`sim-sector-btn ${sector === s.id ? 'active' : ''}`}
                  style={{ '--sector-color': s.color }}
                  onClick={() => setSector(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 캐릭터 선택 */}
          <div className="sim-control">
            <label className="sim-label">
              <span>🎭 캐릭터 선택</span>
            </label>
            <div className="sim-characters">
              {[
                { id: 1, label: '🧑 캐릭터 1' },
                { id: 2, label: '👧 캐릭터 2' },
                { id: 3, label: '🧒 캐릭터 3' },
              ].map((c) => (
                <button
                  key={c.id}
                  className={`sim-char-btn ${charType === c.id ? 'active' : ''}`}
                  onClick={() => setCharType(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 특별 캐릭터 토글 */}
          <div className="sim-control">
            <label className="sim-label">
              <span>⭐ 특별 캐릭터</span>
              <span className={`sim-value ${isSpecialChar ? 'positive' : ''}`}>
                {isSpecialChar ? 'ON' : 'OFF'}
              </span>
            </label>
            <button
              className={`sim-special-btn ${isSpecialChar ? 'active' : ''}`}
              onClick={() => setIsSpecialChar(!isSpecialChar)}
            >
              {isSpecialChar ? '✨ 특별 캐릭터 활성화됨' : '특별 캐릭터 활성화'}
            </button>
          </div>

          {/* 현재 상태 요약 */}
          <div className="sim-summary">
            <div className="sim-summary-item">
              <span className="summary-label">포인트</span>
              <span className="summary-value">{points}P</span>
            </div>
            <div className="sim-summary-item">
              <span className="summary-label">완료 게임</span>
              <span className="summary-value">{completedGames.length}/4</span>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 앱 컨테이너 */}
      <div className="mobile-app">
        <div className="app-container">
          {/* 전체 배경 이미지 (섹터별) */}
          <div className={`app-background ${isNegative ? 'negative' : ''}`}>
            <img src={bgSrc} alt="Island Background" className="bg-image" />
            {/* 캐릭터 오버레이 */}
            <div className="char-container" onClick={handleCharacterClick}>
              <img src={charSrc} alt="Character" className="char-image" />
              {/* 캐릭터 말풍선 */}
              {showBubble && (
                <div className="speech-bubble">
                  <span className="speech-text">{speechBubble}</span>
                </div>
              )}
            </div>
            {/* 날씨 효과 오버레이 */}
            {isNegative && <div className="weather-rain" />}
            {profit > 20 && <div className="weather-sunny" />}
          </div>

          {/* 상단 헤더 (반투명, 배경 위에 떠있음) */}
          <header className="mobile-header floating">
            <img src="/logo.png" alt="Logo" className="mobile-logo" />
            <div className="header-stats">
              <div className="header-stat">
                <span className="stat-icon">💰</span>
                <span className={`stat-value ${profit >= 0 ? 'positive' : 'negative'}`}>
                  {profit >= 0 ? '+' : ''}{profit.toFixed(1)}%
                </span>
              </div>
              <div className="header-stat">
                <span className="stat-icon">🎯</span>
                <span className="stat-value exp">{exp}%</span>
              </div>
              <div className="header-stat">
                <span className="stat-icon">⭐</span>
                <span className="stat-value">{points}P</span>
              </div>
            </div>
          </header>

          {/* 토글 패널 (접히는 UI) */}
          <div className={`toggle-panel ${showPanel ? 'open' : ''}`}>
            {/* 패널 핸들 (드래그 바) */}
            <button
              className="panel-handle"
              onClick={() => setShowPanel(!showPanel)}
            >
              <span className="handle-bar" />
              <span className="handle-text">{showPanel ? '닫기' : '메뉴 열기'}</span>
            </button>

            {/* 패널 내용 */}
            <div className="panel-content">
              {/* 목표 수익률 */}
              <GoalSetting
                profit={profit}
                points={points}
                onPointsChange={setPoints}
              />

              {/* 퀵 액션 버튼들 */}
              <div className="quick-actions">
                <button className="quick-btn attendance" onClick={() => setShowAttendance(true)}>
                  <span className="quick-icon">📅</span>
                  <span className="quick-label">출석체크</span>
                </button>
                <button className="quick-btn chart" onClick={() => setShowStockChart(true)}>
                  <span className="quick-icon">📈</span>
                  <span className="quick-label">실시간 차트</span>
                </button>
              </div>

              {/* 팀 커뮤니티 */}
              <TeamMembers
                onSelectMember={(member) => setSelectedMember(member)}
                onOpenChat={() => setShowChat(true)}
                onOpenGuestbook={() => setShowGuestbook(true)}
                onOpenTreasureHunt={() => window.open("/treasure-hunt.html", "_blank")}
                onOpenTeamBattle={() => setShowTeamBattle(true)}
              />
            </div>
          </div>

          {/* 하단 네비게이션 바 (고정) */}
          <nav className="mobile-nav">
            <button className="nav-item nav-gift" onClick={() => setShowGift(true)}>
              <span className="nav-icon">🎁</span>
              <span className="nav-label">선물</span>
              {giftChances > 0 && <span className="nav-badge">{giftChances}</span>}
            </button>
            <button
              className={`nav-item nav-toggle ${showPanel ? 'active' : ''}`}
              onClick={() => setShowPanel(!showPanel)}
            >
              <span className="nav-icon">{showPanel ? '✕' : '☰'}</span>
              <span className="nav-label">{showPanel ? '닫기' : '메뉴'}</span>
            </button>
            <button className="nav-item" onClick={() => setShowGuestbook(true)}>
              <span className="nav-icon">📝</span>
              <span className="nav-label">방명록</span>
            </button>
          </nav>

          {/* 레벨업 알림 */}
          {showLevelUpAlert && (
            <div className="level-up-alert">
              <div className="level-up-content">
                <span className="level-up-icon">🎉</span>
                <span className="level-up-text">캐릭터가 성장했습니다!</span>
                <span className="level-up-reward">🎟️ 선물 교환권 +1</span>
              </div>
            </div>
          )}

        {/* 모달들 - 앱 컨테이너 내부에 배치 */}
        {/* 출석체크 모달 */}
        {showAttendance && (
          <AttendanceModal
            onClose={() => setShowAttendance(false)}
            onSelectGame={handleSelectGameFromAttendance}
            completedGames={completedGames}
          />
        )}

        {/* 미니게임 모달들 */}
        {activeGame === "balance" && <BalanceGame onClose={closeGame} />}
        {activeGame === "vs" && <VsQuiz onClose={closeGame} />}
        {activeGame === "fortune" && <FortuneGame onClose={closeGame} />}
        {activeGame === "chart" && <ChartQuiz onClose={closeGame} />}

        {/* 주식 차트 모달 */}
        {showStockChart && (
          <StockChart
            onClose={() => setShowStockChart(false)}
            profit={profit}
          />
        )}

        {/* 팀원 포트폴리오 모달 */}
        {selectedMember && (
          <PortfolioModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}

        {/* 실시간 채팅 모달 */}
        {showChat && (
          <ChatModal
            onClose={() => setShowChat(false)}
            profit={profit}
          />
        )}

        {/* 팀 방명록 모달 */}
        {showGuestbook && (
          <GuestbookModal
            onClose={() => setShowGuestbook(false)}
          />
        )}

        {/* 선물 혜택 모달 */}
        {showGift && (
          <GiftModal
            onClose={() => setShowGift(false)}
            giftChances={giftChances}
            onUseChance={handleUseGiftChance}
            receivedGifts={receivedGifts}
          />
        )}

        {/* 팀 대항전 모달 */}
        {showTeamBattle && (
          <TeamBattle onClose={() => setShowTeamBattle(false)} />
        )}
      </div>
      </div>
    </div>
  );
}
