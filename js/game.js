class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 800;
    this.canvas.height = 600;
    
    this.ctx.imageSmoothingEnabled = false;
    
    this.gameState = 'title';
    this.keys = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      attack: false,
      subweapon: false
    };
    
    this.player = null;
    this.level = null;
    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    
    this.camera = {
      x: 0,
      y: 0,
      width: 800,
      height: 600
    };

    this.backgroundLayers = [];
    this.setupBackgrounds();
    
    this.setupEventListeners();
    this.gameLoop();
  }

  setupBackgrounds() {
    this.backgroundLayers = [
      { speed: 0.1 },
      { speed: 0.2 },
      { speed: 0.3 }
    ];
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    
    document.getElementById('startBtn').addEventListener('click', () => this.startGame());
    document.getElementById('controlsBtn').addEventListener('click', () => ui.showControls());
    document.getElementById('backBtn').addEventListener('click', () => ui.hideControls());
    document.getElementById('themeBtn').addEventListener('click', () => ui.showThemes());
    document.getElementById('themeBackBtn').addEventListener('click', () => ui.hideThemes());
    document.getElementById('retryBtn').addEventListener('click', () => this.startGame());
  }

  handleKeyDown(e) {
    if (this.gameState === 'title' && e.key === 'Enter') {
      this.startGame();
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'arrowleft':
      case 'a':
        this.keys.left = true;
        break;
      case 'arrowright':
      case 'd':
        this.keys.right = true;
        break;
      case 'arrowup':
      case 'w':
        this.keys.up = true;
        break;
      case 'arrowdown':
      case 's':
        this.keys.down = true;
        break;
      case ' ':
        this.keys.jump = true;
        e.preventDefault();
        break;
      case 'z':
        this.keys.attack = true;
        break;
      case 'x':
        this.keys.subweapon = true;
        break;
      case 't':
        if (this.gameState === 'playing') {
          const theme = themeManager.nextTheme();
          ui.showThemeToast(theme.name);
        }
        break;
    }
  }

  handleKeyUp(e) {
    switch (e.key.toLowerCase()) {
      case 'arrowleft':
      case 'a':
        this.keys.left = false;
        break;
      case 'arrowright':
      case 'd':
        this.keys.right = false;
        break;
      case 'arrowup':
      case 'w':
        this.keys.up = false;
        break;
      case 'arrowdown':
      case 's':
        this.keys.down = false;
        break;
      case ' ':
        this.keys.jump = false;
        break;
      case 'z':
        this.keys.attack = false;
        break;
      case 'x':
        this.keys.subweapon = false;
        break;
    }
  }

  startGame() {
    audio.init();
    
    this.level = new Level();
    this.player = new Player(100, 500);
    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    
    this.spawnInitialEnemies();
    
    this.gameState = 'playing';
    ui.startGame();
  }

  spawnInitialEnemies() {
    this.level.spawnPoints.forEach(spawn => {
      this.enemies.push(new Enemy(spawn.x, spawn.y, spawn.type));
    });
  }

  update() {
    if (this.gameState !== 'playing') return;

    this.player.update(
      this.keys,
      this.level,
      this.enemies,
      this.projectiles,
      this.level.candles,
      this.pickups
    );

    this.updateCamera();

    this.enemies.forEach(enemy => {
      enemy.update(this.player, this.level, this.projectiles);
    });
    this.enemies = this.enemies.filter(e => e.active);

    this.projectiles.forEach(proj => proj.update(this.level));
    this.projectiles = this.projectiles.filter(p => p.active);

    for (const proj of this.projectiles) {
      if (proj.friendly) {
        for (const enemy of this.enemies) {
          if (!enemy.active) continue;
          
          const dx = Math.abs(proj.x - enemy.x);
          const dy = Math.abs(proj.y - (enemy.y - enemy.height / 2));
          
          if (dx < (proj.width + enemy.width) / 2 && 
              dy < (proj.height + enemy.height) / 2) {
            const killed = enemy.takeDamage(proj.damage, proj.vx > 0 ? 1 : -1);
            if (killed) {
              this.player.score += this.player.getEnemyScore(enemy.type);
              this.player.spawnEnemyDrop(enemy, this.pickups);
            }
            proj.active = false;
            break;
          }
        }
      }
    }

    this.pickups.forEach(pickup => pickup.update(this.level));
    this.pickups = this.pickups.filter(p => p.active);

    particles.update();

    this.checkWhipBreakables();

    ui.update(this.player);

    if (this.player.health <= 0) {
      this.gameOver();
    }
  }

  checkWhipBreakables() {
    const whipHitbox = this.player.getWhipHitbox();
    if (!whipHitbox) return;

    const tileX = Math.floor(whipHitbox.x / 32);
    const tileY = Math.floor(whipHitbox.y / 32);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        this.level.breakTile(tileX + dx, tileY + dy, this.pickups);
      }
    }
  }

  updateCamera() {
    const targetX = this.player.x - this.camera.width / 2;
    const targetY = this.player.y - this.camera.height / 2;
    
    this.camera.x += (targetX - this.camera.x) * 0.1;
    this.camera.y += (targetY - this.camera.y) * 0.1;
    
    this.camera.x = Math.max(0, Math.min(this.level.width * 32 - this.camera.width, this.camera.x));
    this.camera.y = Math.max(0, Math.min(this.level.height * 32 - this.camera.height, this.camera.y));
  }

  gameOver() {
    this.gameState = 'gameover';
    ui.showGameOver(this.player.score);
  }

  render() {
    const theme = themeManager.getTheme();
    
    ctx.fillStyle = `rgb(${theme.background.r}, ${theme.background.g}, ${theme.background.b})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gameState === 'playing' || this.gameState === 'gameover') {
      this.drawBackground();
      this.level.draw(this.ctx, this.camera);
      
      this.pickups.forEach(pickup => pickup.draw(this.ctx, this.camera));
      
      this.enemies.forEach(enemy => {
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        enemy.draw(this.ctx);
        this.ctx.restore();
      });
      
      this.projectiles.forEach(proj => {
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        proj.draw(this.ctx);
        this.ctx.restore();
      });
      
      this.player.draw(this.ctx, this.camera);
      
      this.ctx.save();
      this.ctx.translate(-this.camera.x, -this.camera.y);
      particles.draw(this.ctx);
      this.ctx.restore();

      ui.drawMinimap(this.ctx, this.level, this.player, this.camera);
      
      themeManager.applyPostProcess(this.ctx, this.canvas);
    }
  }

  drawBackground() {
    const theme = themeManager.getTheme();
    const time = Date.now() / 1000;
    
    for (let i = 0; i < 50; i++) {
      const x = (Math.sin(i * 0.5 + time * 0.1) * 0.5 + 0.5) * this.canvas.width;
      const y = (Math.cos(i * 0.7 + time * 0.05) * 0.5 + 0.5) * this.canvas.height;
      const alpha = 0.1 + Math.sin(i + time) * 0.05;
      
      ctx.fillStyle = theme.tileColors.wall.main.replace('#', 'rgba(') + `, ${alpha})`;
      this.ctx.fillStyle = `rgba(${theme.background.r + 40}, ${theme.background.g + 20}, ${theme.background.b + 10}, ${alpha})`;
      this.ctx.fillRect(x, y, 2, 2);
    }

    this.ctx.fillStyle = `rgba(${theme.background.r + 30}, ${theme.background.g + 15}, ${theme.background.b + 10}, 0.3)`;
    for (let i = 0; i < 3; i++) {
      const offset = -this.camera.x * this.backgroundLayers[i].speed;
      for (let x = offset % 200 - 200; x < this.canvas.width + 200; x += 200) {
        this.ctx.fillRect(x, 100 + i * 50, 40, 200 - i * 30);
        this.ctx.fillRect(x + 80, 80 + i * 60, 30, 220 - i * 40);
      }
    }

    if (Math.random() < 0.01) {
      this.ctx.fillStyle = `rgba(255, 255, 200, 0.8)`;
      const flashX = Math.random() * this.canvas.width;
      this.ctx.fillRect(flashX, 0, 2, this.canvas.height * 0.3);
    }
  }

  gameLoop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }
}

const ctx = document.getElementById('gameCanvas').getContext('2d');

window.addEventListener('load', () => {
  new Game();
});
