class Level {
  constructor() {
    this.width = 80;
    this.height = 20;
    this.tiles = [];
    this.candles = [];
    this.secrets = [];
    this.doors = [];
    this.spawnPoints = [];
    
    this.generate();
  }

  generate() {
    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.tiles[y][x] = { type: 'air', solid: false };
      }
    }

    this.generateCastleStructure();
    this.generatePlatforms();
    this.generateCandles();
    this.generateSecrets();
    this.placeEnemySpawns();
  }

  generateCastleStructure() {
    for (let x = 0; x < this.width; x++) {
      this.tiles[this.height - 1][x] = { type: 'stone', solid: true };
      this.tiles[this.height - 2][x] = { type: 'stone', solid: true };
    }

    for (let y = 0; y < this.height; y++) {
      this.tiles[y][0] = { type: 'wall', solid: true };
      this.tiles[y][this.width - 1] = { type: 'wall', solid: true };
    }

    const rooms = [
      { x: 0, w: 20 },
      { x: 20, w: 25 },
      { x: 45, w: 20 },
      { x: 65, w: 15 }
    ];

    rooms.forEach((room, idx) => {
      if (idx > 0) {
        for (let y = 0; y < this.height - 4; y++) {
          this.tiles[y][room.x] = { type: 'wall', solid: true };
        }
        
        const doorY = this.height - 5;
        this.tiles[doorY][room.x] = { type: 'door', solid: false };
        this.tiles[doorY - 1][room.x] = { type: 'door', solid: false };
        this.tiles[doorY - 2][room.x] = { type: 'door', solid: false };
        
        this.doors.push({ x: room.x, y: doorY });
      }

      this.generateRoomDetails(room.x + 1, room.w - 2, idx);
    });
  }

  generateRoomDetails(startX, width, roomIdx) {
    const roomConfigs = [
      { platforms: 3, maxHeight: 8 },
      { platforms: 4, maxHeight: 10 },
      { platforms: 5, maxHeight: 12 },
      { platforms: 3, maxHeight: 10 }
    ];

    const config = roomConfigs[roomIdx];
    
    for (let i = 0; i < config.platforms; i++) {
      const platY = this.height - 4 - Math.floor(Math.random() * config.maxHeight);
      const platX = startX + Math.floor(Math.random() * (width - 6));
      const platLen = 3 + Math.floor(Math.random() * 5);
      
      for (let px = 0; px < platLen && platX + px < startX + width; px++) {
        if (platY > 2 && platY < this.height - 2) {
          this.tiles[platY][platX + px] = { type: 'platform', solid: true };
        }
      }
    }

    if (roomIdx === 1) {
      for (let sy = 6; sy < 10; sy++) {
        for (let sx = startX + 8; sx < startX + 14; sx++) {
          if (this.tiles[sy][sx].type === 'air') {
            this.tiles[sy][sx] = { type: 'stairs', solid: true };
          }
        }
      }
    }
  }

  generatePlatforms() {
    const mainPlatforms = [
      { x: 5, y: 14, len: 5 },
      { x: 12, y: 11, len: 4 },
      { x: 8, y: 8, len: 6 },
      { x: 25, y: 13, len: 6 },
      { x: 30, y: 10, len: 5 },
      { x: 35, y: 7, len: 4 },
      { x: 28, y: 5, len: 8 },
      { x: 50, y: 14, len: 5 },
      { x: 55, y: 11, len: 4 },
      { x: 52, y: 8, len: 6 },
      { x: 58, y: 5, len: 5 },
      { x: 70, y: 12, len: 5 },
      { x: 72, y: 8, len: 4 }
    ];

    mainPlatforms.forEach(plat => {
      for (let i = 0; i < plat.len; i++) {
        if (plat.x + i < this.width - 1) {
          this.tiles[plat.y][plat.x + i] = { type: 'platform', solid: true };
        }
      }
    });
  }

  generateCandles() {
    const candlePositions = [];
    
    for (let x = 3; x < this.width - 3; x += 4 + Math.floor(Math.random() * 3)) {
      for (let y = 3; y < this.height - 4; y++) {
        if (this.tiles[y][x].type === 'air' && 
            (this.tiles[y + 1][x].solid || this.tiles[y][x - 1].solid || this.tiles[y][x + 1].solid)) {
          if (Math.random() < 0.4) {
            candlePositions.push({ x: x * 32 + 16, y: y * 32 + 16 });
          }
        }
      }
    }

    candlePositions.forEach(pos => {
      this.candles.push(new Candle(pos.x, pos.y));
    });
  }

  generateSecrets() {
    const secretLocations = [
      { x: 15, y: 6, type: 'wall' },
      { x: 38, y: 4, type: 'floor' },
      { x: 60, y: 10, type: 'wall' },
      { x: 75, y: 6, type: 'floor' }
    ];

    secretLocations.forEach(secret => {
      if (secret.x < this.width && secret.y < this.height) {
        this.secrets.push({
          x: secret.x,
          y: secret.y,
          type: secret.type,
          revealed: false,
          contents: this.getSecretContents()
        });
        
        if (secret.type === 'wall') {
          this.tiles[secret.y][secret.x] = { type: 'breakable', solid: true, secret: true };
        }
      }
    });
  }

  getSecretContents() {
    const items = ['meat', 'bigheart', 'money', 'whipup', 'dagger', 'axe', 'holywater'];
    return items[Math.floor(Math.random() * items.length)];
  }

  placeEnemySpawns() {
    const spawns = [
      { x: 200, y: 500, type: 'zombie' },
      { x: 350, y: 300, type: 'bat' },
      { x: 500, y: 500, type: 'skeleton' },
      { x: 700, y: 200, type: 'bat' },
      { x: 850, y: 500, type: 'zombie' },
      { x: 1000, y: 350, type: 'bat' },
      { x: 1100, y: 500, type: 'skeleton' },
      { x: 1300, y: 200, type: 'bat' },
      { x: 1500, y: 500, type: 'zombie' },
      { x: 1700, y: 300, type: 'bat' },
      { x: 1800, y: 500, type: 'skeleton' },
      { x: 2000, y: 250, type: 'bat' },
      { x: 2100, y: 500, type: 'zombie' },
      { x: 2200, y: 150, type: 'bat' },
      { x: 2350, y: 400, type: 'skeleton' }
    ];

    this.spawnPoints = spawns;
  }

  getTileAt(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return { type: 'void', solid: true };
    }
    return this.tiles[y][x];
  }

  getTilesAround(worldX, worldY) {
    const tileX = Math.floor(worldX / 32);
    const tileY = Math.floor(worldY / 32);
    const tiles = [];

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const tile = this.getTileAt(tileX + dx, tileY + dy);
        tiles.push({
          ...tile,
          x: tileX + dx,
          y: tileY + dy
        });
      }
    }

    return tiles;
  }

  breakTile(x, y, pickups) {
    const tile = this.getTileAt(x, y);
    if (tile.type === 'breakable') {
      this.tiles[y][x] = { type: 'air', solid: false };
      
      const secret = this.secrets.find(s => s.x === x && s.y === y);
      if (secret && !secret.revealed) {
        secret.revealed = true;
        pickups.push(new Pickup(x * 32 + 16, y * 32 + 16, secret.contents));
        audio.playSecretFound();
        return true;
      }
      
      particles.emitDust(x * 32 + 16, y * 32 + 16);
      return true;
    }
    return false;
  }

  draw(ctx, camera) {
    const theme = themeManager.getTheme();
    const startX = Math.floor(camera.x / 32) - 1;
    const endX = startX + Math.ceil(camera.width / 32) + 2;
    const startY = Math.floor(camera.y / 32) - 1;
    const endY = startY + Math.ceil(camera.height / 32) + 2;

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const tile = this.getTileAt(x, y);
        if (tile.type === 'air') continue;

        const screenX = x * 32 - Math.floor(camera.x);
        const screenY = y * 32 - Math.floor(camera.y);

        this.drawTile(ctx, tile, screenX, screenY, x, y, theme);
      }
    }

    this.candles.forEach(candle => candle.draw(ctx, camera));
  }

  drawTile(ctx, tile, x, y, tileX, tileY, theme) {
    const colors = theme.tileColors;
    
    switch (tile.type) {
      case 'stone':
        ctx.fillStyle = colors.stone.main;
        ctx.fillRect(x, y, 32, 32);
        ctx.fillStyle = colors.stone.dark;
        ctx.fillRect(x, y, 32, 2);
        ctx.fillRect(x, y, 2, 32);
        ctx.fillStyle = colors.stone.light;
        ctx.fillRect(x + 30, y, 2, 32);
        ctx.fillRect(x, y + 30, 32, 2);
        
        if ((tileX + tileY) % 3 === 0) {
          ctx.fillStyle = colors.stone.dark;
          ctx.fillRect(x + 8, y + 8, 4, 4);
        }
        break;

      case 'wall':
        ctx.fillStyle = colors.wall.main;
        ctx.fillRect(x, y, 32, 32);
        
        ctx.fillStyle = colors.wall.dark;
        for (let i = 0; i < 3; i++) {
          const brickY = y + i * 11;
          const offset = i % 2 === 0 ? 0 : 16;
          ctx.fillRect(x + offset, brickY, 16, 10);
          ctx.fillRect(x + offset + 17, brickY, 15 - offset, 10);
        }
        
        ctx.fillStyle = colors.wall.accent;
        ctx.fillRect(x, y, 32, 1);
        for (let i = 1; i < 3; i++) {
          ctx.fillRect(x, y + i * 11, 32, 1);
        }
        break;

      case 'platform':
        ctx.fillStyle = colors.platform.main;
        ctx.fillRect(x, y, 32, 8);
        ctx.fillStyle = colors.platform.light;
        ctx.fillRect(x, y, 32, 2);
        ctx.fillStyle = colors.platform.dark;
        ctx.fillRect(x, y + 6, 32, 2);
        
        ctx.fillStyle = colors.wall.accent;
        ctx.fillRect(x + 8, y + 2, 2, 4);
        ctx.fillRect(x + 22, y + 2, 2, 4);
        break;

      case 'breakable':
        ctx.fillStyle = colors.platform.main;
        ctx.fillRect(x, y, 32, 32);
        ctx.fillStyle = colors.platform.dark;
        ctx.fillRect(x + 4, y + 4, 10, 10);
        ctx.fillRect(x + 18, y + 4, 10, 10);
        ctx.fillRect(x + 4, y + 18, 10, 10);
        ctx.fillRect(x + 18, y + 18, 10, 10);
        
        ctx.fillStyle = theme.uiColors.accent;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(x + 14, y + 8, 4, 4);
        ctx.fillRect(x + 8, y + 20, 4, 4);
        ctx.globalAlpha = 1;
        break;

      case 'door':
        ctx.fillStyle = colors.wall.accent;
        ctx.fillRect(x, y, 32, 32);
        ctx.fillStyle = colors.wall.main;
        ctx.fillRect(x + 4, y, 24, 32);
        ctx.fillStyle = colors.wall.dark;
        ctx.fillRect(x + 4, y + 8, 10, 24);
        ctx.fillRect(x + 18, y + 8, 10, 24);
        ctx.fillStyle = theme.uiColors.accent;
        ctx.fillRect(x + 22, y + 16, 4, 4);
        break;

      case 'stairs':
        ctx.fillStyle = colors.stone.main;
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(x + i * 8, y + 24 - i * 8, 8, 8 + i * 8);
        }
        break;
    }
  }
}

