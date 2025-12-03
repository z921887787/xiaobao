import { HandTracker } from "./hand-tracker.js";
import { MagicScene } from "./particle-system.js";

const video = document.getElementById("webcam");
const canvas = document.getElementById("output_canvas");
const enableBtn = document.getElementById("enable-camera");
const overlay = document.getElementById("permission-overlay");
const loading = document.getElementById("loading-indicator");
const debugCheckbox = document.getElementById("debug-mode");

const tracker = new HandTracker();
const scene = new MagicScene(canvas);
let lastVideoTime = -1;

// Helper: Check if protocol is secure
function isSecureContext() {
  return window.isSecureContext;
}

async function startApp() {
  if (!isSecureContext()) {
    alert("安全限制：浏览器要求摄像头访问必须在 HTTPS 或 Localhost 环境下运行。");
    return;
  }

  try {
    enableBtn.disabled = true;
    enableBtn.textContent = "正在启动...";
    loading.classList.remove("hidden");
    
    // 1. Init Tracker (Download Model)
    await tracker.init();
    
    // 2. Get Camera
    const constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user"
      }
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    
    // Wait for video to load
    video.onloadedmetadata = () => {
      video.play();
      loading.classList.add("hidden");
      overlay.style.display = "none";
      requestAnimationFrame(loop);
    };

  } catch (err) {
    console.error("Error starting app:", err);
    loading.classList.add("hidden");
    enableBtn.disabled = false;
    enableBtn.textContent = "重试开启相机";
    
    if (err.name === 'NotAllowedError') {
        alert("请允许摄像头权限以使用魔法功能。");
    } else {
        alert(`初始化失败: ${err.message}`);
    }
  }
}

function loop() {
  // Only process if video has enough data
  if (video.readyState >= 2) {
     // Check if frame changed
     if (video.currentTime !== lastVideoTime) {
       lastVideoTime = video.currentTime;
       const startTimeMs = performance.now();
       
       const results = tracker.detect(video, startTimeMs);
       
       scene.clear();
       
       if (results && results.landmarks) {
         // Draw debug skeleton
         if (debugCheckbox.checked) {
           scene.drawSkeleton(results.landmarks);
         }
         
         // Logic: Emit particles from Index Finger Tip (Index 8)
         for (const landmarks of results.landmarks) {
           const indexTip = landmarks[8]; // Index Finger Tip
           // Check depth/visibility if needed, but for now existence is enough
           if (indexTip) {
             // Emit particles
             scene.emit(indexTip.x, indexTip.y);
           }
         }
       }
       
       scene.update();
       scene.draw();
     }
  }
  
  requestAnimationFrame(loop);
}

enableBtn.addEventListener("click", startApp);

// Handle Resize
window.addEventListener('resize', () => {
    scene.resize();
});
