import { WIDTH as W, HEIGHT as H, ROUND_SECONDS, FRUITS, FruitRound, cameraPoint, validSwing } from "./fruit-game-core.js";

const $ = (id) => document.getElementById(id);
const canvas = $("game-canvas"), ctx = canvas.getContext("2d"), video = $("camera-video");
const round = new FruitRound();
const colors = ["#d7efa1", "#ffb999", "#e2f4c2"];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let state = "welcome", mode = "mouse", best = 0, stream = null, worker = null;
let cameraTicket = 0, cameraReady = false, frameBusy = false, lastFrame = 0, lastVideoTime = -1;
let lastSeen = 0, tracked = 0, arms = [], hands = [null, null, null], trails = [[], [], []];
let particles = [], halves = [], labels = [], lastTick = performance.now(), countdownLeft = 0;
let pointerDown = false, pointerId = null, audio = null, soundOn = true, flash = 0;
let pixelScale = 1, worldOffsetY = 0, workerTimeout = null, frameTimeout = null;
try { best = Number(localStorage.getItem("fruit-motion-best-v1")) || 0; } catch (_) { /* Private browsing may disable storage. */ }
$("best-score").textContent = String(best);

function resize() {
  const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
  pixelScale = canvas.width / W;
  worldOffsetY = (canvas.height - H * pixelScale) / 2;
}
new ResizeObserver(resize).observe($("stage"));
function setStatus(message) { $("game-status").textContent = message; }
function clearHands() { hands = [null, null, null]; trails = [[], [], []]; arms = []; pointerDown = false; }
function show(card) {
  $("overlay").hidden = !card;
  for (const el of document.querySelectorAll(".overlay-card")) el.hidden = el.id !== card;
  $("countdown").hidden = true;
}
function hud() {
  $("score").textContent = round.score;
  $("time").innerHTML = `${Math.max(0, Math.ceil(ROUND_SECONDS - round.elapsed))}<small>s</small>`;
  $("combo").textContent = round.combo > 1 ? `${round.combo} 连切` : "✦";
  $("combo-label").textContent = round.combo > 1 ? `${Math.min(5, 1 + Math.floor((round.combo - 1) / 3))} 倍快乐` : "挥手就有惊喜";
  document.querySelector(".time-box").classList.toggle("urgent", round.elapsed >= 50);
}
function unlockSound() {
  if (!soundOn) return;
  try { audio ||= new (window.AudioContext || window.webkitAudioContext)(); audio.resume().catch(() => {}); } catch (_) { /* Game also works silently. */ }
}
function tone(frequency = 600, duration = .09, delay = 0) {
  if (!soundOn || !audio || audio.state !== "running") return;
  const oscillator = audio.createOscillator(), gain = audio.createGain(), at = audio.currentTime + delay;
  oscillator.type = "sine"; oscillator.frequency.setValueAtTime(frequency, at);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * .6, at + duration);
  gain.gain.setValueAtTime(.055, at); gain.gain.exponentialRampToValueAtTime(.001, at + duration);
  oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(at); oscillator.stop(at + duration);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
}
function startRound() {
  if (mode === "camera" && (!cameraReady || tracked === 0)) return;
  unlockSound(); round.reset(); particles = []; halves = []; labels = []; clearHands();
  state = "countdown"; countdownLeft = 3; show(null); $("countdown").hidden = false;
  $("countdown").textContent = "3"; $("pause-button").disabled = false;
  $("pause-button").textContent = "Ⅱ 暂停";
  $("mode-label").textContent = mode === "camera" ? "体感模式 · 双手开切" : "鼠标模式 · 按住拖动";
  $("stage-tip").textContent = mode === "camera" ? "双手划过水果，就能切开。" : "按住鼠标拖动，或在触屏上划动。";
  setStatus(mode === "camera" ? "跟着发光的手部圆点，划过水果。" : "按住鼠标左键拖动切水果；触屏直接划动。");
  lastSeen = performance.now(); lastTick = performance.now(); tone(420, .12); hud();
}
function pause(message = "准备好了，就继续挥挥手吧。") {
  if (state !== "playing" && state !== "countdown") return;
  state = "paused"; clearHands(); show("pause-card");
  $("pause-message").textContent = message; $("pause-button").textContent = "▶ 继续";
  $("tracking-hint").hidden = true;
}
function resume() {
  if (mode === "camera" && !cameraReady) { $("pause-message").textContent = "摄像头已断开，请重新连接，或改用鼠标开始新一局。"; return; }
  unlockSound(); state = countdownLeft > 0 ? "countdown" : "playing"; clearHands(); show(null);
  if (state === "countdown") { $("countdown").hidden = false; $("countdown").textContent = Math.ceil(countdownLeft); }
  $("pause-button").textContent = "Ⅱ 暂停"; lastSeen = performance.now(); lastTick = performance.now();
}
function finish() {
  state = "result"; show("result-card"); clearHands(); $("pause-button").disabled = true;
  $("result-score").textContent = round.score;
  $("result-detail").textContent = `切开 ${round.sliced} 个水果 · 最高 ${round.bestCombo} 连切`;
  if (round.score > best) {
    best = round.score; $("best-score").textContent = best;
    try { localStorage.setItem("fruit-motion-best-v1", String(best)); } catch (_) { /* Optional persistence. */ }
    setStatus("新纪录！给自己一个大大的赞。");
  } else setStatus("挑战完成！休息一下，或者再来一局。");
  tone(523, .2); tone(659, .2, .13); tone(784, .25, .26);
}

