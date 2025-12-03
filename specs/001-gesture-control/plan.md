# Implementation Plan: Hand Gesture Interaction

**Branch**: `001-gesture-control` | **Date**: 2025-12-03 | **Spec**: [specs/001-gesture-control/spec.md](../spec.md)
**Input**: Feature specification from `/specs/001-gesture-control/spec.md`

## Summary

实现一个“魔法互动”页面 (`magic.html`)，利用网络摄像头，在用户展示张开手掌时叠加视觉粒子特效（气泡/火花）。使用 Google MediaPipe Tasks 进行客户端手部追踪，并使用自定义 HTML5 Canvas 粒子系统进行渲染。

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES6+ modules).
**Primary Dependencies**: 
- Google MediaPipe Tasks Vision (`@mediapipe/tasks-vision`) via CDN.
- Google MediaPipe Hand Landmarker Model (float16) via Google Storage.
**Storage**: 无 (临时的运行时状态).
**Testing**: 人工验证 (交互式 UI).
**Target Platform**: 桌面浏览器 (Chrome, Edge, Firefox)，需支持 WebGL 和摄像头。
**Project Type**: 静态网页。
**Performance Goals**: > 30 FPS 渲染; < 100ms 交互延迟。
**Constraints**: 必须通过 HTTPS 或 localhost 服务以满足 `getUserMedia` 安全要求。

## Constitution Check

*GATE: Passed.*

- **Structure Integrity**: 添加新的独立页面；不改变其他页面的现有 DOM 结构。
- **Content Trust**: N/A.
- **Performance Priority**: 模型异步加载；视觉任务卸载到 WASM；粒子系统轻量化。
- **Accessibility**: 页面必须支持键盘访问；如果摄像头被拒绝，提供清晰的错误消息。

## Project Structure

### Documentation (this feature)

```text
specs/001-gesture-control/
├── plan.md              # 本文件
├── research.md          # 库选择与风险分析
├── data-model.md        # 运行时状态定义
```

### Source Code (repository root)

```text
blog/
├── magic.html           # 新入口点
├── styles/
│   └── magic.css        # 特定样式 (若很小则合并)
└── assets/
    └── scripts/         # (注: 项目目前使用内联或根目录脚本，将进行整理)
        └── magic/
            ├── hand-tracker.js   # MediaPipe 封装
            ├── particle-system.js # 视觉效果
            └── main.js           # 协调器
```

**Structure Decision**: 在 `blog/assets/scripts/magic/` 中采用模块化脚本方法 (`type="module"`)，以保持逻辑组织清晰，并与旧的全局脚本分离。

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 新的脚本文件夹结构 | 当前 `blog/` 根目录较乱 | 将文件直接堆在根目录下会增加维护难度 |
