import React, { useState, useEffect, useRef } from "react";

/* ===================================================
 * 실시간 채팅 모달
 * 팀원들과 실시간으로 채팅하고 수익률 자랑하기 기능
 * =================================================== */

export default function ChatModal({ onClose, profit }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [isNicknameSet, setIsNicknameSet] = useState(false);
  const messagesEndRef = useRef(null);

  // localStorage에서 메시지 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("team-chat-messages");
    if (saved) {
      setMessages(JSON.parse(saved));
    }

    const savedNickname = localStorage.getItem("chat-nickname");
    if (savedNickname) {
      setNickname(savedNickname);
      setIsNicknameSet(true);
    }
  }, []);

  // 메시지 추가 시 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 저장
  const saveMessages = (newMessages) => {
    // 최근 100개만 유지
    const limitedMessages = newMessages.slice(-100);
    localStorage.setItem("team-chat-messages", JSON.stringify(limitedMessages));
    setMessages(limitedMessages);
  };

  const handleSetNickname = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    localStorage.setItem("chat-nickname", nickname.trim());
    setIsNicknameSet(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      nickname: nickname,
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      type: "normal",
    };

    saveMessages([...messages, message]);
    setNewMessage("");
  };

  // 수익률 자랑하기
  const handleShareProfit = () => {
    const isPositive = profit >= 0;
    const emoji = isPositive ? "🚀" : "😢";
    const message = {
      id: Date.now(),
      nickname: nickname,
      content: `${emoji} 내 수익률 자랑! ${isPositive ? "+" : ""}${profit.toFixed(1)}% ${isPositive ? "수익 중!" : "손실 중..."}`,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      type: "profit",
      profit: profit,
    };

    saveMessages([...messages, message]);
  };

  // 채팅 기록 삭제
  const handleClearChat = () => {
    if (window.confirm("채팅 기록을 모두 삭제하시겠습니까?")) {
      localStorage.removeItem("team-chat-messages");
      setMessages([]);
    }
  };

  if (!isNicknameSet) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content chat-modal nickname-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>✕</button>
          <h2 className="modal-title">💬 실시간 채팅</h2>
          <p className="modal-subtitle">채팅에 참여하려면 닉네임을 입력해주세요</p>

          <form onSubmit={handleSetNickname} className="nickname-form">
            <input
              type="text"
              placeholder="닉네임 입력 (최대 10자)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="nickname-input"
              maxLength={10}
              autoFocus
            />
            <button type="submit" className="nickname-submit">입장하기</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content chat-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="chat-header">
          <h2 className="modal-title">💬 팀 채팅방</h2>
          <div className="chat-user-info">
            <span className="chat-nickname">{nickname}</span>
            <button className="clear-chat-btn" onClick={handleClearChat}>기록 삭제</button>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>아직 메시지가 없습니다.</p>
              <p>첫 번째 메시지를 보내보세요!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${msg.nickname === nickname ? "my-message" : ""} ${msg.type === "profit" ? "profit-message" : ""}`}
              >
                <div className="message-header">
                  <span className="message-nickname">{msg.nickname}</span>
                  <span className="message-time">{msg.timestamp}</span>
                </div>
                <div className={`message-content ${msg.type === "profit" ? (msg.profit >= 0 ? "positive" : "negative") : ""}`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 수익률 자랑하기 버튼 */}
        <div className="profit-share-section">
          <button className="profit-share-btn" onClick={handleShareProfit}>
            <span>📊</span>
            <span>내 수익률 자랑하기</span>
            <span className={profit >= 0 ? "positive" : "negative"}>
              ({profit >= 0 ? "+" : ""}{profit.toFixed(1)}%)
            </span>
          </button>
        </div>

        {/* 메시지 입력 */}
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="chat-input"
            maxLength={200}
          />
          <button type="submit" className="chat-send-btn">전송</button>
        </form>
      </div>
    </div>
  );
}