function cut(a, b) {
  if (state !== "playing") return;
  const hits = round.slice(a, b);
  for (const hit of hits) {
    for (const side of [-1, 1]) halves.push({ ...hit, side, x: hit.x, y: hit.y,
      vx: Math.cos(hit.cutAngle + Math.PI / 2) * side * 145 + hit.vx * .4,
      vy: Math.sin(hit.cutAngle + Math.PI / 2) * side * 120 - 130,
      angle: hit.cutAngle, spin: side * 1.9, life: .95 });
    for (let i = 0; i < (reducedMotion ? 6 : 17); i++) {
      const angle = Math.random() * Math.PI * 2, speed = 80 + Math.random() * 240;
      particles.push({ x: hit.x, y: hit.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 80,
        color: FRUITS[hit.type].color, size: 3 + Math.random() * 6, life: .5 + Math.random() * .35 });
    }
    labels.push({ x: hit.x, y: hit.y - 45, text: `+${hit.points}`, life: .8 });
    tone(550 + Math.min(round.combo, 12) * 55, .095);
  }
  if (hits.length) { flash = .09; hud(); }
  particles = particles.slice(-220); halves = halves.slice(-70); labels = labels.slice(-20);
}

function acceptHand(index, next, allowCut = true) {
  const previous = hands[index];
  const continuous = previous && next.time - previous.time < 350 && Math.hypot(next.x - previous.x, next.y - previous.y) < 370;
  if (index < 2 && continuous) { next.x = previous.x * .2 + next.x * .8; next.y = previous.y * .2 + next.y * .8; }
  if (!continuous) trails[index] = [];
  if (allowCut && validSwing(previous, next, index === 2 ? 20 : Number($("sensitivity").value))) cut(previous, next);
  hands[index] = next; trails[index].push({ ...next, born: performance.now() });
  trails[index] = trails[index].slice(-16);
}
function receivePose(landmarks, timestamp) {
  tracked = 0; arms = [];
  for (let side = 0; side < 2; side++) {
    const wrist = landmarks[15 + side], elbow = landmarks[13 + side], shoulder = landmarks[11 + side];
    const visible = (p) => p && p.visibility > .55 && (p.presence ?? 1) > .5 && p.x > -.05 && p.x < 1.05 && p.y > -.05 && p.y < 1.05;
    if (visible(wrist)) {
      const point = cameraPoint(wrist, video.videoWidth, video.videoHeight);
      if (point.x < 0 || point.x > W || point.y < 0 || point.y > H) { hands[side] = null; trails[side] = []; continue; }
      tracked++;
      acceptHand(side, { ...point, time: timestamp }, mode === "camera");
      const points = [shoulder, elbow, wrist].filter(visible).map((p) => cameraPoint(p, video.videoWidth, video.videoHeight));
      if (points.length > 1) arms.push({ side, points });
    } else { hands[side] = null; trails[side] = []; }
  }
  if (tracked) lastSeen = performance.now();
  $("camera-state").textContent = tracked === 2 ? "双手已识别 ✓" : tracked === 1 ? "已识别一只手" : "寻找手臂中…";
  if (state === "calibration") {
    $("round-start").disabled = !tracked;
    $("round-start").textContent = tracked ? "准备好了，开始挑战 →" : "找到你的手，马上开切";
    $("calibration-message").textContent = tracked ? "挥挥手，检查圆点是否跟着你的手移动。" : "让肩膀和双手进入画面，稍微退后一点。";
  }
}
function stopCamera() {
  cameraTicket++; cameraReady = false; frameBusy = false; tracked = 0;
  clearTimeout(workerTimeout); clearTimeout(frameTimeout);
  if (worker) worker.terminate(); worker = null;
  if (stream) stream.getTracks().forEach((track) => { track.onended = null; track.stop(); });
  stream = null; video.srcObject = null; clearHands();
  $("camera-stop").disabled = true; $("camera-state").textContent = "摄像头未开启";
  $("tracking-hint").hidden = true;
}
function cameraError(message) {
  const active = state === "playing" || state === "countdown" || state === "paused";
  if (active) pause(message);
  stopCamera(); $("camera-retry").hidden = false;
  if (active) { state = "paused"; show("pause-card"); $("pause-message").textContent = message; }
  else { state = "welcome"; show("welcome-card"); }
  setStatus(message); $("camera-state").textContent = "摄像头未连接";
}
async function enableCamera() {
  unlockSound(); stopCamera(); const ticket = cameraTicket;
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
    cameraError("摄像头需要 HTTPS 或 localhost。请用本地启动命令打开，或先用鼠标试玩。"); return;
  }
  mode = "camera"; state = "loading"; show("loading-card");
  $("loading-message").textContent = "请在浏览器提示中允许使用摄像头。";
  $("camera-retry").hidden = true; $("pause-button").disabled = true;
  setStatus("等待摄像头授权；画面不会被录制或上传。");
  try {
    const acquired = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 24, max: 30 } }, audio: false });
    if (ticket !== cameraTicket) { acquired.getTracks().forEach((t) => t.stop()); return; }
    stream = acquired; video.srcObject = acquired;
    stream.getVideoTracks().forEach((track) => { track.onended = () => cameraError("摄像头已断开。请重新连接，或改用鼠标开始新一局。"); });
    await video.play();
    if (ticket !== cameraTicket) return;
    $("camera-stop").disabled = false;
    $("loading-message").textContent = "正在加载本地手臂识别模型，首次打开需要一点时间…";
    $("camera-state").textContent = "正在加载识别模型…";
    if (!window.Worker || !window.OffscreenCanvas || !window.createImageBitmap) throw new Error("unsupported");
    worker = new Worker(new URL("./fruit-pose-worker.js", import.meta.url));
    workerTimeout = setTimeout(() => { if (ticket === cameraTicket) cameraError("识别模型加载超时，请重新连接。也可以先用鼠标试玩。"); }, 60000);
    worker.onerror = (event) => { console.error("Pose worker", event.message); if (ticket === cameraTicket) cameraError("识别程序无法启动，请使用新版 Chrome 或 Edge，或改用鼠标试玩。"); };
    worker.onmessage = ({ data }) => {
      if (ticket !== cameraTicket) return;
      if (data.type === "ready") {
        clearTimeout(workerTimeout); cameraReady = true; frameBusy = false; lastVideoTime = -1;
        state = "calibration"; show("calibration-card"); lastSeen = performance.now();
        $("round-start").disabled = true; $("mode-label").textContent = "体感模式 · 站好位置";
        setStatus("先试着挥动双手，看到圆点后点击开始挑战。");
      } else if (data.type === "result") {
        clearTimeout(frameTimeout); frameBusy = false;
        if (performance.now() - data.time < 800) receivePose(data.landmarks, data.time);
      } else if (data.type === "error") {
        console.error("Pose recognition", data.message);
        cameraError("手臂识别暂时不可用，请重新连接摄像头，或用鼠标试玩。");
      }
    };
    worker.postMessage({ type: "init" });
  } catch (error) {
    if (ticket !== cameraTicket) return;
    const messages = { NotAllowedError: "没有获得摄像头权限。可在地址栏允许摄像头后重试，或先用鼠标试玩。", NotFoundError: "没有找到摄像头。请连接摄像头，或先用鼠标试玩。", NotReadableError: "摄像头可能正被其他应用占用。关闭占用它的应用后重试。" };
    cameraError(messages[error.name] || "无法开启摄像头识别。请使用新版 Chrome 或 Edge，或先用鼠标试玩。");
  }
}
async function sendFrame(now) {
  if (!cameraReady || frameBusy || document.hidden || !worker || video.readyState < 2 || now - lastFrame < 75 || video.currentTime === lastVideoTime) return;
  frameBusy = true; lastFrame = now; lastVideoTime = video.currentTime;
  const ticket = cameraTicket, target = worker;
  try {
    const bitmap = await createImageBitmap(video);
    if (ticket !== cameraTicket || target !== worker) { bitmap.close(); return; }
    target.postMessage({ type: "frame", bitmap, time: now }, [bitmap]);
    frameTimeout = setTimeout(() => { if (ticket === cameraTicket) cameraError("识别暂时没有响应。请重新连接摄像头，或用鼠标试玩。"); }, 10000);
  } catch (error) { if (ticket === cameraTicket) cameraError("无法读取摄像头画面，请重新连接后再试。"); }
}

