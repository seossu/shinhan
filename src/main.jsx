import React from "react";
import ReactDOM from "react-dom/client";
import GrowIslandApp from "./App";
import "./index.css";

/* ===================================================
 * React 앱 진입점
 * 
 * 주의: React.StrictMode를 의도적으로 제거했습니다.
 * Phaser.js는 StrictMode의 이중 마운트/언마운트와 호환되지 않아
 * 캔버스가 생성된 후 즉시 파괴되는 문제가 발생합니다.
 * =================================================== */
ReactDOM.createRoot(document.getElementById("root")).render(<GrowIslandApp />);
