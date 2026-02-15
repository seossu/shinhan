import React from "react";
import SECTOR_CONFIG from "../config/sectorConfig";

/* ===================================================
 * AdminPanel 컴포넌트
 * MTS 데이터 연동을 시뮬레이션하기 위한 테스트 컨트롤 패널입니다.
 * 수익률 슬라이더와 섹터 선택 버튼으로 구성됩니다.
 * =================================================== */
export default function AdminPanel({ profit, sector, exp, onProfitChange, onSectorChange, onExpChange }) {
  /* 수익률 양수/음수에 따른 색상 */
  const isPositive = profit >= 0;
  const profitColor = isPositive
    ? "var(--positive)"
    : "var(--negative)";

  /* 경험치 구간에 따른 캐릭터 단계 표시 */
  const getExpStage = (e) => {
    if (e >= 80) return "e (노년)";
    if (e >= 60) return "d";
    if (e >= 40) return "c";
    if (e >= 20) return "b";
    return "a (유년)";
  };

  return (
    <div className="admin-panel">
      {/* ===== 패널 헤더 ===== */}
      <div className="admin-header">
        <span className="admin-badge">Admin</span>
        <span className="admin-title">
          투자 데이터 시뮬레이터 (MTS 연동 테스트)
        </span>
      </div>

      <div className="controls-grid">
        {/* ===== 수익률 조정 슬라이더 ===== */}
        <div className="control-group">
          <label>📈 수익률 조정</label>
          <div className="slider-container">
            <input
              type="range"
              min="-50"
              max="50"
              step="0.5"
              value={profit}
              onChange={(e) => onProfitChange(parseFloat(e.target.value))}
            />
            <span
              className="slider-value"
              style={{ color: profitColor }}
            >
              {isPositive ? "+" : ""}
              {profit.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* ===== 경험치 조정 슬라이더 ===== */}
        <div className="control-group">
          <label>⭐ 경험치 (캐릭터 성장)</label>
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={exp}
              onChange={(e) => onExpChange(parseInt(e.target.value))}
            />
            <span className="slider-value" style={{ color: "var(--primary)" }}>
              {exp}% ({getExpStage(exp)})
            </span>
          </div>
        </div>

        {/* ===== 섹터 선택 버튼 그리드 ===== */}
        <div className="control-group" style={{ gridColumn: "1 / -1" }}>
          <label>🏢 투자 섹터 변경</label>
          <div className="sector-buttons">
            {Object.entries(SECTOR_CONFIG).map(([key, config]) => (
              <button
                key={key}
                className={`sector-btn ${sector === key ? "active" : ""}`}
                onClick={() => onSectorChange(key)}
              >
                <span className="sector-icon">{config.icon}</span>
                {config.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
