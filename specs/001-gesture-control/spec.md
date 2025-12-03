# Feature Specification: Hand Gesture Interaction

**Feature Branch**: `001-gesture-control`  
**Created**: 2025-12-03  
**Status**: Draft  
**Input**: User description: "Add hand gesture control for animations"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 访问魔法乐园 (Priority: P1)

作为访客（可能是家庭成员或孩子），我希望能进入一个特殊的“魔法”页面并在屏幕上看到自己，这样我就可以用有趣的方式与网站互动。

**Why this priority**: 这一功能是基础；没有摄像头访问和画布，就不可能进行任何互动。

**Independent Test**: 可以导航到 `/magic.html`，授权摄像头权限，并看到视频流。

**Acceptance Scenarios**:

1. **Given** 在首页, **When** 点击导航栏中的“魔法互动”链接, **Then** 进入 `magic.html` 页面。
2. **Given** 魔法页面加载完毕, **When** 浏览器请求摄像头权限我点击允许, **Then** 我能在屏幕上看到我的视频画面。
3. **Given** 在魔法页面, **When** 我拒绝摄像头权限, **Then** 我会看到一个友好的错误提示，解释为什么需要摄像头。

---

### User Story 2 - 触发魔法特效 (Priority: P1)

作为用户，我希望能通过挥手或张开手掌来产生视觉特效（如气泡或星星），这样我会感觉自己拥有魔法。

**Why this priority**: 这是核心价值主张——“有趣”的部分。

**Independent Test**: 向摄像头展示手部动作并能看到视觉反馈。

**Acceptance Scenarios**:

1. **Given** 摄像头已激活, **When** 我在视野中清晰地举起张开的手掌, **Then** 屏幕上会出现粒子特效（如气泡/火花）。
2. **Given** 特效正在显示, **When** 我放下手或握紧拳头, **Then** 特效停止生成。

---

### User Story 3 - 视觉反馈 (Priority: P2)

作为用户，我希望能看到覆盖在我手上的线条图，这样我就知道电脑能“看见”我。

**Why this priority**: 提供关键的可用性反馈，帮助用户了解自己是否在画面范围内。

**Independent Test**: 当手在视野中时，能看到手部骨架的覆盖层。

**Acceptance Scenarios**:

1. **Given** 摄像头已激活, **When** 我的手进入画面, **Then** 一个骨架覆盖层会实时跟随我的手部动作。

---

### Edge Cases

- **多只手**: 系统应追踪至少一只手（优先追踪最明显的那只）。
- **光线不足**: 系统应优雅降级（如果置信度低，可能显示“需要更多光线”的提示，或者什么都不做）。
- **移动设备**: 页面应仍能渲染，但摄像头方向/性能可能会有变化（MVP 优先针对桌面端）。
- **不支持的浏览器**: 如果 `getUserMedia` 不可用，显示降级提示信息。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 创建新页面 `magic.html`，继承标准站点布局（页眉/页脚）。
- **FR-002**: 在主导航或首页 Hero 区域实现“魔法互动”入口。
- **FR-003**: 集成计算机视觉能力，以便在浏览器中追踪手部动作。
- **FR-004**: 安全地请求和处理摄像头权限；提供“允许摄像头”的 UI。
- **FR-005**: 分析视频帧以检测手部关键点（具体为张开手掌 vs 握拳/无手势）。
- **FR-006**: 实现视觉粒子系统以渲染特效（如气泡、火花）。
- **FR-007**: 当以高置信度检测到“张开手掌”手势时，触发粒子发射。
- **FR-008**: 在视频流上绘制手部骨架关键点用于调试/反馈（可切换或常驻）。

### Key Entities *(include if feature involves data)*

- **GestureState**: 手部状态 { NONE, OPEN_PALM, CLOSED_FIST }。
- **Particle**: 具有位置、速度和外观属性的视觉元素。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 授权后 2 秒内启动摄像头流。
- **SC-002**: 手部追踪模型在标准宽带连接下 5 秒内加载就绪。
- **SC-003**: 交互延迟（动作到特效）低于 100ms（感知为实时）。
- **SC-004**: 在交互期间，普通桌面硬件上的平均帧率保持在 30 FPS 以上。