function mouseMode() { stopCamera(); mode = "mouse"; $("camera-retry").hidden = false; startRound(); }
function pointerPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * canvas.width / rect.width / pixelScale,
    y: ((event.clientY - rect.top) * canvas.height / rect.height - worldOffsetY) / pixelScale,
    time: performance.now() };
}
canvas.addEventListener("pointerdown", (event) => {
  if (mode !== "mouse" || state !== "playing" || (event.pointerType === "mouse" && event.button !== 0)) return;
  pointerDown = true; pointerId = event.pointerId; canvas.setPointerCapture(event.pointerId);
  acceptHand(2, pointerPoint(event), false); unlockSound(); event.preventDefault();
});
canvas.addEventListener("pointermove", (event) => { if (pointerDown && event.pointerId === pointerId && state === "playing") acceptHand(2, pointerPoint(event)); });
for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) canvas.addEventListener(type, () => { pointerDown = false; pointerId = null; hands[2] = null; });

function circle(x, y, radius, fill) { ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
function leaf(x, y, size, angle = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.beginPath();
  ctx.moveTo(0, 0); ctx.quadraticCurveTo(size, -size * .9, size * 1.5, 0); ctx.quadraticCurveTo(size, size * .7, 0, 0);
  ctx.fillStyle = "#8db779"; ctx.fill(); ctx.restore();
}
function drawFruit(fruit, half = false) {
  const { radius: r, type } = fruit, info = FRUITS[type];
  ctx.save(); ctx.translate(fruit.x, fruit.y); ctx.rotate(fruit.angle);
  if (half) { ctx.beginPath(); ctx.rect(-r - 8, fruit.side < 0 ? -r - 30 : 0, r * 2 + 16, r + 30); ctx.clip(); }
  ctx.shadowColor = "#0b1c2545"; ctx.shadowBlur = 17; ctx.shadowOffsetY = 9;
  circle(0, 0, r, info.rind); ctx.shadowColor = "transparent";
  circle(0, 0, r - 5, info.color);
  if (type === 0) {
    circle(0, 0, r - 8, "#ee817f");
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.save(); ctx.translate(Math.cos(a) * r * .55, Math.sin(a) * r * .55); ctx.rotate(a); ctx.fillStyle = "#613e4b"; ctx.beginPath(); ctx.ellipse(0, 0, 2.4, 4.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  } else if (type === 1) {
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.strokeStyle = "#ffe0a0"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 7, Math.sin(a) * 7); ctx.lineTo(Math.cos(a) * (r - 11), Math.sin(a) * (r - 11)); ctx.stroke(); }
    circle(0, 0, 6, "#ffe7ad");
  } else if (type === 2) {
    circle(0, 0, r * .36, "#eef0b6");
    for (let i = 0; i < 13; i++) { const a = i * Math.PI * 2 / 13; circle(Math.cos(a) * r * .51, Math.sin(a) * r * .51, 2.1, "#536541"); }
  } else if (type === 3) {
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; circle(Math.cos(a) * r * .48, Math.sin(a) * r * .48, r * .3, i % 2 ? "#ae8dcc" : "#bea0df"); }
    circle(0, 0, r * .29, "#c8ace6");
  } else {
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r - 6, 0, Math.PI * 2); ctx.clip(); ctx.strokeStyle = "#d9a949"; ctx.lineWidth = 1.5;
    for (let n = -r * 2; n < r * 2; n += 18) { ctx.beginPath(); ctx.moveTo(n - r, -r); ctx.lineTo(n + r, r); ctx.moveTo(n + r, -r); ctx.lineTo(n - r, r); ctx.stroke(); }
    ctx.restore();
  }
  if (type !== 0 && type !== 2) {
    leaf(-1, -r + 4, r * .6, -.5); leaf(2, -r + 3, r * .4, -2.2);
    if (type === 4) leaf(0, -r, r * .8, -1.5);
  }
  ctx.globalAlpha *= .3; ctx.beginPath(); ctx.ellipse(-r * .33, -r * .38, r * .16, r * .28, .6, 0, Math.PI * 2); ctx.fillStyle = "#fffde5"; ctx.fill();
  ctx.restore();
}
function background(now) {
  ctx.fillStyle = "#172f2c"; ctx.fillRect(0, 0, W, H);
  const gradient = ctx.createRadialGradient(W * .5, H * .4, 5, W * .5, H * .4, W * .65);
  gradient.addColorStop(0, "#2b5142"); gradient.addColorStop(1, "#132b29"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#a3bd8530"; ctx.lineWidth = 1;
  for (const [x, y, r] of [[140, 200, 99], [810, 320, 130], [490, 330, 240]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); }
  for (let i = 0; i < 33; i++) {
    const x = (i * 157 + 49) % W, y = (i * 97 + 39) % H;
    circle(x, y, i % 4 === 0 ? 2 : 1, `rgba(200,220,165,${.12 + .11 * Math.sin(now / 1500 + i)})`);
  }
  for (let i = 0; i < 8; i++) { ctx.save(); ctx.globalAlpha = .18; leaf(i * 154 - 40, H + 10, 100, -1.4 - (i % 3) * .4); ctx.restore(); }
}
function paint(now, dt) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = "#172f2c"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(pixelScale, 0, 0, pixelScale, 0, worldOffsetY); background(now);
  if (cameraReady && $("show-camera").checked && video.readyState >= 2) {
    const scale = Math.max(W / video.videoWidth, H / video.videoHeight);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); ctx.globalAlpha = .46;
    ctx.translate(W, 0); ctx.scale(-1, 1);
    ctx.drawImage(video, (W - video.videoWidth * scale) / 2, (H - video.videoHeight * scale) / 2, video.videoWidth * scale, video.videoHeight * scale); ctx.restore();
  }
  if (["welcome", "loading", "result"].includes(state)) {
    const positions = [[137, 179, 52, 0], [811, 154, 47, 1], [112, 412, 47, 2], [822, 406, 51, 4], [220, 499, 30, 3], [738, 502, 27, 0]];
    for (const [x, y, radius, type] of positions) drawFruit({ x, y: y + (reducedMotion ? 0 : Math.sin(now / 1400 + type) * 13), radius, type, angle: -.3 + type * .16 });
    ctx.save(); ctx.strokeStyle = "#c1db9a"; ctx.globalAlpha = .28; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(54, 440); ctx.bezierCurveTo(81, 333, 208, 365, 209, 203); ctx.stroke(); ctx.restore();
  } else round.fruits.forEach((fruit) => drawFruit(fruit));
  const moving = state === "playing";
  if (moving) {
    for (const half of halves) { half.x += half.vx * dt; half.y += half.vy * dt; half.vy += 570 * dt; half.angle += half.spin * dt; half.life -= dt; }
    for (const p of particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 350 * dt; p.life -= dt; }
    for (const label of labels) { label.y -= 65 * dt; label.life -= dt; }
  }
  halves = halves.filter((h) => h.life > 0); particles = particles.filter((p) => p.life > 0); labels = labels.filter((p) => p.life > 0);
  for (const half of halves) { ctx.save(); ctx.globalAlpha = Math.min(1, half.life * 2); drawFruit(half, true); ctx.restore(); }
  for (const p of particles) { ctx.save(); ctx.globalAlpha = Math.min(1, p.life * 2); circle(p.x, p.y, p.size, p.color); ctx.restore(); }
  for (const label of labels) { ctx.save(); ctx.globalAlpha = Math.min(1, label.life * 2); ctx.fillStyle = "#ffefb6"; ctx.font = "bold 29px sans-serif"; ctx.textAlign = "center"; ctx.fillText(label.text, label.x, label.y); ctx.restore(); }
  if (mode === "camera" && cameraReady && now - lastSeen < 350) {
    for (const arm of arms) { ctx.save(); ctx.strokeStyle = colors[arm.side]; ctx.globalAlpha = .3; ctx.lineWidth = 3; ctx.setLineDash([6, 10]); ctx.beginPath(); arm.points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.restore(); }
  }
  for (let i = 0; i < 3; i++) {
    trails[i] = trails[i].filter((p) => now - p.born < 260);
    const trail = trails[i];
    if (trail.length > 1) {
      for (let n = 1; n < trail.length; n++) {
        ctx.save(); ctx.lineCap = "round"; ctx.strokeStyle = colors[i]; ctx.globalAlpha = n / trail.length * .7;
        ctx.shadowColor = colors[i]; ctx.shadowBlur = reducedMotion ? 0 : 15; ctx.lineWidth = 2 + n / trail.length * 8;
        ctx.beginPath(); ctx.moveTo(trail[n - 1].x, trail[n - 1].y); ctx.lineTo(trail[n].x, trail[n].y); ctx.stroke(); ctx.restore();
      }
    }
    if (hands[i] && now - hands[i].time < 350) {
      const p = hands[i]; ctx.save(); ctx.shadowColor = colors[i]; ctx.shadowBlur = reducedMotion ? 0 : 22;
      circle(p.x, p.y, 11, colors[i]); circle(p.x, p.y, 4, "#ffffef"); ctx.restore();
    }
  }
  if (flash > 0) { flash -= dt; if (!reducedMotion) { ctx.fillStyle = `rgba(240,235,166,${Math.max(0, flash) * .3})`; ctx.fillRect(0, 0, W, H); } }
}
function tick(now) {
  // Use real elapsed time for the round; limit only cosmetic particle updates.
  const dt = Math.max(0, (now - lastTick) / 1000); lastTick = now;
  if (!document.hidden) {
    sendFrame(now);
    if (state === "countdown") {
      const before = Math.ceil(countdownLeft); countdownLeft = Math.max(0, countdownLeft - dt);
      $("countdown").textContent = Math.ceil(countdownLeft) || "开切！";
      if (Math.ceil(countdownLeft) !== before) tone(500, .1);
      if (countdownLeft === 0) { state = "playing"; $("countdown").hidden = true; lastSeen = now; }
    }
    if (state === "playing") {
      if (mode === "camera" && now - lastSeen > 3000) pause("暂时看不到你的手。回到画面里，再点击继续，时间会等你。");
      else { round.update(dt); hud(); if (round.elapsed >= ROUND_SECONDS) finish(); }
    }
    const missing = state === "playing" && mode === "camera" && now - lastSeen > 700;
    $("tracking-hint").hidden = !missing;
    if (missing) $("tracking-hint").textContent = "让双手回到画面里，露出肩膀和手肘。";
    paint(now, Math.min(dt, .05));
  }
  requestAnimationFrame(tick);
}

