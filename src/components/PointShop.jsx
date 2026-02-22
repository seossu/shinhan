import React, { useState } from "react";

/* ===================================================
 * 포인트 상점 컴포넌트
 * 포인트로 다양한 아이템을 구매할 수 있는 상점
 * =================================================== */

// 상점 아이템 데이터
const SHOP_ITEMS = {
  rescue: {
    name: "출석 구제권",
    category: "출석 구제",
    icon: "🆘",
    description: "팀원이 놓친 출석체크를 구제해줍니다",
    price: 50,
    type: "consumable",
  },
  freeze: {
    name: "출석 동결권",
    category: "출석 동결",
    icon: "❄️",
    description: "시험, 여행, 하락장 등에 연속 출석이 깨지지 않습니다",
    price: 80,
    type: "consumable",
  },
  // 캐릭터 꾸미기 아이템
  hat_crown: {
    name: "왕관",
    category: "캐릭터 장식",
    icon: "👑",
    description: "캐릭터에게 왕관을 씌워줍니다",
    price: 100,
    type: "decoration",
    slot: "head",
  },
  hat_ribbon: {
    name: "리본",
    category: "캐릭터 장식",
    icon: "🎀",
    description: "귀여운 리본 장식",
    price: 60,
    type: "decoration",
    slot: "head",
  },
  // 섬 꾸미기 아이템
  tree: {
    name: "나무",
    category: "섬 장식",
    icon: "🌳",
    description: "섬에 나무를 심습니다",
    price: 30,
    type: "decoration",
    slot: "island",
  },
  house: {
    name: "작은 집",
    category: "섬 장식",
    icon: "🏠",
    description: "아담한 집을 지어줍니다",
    price: 150,
    type: "decoration",
    slot: "island",
  },
  fountain: {
    name: "분수대",
    category: "섬 장식",
    icon: "⛲",
    description: "시원한 분수대",
    price: 120,
    type: "decoration",
    slot: "island",
  },
};

const CATEGORIES = [
  { id: "all", name: "전체", icon: "🛒" },
  { id: "rescue", name: "출석 구제", icon: "🆘" },
  { id: "freeze", name: "출석 동결", icon: "❄️" },
  { id: "character", name: "캐릭터 장식", icon: "🎭" },
  { id: "island", name: "섬 장식", icon: "🏝️" },
];

export default function PointShop({ points, inventory, onPurchase, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [purchaseMessage, setPurchaseMessage] = useState(null);

  // 카테고리별 필터링
  const filteredItems = Object.entries(SHOP_ITEMS).filter(([key, item]) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "rescue") return key === "rescue";
    if (selectedCategory === "freeze") return key === "freeze";
    if (selectedCategory === "character") return item.category === "캐릭터 장식";
    if (selectedCategory === "island") return item.category === "섬 장식";
    return true;
  });

  const handlePurchase = (itemId, item) => {
    if (points < item.price) {
      setPurchaseMessage({ type: "error", text: "포인트가 부족합니다!" });
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    // 이미 보유한 장식 아이템인지 확인
    if (item.type === "decoration" && inventory.includes(itemId)) {
      setPurchaseMessage({ type: "error", text: "이미 보유한 아이템입니다!" });
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    onPurchase(itemId, item);
    setPurchaseMessage({ type: "success", text: `${item.name}을(를) 구매했습니다!` });
    setTimeout(() => setPurchaseMessage(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content shop-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="modal-title">🛍️ 포인트 상점</h2>

        {/* 보유 포인트 */}
        <div className="shop-points">
          <span className="points-icon">💰</span>
          <span className="points-value">{points.toLocaleString()} P</span>
        </div>

        {/* 구매 메시지 */}
        {purchaseMessage && (
          <div className={`purchase-message ${purchaseMessage.type}`}>
            {purchaseMessage.text}
          </div>
        )}

        {/* 카테고리 탭 */}
        <div className="shop-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`shop-cat-btn ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* 아이템 목록 */}
        <div className="shop-items">
          {filteredItems.map(([key, item]) => {
            const owned = item.type === "decoration" && inventory.includes(key);
            const canAfford = points >= item.price;

            return (
              <div key={key} className={`shop-item ${owned ? "owned" : ""}`}>
                <div className="item-icon">{item.icon}</div>
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-desc">{item.description}</div>
                  <div className="item-category">{item.category}</div>
                </div>
                <div className="item-purchase">
                  <div className="item-price">
                    <span>💰</span> {item.price.toLocaleString()} P
                  </div>
                  {owned ? (
                    <span className="owned-badge">보유중</span>
                  ) : (
                    <button
                      className={`buy-btn ${!canAfford ? "disabled" : ""}`}
                      onClick={() => handlePurchase(key, item)}
                      disabled={!canAfford}
                    >
                      구매
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { SHOP_ITEMS };
