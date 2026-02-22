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
import PointShop from "./components/PointShop";
import Inventory from "./components/Inventory";
import "./App.css";

/* 섹터별 배경 이미지 매핑 */
const SECTOR_BG_MAP = {
  default: "/back1.png",
  it: "/back2.png",
  bio: "/back3.png",
  energy: "/back4.png",
  airport: "/back5.png",
  finance: "/back6.png",
};

/* 캐릭터 타입별 경험치 이미지 매핑 (0~7) */
const CHARACTER_TYPES = {
  0: { name: "쏠", stages: ["/0-a.png", "/0-b.png", "/0-c.png", "/0-d.png", "/0-e.png"] },
  1: { name: "레이", stages: ["/1-a.png", "/1-b.png", "/1-c.png", "/1-d.png", "/1-e.png"] },
  2: { name: "플리", stages: ["/2-a.png", "/2-b.png", "/2-c.png", "/2-d.png", "/2-e.png"] },
  3: { name: "루루라라", stages: ["/3-a.png", "/3-b.png", "/3-c.png", "/3-d.png", "/3-e.png"] },
  4: { name: "슈", stages: ["/4-a.png", "/4-b.png", "/4-c.png", "/4-d.png", "/4-e.png"] },
  5: { name: "몰리", stages: ["/5-a.png", "/5-b.png", "/5-c.png", "/5-d.png", "/5-e.png"] },
  6: { name: "도레미", stages: ["/6-a.png", "/6-b.png", "/6-c.png", "/6-d.png", "/6-e.png"] },
  7: { name: "리노", stages: ["/7-a.png", "/7-b.png", "/7-c.png", "/7-d.png", "/7-e.png"] },
};

/* 특별 캐릭터 이미지 */
const SPECIAL_CHARACTERS = {
  0: "/0-s.png",
  1: "/1-s.png",
  2: "/2-s.png",
  3: "/3-s.png",
  4: "/4-s.png",
  5: "/5-s.png",
  6: "/6-s.png",
  7: "/7-s.png",
};

/* 경험치 단계 (0~4) */
const EXP_THRESHOLDS = [0, 20, 40, 60, 80];

