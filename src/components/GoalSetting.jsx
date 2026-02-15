import React, { useState, useEffect } from "react";

/* ===================================================
 * 목표 수익률 설정 컴포넌트
 * 목표 달성 시 포인트 지급
 * =================================================== */

export default function GoalSetting({ profit, points, onPointsChange }) {
  const [goalProfit, setGoalProfit] = useState(null);
  const [isSettingGoal, setIsSettingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(10);
  const [goalAchieved, setGoalAchieved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // localStorage에서 목표 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("profit-goal");
    const achieved = localStorage.getItem("goal-achieved");
    if (saved) {
      setGoalProfit(parseFloat(saved));
    }
    if (achieved === "true") {
      setGoalAchieved(true);
    }
  }, []);

  // 목표 달성 체크
  useEffect(() => {
    if (goalProfit !== null && !goalAchieved && profit >= goalProfit) {
      setGoalAchieved(true);
      setShowCelebration(true);
      localStorage.setItem("goal-achieved", "true");
      // 포인트 지급 (목표 수익률에 비례)
      const bonusPoints = Math.floor(goalProfit * 2);
      onPointsChange(points + bonusPoints);

      // 3초 후 축하 메시지 숨기기
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }
  }, [profit, goalProfit, goalAchieved, points, onPointsChange]);

  const handleSetGoal = () => {
    if (tempGoal > 0) {
      setGoalProfit(tempGoal);
      setGoalAchieved(false);
      localStorage.setItem("profit-goal", tempGoal.toString());
      localStorage.removeItem("goal-achieved");
      setIsSettingGoal(false);
    }
  };

  const handleResetGoal = () => {
    setGoalProfit(null);
    setGoalAchieved(false);
    localStorage.removeItem("profit-goal");
    localStorage.removeItem("goal-achieved");
  };

  // 진행률 계산
  const progressPercent = goalProfit
    ? Math.min(Math.max((profit / goalProfit) * 100, 0), 100)
    : 0;

  return (
    <div className="goal-setting">
      {/* 축하 팝업 */}
      {showCelebration && (
        <div className="goal-celebration">
          <div className="celebration-content">
            <span className="celebration-emoji">🎉</span>
            <span className="celebration-text">목표 달성!</span>
            <span className="celebration-bonus">+{Math.floor(goalProfit * 2)}P 획득!</span>
          </div>
        </div>
      )}

      {goalProfit === null ? (
        // 목표 설정 전
        <div className="goal-empty">
          {!isSettingGoal ? (
            <button className="set-goal-btn" onClick={() => setIsSettingGoal(true)}>
              <span className="goal-icon">🎯</span>
              <span>목표 수익률 설정하기</span>
            </button>
          ) : (
            <div className="goal-input-area">
              <div className="goal-input-header">
                <span className="goal-icon">🎯</span>
                <span>목표 수익률</span>
              </div>
              <div className="goal-input-row">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(parseFloat(e.target.value) || 0)}
                  className="goal-input"
                />
                <span className="goal-unit">%</span>
                <button className="goal-confirm-btn" onClick={handleSetGoal}>
                  설정
                </button>
                <button className="goal-cancel-btn" onClick={() => setIsSettingGoal(false)}>
                  취소
                </button>
              </div>
              <p className="goal-hint">달성 시 목표 수익률 x 2 포인트 획득!</p>
            </div>
          )}
        </div>
      ) : (
        // 목표 설정 후
        <div className="goal-display">
          <div className="goal-header">
            <div className="goal-title">
              <span className="goal-icon">{goalAchieved ? "🏆" : "🎯"}</span>
              <span>목표 수익률</span>
            </div>
            <button className="goal-reset-btn" onClick={handleResetGoal}>
              재설정
            </button>
          </div>

          <div className="goal-progress-area">
            <div className="goal-numbers">
              <span className={`current-profit ${profit >= 0 ? "positive" : "negative"}`}>
                {profit >= 0 ? "+" : ""}{profit.toFixed(1)}%
              </span>
              <span className="goal-separator">/</span>
              <span className="target-profit">+{goalProfit}%</span>
            </div>

            <div className="progress-bar-container">
              <div
                className={`progress-bar-fill ${goalAchieved ? "achieved" : ""}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="goal-status">
              {goalAchieved ? (
                <span className="status-achieved">
                  ✅ 목표 달성 완료! (+{Math.floor(goalProfit * 2)}P 획득)
                </span>
              ) : profit < 0 ? (
                <span className="status-negative">
                  📉 목표까지 {(goalProfit - profit).toFixed(1)}% 남음
                </span>
              ) : (
                <span className="status-progress">
                  📈 목표까지 {(goalProfit - profit).toFixed(1)}% 남음
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
