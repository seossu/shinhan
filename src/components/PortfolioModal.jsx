import React, { useState, useEffect } from "react";

/* ===================================================
 * 팀원 포트폴리오 모달
 * 각 팀원의 주식 포트폴리오와 댓글 기능
 * =================================================== */

// 샘플 포트폴리오 데이터
const PORTFOLIO_DATA = {
  1: {
    stocks: [
      { name: "삼성전자", quantity: 50, avgPrice: 72000, currentPrice: 75000 },
      { name: "SK하이닉스", quantity: 20, avgPrice: 130000, currentPrice: 145000 },
      { name: "NAVER", quantity: 10, avgPrice: 210000, currentPrice: 195000 },
    ],
    totalInvest: 7820000,
  },
  2: {
    stocks: [
      { name: "카카오", quantity: 30, avgPrice: 55000, currentPrice: 48000 },
      { name: "LG에너지솔루션", quantity: 5, avgPrice: 450000, currentPrice: 480000 },
      { name: "현대차", quantity: 15, avgPrice: 185000, currentPrice: 210000 },
    ],
    totalInvest: 6475000,
  },
  3: {
    stocks: [
      { name: "셀트리온", quantity: 25, avgPrice: 175000, currentPrice: 168000 },
      { name: "POSCO홀딩스", quantity: 12, avgPrice: 380000, currentPrice: 420000 },
      { name: "기아", quantity: 20, avgPrice: 82000, currentPrice: 95000 },
    ],
    totalInvest: 8555000,
  },
  4: {
    stocks: [
      { name: "KB금융", quantity: 40, avgPrice: 52000, currentPrice: 58000 },
      { name: "신한지주", quantity: 35, avgPrice: 38000, currentPrice: 42000 },
      { name: "삼성SDI", quantity: 8, avgPrice: 520000, currentPrice: 490000 },
    ],
    totalInvest: 7570000,
  },
};

export default function PortfolioModal({ member, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [nickname, setNickname] = useState("");

  // localStorage에서 댓글 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(`portfolio-comments-${member.id}`);
    if (saved) {
      setComments(JSON.parse(saved));
    }
  }, [member.id]);

  // 댓글 저장
  const saveComments = (newComments) => {
    localStorage.setItem(`portfolio-comments-${member.id}`, JSON.stringify(newComments));
    setComments(newComments);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !nickname.trim()) return;

    const comment = {
      id: Date.now(),
      nickname: nickname.trim(),
      content: newComment.trim(),
      timestamp: new Date().toLocaleString("ko-KR"),
    };

    saveComments([...comments, comment]);
    setNewComment("");
  };

  const handleDeleteComment = (commentId) => {
    saveComments(comments.filter((c) => c.id !== commentId));
  };

  const portfolio = PORTFOLIO_DATA[member.id];

  // 수익률 계산
  const calculateReturn = (stock) => {
    const totalCost = stock.quantity * stock.avgPrice;
    const currentValue = stock.quantity * stock.currentPrice;
    return ((currentValue - totalCost) / totalCost * 100).toFixed(2);
  };

  // 전체 수익률 계산
  const totalCurrentValue = portfolio.stocks.reduce(
    (sum, stock) => sum + stock.quantity * stock.currentPrice,
    0
  );
  const totalReturn = ((totalCurrentValue - portfolio.totalInvest) / portfolio.totalInvest * 100).toFixed(2);
  const isPositive = parseFloat(totalReturn) >= 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content portfolio-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="portfolio-header">
          <span className="portfolio-avatar" style={{ backgroundColor: member.color }}>
            {member.avatar}
          </span>
          <div className="portfolio-info">
            <h2 className="portfolio-name">{member.name}의 포트폴리오</h2>
            <div className={`portfolio-total-return ${isPositive ? "positive" : "negative"}`}>
              총 수익률: {isPositive ? "+" : ""}{totalReturn}%
            </div>
          </div>
        </div>

        {/* 주식 목록 */}
        <div className="portfolio-stocks">
          <table className="stocks-table">
            <thead>
              <tr>
                <th>종목</th>
                <th>수량</th>
                <th>평단가</th>
                <th>현재가</th>
                <th>수익률</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.stocks.map((stock, idx) => {
                const returnRate = calculateReturn(stock);
                const isStockPositive = parseFloat(returnRate) >= 0;
                return (
                  <tr key={idx}>
                    <td className="stock-name">{stock.name}</td>
                    <td>{stock.quantity}주</td>
                    <td>{stock.avgPrice.toLocaleString()}원</td>
                    <td>{stock.currentPrice.toLocaleString()}원</td>
                    <td className={isStockPositive ? "positive" : "negative"}>
                      {isStockPositive ? "+" : ""}{returnRate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 평가 총액 */}
        <div className="portfolio-summary">
          <div className="summary-item">
            <span className="summary-label">투자 원금</span>
            <span className="summary-value">{portfolio.totalInvest.toLocaleString()}원</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">평가 금액</span>
            <span className={`summary-value ${isPositive ? "positive" : "negative"}`}>
              {totalCurrentValue.toLocaleString()}원
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">평가 손익</span>
            <span className={`summary-value ${isPositive ? "positive" : "negative"}`}>
              {isPositive ? "+" : ""}{(totalCurrentValue - portfolio.totalInvest).toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="comments-section">
          <h3 className="comments-title">💬 평가 댓글</h3>

          {/* 댓글 목록 */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-nickname">{comment.nickname}</span>
                    <span className="comment-time">{comment.timestamp}</span>
                    <button
                      className="comment-delete"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      삭제
                    </button>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          {/* 댓글 입력 */}
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="comment-nickname-input"
              maxLength={10}
            />
            <input
              type="text"
              placeholder="포트폴리오에 대한 평가를 남겨주세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
              maxLength={100}
            />
            <button type="submit" className="comment-submit">등록</button>
          </form>
        </div>
      </div>
    </div>
  );
}
