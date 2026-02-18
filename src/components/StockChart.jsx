import React, { useState, useEffect, useRef } from "react";

/* ===================================================
 * 주식 차트 컴포넌트
 * - 실시간 주식 그래프 표시
 * - 상승(빨강) / 하락(파랑) 기본 색상
 * - 커스텀 색상 선택 가능
 * - 숫자와 부호는 조작 방지를 위해 명확히 표시
 * =================================================== */

// 상승/하락 각각의 색상 옵션 (12개씩)
const UP_COLORS = [
  { id: "red", name: "빨강", color: "#FF1744" },
  { id: "orange", name: "주황", color: "#FF9800" },
  { id: "pink", name: "핑크", color: "#FF4081" },
  { id: "green", name: "초록", color: "#4CAF50" },
  { id: "purple", name: "보라", color: "#9C27B0" },
  { id: "gold", name: "골드", color: "#FFD700" },
  { id: "mint", name: "민트", color: "#26A69A" },
  { id: "coral", name: "코랄", color: "#FF6B6B" },
  { id: "lime", name: "라임", color: "#CDDC39" },
  { id: "amber", name: "앰버", color: "#FFC107" },
  { id: "rose", name: "로즈", color: "#E91E63" },
  { id: "emerald", name: "에메랄드", color: "#00C853" },
];

const DOWN_COLORS = [
  { id: "blue", name: "파랑", color: "#2979FF" },
  { id: "navy", name: "네이비", color: "#1E88E5" },
  { id: "cyan", name: "시안", color: "#00E5FF" },
  { id: "purple", name: "보라", color: "#673AB7" },
  { id: "gray", name: "회색", color: "#78909C" },
  { id: "silver", name: "실버", color: "#C0C0C0" },
  { id: "teal", name: "틸", color: "#009688" },
  { id: "skyblue", name: "하늘", color: "#81D4FA" },
  { id: "indigo", name: "인디고", color: "#3F51B5" },
  { id: "slate", name: "슬레이트", color: "#607D8B" },
  { id: "violet", name: "바이올렛", color: "#7C4DFF" },
  { id: "ocean", name: "오션", color: "#0288D1" },
];

// 랜덤 주식 데이터 생성
function generateStockData(basePrice, points = 30) {
  const data = [];
  let price = basePrice;
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.48) * basePrice * 0.03;
    price = Math.max(price + change, basePrice * 0.7);
    data.push(price);
  }
  return data;
}

