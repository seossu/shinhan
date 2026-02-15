/* ===================================================
 * 섹터별 설정 데이터
 * 각 투자 섹터에 대응하는 한글 이름, 아이콘, 컬러 팔레트를 정의합니다.
 * Phaser 씬과 React UI 모두에서 참조됩니다.
 * =================================================== */

const SECTOR_CONFIG = {
  /* 기본 상태: 푸른 초원 위에 나무만 있는 섬 */
  default: {
    name: "기본",
    icon: "🌿",
    description: "푸른 초원의 섬",
    color: "#4CAF50",
    groundColor: 0x4caf50,
    buildingColor: 0x8bc34a,
    skyColor: 0x87ceeb,
  },

  /* IT 관련주: 첨단 테크 시티로 변환 */
  it: {
    name: "IT",
    icon: "💻",
    description: "첨단 테크 시티",
    color: "#2196F3",
    groundColor: 0x37474f,
    buildingColor: 0x00bcd4,
    skyColor: 0x1a237e,
  },

  /* 바이오 관련주: 연구 단지 환경으로 변환 */
  bio: {
    name: "바이오",
    icon: "🧬",
    description: "바이오 연구 단지",
    color: "#4CAF50",
    groundColor: 0x2e7d32,
    buildingColor: 0x66bb6a,
    skyColor: 0xc8e6c9,
  },

  /* 에너지 관련주: 풍력/태양광 발전 섬으로 변환 */
  energy: {
    name: "에너지",
    icon: "⚡",
    description: "에너지 발전 섬",
    color: "#FF9800",
    groundColor: 0xbf360c,
    buildingColor: 0xff6f00,
    skyColor: 0xfff3e0,
  },

  /* 항공/공항 관련주: 국제 공항 허브로 변환 */
  airport: {
    name: "항공/공항",
    icon: "✈️",
    description: "국제 공항 허브",
    color: "#607D8B",
    groundColor: 0x546e7a,
    buildingColor: 0x90a4ae,
    skyColor: 0xb0bec5,
  },

  /* 금융 관련주: 금융 중심지로 변환 */
  finance: {
    name: "금융",
    icon: "🏦",
    description: "금융 중심지",
    color: "#FFC107",
    groundColor: 0x4e342e,
    buildingColor: 0xffd54f,
    skyColor: 0x263238,
  },
};

export default SECTOR_CONFIG;
