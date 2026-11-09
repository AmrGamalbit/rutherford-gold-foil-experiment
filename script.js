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

let particles = [];
const nuclei = [];
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
    spawnId = setInterval(spawnParticle, 1000);
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

function createNuclei(foilX, foilY, foilWidth, foilHeight) {
  for (let i = 0; i < 100; i++) {
    nuclei.push({
      x: foilX + Math.random() * foilWidth,
      y: foilY + Math.random() * foilHeight,
    });
  }
}

function drawFoil() {
  ctx.fillStyle = gold;
  ctx.translate(cx, cy);
  ctx.transform(1, 0.5, 0, 1, 0, 0);
  ctx.fillRect(foilX, foilY, foilWidth, foilHeight);
  ctx.fillStyle = "red";
  console.log(nuclei);
  nuclei.forEach((n) => ctx.fillRect(n.x, n.y, 2, 2));
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
  particles.push({ x: startX, y: startY + (Math.random() * 2 - 1) * 50 });
}

function updateParticles() {
  particles.forEach((p) => {
    p.x += 10;
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

createNuclei(foilX, foilY, foilWidth, foilHeight);
