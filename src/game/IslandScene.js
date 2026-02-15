import Phaser from "phaser";
import SECTOR_CONFIG from "../config/sectorConfig";

/* ===================================================
 * 색상 유틸리티
 * =================================================== */
function hexToRgb(h) { return { r: (h >> 16) & 0xff, g: (h >> 8) & 0xff, b: h & 0xff }; }
function rgbToHex(r, g, b) {
  return (Math.min(255, Math.max(0, Math.round(r))) << 16) |
    (Math.min(255, Math.max(0, Math.round(g))) << 8) |
    Math.min(255, Math.max(0, Math.round(b)));
}
function lerpColor(a, b, t) {
  const ca = hexToRgb(a), cb = hexToRgb(b);
  return rgbToHex(ca.r + (cb.r - ca.r) * t, ca.g + (cb.g - ca.g) * t, ca.b + (cb.b - ca.b) * t);
}
function darkenColor(h, p) { const c = hexToRgb(h); const f = 1 - p / 100; return rgbToHex(c.r * f, c.g * f, c.b * f); }

/* ===================================================
 * 섹터별 배경 이미지 매핑
 * default=1, it=2, bio=3, energy=4, airport=5, finance=6
 * =================================================== */
const SECTOR_BG_MAP = {
  default: "bg-1",
  it: "bg-2",
  bio: "bg-3",
  energy: "bg-4",
  airport: "bg-5",
  finance: "bg-6",
};

/* ===================================================
 * 경험치 구간별 캐릭터 이미지 매핑
 * a=어린시절, b, c, d, e=늙은시절
 * =================================================== */
const EXP_CHAR_MAP = [
  { minExp: 0, key: "char-a" },    // 0~19%
  { minExp: 20, key: "char-b" },   // 20~39%
  { minExp: 40, key: "char-c" },   // 40~59%
  { minExp: 60, key: "char-d" },   // 60~79%
  { minExp: 80, key: "char-e" },   // 80~100%
];

function getCharKeyByExp(exp) {
  for (let i = EXP_CHAR_MAP.length - 1; i >= 0; i--) {
    if (exp >= EXP_CHAR_MAP[i].minExp) return EXP_CHAR_MAP[i].key;
  }
  return "char-a";
}

/* ===================================================
 * IslandScene
 * 업로드된 이미지를 배경으로 깔고, 그 위에
 * 캐릭터·날씨·섹터 건물을 오버레이합니다.
 * =================================================== */
export default class IslandScene extends Phaser.Scene {
  constructor() {
    super({ key: "IslandScene" });
    this.currentSector = "default";
    this.currentProfit = 0;
    this.currentExp = 0;
    this.currentCharKey = "char-a";
    this.isReady = false;
  }

  /* ===================================================
   * preload: 섹터별 배경 이미지 6개 모두 로드
   * public 폴더에 1.png ~ 6.png 파일 필요
   * =================================================== */
  preload() {
    // 섹터별 배경 이미지 (1~6)
    this.load.image("bg-1", "/1.png");  // default (기본)
    this.load.image("bg-2", "/2.png");  // IT
    this.load.image("bg-3", "/3.png");  // 바이오
    this.load.image("bg-4", "/4.png");  // 에너지
    this.load.image("bg-5", "/5.png");  // 항공/공항
    this.load.image("bg-6", "/6.png");  // 금융

    // 경험치별 캐릭터 이미지 (a~e: 어린시절→늙은시절)
    this.load.image("char-a", "/a.png");
    this.load.image("char-b", "/b.png");
    this.load.image("char-c", "/c.png");
    this.load.image("char-d", "/d.png");
    this.load.image("char-e", "/e.png");

    console.log("[Grow-Island] 배경 6개 + 캐릭터 5개 이미지 로딩 중...");
  }

  /* ===================================================
   * create: 배경 이미지를 캔버스에 꽉 채우고 레이어 구성
   * =================================================== */
  create() {
    this.W = this.sys.game.config.width;
    this.H = this.sys.game.config.height;

    /* 배경 이미지를 캔버스 크기에 맞게 배치 (기본 이미지로 시작) */
    this.bgImage = this.add.image(this.W / 2, this.H / 2, "bg-1");
    this.bgImage.setDisplaySize(this.W, this.H);

    /* 날씨 오버레이 (비/안개 등 반투명 효과용) */
    this.weatherOverlay = this.add.graphics();

    /* 캐릭터 이미지 (화면 중앙에 배치, 크기 조절) */
    this.characterSprite = this.add.image(this.W / 2, this.H / 2, "char-a");
    this.characterSprite.setOrigin(0.5, 0.5);
    this.characterSprite.setScale(0.25); // 캐릭터 크기 25%로 확대

    /* 날씨 이펙트 컨테이너 (비, 구름 등) */
    this.weatherContainer = this.add.container(0, 0);

    /* 무지개 */
    this.rainbowGfx = this.add.graphics();
    this.rainbowGfx.setAlpha(0);

    /* 밝기/색조 오버레이 (수익률에 따라 화면 톤 변경) */
    this.tintOverlay = this.add.graphics();

    this.isReady = true;
    console.log("[Grow-Island] 씬 생성 완료 (이미지 배경)");
  }

  /* ===================================================
   * 캐릭터 이미지 업데이트 (경험치에 따라 a~e 변경)
   * =================================================== */
  updateCharacter(exp) {
    const newKey = getCharKeyByExp(exp);
    if (newKey !== this.currentCharKey) {
      this.characterSprite.setTexture(newKey);
      this.currentCharKey = newKey;
      console.log(`[Grow-Island] 캐릭터 변경: ${newKey} (exp: ${exp}%)`);
    }
  }

