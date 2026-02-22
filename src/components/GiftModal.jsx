import React, { useState } from "react";

/* ===================================================
 * 선물 혜택 모달
 * 문화생활, 액티비티, 실물/이벤트, 자기계발 4가지 카테고리
 * =================================================== */

const GIFT_CATEGORIES = {
  culture: {
    id: "culture",
    name: "문화생활",
    icon: "🎬",
    color: "#E91E63",
    gifts: [
      { name: "팀단위 OTT 구독권", desc: "넷플릭스, 왓챠 등 팀 공유 구독권" },
      { name: "보드게임 카페 이용권", desc: "팀원들과 함께 즐기는 보드게임 카페" },
      { name: "파티룸 이용권", desc: "프라이빗 파티룸에서 특별한 시간" },
      { name: "유명 식당 이용권", desc: "미슐랭 맛집에서의 특별한 식사" },
      { name: "야구 VIP 스카이박스 이용권", desc: "최고의 시야에서 즐기는 야구 경기" },
    ],
  },
  activity: {
    id: "activity",
    name: "액티비티",
    icon: "🏃",
    color: "#4CAF50",
    gifts: [
      { name: "방탈출 체험권", desc: "스릴 넘치는 방탈출 체험" },
      { name: "글램핑 체험권", desc: "자연 속 럭셔리 캠핑 체험" },
      { name: "템플스테이 체험권", desc: "마음의 휴식, 템플스테이" },
      { name: "놀이공원 티켓", desc: "에버랜드/롯데월드 자유이용권" },
    ],
  },
  physical: {
    id: "physical",
    name: "실물/이벤트",
    icon: "🎁",
    color: "#FF9800",
    gifts: [
      { name: "필름 카메라 현상비 지원", desc: "아날로그 감성의 필름 현상 지원" },
      { name: "인생네컷/스튜디오 촬영비 지원", desc: "특별한 순간을 사진으로" },
      { name: "팀 단체 티셔츠/굿즈 제작비 지원", desc: "우리 팀만의 특별한 굿즈" },
      { name: "대학생 졸업 화환/현수막 지원", desc: "졸업을 축하하는 특별한 선물" },
      { name: "대학내일 인터뷰권", desc: "대학내일 매거진 인터뷰 기회" },
    ],
  },
  growth: {
    id: "growth",
    name: "자기계발",
    icon: "📚",
    color: "#2196F3",
    gifts: [
      { name: "투자 플러스 무료 체험권", desc: "프리미엄 투자 분석 서비스" },
      { name: "팀 노션 패키지 제공", desc: "협업을 위한 노션 템플릿" },
      { name: "취업박람회 티켓", desc: "커리어 기회를 만나는 취업박람회" },
      { name: "신한 투자증권 기업 탐방", desc: "신한 투자증권 본사 견학 및 현직자 만남" },
      { name: "애널리스트 특강 참여", desc: "현직 애널리스트의 투자 인사이트 특강" },
    ],
  },
};

export default function GiftModal({ onClose, giftChances, onUseChance, receivedGifts }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [wonGift, setWonGift] = useState(null);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowResult(false);
    setWonGift(null);
  };

  const handleReceiveGift = () => {
    if (giftChances <= 0) return;

    const category = GIFT_CATEGORIES[selectedCategory];
    const randomIndex = Math.floor(Math.random() * category.gifts.length);
    const gift = category.gifts[randomIndex];

    setWonGift({ ...gift, category: category.name, categoryIcon: category.icon });
    setShowResult(true);
    onUseChance(selectedCategory, gift);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setShowResult(false);
    setWonGift(null);
  };

  // 카테고리 선택 화면
  if (!selectedCategory) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content gift-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>✕</button>

          <h2 className="modal-title">🎁 선물 혜택</h2>

          <div className="gift-chances-display">
            <span className="chances-icon">🎟️</span>
            <span className="chances-text">남은 교환권</span>
            <span className="chances-count">{giftChances}개</span>
          </div>

          {giftChances === 0 && (
            <div className="no-chances-notice">
              캐릭터가 성장하면 선물 교환권을 받을 수 있어요!
            </div>
          )}

          <div className="gift-categories">
            {Object.values(GIFT_CATEGORIES).map((category) => (
              <button
                key={category.id}
                className="gift-category-btn"
                style={{ "--category-color": category.color }}
                onClick={() => handleSelectCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.gifts.length}종</span>
              </button>
            ))}
          </div>

          {/* 받은 선물 목록 */}
          {receivedGifts && receivedGifts.length > 0 && (
            <div className="received-gifts-section">
              <h3 className="received-title">🎉 받은 선물</h3>
              <div className="received-gifts-list">
                {receivedGifts.map((gift, idx) => (
                  <div key={idx} className="received-gift-item">
                    <span className="received-icon">{gift.categoryIcon}</span>
                    <span className="received-name">{gift.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 선물 결과 화면
  if (showResult && wonGift) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content gift-modal gift-result" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>✕</button>

          <div className="gift-result-content">
            <div className="result-confetti">🎊</div>
            <h2 className="result-title">축하합니다!</h2>
            <div className="result-gift-card" style={{ "--category-color": GIFT_CATEGORIES[selectedCategory].color }}>
              <span className="result-category">{wonGift.categoryIcon} {wonGift.category}</span>
              <span className="result-gift-name">{wonGift.name}</span>
              <span className="result-gift-desc">{wonGift.desc}</span>
            </div>
            <p className="result-message">선물이 지급될 예정입니다!</p>
          </div>

          <button className="gift-back-btn" onClick={handleBack}>
            다른 선물 보기
          </button>
        </div>
      </div>
    );
  }

  // 카테고리 상세 화면
  const category = GIFT_CATEGORIES[selectedCategory];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content gift-modal gift-detail" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <button className="gift-back-arrow" onClick={handleBack}>
          ← 뒤로
        </button>

        <div className="gift-category-header" style={{ "--category-color": category.color }}>
          <span className="category-header-icon">{category.icon}</span>
          <h2 className="category-header-name">{category.name}</h2>
        </div>

        <div className="gift-chances-mini">
          🎟️ 남은 교환권: <strong>{giftChances}개</strong>
        </div>

        <p className="gift-info-text">
          아래 선물 중 <strong>하나를 랜덤</strong>으로 받을 수 있어요!
        </p>

        <div className="gift-list">
          {category.gifts.map((gift, idx) => (
            <div key={idx} className="gift-item" style={{ "--category-color": category.color }}>
              <div className="gift-item-header">
                <span className="gift-number">{idx + 1}</span>
                <span className="gift-name">{gift.name}</span>
              </div>
              <p className="gift-desc">{gift.desc}</p>
            </div>
          ))}
        </div>

        <div className="gift-receive-section">
          <button
            className="gift-receive-btn"
            style={{ "--category-color": category.color }}
            onClick={handleReceiveGift}
            disabled={giftChances <= 0}
          >
            {giftChances > 0 ? (
              <>🎁 선물 받기</>
            ) : (
              <>교환권이 없습니다</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
