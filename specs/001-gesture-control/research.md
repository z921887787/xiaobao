# Research: Hand Gesture Interaction

**Feature**: Hand Gesture Control (001-gesture-control)
**Date**: 2025-12-03

## Unknowns & Decisions

### 1. 手部追踪库 (Hand Tracking Library)
**Decision**: 使用 Google MediaPipe Tasks Vision (`@mediapipe/tasks-vision`)。
**Rationale**: 
- 基于 Web 的机器学习行业标准。
- 高度优化（WASM/WebGL 后端）。
- "Tasks" API 是旧版 "Solutions" API 的现代继承者，提供更好的性能和更简单的接口。
- 专门支持 "Hand Landmarker"。

**Alternatives Considered**:
- *TensorFlow.js*: 太重且层级较低。很难开箱即用地获得高性能的手部网格。
- *Handtrack.js*: 较旧，准确度不如 MediaPipe。

### 2. 资源交付 (Asset Delivery)
**Decision**: 通过 CDN (`jsdelivr` 或 `unpkg`) 加载库，通过 Google Storage 或本地托管加载模型文件。
**Rationale**: 
- 项目是静态 HTML。根目录下目前不可见打包器（Webpack/Vite）（只有 `blog/` 文件夹）。
- 直接在浏览器中使用 ES Modules (`<script type="module">`) 配合 import maps 或直接 CDN 导入，是最符合项目结构的“原生”方式。
- **模型文件**: `hand_landmarker.task` (~9MB)。应该被缓存。原型阶段我们将指向官方 Google 存储 URL 以节省带宽/存储，或者如果需要离线能力则下载它。目前远程 URL 即可。

### 3. 粒子系统 (Particle System)
**Decision**: 自定义轻量级 Canvas 实现。
**Rationale**:
- 对于简单的 2D 气泡/火花，不需要沉重的游戏引擎（Three.js/Pixi.js）。
- 保持页面体积小（粒子逻辑 < 5KB）。
- 符合“性能优先”的章程原则。

## Technical Stack Confirmation

- **Library URL**: `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js` (or similar ES module entry).
- **Model URL**: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`
- **Browser Support**: 需要 `getUserMedia` (仅限 HTTPS 或 localhost)。

## Risks
- **HTTPS Requirement**: 摄像头访问需要安全上下文。用户必须运行本地服务器（例如 `python -m http.server` 或 VS Code Live Server）来进行本地测试。直接打开 `file://` 将无法使用摄像头。
- **Performance on Low-End**: ML 推理可能是 CPU/GPU 密集型的。我们将设置 `min_detection_confidence` 和 `min_tracking_confidence` 来平衡速度/准确性。