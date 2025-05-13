const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const centerX = () => canvas.width / 2;
const centerY = () => canvas.height / 2;
const radius = () => Math.min(canvas.width, canvas.height) / 2 - 40;

let angle = 0;
let spinning = false;

const tickSound = document.getElementById("tickSound");

// Load the wheel image
const wheelImage = new Image();
let wheelImageLoaded = false;
wheelImage.src = "assets/bulet.png";
wheelImage.onload = () => {
  wheelImageLoaded = true;
  drawWheel();
};

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!wheelImageLoaded) return;

  const size = radius() * 2;

  ctx.save();
  ctx.translate(centerX(), centerY());
  ctx.rotate(angle);
  ctx.drawImage(wheelImage, -radius(), -radius(), size, size);
  ctx.restore();

  // Optional center circle
  ctx.beginPath();
  ctx.arc(centerX(), centerY(), 30, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "#999";
  ctx.stroke();
}

function spinWheel() {
  if (spinning || !wheelImageLoaded) return;

  spinning = true;
  document.getElementById("result").textContent = "";
  document.getElementById("spinBtn").style.display = "none";
  document.getElementById("resetBtn").style.display = "none";

  const spinTime = 4000;
  const spinAngle = Math.random() * 360 + 720;
  const targetAngle = (angle * 180 / Math.PI + spinAngle) % 360;

  const start = performance.now();
  let lastTick = -1;

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / spinTime, 1);
    const eased = easeOutCubic(progress);
    angle = (spinAngle * eased) * Math.PI / 180;
    drawWheel();

    // Play tick sound per slice (optional logic per 10 slices)
    const index = Math.floor(((360 - (angle * 180 / Math.PI) + 90) % 360) / 36);
    if (index !== lastTick) {
      tickSound.currentTime = 0;
      tickSound.play();
      lastTick = index;
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      showResult(targetAngle);
      document.getElementById("resetBtn").style.display = "inline-block";
    }
  }

  requestAnimationFrame(animate);
}

function showResult(degree) {
  const normalized = (360 - degree + 90) % 360;
  const index = Math.floor(normalized / 36);
  document.getElementById("result").textContent = `🎉 You landed on slice ${index + 1}!`;
}

function resetWheel() {
  angle = 0;
  drawWheel();
  document.getElementById("result").textContent = "";
  document.getElementById("resetBtn").style.display = "none";
  setTimeout(spinWheel, 300);
}

function easeOutCubic(t) {
  return (--t) * t * t + 1;
}

document.getElementById("spinBtn").addEventListener("click", spinWheel);
document.getElementById("resetBtn").addEventListener("click", resetWheel);
