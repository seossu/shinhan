# 🏝️ Grow-Island VS Code 세팅 가이드

## 📋 사전 준비물

| 도구 | 최소 버전 | 확인 명령어 |
|------|----------|------------|
| Node.js | v18 이상 | `node -v` |
| npm | v9 이상 | `npm -v` |
| VS Code | 최신 | - |

> Node.js가 없다면 👉 https://nodejs.org 에서 LTS 버전을 설치하세요.

---

## 🚀 세팅 절차 (총 6단계)

### 1단계: 프로젝트 생성

터미널(CMD / PowerShell / Terminal)을 열고 원하는 폴더 위치에서 실행합니다.

```bash
# Vite + React 프로젝트 생성
npm create vite@latest grow-island -- --template react

# 프로젝트 폴더로 이동
cd grow-island
```

---

### 2단계: 의존성 설치

```bash
# 기본 의존성 설치
npm install

# Phaser.js 설치 (2D 게임 엔진)
npm install phaser
```

---

### 3단계: VS Code로 프로젝트 열기

```bash
# VS Code에서 현재 폴더 열기
code .
```

> VS Code가 열리면 좌측 탐색기에서 아래 폴더 구조를 확인합니다.

---

### 4단계: 파일 배치

VS Code에서 아래 구조대로 파일을 생성/교체합니다.

```
grow-island/
├── public/
├── src/
│   ├── config/
│   │   └── sectorConfig.js      ← 새로 생성
│   ├── game/
│   │   └── IslandScene.js       ← 새로 생성
│   ├── components/
│   │   ├── Dashboard.jsx        ← 새로 생성
│   │   └── AdminPanel.jsx       ← 새로 생성
│   ├── App.jsx                  ← 교체
│   ├── App.css                  ← 교체
│   ├── index.css                ← 교체
│   └── main.jsx                 ← 그대로 유지
├── index.html                   ← 교체
├── package.json
└── vite.config.js
```

**아래 제공되는 파일들을 각 경로에 복사/붙여넣기 하세요.**

---

### 5단계: 개발 서버 실행

```bash
npm run dev
```

터미널에 아래와 같이 표시됩니다:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

---

### 6단계: 브라우저에서 확인

브라우저에서 **http://localhost:5173** 에 접속하면 Grow-Island 게임이 실행됩니다.

---

## 🔧 추천 VS Code 확장 프로그램

| 확장 프로그램 | 용도 |
|-------------|------|
| ES7+ React/Redux/React-Native snippets | React 코드 자동완성 |
| Prettier - Code formatter | 코드 자동 정렬 |
| ESLint | 코드 품질 검사 |

---

## 🛠️ 유용한 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

---

## ⚠️ 중요 주의사항

1. **React.StrictMode 사용 금지**: `main.jsx`에서 `<React.StrictMode>`를 **절대 감싸지 마세요**. Phaser.js는 StrictMode의 이중 마운트/언마운트와 호환되지 않아 캔버스가 빈 화면으로 나옵니다.

2. **Vite 기본 템플릿의 main.jsx를 반드시 교체하세요**: Vite가 생성하는 기본 `main.jsx`에는 StrictMode가 포함되어 있습니다. 제공된 `main.jsx`로 교체해야 합니다.

3. **기본 생성 파일 정리**: Vite가 자동 생성하는 `src/App.css`, `src/index.css`는 제공된 파일로 **교체**합니다. `src/assets/` 폴더는 삭제해도 됩니다.

---

## ❓ 트러블슈팅

| 문제 | 해결 |
|------|------|
| `npm create vite` 실행 안 됨 | `npm install -g create-vite` 후 재시도 |
| 포트 5173 사용 중 | `npx vite --port 3000` 으로 포트 변경 |
| Phaser 관련 에러 | `npm install phaser` 재설치 확인 |
| **게임 화면이 빈 화면** | `main.jsx`에서 StrictMode가 제거되었는지 확인 |
| 콘솔에 "씬 아직 준비 안됨" | 정상입니다. 잠시 후 "씬 연결 성공" 메시지가 나옵니다 |
| 콘솔에 Color 관련 에러 | 최신 `IslandScene.js` 파일로 교체했는지 확인 |
