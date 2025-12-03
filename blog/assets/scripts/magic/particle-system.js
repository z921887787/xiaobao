class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 1) * 4 - 2; // Upward trend
    this.life = 1.0;
    this.decay = 0.01 + Math.random() * 0.02;
    this.color = color;
    this.size = Math.random() * 10 + 5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.size *= 0.95; // Shrink
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class MagicScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    // Brand colors from CSS
    this.colors = ['#ff98b3', '#ff6d89', '#ffffff', '#ffe4e1'];
    
    // Connections for hand skeleton
    this.CONNECTIONS = [
      [0, 1], [1, 2], [2, 3], [3, 4],           // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8],           // Index
      [0, 9], [9, 10], [10, 11], [11, 12],      // Middle
      [0, 13], [13, 14], [14, 15], [15, 16],    // Ring
      [0, 17], [17, 18], [18, 19], [19, 20]     // Pinky
    ];

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    // Match the internal resolution to the display size for sharpness
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  emit(x, y) {
    // Input x,y are normalized (0.0 - 1.0)
    const px = x * this.canvas.width;
    const py = y * this.canvas.height;

    // Burst of particles
    for (let i = 0; i < 3; i++) {
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.particles.push(new Particle(px, py, color));
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    // Note: We don't clearRect here because we want to layer over the video
    // But the main loop clears before drawing if needed.
    // Actually, Main loop will handle the clearing of the canvas.
    // Here we just draw particles.
    this.particles.forEach(p => p.draw(this.ctx));
  }

  drawSkeleton(landmarks) {
    if (!landmarks) return;

    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#ff6d89';

    for (const landmarksPerHand of landmarks) {
      // Draw connections
      for (const [start, end] of this.CONNECTIONS) {
        const p1 = landmarksPerHand[start];
        const p2 = landmarksPerHand[end];
        ctx.beginPath();
        ctx.moveTo(p1.x * this.canvas.width, p1.y * this.canvas.height);
        ctx.lineTo(p2.x * this.canvas.width, p2.y * this.canvas.height);
        ctx.stroke();
      }

      // Draw points
      for (const point of landmarksPerHand) {
        ctx.beginPath();
        ctx.arc(point.x * this.canvas.width, point.y * this.canvas.height, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    ctx.restore();
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
