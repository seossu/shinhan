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
   * Phaser 게임 인스턴스 초기화 (600x420 고정 크기)
   * =================================================== */
  useEffect(() => {
    if (isMountedRef.current || !containerRef.current) return;
    isMountedRef.current = true;
    containerRef.current.innerHTML = "";

    const config = {
      type: Phaser.CANVAS,
      width: 600,
      height: 420,
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
    <div>
      <div className="app-bg" />
      <div className="app-container">
        {/* 헤더: 로고 + 대시보드 */}
        <div className="header-row">
          <img src="/logo.png" alt="Logo" className="app-logo" />
          <Dashboard
            profit={profit}
            sector={sector}
            points={points}
            onAttendanceClick={() => setShowAttendance(true)}
            completedCount={completedGames.length}
          />
        </div>

        <div className="game-area">
          <div id="phaser-container" ref={containerRef} />
        </div>

        {/* 목표 수익률 설정 */}
        <GoalSetting
          profit={profit}
          points={points}
          onPointsChange={setPoints}
        />

        <AdminPanel
          profit={profit}
          sector={sector}
          exp={exp}
          onProfitChange={setProfit}
          onSectorChange={setSector}
          onExpChange={setExp}
        />

        {/* 팀원 버튼 섹션 */}
        <TeamMembers
          onSelectMember={(member) => setSelectedMember(member)}
          onOpenChat={() => setShowChat(true)}
          onOpenGuestbook={() => setShowGuestbook(true)}
        />

        {/* 하단 차트 버튼 */}
        <button className="stock-chart-btn" onClick={() => setShowStockChart(true)}>
          <span className="chart-btn-icon">📈</span>
          <span className="chart-btn-text">실시간 차트 보기</span>
        </button>
      </div>

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
  );
}
