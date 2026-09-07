// Rendering-independent rules shared by camera and pointer input.
export const WIDTH = 960;
export const HEIGHT = 600;
export const ROUND_SECONDS = 60;
export const FRUITS = [
  { name: "watermelon", color: "#f0787c", rind: "#9ecf70", points: 10 },
  { name: "orange", color: "#f7b054", rind: "#ffcc73", points: 10 },
  { name: "kiwi", color: "#b7d875", rind: "#927357", points: 10 },
  { name: "berry", color: "#b09cde", rind: "#d3b4e7", points: 10 },
  { name: "pineapple", color: "#f6d979", rind: "#d8aa50", points: 30 },
];

export function segmentHitsCircle(a, b, circle, padding = 0) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared ? Math.max(0, Math.min(1, ((circle.x - a.x) * dx + (circle.y - a.y) * dy) / lengthSquared)) : 0;
  return Math.hypot(circle.x - (a.x + t * dx), circle.y - (a.y + t * dy)) <= circle.radius + padding;
}

// Match the mirrored, cover-cropped camera image exactly, independent of camera aspect ratio.
export function cameraPoint(point, videoWidth, videoHeight) {
  const scale = Math.max(WIDTH / videoWidth, HEIGHT / videoHeight);
  const offsetX = (WIDTH - videoWidth * scale) / 2;
  const offsetY = (HEIGHT - videoHeight * scale) / 2;
  return { x: WIDTH - (point.x * videoWidth * scale + offsetX), y: point.y * videoHeight * scale + offsetY };
}

export function validSwing(previous, next, minSpeed = 180) {
  if (!previous) return false;
  const elapsed = next.time - previous.time;
  const distance = Math.hypot(next.x - previous.x, next.y - previous.y);
  // Reject camera jitter, stale detections, and reacquisition jumps across the screen.
  return elapsed > 0 && elapsed <= 350 && distance >= 7 && distance < 370 && distance / (elapsed / 1000) >= minSpeed;
}

export class FruitRound {
  constructor(random = Math.random) { this.random = random; this.reset(); }
  reset() {
    this.fruits = []; this.elapsed = 0; this.score = 0; this.sliced = 0;
    this.combo = 0; this.bestCombo = 0; this.lastSlice = -10; this.spawnIn = .2; this.nextId = 1;
  }
  spawn() {
    const count = 2 + Math.floor(this.random() * (this.elapsed > 25 ? 3 : 2));
    for (let i = 0; i < count; i++) {
      const type = Math.floor(this.random() * FRUITS.length);
      this.fruits.push({ id: this.nextId++, type, x: 155 + this.random() * 650,
        y: HEIGHT + 70 + i * 35, vx: (this.random() - .5) * 215,
        vy: -770 - this.random() * 215, radius: 34 + this.random() * 15,
        angle: this.random() * Math.PI, spin: (this.random() - .5) * 2.4, age: 0 });
    }
  }
  update(dt) {
    if (this.elapsed >= ROUND_SECONDS) return;
    dt = Math.min(Math.max(dt, 0), ROUND_SECONDS - this.elapsed);
    this.elapsed += dt;
    this.spawnIn -= dt;
    if (this.spawnIn <= 0) { this.spawn(); this.spawnIn = 1.05 + this.random() * .35; }
    for (const fruit of this.fruits) {
      fruit.x += fruit.vx * dt; fruit.y += fruit.vy * dt + 435 * dt * dt; fruit.vy += 870 * dt;
      fruit.angle += fruit.spin * dt; fruit.age += dt;
    }
    this.fruits = this.fruits.filter((f) => f.age < 5 && !(f.vy > 0 && f.y > HEIGHT + f.radius + 70));
    if (this.elapsed - this.lastSlice > .8) this.combo = 0;
  }
  slice(a, b, padding = 13) {
    if (this.elapsed >= ROUND_SECONDS) return [];
    const hits = [];
    this.fruits = this.fruits.filter((fruit) => {
      if (fruit.y > HEIGHT + fruit.radius || !segmentHitsCircle(a, b, fruit, padding)) return true;
      this.combo = this.elapsed - this.lastSlice <= .8 ? this.combo + 1 : 1;
      this.lastSlice = this.elapsed;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      const multiplier = Math.min(5, 1 + Math.floor((this.combo - 1) / 3));
      const points = FRUITS[fruit.type].points * multiplier;
      this.score += points; this.sliced++;
      hits.push({ ...fruit, points, multiplier, cutAngle: Math.atan2(b.y - a.y, b.x - a.x) });
      return false;
    });
    return hits;
  }
}
