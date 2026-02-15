import React, { useState, useEffect } from "react";

/* ===================================================
 * 차트 스케치 퀴즈
 * 차트 이미지의 끝부분을 가리고 방향 맞추기
 * 이미지는 public/charts/ 폴더에 넣어주세요
 * 첫 번째(chart1)는 올라가는 게 정답
 * =================================================== */
const CHARTS = [
  {
    id: 1,
    image: "/charts/chart1.png",
    name: "종목 A",
    answer: "up",
    hint: "실적 발표 직전 차트",
  },
  {
    id: 2,
    image: "/charts/chart2.png",
    name: "종목 B",
    answer: "down",
    hint: "급등 후 조정 구간",
  },
  {
    id: 3,
    image: "/charts/chart3.png",
    name: "종목 C",
    answer: "up",
    hint: "바닥 다지기 패턴",
  },
  {
    id: 4,
    image: "/charts/chart4.png",
    name: "종목 D",
    answer: "down",
    hint: "저항선 근처",
  },
  {
    id: 5,
    image: "/charts/chart5.png",
    name: "종목 E",
    answer: "up",
    hint: "골든크로스 직전",
  },
];

export default function ChartQuiz({ onClose }) {
  const [chartIdx, setChartIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // 첫 번째 차트(올라가는 정답)부터 시작
    setChartIdx(0);
  }, []);

  const chart = CHARTS[chartIdx];
  const isCorrect = selected === chart.answer;

  const handleSelect = (choice) => {
    if (selected) return;
    setSelected(choice);
    setShowResult(true);
    setScore((prev) => ({
      correct: prev.correct + (choice === chart.answer ? 1 : 0),
      total: prev.total + 1,
    }));
    if (!completed) {
      setCompleted(true);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    // 순차적으로 다음 차트
    setChartIdx((prev) => (prev + 1) % CHARTS.length);
  };

  const handleClose = () => {
    onClose(completed);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content chart-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>✕</button>

        <h2 className="modal-title">📈 차트 스케치 퀴즈</h2>
        <p className="modal-subtitle">이 차트, 다음날 어디로 갈까요?</p>

        <div className="score-display">
          정답률: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
          ({score.correct}/{score.total})
        </div>

        <div className="chart-container">
          <div className="chart-image-wrapper">
            <img
              src={chart.image}
              alt={chart.name}
              className="chart-image"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `
                  <div class="chart-placeholder">
                    <span>📊</span>
                    <p>${chart.name} 차트</p>
                    <small>이미지: ${chart.image}</small>
                  </div>
                `;
              }}
            />
            {!showResult && <div className="chart-hidden-area" />}
          </div>
          <p className="chart-hint">💡 힌트: {chart.hint}</p>
        </div>

        {!showResult ? (
          <div className="chart-buttons">
            <button
              className="chart-btn up"
              onClick={() => handleSelect("up")}
            >
              <span className="arrow">📈</span>
              <span>상승</span>
            </button>
            <button
              className="chart-btn down"
              onClick={() => handleSelect("down")}
            >
              <span className="arrow">📉</span>
              <span>하락</span>
            </button>
          </div>
        ) : (
          <div className="chart-result">
            <div className={`result-text ${isCorrect ? "correct" : "wrong"}`}>
              {isCorrect ? "🎉 정답!" : "😢 아쉬워요!"}
            </div>
            <p className="result-answer">
              정답: {chart.answer === "up" ? "📈 상승" : "📉 하락"}
            </p>
            <button className="next-btn" onClick={handleNext}>
              다음 차트 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