  /* ===================================================
   * 날씨/톤 오버레이 업데이트
   * 수익률에 따라 화면 전체의 밝기와 분위기를 변경합니다.
   * =================================================== */
  updateTint(profit) {
    this.tintOverlay.clear();

    if (profit < 0) {
      /* 마이너스: 어둡고 우중충한 오버레이 */
      const intensity = Math.min(Math.abs(profit) / 50, 1);
      this.tintOverlay.fillStyle(0x37474f, 0.15 + intensity * 0.2);
      this.tintOverlay.fillRect(0, 0, this.W, this.H);
    } else if (profit > 20) {
      /* 높은 수익률: 살짝 따뜻한 황금빛 오버레이 */
      this.tintOverlay.fillStyle(0xfff9c4, 0.08);
      this.tintOverlay.fillRect(0, 0, this.W, this.H);
    }
  }

  /* ===================================================
   * 날씨 이펙트
   * =================================================== */
  updateWeather(profit) {
    this.weatherContainer.removeAll(true);
    this.weatherOverlay.clear();
    this.rainbowGfx.clear();
    this.rainbowGfx.setAlpha(0);

    if (profit > 0) {
      this.drawRainbow();
      this.drawSunshine();
    } else if (profit < 0) {
      this.drawRain();
    }
  }

  /* 무지개 */
  drawRainbow() {
    const g = this.rainbowGfx;
    g.clear();
    g.setAlpha(0);
    const cx = this.W * 0.72, cy = this.H * 0.28;
    [0xff0000, 0xff7700, 0xffff00, 0x00ff00, 0x0000ff, 0x8b00ff].forEach((c, i) => {
      g.lineStyle(3, c, 0.3);
      g.beginPath();
      g.arc(cx, cy, 70 + i * 5, Math.PI, 0);
      g.strokePath();
    });
    this.tweens.add({ targets: g, alpha: 0.7, duration: 1500, ease: "Sine.easeInOut" });
  }

  /* 햇살 */
  drawSunshine() {
    const g = this.add.graphics();
    const sx = this.W * 0.88, sy = this.H * 0.08;

    /* 햇살 광선 (뒤쪽) */
    g.lineStyle(2, 0xfff9c4, 0.2);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      g.beginPath();
      g.moveTo(sx + Math.cos(a) * 20, sy + Math.sin(a) * 20);
      g.lineTo(sx + Math.cos(a) * 50, sy + Math.sin(a) * 50);
      g.strokePath();
    }

    /* 태양 글로우 */
    g.fillStyle(0xfff9c4, 0.25);
    g.fillCircle(sx, sy, 35);
    g.fillStyle(0xffeb3b, 0.5);
    g.fillCircle(sx, sy, 18);
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(sx, sy, 10);

    this.weatherContainer.add(g);
  }

  /* 비 */
  drawRain() {
    const g = this.add.graphics();

    /* 어두운 비 오버레이 */
    this.weatherOverlay.fillStyle(0x263238, 0.2);
    this.weatherOverlay.fillRect(0, 0, this.W, this.H);

    /* 먹구름 */
    g.fillStyle(0x546e7a, 0.6);
    g.fillEllipse(this.W * 0.2, 35, 140, 45);
    g.fillEllipse(this.W * 0.5, 28, 160, 50);
    g.fillEllipse(this.W * 0.8, 40, 130, 42);
    g.fillStyle(0x455a64, 0.5);
    g.fillEllipse(this.W * 0.35, 32, 120, 38);
    g.fillEllipse(this.W * 0.65, 38, 110, 35);

    /* 빗방울 */
    g.lineStyle(1, 0x90caf9, 0.5);
    for (let i = 0; i < 100; i++) {
      const rx = Math.random() * this.W;
      const ry = Math.random() * this.H;
      g.beginPath();
      g.moveTo(rx, ry);
      g.lineTo(rx - 1.5, ry + 12);
      g.strokePath();
    }

    this.weatherContainer.add(g);
  }

  /* ===================================================
   * updateState: React → Phaser 상태 동기화
   * profit: 수익률, sector: 섹터, exp: 경험치(0~100)
   * =================================================== */
  updateState(profit, sector, exp = 0) {
    if (!this.isReady) return;

    const isPositive = profit >= 0;

    /* 배경 이미지 밝기 조절 (수익률에 따라) */
    if (isPositive) {
      this.bgImage.setTint(0xffffff); // 원본 밝기
    } else {
      /* 마이너스일수록 어둡게 */
      const darkness = Math.min(Math.abs(profit) / 50, 1);
      const tintValue = Math.round(255 - darkness * 80);
      const tint = (tintValue << 16) | (tintValue << 8) | tintValue;
      this.bgImage.setTint(tint);
    }

    /* 톤 오버레이 */
    this.updateTint(profit);

    /* 섹터 변경 시: 배경 이미지 교체 */
    if (sector !== this.currentSector) {
      const bgKey = SECTOR_BG_MAP[sector] || "bg-1";
      this.bgImage.setTexture(bgKey);
      this.bgImage.setDisplaySize(this.W, this.H);
      this.currentSector = sector;
    }

    /* 캐릭터 (경험치에 따라 a~e 변경) */
    this.updateCharacter(exp);
    this.currentExp = exp;

    /* 날씨 */
    this.updateWeather(profit);

    this.currentProfit = profit;
    console.log(`[Grow-Island] 업데이트: profit=${profit}%, sector=${sector}, exp=${exp}%`);
  }
}
