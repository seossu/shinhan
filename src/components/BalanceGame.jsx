import React, { useState, useEffect } from "react";

/* ===================================================
 * 밸런스 게임: 극단적인 투자 상황 2가지 중 선택
 * =================================================== */
const QUESTIONS = [
  { a: "전재산 올인 가치주", b: "매일 1% 단타 테마주" },
  { a: "10년 존버 삼성전자", b: "매주 바뀌는 테마주 서핑" },
  { a: "배당금으로만 생활", b: "시세차익으로만 생활" },
  { a: "AI가 추천한 종목 올인", b: "친구가 추천한 종목 올인" },
  { a: "하락장에 물타기", b: "하락장에 손절" },
  { a: "레버리지 ETF 3배", b: "인버스 ETF 3배" },
  { a: "코스피 우량주만", b: "코스닥 성장주만" },
  { a: "차트만 보고 투자", b: "재무제표만 보고 투자" },
  { a: "뉴스 보고 즉시 매수", b: "뉴스 무시하고 장기 보유" },
  { a: "월급 전액 적립식", b: "보너스 한방 일시 투자" },
  { a: "IPO 공모주만", b: "우선주만" },
  { a: "새벽에 미국주식", b: "낮에 한국주식" },
  { a: "변동성 높은 바이오", b: "안정적인 은행주" },
  { a: "1년에 한 번 리밸런싱", b: "매일 포트폴리오 체크" },
  { a: "신용거래로 레버리지", b: "현금만으로 안전하게" },
];

export default function BalanceGame({ onClose }) {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState({ a: 0, b: 0 });
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setQuestionIdx(Math.floor(Math.random() * QUESTIONS.length));
  }, []);

  const question = QUESTIONS[questionIdx];

  const handleSelect = (choice) => {
    setSelected(choice);
    setResults((prev) => ({
      ...prev,
      [choice]: prev[choice] + 1,
    }));
    if (!completed) {
      setCompleted(true);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setQuestionIdx(Math.floor(Math.random() * QUESTIONS.length));
  };

  const handleClose = () => {
    onClose(completed);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content balance-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>✕</button>

        <h2 className="modal-title">⚖️ 밸런스 게임</h2>
        <p className="modal-subtitle">극단적인 투자 상황, 당신의 선택은?</p>

        <div className="balance-options">
          <button
            className={`balance-btn ${selected === "a" ? "selected" : ""}`}
            onClick={() => handleSelect("a")}
            disabled={selected !== null}
          >
            <span className="balance-text">{question.a}</span>
            {selected && (
              <span className="balance-percent">
                {Math.round((results.a / (results.a + results.b || 1)) * 100)}%
              </span>
            )}
          </button>

          <div className="balance-vs">VS</div>

          <button
            className={`balance-btn ${selected === "b" ? "selected" : ""}`}
            onClick={() => handleSelect("b")}
            disabled={selected !== null}
          >
            <span className="balance-text">{question.b}</span>
            {selected && (
              <span className="balance-percent">
                {Math.round((results.b / (results.a + results.b || 1)) * 100)}%
              </span>
            )}
          </button>
        </div>

        {selected && (
          <button className="next-btn" onClick={handleNext}>
            다음 질문 →
          </button>
        )}
      </div>
    </div>
  );
}
