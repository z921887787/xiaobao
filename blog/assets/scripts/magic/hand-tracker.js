import {
  HandLandmarker,
  FilesetResolver
} from "../../lib/mediapipe/vision_bundle.js";

export class HandTracker {
  constructor() {
    this.handLandmarker = undefined;
    this.runningMode = "VIDEO";
    this.isReady = false;
  }

  async init() {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "assets/lib/mediapipe"
      );
      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `assets/lib/mediapipe/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: this.runningMode,
        numHands: 2,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      this.isReady = true;
      console.log("HandTracker initialized");
    } catch (error) {
      console.error("Failed to initialize HandTracker:", error);
      throw error;
    }
  }

  detect(video, timestamp) {
    if (!this.isReady || !this.handLandmarker) return null;
    return this.handLandmarker.detectForVideo(video, timestamp);
  }
}
