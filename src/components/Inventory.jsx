import React, { useState } from "react";
import { SHOP_ITEMS } from "./PointShop";

/* ===================================================
 * 인벤토리 컴포넌트
 * 구매한 아이템을 확인하고 장착/해제할 수 있습니다
 * =================================================== */

const SLOT_NAMES = {
  head: "머리",
  island: "섬",
};

export default function Inventory({ inventory, equipped, onEquipToggle, onClose }) {
  const [selectedSlot, setSelectedSlot] = useState("all");

  // 인벤토리에 있는 아이템만 필터링
  const ownedItems = inventory
    .map((itemId) => ({ id: itemId, ...SHOP_ITEMS[itemId] }))
    .filter((item) => item.type === "decoration");

  // 슬롯별 필터링
  const filteredItems = selectedSlot === "all"
    ? ownedItems
    : ownedItems.filter((item) => item.slot === selectedSlot);

  const slots = [
    { id: "all", name: "전체", icon: "📦" },
    { id: "head", name: "머리", icon: "🎩" },
    { id: "island", name: "섬", icon: "🏝️" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content inventory-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="modal-title">🎒 인벤토리</h2>

        {/* 슬롯 필터 탭 */}
        <div className="inventory-tabs">
          {slots.map((slot) => (
            <button
              key={slot.id}
              className={`inventory-tab ${selectedSlot === slot.id ? "active" : ""}`}
              onClick={() => setSelectedSlot(slot.id)}
            >
              <span>{slot.icon}</span>
              <span>{slot.name}</span>
            </button>
          ))}
        </div>

        {/* 현재 장착 상태 */}
        <div className="equipped-status">
          <h3 className="equipped-title">현재 장착 중</h3>
          <div className="equipped-slots">
            {Object.entries(SLOT_NAMES).map(([slotId, slotName]) => {
              const equippedItem = equipped[slotId];
              const itemData = equippedItem ? SHOP_ITEMS[equippedItem] : null;

              return (
                <div key={slotId} className="equipped-slot">
                  <span className="slot-name">{slotName}</span>
                  {itemData ? (
                    <span className="slot-item">
                      {itemData.icon} {itemData.name}
                    </span>
                  ) : (
                    <span className="slot-empty">비어있음</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 아이템 목록 */}
        <div className="inventory-items">
          {filteredItems.length === 0 ? (
            <div className="inventory-empty">
              <span className="empty-icon">📭</span>
              <p>보유한 아이템이 없습니다</p>
              <p className="empty-hint">상점에서 아이템을 구매해보세요!</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isEquipped = equipped[item.slot] === item.id;

              return (
                <div
                  key={item.id}
                  className={`inventory-item ${isEquipped ? "equipped" : ""}`}
                  onClick={() => onEquipToggle(item.id, item.slot)}
                >
                  <div className="inv-item-icon">{item.icon}</div>
                  <div className="inv-item-info">
                    <div className="inv-item-name">{item.name}</div>
                    <div className="inv-item-slot">{SLOT_NAMES[item.slot]} 장식</div>
                  </div>
                  <div className="inv-item-action">
                    {isEquipped ? (
                      <span className="equipped-badge">장착중 ✓</span>
                    ) : (
                      <span className="equip-hint">터치하여 장착</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="inventory-tip">
          💡 아이템을 터치하면 장착/해제할 수 있어요
        </div>
      </div>
    </div>
  );
}