$("camera-start").addEventListener("click", enableCamera);
$("camera-retry").addEventListener("click", enableCamera);
for (const id of ["mouse-start", "loading-mouse", "calibration-mouse", "pause-mouse"]) $(id).addEventListener("click", mouseMode);
$("round-start").addEventListener("click", startRound);
$("again-button").addEventListener("click", () => {
  if (mode === "camera") { state = "calibration"; show("calibration-card"); $("round-start").disabled = !tracked; }
  else startRound();
});
$("home-button").addEventListener("click", () => { stopCamera(); state = "welcome"; show("welcome-card"); round.reset(); hud(); $("mode-label").textContent = "准备开切"; setStatus("准备好一小块可以自由挥手的空间。"); });
$("pause-button").addEventListener("click", () => state === "paused" ? resume() : pause());
$("resume-button").addEventListener("click", resume);
$("camera-stop").addEventListener("click", () => {
  if (["playing", "countdown", "paused"].includes(state)) cameraError("摄像头已关闭。可重新连接，或改用鼠标开始新一局。");
  else { stopCamera(); state = "welcome"; show("welcome-card"); setStatus("摄像头已关闭。可以重新开启，或用鼠标试玩。"); }
});
$("sound-button").addEventListener("click", () => {
  soundOn = !soundOn; $("sound-button").textContent = soundOn ? "♪ 音效开" : "♪ 音效关";
  $("sound-button").setAttribute("aria-pressed", String(soundOn)); $("sound-button").setAttribute("aria-label", soundOn ? "关闭音效" : "开启音效");
  if (soundOn) unlockSound();
});
$("fullscreen-button").addEventListener("click", async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.querySelector(".game-shell").requestFullscreen(); }
  catch (_) { setStatus("当前浏览器不支持全屏，普通窗口也可以玩。"); }
});
document.addEventListener("keydown", (event) => {
  if (event.code !== "Space" || event.repeat || /BUTTON|INPUT|SELECT|TEXTAREA|A/.test(event.target.tagName)) return;
  if (["playing", "countdown", "paused"].includes(state)) { event.preventDefault(); state === "paused" ? resume() : pause(); }
});
document.addEventListener("visibilitychange", () => { if (document.hidden) pause("你刚刚切换了窗口。游戏已暂停，准备好再继续。"); lastTick = performance.now(); });
window.addEventListener("pagehide", () => { pause(); stopCamera(); if (audio) audio.suspend(); });
window.addEventListener("pageshow", (event) => { if (event.persisted && mode === "camera") $("camera-retry").hidden = false; });
resize(); hud(); requestAnimationFrame(tick);
