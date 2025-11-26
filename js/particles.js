class Particle {
  constructor(x, y, vx, vy, color, size, life, gravity = 0.2) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.life = life;
    this.maxLife = life;
    this.gravity = gravity;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life--;
    return this.life > 0;
  }

  draw(ctx) {
    const alpha = this.life / this.maxLife;
    ctx.fillStyle = this.color.replace('1)', `${alpha})`);
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count, options = {}) {
    const {
      color = 'rgba(255, 100, 50, 1)',
      minSpeed = 1,
      maxSpeed = 4,
      minSize = 2,
      maxSize = 4,
      minLife = 20,
      maxLife = 40,
      gravity = 0.2,
      spread = Math.PI * 2,
      angle = -Math.PI / 2
    } = options;

    for (let i = 0; i < count; i++) {
      const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
      const dir = angle - spread / 2 + Math.random() * spread;
      const vx = Math.cos(dir) * speed;
      const vy = Math.sin(dir) * speed;
      const size = minSize + Math.random() * (maxSize - minSize);
      const life = minLife + Math.random() * (maxLife - minLife);
      
      this.particles.push(new Particle(x, y, vx, vy, color, size, life, gravity));
    }
  }

  emitFire(x, y) {
    this.emit(x, y, 8, {
      color: 'rgba(255, 150, 50, 1)',
      minSpeed: 1,
      maxSpeed: 3,
      gravity: -0.1,
      spread: Math.PI / 2,
      angle: -Math.PI / 2,
      minLife: 15,
      maxLife: 30
    });
    this.emit(x, y, 4, {
      color: 'rgba(255, 50, 0, 1)',
      minSpeed: 0.5,
      maxSpeed: 2,
      gravity: -0.05,
      spread: Math.PI / 3,
      angle: -Math.PI / 2,
      minLife: 10,
      maxLife: 20
    });
  }

  emitBlood(x, y) {
    this.emit(x, y, 12, {
      color: 'rgba(180, 0, 0, 1)',
      minSpeed: 2,
      maxSpeed: 5,
      gravity: 0.3,
      spread: Math.PI,
      angle: -Math.PI / 2,
      minLife: 20,
      maxLife: 40
    });
  }

  emitDust(x, y) {
    this.emit(x, y, 6, {
      color: 'rgba(100, 80, 60, 1)',
      minSpeed: 0.5,
      maxSpeed: 2,
      gravity: 0.05,
      spread: Math.PI,
      angle: -Math.PI / 2,
      minLife: 15,
      maxLife: 30,
      minSize: 2,
      maxSize: 4
    });
  }

  emitSparkle(x, y) {
    this.emit(x, y, 10, {
      color: 'rgba(255, 215, 0, 1)',
      minSpeed: 1,
      maxSpeed: 3,
      gravity: 0,
      spread: Math.PI * 2,
      minLife: 20,
      maxLife: 40,
      minSize: 1,
      maxSize: 3
    });
  }

  update() {
    this.particles = this.particles.filter(p => p.update());
  }

  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }
}

const particles = new ParticleSystem();
