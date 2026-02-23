import React, { useState, useEffect } from "react";

/* ===================================================
 * VS 결과 맞추기: 주식 관련 비교 퀴즈
 * answer: "a" 또는 "b" (정답)
 * =================================================== */
const QUESTIONS = [
  {
    a: "스타벅스 아메리카노 1잔",
    b: "테슬라 0.01주",
    answer: "b",
    explanation: "테슬라 0.01주가 약 4,500원으로 아메리카노(4,500원)와 비슷해요!",
  },
  {
    a: "삼성전자 1년 검색량",
    b: "SK하이닉스 1년 검색량",
    answer: "a",
    explanation: "삼성전자가 약 3배 더 많이 검색돼요!",
  },
  {
    a: "애플 시가총액",
    b: "코스피 전체 시가총액",
    answer: "a",
    explanation: "애플 하나가 한국 주식시장 전체보다 커요!",
  },
  {
    a: "비트코인 2010년 1만원 투자",
    b: "삼성전자 2010년 1만원 투자",
    answer: "a",
    explanation: "비트코인은 수억 배, 삼성전자는 약 5배 수익이에요!",
  },
  {
    a: "엔비디아 2023년 상승률",
    b: "비트코인 2023년 상승률",
    answer: "a",
    explanation: "엔비디아가 약 240%, 비트코인이 약 150% 상승했어요!",
  },
  {
    a: "워렌 버핏 하루 수익",
    b: "한국인 평균 연봉",
    answer: "a",
    explanation: "버핏은 하루에 약 1억 달러 이상 벌어요!",
  },
  {
    a: "카카오 최고가 대비 하락률",
    b: "네이버 최고가 대비 하락률",
    answer: "a",
    explanation: "카카오가 80% 이상, 네이버가 약 60% 하락했어요.",
  },
  {
    a: "현대차 전기차 판매량",
    b: "기아 전기차 판매량",
    answer: "b",
    explanation: "기아가 EV6 등으로 현대차보다 많이 팔고 있어요!",
  },
  {
    a: "코스피 역대 최고점",
    b: "6,000포인트",
    answer: "b",
    explanation: "코스피 역대 최고점은 5861포인트예요!",
  },
  {
    a: "한국 개미 해외주식 보유 1위",
    b: "애플",
    answer: "b",
    explanation: "테슬라가 1위, 애플이 2위예요! (정답: 테슬라)",
  },
  {
    a: "넷플릭스 월 구독료",
    b: "넷플릭스 주식 0.1주",
    answer: "b",
    explanation: "넷플릭스 0.1주가 약 7만원, 구독료는 17,000원!",
  },
  {
    a: "치킨 한 마리 가격",
    b: "KODEX 200 1주",
    answer: "a",
    explanation: "치킨이 약 2만원, KODEX 200이 약 3.5만원이에요!",
  },
];

export default function VsQuiz({ onClose }) {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setQuestionIdx(Math.floor(Math.random() * QUESTIONS.length));
  }, []);

  const question = QUESTIONS[questionIdx];
  const isCorrect = selected === question.answer;

  const handleSelect = (choice) => {
    if (selected) return;
    setSelected(choice);
    setScore((prev) => ({
      correct: prev.correct + (choice === question.answer ? 1 : 0),
      total: prev.total + 1,
    }));
    if (!completed) {
      setCompleted(true);
    }
  };

  const handleNext = () => {
    setSelected(null);
    let newIdx;
    do {
      newIdx = Math.floor(Math.random() * QUESTIONS.length);
    } while (newIdx === questionIdx && QUESTIONS.length > 1);
    setQuestionIdx(newIdx);
  };

  const handleClose = () => {
    onClose(completed);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content vs-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>✕</button>

        <h2 className="modal-title">🆚 VS 결과 맞추기</h2>
        <p className="modal-subtitle">어느 쪽이 더 클까요?</p>

        <div className="score-display">
          정답률: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
          ({score.correct}/{score.total})
        </div>

        <div className="vs-options">
          <button
            className={`vs-btn ${selected === "a" ? (isCorrect ? "correct" : "wrong") : ""} ${selected && question.answer === "a" ? "answer" : ""}`}
            onClick={() => handleSelect("a")}
            disabled={selected !== null}
          >
            {question.a}
          </button>

          <div className="vs-badge">VS</div>

          <button
            className={`vs-btn ${selected === "b" ? (isCorrect ? "correct" : "wrong") : ""} ${selected && question.answer === "b" ? "answer" : ""}`}
            onClick={() => handleSelect("b")}
            disabled={selected !== null}
          >
            {question.b}
          </button>
        </div>

        {selected && (
          <div className="result-box">
            <div className={`result-text ${isCorrect ? "correct" : "wrong"}`}>
              {isCorrect ? "🎉 정답!" : "😢 오답!"}
            </div>
            <p className="explanation">{question.explanation}</p>
            <button className="next-btn" onClick={handleNext}>
              다음 문제 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
