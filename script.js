const gold = "#FFD700";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth / 1.4;
canvas.height = window.innerHeight / 1.5;
const cx = canvas.width * 0.6;
const cy = canvas.height * 0.5;
const R = Math.min(canvas.width, canvas.height) * 0.45;
const gap = 0.25;
const leadBlockX = canvas.width * 0.1;
const leadBlockY = cy - 50;
const img = new Image();
img.src = "assets/radiation.png";
img.onload = () => drawEverything();
let animationId;
let spawnId;
const nuclei = [];
const SPEED = 10
let foilThickness = 1;
let density = 5;
let count = foilThickness * density;
let numberOfParticles = 1;

const modelInputs = document.querySelectorAll('input[type="radio"]');
let atomicModel = Array.from(modelInputs).find((i) => i.checked).value;
modelInputs.forEach((i) =>
  i.addEventListener("change", (e) => {
    atomicModel = e.target.value;
    nuclei.length = 0;
    if (atomicModel == "nuclear") {
      createNuclei(foilThickness, foilX, foilY, foilWidth, foilHeight);
    }
  }),
);

const numberOfParticlesInput = document.getElementById("particle-count");
numberOfParticlesInput.addEventListener("change", (e) => {
  numberOfParticles = Number(e.target.value);
  clearInterval(spawnId);
  spawnId = setInterval(spawnParticle, 1000 / numberOfParticles);
});

const foilThicknessInput = document.getElementById("foil-thickness");
foilThicknessInput.addEventListener("change", (e) => {
  foilThickness = Number(e.target.value);
  count = foilThickness * density;
  nuclei.length = 0;
  createNuclei(count, foilX, foilY, foilWidth, foilHeight);
});

let particles = [];
const foilX = -20;
const foilY = -100;
const foilWidth = 100;
const foilHeight = 200;
let running = false;
const startButton = document.getElementById("start-button");

startButton.addEventListener("click", () => {
  running = !running;
  if (running) {
    animationId = requestAnimationFrame(update);
    spawnId = setInterval(spawnParticle, 1000 / numberOfParticles);
    startButton.innerText = "Pause";
  } else {
    cancelAnimationFrame(animationId);
    clearInterval(spawnId);
    animationId = null;
    spawnId = null;
    startButton.innerText = "Start";
  }
});

function drawBackground() {
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
}

function createNuclei(count, foilX, foilY, foilWidth, foilHeight) {
  for (let i = 0; i < count; i++) {
    nuclei.push({
      x: cx + foilX + Math.random() * foilWidth,
      y: cy + foilY + Math.random() * foilHeight,
    });
  }
}

function drawFoil() {
  ctx.fillStyle = gold;
  ctx.transform(1, 0.5, 0, 1, cx, cy);
  ctx.fillRect(foilX, foilY, foilWidth, foilHeight);
  ctx.fillStyle = "red";
  // nuclei.forEach((n) => ctx.fillRect(n.x - cx, n.y - cy, 2, 2));
  ctx.resetTransform();
}

function drawRing(cx, cy, R, gap) {
  const innerR = R * 0.86;
  const innerCx = cx + R * 0.08;
  const innerCy = cy;
  const startAngle = Math.PI + gap;
  const endAngle = Math.PI - gap;

  const grad = ctx.createRadialGradient(innerCx, innerCy, innerR, cx, cy, R);
  grad.addColorStop(0, "#d6efff");
  grad.addColorStop(1, "#0a8be0");

  ctx.beginPath();
  ctx.arc(cx, cy, R, startAngle, endAngle);
  ctx.arc(innerCx, innerCy, innerR, endAngle, startAngle, true);
  ctx.closePath();

  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = "#0670b5";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawLeadBlock() {
  const rectWidth = 100;
  const rectHeight = 100;

  ctx.fillStyle = "#212121";
  ctx.strokeStyle = "#0b0b0b";
  ctx.lineWidth = 3;

  ctx.rect(leadBlockX, leadBlockY, rectWidth, rectHeight);
  ctx.fill();
  ctx.stroke();

  const imgX = leadBlockX + (rectWidth - img.width) / 2;
  const imgY = leadBlockY + (rectHeight - img.height) / 2;

  ctx.drawImage(img, imgX, imgY);
}

function drawParticle(x, y) {
  ctx.beginPath();
  ctx.ellipse(x, y, 4, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#FF4500";
  ctx.fill();
}

function spawnParticle() {
  const startX = leadBlockX + 50;
  const startY = leadBlockY + 50;
  const leadBlockHeight = 100;
  particles.push({
    x: startX,
    y: startY + (Math.random() * 2 - 1) * 50,
    vx: 10,
    vy: 0,
  });
}

function updateParticles() {
  particles.forEach((p) => {
    for (const n of nuclei) {
      const dx = p.x - n.x;
      const dy = p.y - n.y;
      const d2 = dx * dx + dy * dy;
      const d = Math.sqrt(d2) + 0.001;
      if (d > 4) {
        continue;
      }
      const force = 100 / (d2 + 4);
      p.vx += (dx / d) * force;
      p.vy += (dy / d) * force;
    }
    const speedAfter = Math.hypot(p.vx, p.vy);
    p.vx *= SPEED / speedAfter;
    p.vy *= SPEED / speedAfter;
    p.x += p.vx;
    p.y += p.vy;
  });
  particles = particles.filter((p) => p.x < canvas.width);
}

function drawEverything() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawFoil();
  drawLeadBlock();
  drawRing(cx, cy, R, gap);
  particles.forEach((p) => drawParticle(p.x, p.y));
}

function update() {
  drawEverything();
  updateParticles();
  animationId = requestAnimationFrame(update);
}
if (atomicModel == "nuclear") {
  createNuclei(foilThickness, foilX, foilY, foilWidth, foilHeight);
}