class Candle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.active = true;
    this.flickerOffset = Math.random() * Math.PI * 2;
    this.dropType = this.getRandomDrop();
  }

  getRandomDrop() {
    const drops = ['heart', 'heart', 'heart', 'bigheart', 'money', 'dagger', 'axe', 'holywater', 'whipup'];
    return drops[Math.floor(Math.random() * drops.length)];
  }

  destroy(pickups) {
    if (!this.active) return;
    
    this.active = false;
    audio.playCandleBreak();
    particles.emitFire(this.x, this.y);
    
    pickups.push(new Pickup(this.x, this.y, this.dropType));
  }

  draw(ctx, camera) {
    if (!this.active) return;

    const theme = themeManager.getTheme();
    const screenX = Math.floor(this.x - camera.x);
    const screenY = Math.floor(this.y - camera.y);
    
    this.flickerOffset += 0.15;
    const flicker = Math.sin(this.flickerOffset) * 0.3 + 0.7;

    ctx.fillStyle = theme.tileColors.wall.main;
    ctx.fillRect(screenX - 4, screenY, 8, 16);
    
    ctx.fillStyle = theme.uiColors.accent;
    ctx.fillRect(screenX - 3, screenY + 2, 6, 12);
    
    ctx.fillStyle = theme.tileColors.wall.dark;
    ctx.fillRect(screenX - 1, screenY - 4, 2, 6);
    
    const flameHeight = 8 + Math.sin(this.flickerOffset * 2) * 2;
    
    const fireColor = theme.particles.fire;
    ctx.fillStyle = fireColor.replace('1)', `${flicker})`);
    ctx.beginPath();
    ctx.ellipse(screenX, screenY - 8, 4, flameHeight / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = `rgba(255, 255, 100, ${flicker * 0.8})`;
    ctx.beginPath();
    ctx.ellipse(screenX, screenY - 8, 2, flameHeight / 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}
