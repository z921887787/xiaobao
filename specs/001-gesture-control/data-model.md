# Data Model: Hand Gesture Interaction

**Feature**: 001-gesture-control
**Type**: Client-Side Runtime State (No Persistent Storage)

## Entities

### 1. GestureState
*Represents the current interpreted state of the user's hand.*

| Field | Type | Description |
|-------|------|-------------|
| `type` | Enum | `NONE` \| `OPEN_PALM` \| `CLOSED_FIST` |
| `confidence` | Float | 0.0 - 1.0 score from model |
| `timestamp` | Number | Time of detection |

### 2. HandLandmarks
*Raw data from MediaPipe.*

| Field | Type | Description |
|-------|------|-------------|
| `landmarks` | Array<{x, y, z}> | 21 normalized coordinates (0.0 - 1.0) |
| `handedness` | String | "Left" or "Right" |

### 3. Particle
*Visual effect element.*

| Field | Type | Description |
|-------|------|-------------|
| `x` | Number | Screen X position |
| `y` | Number | Screen Y position |
| `vx` | Number | Velocity X |
| `vy` | Number | Velocity Y |
| `life` | Number | Remaining frames/time to live |
| `color` | String | CSS Color string |
| `size` | Number | Radius in pixels |

## State Management

- **Global State**: None.
- **Component State**:
  - `HandTracker`: Holds latest `HandLandmarks`.
  - `MagicScene`: Holds array of active `Particle`s and current `GestureState`.

## Data Flow

1. `VideoElement` -> `HandTracker` (Frame Analysis)
2. `HandTracker` -> `GestureState` (Interpretation)
3. `GestureState` -> `MagicScene` (Trigger Effects)
4. `MagicScene` -> `CanvasElement` (Render)
