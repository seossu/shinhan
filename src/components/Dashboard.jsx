import React from "react";
import SECTOR_CONFIG from "../config/sectorConfig";

/* ===================================================
 * Dashboard 컴포넌트
 * 화면 상단에 팀 이름, 현재 수익률, 투자 섹터, 날씨 상태를
 * 실시간으로 보여주는 대시보드입니다.
 * =================================================== */
export default function Dashboard({ profit, sector, points, onAttendanceClick, completedCount }) {
  /* 현재 섹터의 설정 정보 조회 */
  const currentSectorConfig = SECTOR_CONFIG[sector] || SECTOR_CONFIG.default;

  /* 수익률 양수/음수 판별 */
  const isPositive = profit >= 0;

  /* 날씨 상태 텍스트 및 색상 */
  const weatherText = isPositive ? "☀️ 맑음" : "🌧️ 비/흐림";
  const weatherDotColor = isPositive ? "#00E676" : "#90A4AE";

  return (
    <div className="dashboard">
      {/* ===== 팀 정보 영역 ===== */}
      <div className="team-info">
        <div className="team-avatar">G</div>
        <div>
          <div className="team-name">쏠-루션</div>
          <div className="team-subtitle">Grow-Island · 신한투자증권</div>
        </div>
      </div>

      {/* ===== 통계 수치 영역 ===== */}
      <div className="stats-row">
        {/* 포인트 표시 */}
        <div className="stat-block">
          <div className="stat-label">포인트</div>
          <div className="stat-value points">{points || 0}P</div>
        </div>

        {/* 수익률 표시 */}
        <div className="stat-block">
          <div className="stat-label">수익률</div>
          <div
            className={`stat-value ${isPositive ? "positive" : "negative"}`}
          >
            {isPositive ? "+" : ""}
            {profit.toFixed(1)}%
          </div>
        </div>

        {/* 투자 섹터 표시 */}
        <div className="stat-block">
          <div className="stat-label">주요 섹터</div>
          <div className="stat-sector">
            {currentSectorConfig.icon} {currentSectorConfig.name}
          </div>
        </div>

        {/* 섬 날씨 표시 */}
        <div className="stat-block">
          <div className="stat-label">섬 날씨</div>
          <div className="weather-indicator">
            <div
              className="weather-dot"
              style={{ backgroundColor: weatherDotColor }}
            />
            {weatherText}
          </div>
        </div>

        {/* 출석체크 버튼 */}
        <button className="attendance-btn" onClick={onAttendanceClick}>
          <span className="attendance-icon">📅</span>
          <span className="attendance-text">출석체크</span>
          <span className="attendance-badge">{completedCount || 0}/4</span>
        </button>
      </div>
    </div>
  );
}
