import React, { useState } from "react";

/* ===================================================
 * 오늘의 투자 운세
 * 생년월일 + 오늘 날짜를 조합하여 동일 입력 시 같은 결과
 * =================================================== */
const FORTUNES = [
  {
    grade: "S",
    title: "대박 상한가의 날",
    color: "#FF6B6B",
    message: "오늘은 매수 버튼에 손이 가는 날! 평소 관심 종목을 다시 살펴보세요.",
    tip: "오전 장 시작 30분이 골든타임!",
    lucky: "테마주",
  },
  {
    grade: "A+",
    title: "순풍에 돛 단 수익",
    color: "#4ECDC4",
    message: "차트가 당신 편입니다. 분할 매수로 안정적인 수익을 노려보세요.",
    tip: "급등주보다 우량주 중심으로!",
    lucky: "반도체",
  },
  {
    grade: "A",
    title: "안정적인 우상향",
    color: "#45B7D1",
    message: "꾸준히 오르는 종목들이 눈에 들어올 거예요. 조급해하지 마세요.",
    tip: "배당주도 좋은 선택!",
    lucky: "금융주",
  },
  {
    grade: "B+",
    title: "기회를 노리는 날",
    color: "#96CEB4",
    message: "큰 수익보다 작은 수익을 여러 번! 분산 투자가 답입니다.",
    tip: "ETF로 리스크 분산 추천",
    lucky: "ETF",
  },
  {
    grade: "B",
    title: "관망이 미덕",
    color: "#FFEAA7",
    message: "오늘은 지켜보는 것도 전략입니다. 공부하는 시간으로!",
    tip: "투자 서적 한 챕터 읽기",
    lucky: "현금",
  },
  {
    grade: "C+",
    title: "조심스러운 하루",
    color: "#DDA0DD",
    message: "변동성이 클 수 있어요. 매수보다 매도 타이밍을 잡아보세요.",
    tip: "손절 라인을 미리 정해두세요",
    lucky: "채권",
  },
  {
    grade: "C",
    title: "쉬어가는 날",
    color: "#B8B8B8",
    message: "오늘은 쉬는 것도 투자! 리프레시하고 내일을 준비하세요.",
    tip: "계좌 들여다보지 않기 챌린지",
    lucky: "휴식",
  },
  {
    grade: "D",
    title: "역행의 기운",
    color: "#778899",
    message: "오늘 매수한 종목은 조금 기다려야 할 수도 있어요.",
    tip: "장기 투자 관점으로 접근!",
    lucky: "인내",
  },
];

/* 생년월일 + 오늘 날짜로 고정 해시 생성 */
function getFortuneIndex(birthdate) {
  const today = new Date().toISOString().split("T")[0];
  const combined = birthdate + today;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) % 100000;
  }
  return hash % FORTUNES.length;
}

export default function FortuneGame({ onClose }) {
  const [birthdate, setBirthdate] = useState("");
  const [fortune, setFortune] = useState(null);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!birthdate) return;
    const idx = getFortuneIndex(birthdate);
    setFortune(FORTUNES[idx]);
    if (!completed) {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setBirthdate("");
    setFortune(null);
  };

  const handleClose = () => {
    onClose(completed);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content fortune-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>✕</button>

        <h2 className="modal-title">🔮 오늘의 투자 운세</h2>

        {!fortune ? (
          <>
            <p className="modal-subtitle">생년월일을 입력하면 오늘의 투자 운세를 알려드려요!</p>
            <form onSubmit={handleSubmit} className="fortune-form">
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="fortune-input"
                max={new Date().toISOString().split("T")[0]}
                required
              />
              <button type="submit" className="fortune-submit">
                운세 확인하기 ✨
              </button>
            </form>
          </>
        ) : (
          <div className="fortune-result">
            <div
              className="fortune-grade"
              style={{ backgroundColor: fortune.color }}
            >
              {fortune.grade}
            </div>
            <h3 className="fortune-title">{fortune.title}</h3>
            <p className="fortune-message">{fortune.message}</p>

            <div className="fortune-details">
              <div className="fortune-item">
                <span className="fortune-label">💡 오늘의 팁</span>
                <span className="fortune-value">{fortune.tip}</span>
              </div>
              <div className="fortune-item">
                <span className="fortune-label">🍀 행운의 종목</span>
                <span className="fortune-value">{fortune.lucky}</span>
              </div>
            </div>

            <button className="fortune-retry" onClick={handleReset}>
              다시 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