export default function StockChart({ onClose, profit }) {
  const canvasRef = useRef(null);
  const [stockData, setStockData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [previousClose, setPreviousClose] = useState(0);
  const [selectedUpColor, setSelectedUpColor] = useState("red");
  const [selectedDownColor, setSelectedDownColor] = useState("blue");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // 현재 선택된 색상 가져오기
  const currentColors = {
    up: UP_COLORS.find(c => c.id === selectedUpColor)?.color || UP_COLORS[0].color,
    down: DOWN_COLORS.find(c => c.id === selectedDownColor)?.color || DOWN_COLORS[0].color,
  };

  // 초기 데이터 생성
  useEffect(() => {
    const basePrice = 50000 + Math.random() * 30000;
    const data = generateStockData(basePrice);
    setStockData(data);
    setPreviousClose(data[0]);
    setCurrentPrice(data[data.length - 1]);
  }, []);

  // 실시간 업데이트 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setStockData((prev) => {
        if (prev.length === 0) return prev;
        const lastPrice = prev[prev.length - 1];
        const change = (Math.random() - 0.48) * lastPrice * 0.02;
        const newPrice = Math.max(lastPrice + change, prev[0] * 0.7);
        const newData = [...prev.slice(1), newPrice];
        setCurrentPrice(newPrice);
        return newData;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // 차트 그리기
  useEffect(() => {
    if (!canvasRef.current || stockData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // 상승/하락 판단
    const isUp = currentPrice >= previousClose;
    const chartColor = isUp ? currentColors.up : currentColors.down;

    // 캔버스 초기화
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, width, height);

    // 그리드 그리기
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (height / 5) * i + 30;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // 데이터 범위 계산
    const minPrice = Math.min(...stockData) * 0.995;
    const maxPrice = Math.max(...stockData) * 1.005;
    const priceRange = maxPrice - minPrice;

    // 차트 영역
    const chartLeft = 60;
    const chartRight = width - 30;
    const chartTop = 40;
    const chartBottom = height - 40;
    const chartWidth = chartRight - chartLeft;
    const chartHeight = chartBottom - chartTop;

    // 그래프 그리기
    ctx.beginPath();
    ctx.strokeStyle = chartColor;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    stockData.forEach((price, i) => {
      const x = chartLeft + (i / (stockData.length - 1)) * chartWidth;
      const y = chartBottom - ((price - minPrice) / priceRange) * chartHeight;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // 그라데이션 영역 채우기
    const gradient = ctx.createLinearGradient(0, chartTop, 0, chartBottom);
    gradient.addColorStop(0, chartColor + "40");
    gradient.addColorStop(1, chartColor + "05");

    ctx.lineTo(chartRight, chartBottom);
    ctx.lineTo(chartLeft, chartBottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Y축 가격 레이블
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "11px 'Pretendard', sans-serif";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const price = minPrice + (priceRange / 4) * (4 - i);
      const y = chartTop + (chartHeight / 4) * i;
      ctx.fillText(Math.round(price).toLocaleString(), chartLeft - 8, y + 4);
    }

    // 현재가 표시 라인
    const currentY = chartBottom - ((currentPrice - minPrice) / priceRange) * chartHeight;
    ctx.strokeStyle = chartColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(chartLeft, currentY);
    ctx.lineTo(chartRight, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 현재가 라벨
    ctx.fillStyle = chartColor;
    ctx.fillRect(chartRight + 2, currentY - 10, 55, 20);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px 'Pretendard', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(Math.round(currentPrice).toLocaleString(), chartRight + 6, currentY + 4);

  }, [stockData, currentPrice, previousClose, currentColors]);

  // 등락률 계산
  const priceChange = currentPrice - previousClose;
  const changePercent = previousClose > 0 ? (priceChange / previousClose) * 100 : 0;
  const isUp = priceChange >= 0;

  // 색상 결정
  const displayColor = isUp ? currentColors.up : currentColors.down;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content stock-chart-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="modal-title">📊 실시간 주식 차트</h2>

        {/* 주식 정보 헤더 */}
        <div className="stock-header">
          <div className="stock-name">
            <span className="stock-symbol">GROW</span>
            <span className="stock-label">Grow-Island Corp.</span>
          </div>
          <div className="stock-price-info">
            <div className="current-price" style={{ color: displayColor }}>
              {Math.round(currentPrice).toLocaleString()}
              <span className="currency">원</span>
            </div>
            <div className="price-change" style={{ color: displayColor }}>
              {/* 부호와 숫자 명확히 표시 */}
              <span className="change-sign">{isUp ? "▲" : "▼"}</span>
              <span className="change-amount">
                {isUp ? "+" : "-"}{Math.abs(Math.round(priceChange)).toLocaleString()}
              </span>
              <span className="change-percent">
                ({isUp ? "+" : "-"}{Math.abs(changePercent).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* 차트 캔버스 */}
        <div className="chart-canvas-wrapper">
          <canvas ref={canvasRef} width={420} height={220} />
        </div>

        {/* 거래 정보 */}
        <div className="stock-details">
          <div className="detail-item">
            <span className="detail-label">전일 종가</span>
            <span className="detail-value">{Math.round(previousClose).toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">현재가</span>
            <span className="detail-value" style={{ color: displayColor }}>
              {Math.round(currentPrice).toLocaleString()}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">등락률</span>
            <span className="detail-value" style={{ color: displayColor }}>
              {isUp ? "+" : "-"}{Math.abs(changePercent).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* 색상 커스터마이징 */}
        <div className="color-customize-section">
          <button
            className="color-toggle-btn"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            🎨 색상 테마 선택 {showColorPicker ? "▲" : "▼"}
          </button>

          {showColorPicker && (
            <div className="color-picker-panel">
              {/* 상승 색상 선택 */}
              <div className="color-section">
                <div className="color-section-label">
                  <span className="label-icon">📈</span> 상승 색상
                </div>
                <div className="color-options">
                  {UP_COLORS.map((colorItem) => (
                    <button
                      key={colorItem.id}
                      className={`color-btn ${selectedUpColor === colorItem.id ? "active" : ""}`}
                      onClick={() => setSelectedUpColor(colorItem.id)}
                      style={{ backgroundColor: colorItem.color }}
                      title={colorItem.name}
                    >
                      {selectedUpColor === colorItem.id && <span className="check-mark">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* 하락 색상 선택 */}
              <div className="color-section">
                <div className="color-section-label">
                  <span className="label-icon">📉</span> 하락 색상
                </div>
                <div className="color-options">
                  {DOWN_COLORS.map((colorItem) => (
                    <button
                      key={colorItem.id}
                      className={`color-btn ${selectedDownColor === colorItem.id ? "active" : ""}`}
                      onClick={() => setSelectedDownColor(colorItem.id)}
                      style={{ backgroundColor: colorItem.color }}
                      title={colorItem.name}
                    >
                      {selectedDownColor === colorItem.id && <span className="check-mark">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* 현재 선택된 색상 정보 */}
              <div className="selected-colors-info">
                <div className="color-info-item">
                  <span className="color-dot" style={{ backgroundColor: currentColors.up }} />
                  <span>상승: {UP_COLORS.find(c => c.id === selectedUpColor)?.name}</span>
                </div>
                <div className="color-info-item">
                  <span className="color-dot" style={{ backgroundColor: currentColors.down }} />
                  <span>하락: {DOWN_COLORS.find(c => c.id === selectedDownColor)?.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 조작 방지 안내 */}
        <div className="disclaimer">
          ⚠️ 이 차트는 시뮬레이션입니다. 숫자와 부호는 실시간 데이터를 기반으로 표시됩니다.
        </div>
      </div>
    </div>
  );
}