function getCharSrc(exp, charType = 0, isSpecial = false) {
  const safeCharType = charType ?? 0;
  if (isSpecial) {
    return SPECIAL_CHARACTERS[safeCharType] || SPECIAL_CHARACTERS[0];
  }
  const stages = CHARACTER_TYPES[safeCharType]?.stages || CHARACTER_TYPES[0].stages;
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
  const [charType, setCharType] = useState(null); // 캐릭터 타입 (0~7), null이면 선택 안됨
  const [isSpecialChar, setIsSpecialChar] = useState(false); // 특별 캐릭터 모드
  const [showMobileSimModal, setShowMobileSimModal] = useState(false); // 모바일 시뮬레이션 모달
  const [showCharSelect, setShowCharSelect] = useState(true); // 캐릭터 선택창 표시 여부
  const [showShop, setShowShop] = useState(false); // 포인트 상점 모달
  const [showInventory, setShowInventory] = useState(false); // 인벤토리 모달
  const [inventory, setInventory] = useState([]); // 보유 아이템 목록
  const [equipped, setEquipped] = useState({ head: null, island: null }); // 장착된 아이템
  const prevLevelRef = useRef(0); // 이전 레벨 추적

  /* 캐릭터 선택 처리 */
  const handleSelectCharacter = (id) => {
    setCharType(id);
    setShowCharSelect(false);
  };

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

  /* 아이템 구매 처리 */
  const handlePurchase = (itemId, item) => {
    setPoints((prev) => prev - item.price);
    if (item.type === "decoration") {
      setInventory((prev) => [...prev, itemId]);
    }
    // consumable 아이템은 바로 사용하거나 별도 관리 가능
  };

  /* 아이템 장착/해제 토글 */
  const handleEquipToggle = (itemId, slot) => {
    setEquipped((prev) => ({
      ...prev,
      [slot]: prev[slot] === itemId ? null : itemId,
    }));
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
              {[0, 1, 2, 3, 4, 5, 6, 7].map((id) => (
                <button
                  key={id}
                  className={`sim-char-btn ${charType === id ? 'active' : ''}`}
                  onClick={() => setCharType(id)}
                >
                  {CHARACTER_TYPES[id].name}
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

          {/* 포인트 조절 */}
          <div className="sim-control">
            <label className="sim-label">
              <span>💰 포인트</span>
              <span className="sim-value points">{points.toLocaleString()}P</span>
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value))}
              className="sim-slider points"
            />
            <div className="sim-hint">상점에서 아이템을 구매해보세요</div>
          </div>

          {/* 현재 상태 요약 */}
          <div className="sim-summary">
            <div className="sim-summary-item">
              <span className="summary-label">포인트</span>
              <span className="summary-value">{points.toLocaleString()}P</span>
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
            {/* 섬 장식 아이템 */}
            {equipped.island && (
              <div className="island-decoration">
                {equipped.island === 'tree' && <span className="deco-item deco-tree">🌳</span>}
                {equipped.island === 'house' && <span className="deco-item deco-house">🏠</span>}
                {equipped.island === 'fountain' && <span className="deco-item deco-fountain">⛲</span>}
              </div>
            )}
            {/* 캐릭터 오버레이 */}
            <div className="char-container" onClick={handleCharacterClick}>
              <img src={charSrc} alt="Character" className={`char-image ${charSrc === '/5-d.png' ? 'char-small' : ''}`} />
              {/* 머리 장식 */}
              {equipped.head && (
                <div className={`char-accessory char-head ${charSrc === '/5-d.png' ? 'char-head-small' : ''}`}>
                  {equipped.head === 'hat_crown' && <span>👑</span>}
                  {equipped.head === 'hat_ribbon' && <span>🎀</span>}
                </div>
              )}
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
                <button className="quick-btn shop" onClick={() => setShowShop(true)}>
                  <span className="quick-icon">🛍️</span>
                  <span className="quick-label">상점</span>
                </button>
                <button className="quick-btn inventory" onClick={() => setShowInventory(true)}>
                  <span className="quick-icon">🎒</span>
                  <span className="quick-label">인벤토리</span>
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

        {/* 포인트 상점 모달 */}
        {showShop && (
          <PointShop
            points={points}
            inventory={inventory}
            onPurchase={handlePurchase}
            onClose={() => setShowShop(false)}
          />
        )}

        {/* 인벤토리 모달 */}
        {showInventory && (
          <Inventory
            inventory={inventory}
            equipped={equipped}
            onEquipToggle={handleEquipToggle}
            onClose={() => setShowInventory(false)}
          />
        )}

        {/* 모바일 시뮬레이션 플로팅 버튼 */}
        <button
          className="mobile-sim-fab"
          onClick={() => setShowMobileSimModal(true)}
        >
          🎮
        </button>

        {/* 모바일 시뮬레이션 모달 */}
        {showMobileSimModal && (
          <div className="modal-overlay" onClick={() => setShowMobileSimModal(false)}>
            <div className="modal-content mobile-sim-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowMobileSimModal(false)}>✕</button>

              <h2 className="modal-title">🎮 시뮬레이션 컨트롤</h2>
              <p className="modal-subtitle">투자 데이터를 조정해보세요</p>

              {/* 수익률 조절 */}
              <div className="mobile-sim-control">
                <label className="mobile-sim-label">
                  <span>📈 수익률</span>
                  <span className={`mobile-sim-value ${profit >= 0 ? 'positive' : 'negative'}`}>
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
                  className="mobile-sim-slider"
                />
              </div>

              {/* 경험치 조절 */}
              <div className="mobile-sim-control">
                <label className="mobile-sim-label">
                  <span>⭐ 경험치</span>
                  <span className="mobile-sim-value">{exp}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={exp}
                  onChange={(e) => setExp(parseInt(e.target.value))}
                  className="mobile-sim-slider exp"
                />
              </div>

              {/* 섹터 선택 */}
              <div className="mobile-sim-control">
                <label className="mobile-sim-label">
                  <span>🏢 섹터 (배경)</span>
                </label>
                <div className="mobile-sim-sectors">
                  {[
                    { id: 'default', label: '🏝️', name: '기본' },
                    { id: 'it', label: '💻', name: 'IT' },
                    { id: 'bio', label: '🧬', name: '바이오' },
                    { id: 'energy', label: '⚡', name: '에너지' },
                    { id: 'airport', label: '✈️', name: '항공' },
                    { id: 'finance', label: '🏦', name: '금융' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      className={`mobile-sim-sector-btn ${sector === s.id ? 'active' : ''}`}
                      onClick={() => setSector(s.id)}
                    >
                      <span>{s.label}</span>
                      <span className="sector-name">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 캐릭터 선택 */}
              <div className="mobile-sim-control">
                <label className="mobile-sim-label">
                  <span>🎭 캐릭터</span>
                </label>
                <div className="mobile-sim-chars">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((id) => (
                    <button
                      key={id}
                      className={`mobile-sim-char-btn ${charType === id ? 'active' : ''}`}
                      onClick={() => setCharType(id)}
                    >
                      <span className="char-name">{CHARACTER_TYPES[id].name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 특별 캐릭터 토글 */}
              <div className="mobile-sim-control">
                <button
                  className={`mobile-sim-special-btn ${isSpecialChar ? 'active' : ''}`}
                  onClick={() => setIsSpecialChar(!isSpecialChar)}
                >
                  ⭐ 특별 캐릭터 {isSpecialChar ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* 포인트 조절 */}
              <div className="mobile-sim-control">
                <label className="mobile-sim-label">
                  <span>💰 포인트</span>
                  <span className="mobile-sim-value points">{points.toLocaleString()}P</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value))}
                  className="mobile-sim-slider points"
                />
              </div>
            </div>
          </div>
        )}

        {/* 캐릭터 선택 모달 (앱 시작 시) */}
        {showCharSelect && (
          <div className="char-select-overlay">
            <div className="char-select-modal">
              <h2 className="char-select-title">캐릭터를 선택하세요</h2>
              <p className="char-select-subtitle">함께 성장할 캐릭터를 골라주세요!</p>
              <div className="char-select-grid">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((id) => (
                  <button
                    key={id}
                    className="char-select-btn"
                    onClick={() => handleSelectCharacter(id)}
                  >
                    <img src={`/${id}.png`} alt={CHARACTER_TYPES[id].name} className="char-select-img" />
                    <span className="char-select-name">{CHARACTER_TYPES[id].name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
