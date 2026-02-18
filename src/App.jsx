import React, { useState, useEffect, useRef } from "react";
import Phaser from "phaser";
import IslandScene from "./game/IslandScene";
import Dashboard from "./components/Dashboard";
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
import GoalSetting from "./components/GoalSetting";
import "./App.css";

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

  const gameRef = useRef(null);
  const sceneRef = useRef(null);
  const containerRef = useRef(null);
  const isMountedRef = useRef(false);

  /* ===================================================
   * Phaser 게임 인스턴스 초기화 (모바일 19.5:9 비율)
   * 화면 너비 기준으로 동적 계산
   * =================================================== */
  useEffect(() => {
    if (isMountedRef.current || !containerRef.current) return;
    isMountedRef.current = true;
    containerRef.current.innerHTML = "";

    // 모바일 앱 컨테이너 기준 게임 크기 (19.5:10 비율)
    const gameWidth = 405; // 앱 컨테이너(437px) - 패딩(32px)
    const gameHeight = 250; // 게임 영역 높이

    const config = {
      type: Phaser.CANVAS,
      width: gameWidth,
      height: gameHeight,
      parent: containerRef.current,
      backgroundColor: "#87CEEB",
      scene: [IslandScene],
      render: { antialias: true, pixelArt: false },
      audio: { noAudio: true },
    };

    gameRef.current = new Phaser.Game(config);

    /* 씬 연결 폴링 */
    const pollInterval = setInterval(() => {
      try {
        const scene = gameRef.current?.scene?.getScene("IslandScene");
        if (scene && scene.isReady) {
          sceneRef.current = scene;
          console.log("[Grow-Island] 씬 연결 성공!");
          scene.updateState(profit, sector, exp);
          clearInterval(pollInterval);
        }
      } catch (e) { /* 초기화 중 */ }
    }, 100);

    const timeout = setTimeout(() => clearInterval(pollInterval), 10000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
      isMountedRef.current = false;
    };
  }, []);

  /* 데이터 변경 → 씬 반영 */
  useEffect(() => {
    if (sceneRef.current && sceneRef.current.isReady) {
      sceneRef.current.updateState(profit, sector, exp);
    }
  }, [profit, sector, exp]);

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
        <div className="app-bg" />
        <div className="app-container">
        {/* 상단 헤더 (고정) */}
        <header className="mobile-header">
          <img src="/logo.png" alt="Logo" className="mobile-logo" />
          <div className="header-stats">
            <div className="header-stat">
              <span className="stat-icon">💰</span>
              <span className={`stat-value ${profit >= 0 ? 'positive' : 'negative'}`}>
                {profit >= 0 ? '+' : ''}{profit.toFixed(1)}%
              </span>
            </div>
            <div className="header-stat">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">{points}P</span>
            </div>
          </div>
        </header>

        {/* 스크롤 가능한 메인 컨텐츠 */}
        <main className="mobile-content">
          {/* 게임 영역 */}
          <div className="game-area">
            <div id="phaser-container" ref={containerRef} />
          </div>

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
              <span className="quick-badge">{completedGames.length}/4</span>
            </button>
            <button className="quick-btn chart" onClick={() => setShowStockChart(true)}>
              <span className="quick-icon">📈</span>
              <span className="quick-label">실시간 차트</span>
            </button>
          </div>

          {/* Admin 패널 (접을 수 있게) */}
          <AdminPanel
            profit={profit}
            sector={sector}
            exp={exp}
            onProfitChange={setProfit}
            onSectorChange={setSector}
            onExpChange={setExp}
          />

          {/* 팀 커뮤니티 */}
          <TeamMembers
            onSelectMember={(member) => setSelectedMember(member)}
            onOpenChat={() => setShowChat(true)}
            onOpenGuestbook={() => setShowGuestbook(true)}
          />
        </main>

        {/* 하단 네비게이션 바 (고정) */}
        <nav className="mobile-nav">
          <button className="nav-item active">
            <span className="nav-icon">🏝️</span>
            <span className="nav-label">홈</span>
          </button>
          <button className="nav-item" onClick={() => setShowChat(true)}>
            <span className="nav-icon">💬</span>
            <span className="nav-label">채팅</span>
          </button>
          <button className="nav-item" onClick={() => setShowGuestbook(true)}>
            <span className="nav-icon">📝</span>
            <span className="nav-label">방명록</span>
          </button>
          <button className="nav-item" onClick={() => setShowStockChart(true)}>
            <span className="nav-icon">📊</span>
            <span className="nav-label">차트</span>
          </button>
        </nav>

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
      </div>
      </div>
    </div>
  );
}
