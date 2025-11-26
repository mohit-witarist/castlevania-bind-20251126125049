class Enemy {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.vx = 0;
    this.vy = 0;
    this.width = 24;
    this.height = 32;
    this.health = 1;
    this.maxHealth = 1;
    this.damage = 1;
    this.active = true;
    this.direction = 1;
    this.animFrame = 0;
    this.animTimer = 0;
    this.invulnerable = 0;
    this.knockback = 0;
    this.gravity = 0.5;
    this.onGround = false;
    
    this.setupType();
  }

  setupType() {
    switch (this.type) {
      case 'bat':
        this.width = 20;
        this.height = 16;
        this.health = 1;
        this.maxHealth = 1;
        this.damage = 1;
        this.flyHeight = this.y;
        this.flyOffset = Math.random() * Math.PI * 2;
        this.speed = 1.5;
        this.gravity = 0;
        break;
      case 'skeleton':
        this.width = 24;
        this.height = 40;
        this.health = 3;
        this.maxHealth = 3;
        this.damage = 2;
        this.speed = 0.8;
        this.attackCooldown = 0;
        this.throwBone = false;
        break;
      case 'zombie':
        this.width = 24;
        this.height = 40;
        this.health = 4;
        this.maxHealth = 4;
        this.damage = 2;
        this.speed = 0.4;
        break;
    }
  }

  update(player, level, projectiles) {
    if (!this.active) return;

    if (this.invulnerable > 0) this.invulnerable--;
    if (this.knockback > 0) {
      this.x += this.knockback;
      this.knockback *= 0.8;
      if (Math.abs(this.knockback) < 0.1) this.knockback = 0;
    }

    this.animTimer++;
    if (this.animTimer > 10) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }

    switch (this.type) {
      case 'bat':
        this.updateBat(player);
        break;
      case 'skeleton':
        this.updateSkeleton(player, level, projectiles);
        break;
      case 'zombie':
        this.updateZombie(player, level);
        break;
    }
  }

  updateBat(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 200) {
      this.vx += (dx / dist) * 0.1;
      this.vy += (dy / dist) * 0.1;
    } else {
      this.flyOffset += 0.05;
      this.vy = Math.sin(this.flyOffset) * 0.5;
      this.vx = Math.cos(this.flyOffset * 0.5) * this.speed;
    }

    this.vx = Math.max(-2, Math.min(2, this.vx));
    this.vy = Math.max(-2, Math.min(2, this.vy));

    this.x += this.vx;
    this.y += this.vy;

    this.direction = this.vx > 0 ? 1 : -1;
  }

  updateSkeleton(player, level, projectiles) {
    this.vy += this.gravity;
    
    const dx = player.x - this.x;
    const dist = Math.abs(dx);

    if (dist < 250 && dist > 100) {
      this.direction = dx > 0 ? 1 : -1;
      this.vx = this.direction * this.speed;
    } else if (dist <= 100) {
      this.vx = 0;
      if (this.attackCooldown <= 0) {
        this.attackCooldown = 90;
        projectiles.push(new Projectile(
          this.x + this.direction * 20,
          this.y + 10,
          this.direction * 4,
          -2,
          'bone'
        ));
        audio.playSubweapon();
      }
    } else {
      this.vx = this.direction * this.speed * 0.5;
    }

    if (this.attackCooldown > 0) this.attackCooldown--;

    this.x += this.vx;
    this.y += this.vy;

    this.handleCollisions(level);
  }

  updateZombie(player, level) {
    this.vy += this.gravity;
    
    const dx = player.x - this.x;
    
    if (Math.abs(dx) < 300) {
      this.direction = dx > 0 ? 1 : -1;
      this.vx = this.direction * this.speed;
    }

    this.x += this.vx;
    this.y += this.vy;

    this.handleCollisions(level);
  }

  handleCollisions(level) {
    this.onGround = false;

    const tiles = level.getTilesAround(this.x, this.y);
    
    for (const tile of tiles) {
      if (tile.solid) {
        const collision = this.checkTileCollision(tile);
        if (collision) {
          this.resolveTileCollision(tile, collision);
        }
      }
    }
  }

  checkTileCollision(tile) {
    const tileLeft = tile.x * 32;
    const tileRight = tileLeft + 32;
    const tileTop = tile.y * 32;
    const tileBottom = tileTop + 32;

    const playerLeft = this.x - this.width / 2;
    const playerRight = this.x + this.width / 2;
    const playerTop = this.y - this.height;
    const playerBottom = this.y;

    if (playerRight > tileLeft && playerLeft < tileRight &&
        playerBottom > tileTop && playerTop < tileBottom) {
      
      const overlapLeft = playerRight - tileLeft;
      const overlapRight = tileRight - playerLeft;
      const overlapTop = playerBottom - tileTop;
      const overlapBottom = tileBottom - playerTop;

      const minOverlapX = Math.min(overlapLeft, overlapRight);
      const minOverlapY = Math.min(overlapTop, overlapBottom);

      if (minOverlapX < minOverlapY) {
        return overlapLeft < overlapRight ? 'left' : 'right';
      } else {
        return overlapTop < overlapBottom ? 'top' : 'bottom';
      }
    }
    return null;
  }

  resolveTileCollision(tile, direction) {
    const tileLeft = tile.x * 32;
    const tileRight = tileLeft + 32;
    const tileTop = tile.y * 32;
    const tileBottom = tileTop + 32;

    switch (direction) {
      case 'top':
        this.y = tileTop;
        this.vy = 0;
        this.onGround = true;
        break;
      case 'bottom':
        this.y = tileBottom + this.height;
        this.vy = 0;
        break;
      case 'left':
        this.x = tileLeft - this.width / 2;
        this.vx = 0;
        this.direction *= -1;
        break;
      case 'right':
        this.x = tileRight + this.width / 2;
        this.vx = 0;
        this.direction *= -1;
        break;
    }
  }

  takeDamage(amount, knockbackDir) {
    if (this.invulnerable > 0) return false;
    
    this.health -= amount;
    this.invulnerable = 20;
    this.knockback = knockbackDir * 5;
    
    audio.playHit();
    particles.emitBlood(this.x, this.y - this.height / 2);

    if (this.health <= 0) {
      this.active = false;
      audio.playEnemyDeath();
      return true;
    }
    return false;
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();
    
    if (this.invulnerable > 0 && this.invulnerable % 4 < 2) {
      ctx.globalAlpha = 0.5;
    }

    ctx.translate(Math.floor(this.x), Math.floor(this.y));
    
    if (this.direction < 0) {
      ctx.scale(-1, 1);
    }

    switch (this.type) {
      case 'bat':
        this.drawBat(ctx);
        break;
      case 'skeleton':
        this.drawSkeleton(ctx);
        break;
      case 'zombie':
        this.drawZombie(ctx);
        break;
    }

    ctx.restore();
  }

  drawBat(ctx) {
    const wingOffset = Math.sin(this.animFrame * Math.PI / 2) * 4;
    
    ctx.fillStyle = '#2a1a2a';
    ctx.fillRect(-10 - wingOffset, -12, 8, 6);
    ctx.fillRect(2 + wingOffset, -12, 8, 6);
    
    ctx.fillStyle = '#4a2a4a';
    ctx.fillRect(-6, -14, 12, 10);
    
    ctx.fillStyle = '#c41e3a';
    ctx.fillRect(-4, -12, 2, 2);
    ctx.fillRect(2, -12, 2, 2);
    
    ctx.fillStyle = '#2a1a2a';
    ctx.fillRect(-3, -8, 2, 3);
    ctx.fillRect(1, -8, 2, 3);
  }

  drawSkeleton(ctx) {
    ctx.fillStyle = '#e8dcc8';
    ctx.fillRect(-6, -38, 12, 12);
    
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-4, -34, 3, 3);
    ctx.fillRect(1, -34, 3, 3);
    ctx.fillRect(-2, -30, 4, 2);
    
    ctx.fillStyle = '#d4c8b4';
    ctx.fillRect(-4, -26, 8, 14);
    
    ctx.fillRect(-2, -38, 4, 4);
    
    const walkOffset = Math.sin(this.animFrame * Math.PI / 2) * 2;
    ctx.fillRect(-4, -12, 3, 12 + walkOffset);
    ctx.fillRect(1, -12, 3, 12 - walkOffset);
    
    ctx.fillRect(4, -24 + Math.sin(this.animFrame * 0.5) * 2, 8, 3);
    ctx.fillRect(-12 - Math.sin(this.animFrame * 0.5) * 2, -22, 8, 3);
  }

  drawZombie(ctx) {
    ctx.fillStyle = '#3a5a3a';
    ctx.fillRect(-6, -38, 12, 12);
    
    ctx.fillStyle = '#8b0000';
    ctx.fillRect(-4, -34, 3, 3);
    ctx.fillRect(1, -34, 3, 3);
    
    ctx.fillStyle = '#2a4a2a';
    ctx.fillRect(-1, -30, 2, 3);
    
    ctx.fillStyle = '#4a6a4a';
    ctx.fillRect(-5, -26, 10, 16);
    
    ctx.fillStyle = '#3a5a3a';
    const walkOffset = Math.sin(this.animFrame * Math.PI / 2) * 3;
    ctx.fillRect(-4, -10, 4, 10 + walkOffset);
    ctx.fillRect(0, -10, 4, 10 - walkOffset);
    
    ctx.fillRect(5, -24, 10, 4);
    ctx.fillRect(-15, -22, 10, 4);
    
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(-6, -26, 2, 4);
    ctx.fillRect(4, -30, 3, 3);
  }
}

class Projectile {
  constructor(x, y, vx, vy, type) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type;
    this.active = true;
    this.rotation = 0;
    this.damage = 1;
    this.friendly = type === 'dagger' || type === 'axe' || type === 'holywater';
    
    this.setupType();
  }

  setupType() {
    switch (this.type) {
      case 'bone':
        this.width = 12;
        this.height = 6;
        this.damage = 1;
        break;
      case 'dagger':
        this.width = 16;
        this.height = 4;
        this.damage = 2;
        break;
      case 'axe':
        this.width = 16;
        this.height = 16;
        this.damage = 3;
        this.gravity = 0.15;
        break;
      case 'holywater':
        this.width = 8;
        this.height = 12;
        this.damage = 2;
        this.gravity = 0.3;
        break;
    }
  }

  update(level) {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += 0.2;

    if (this.gravity) {
      this.vy += this.gravity;
    }

    if (this.type === 'holywater' && this.vy > 0) {
      const tile = level.getTileAt(Math.floor(this.x / 32), Math.floor((this.y + 10) / 32));
      if (tile && tile.solid) {
        this.active = false;
        particles.emitFire(this.x, this.y);
      }
    }

    if (this.x < -50 || this.x > level.width * 32 + 50 || 
        this.y < -50 || this.y > level.height * 32 + 50) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));
    ctx.rotate(this.rotation);

    switch (this.type) {
      case 'bone':
        ctx.fillStyle = '#e8dcc8';
        ctx.fillRect(-6, -3, 12, 6);
        ctx.fillRect(-8, -2, 4, 4);
        ctx.fillRect(4, -2, 4, 4);
        break;
      case 'dagger':
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(-8, -2, 12, 4);
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(4, -3, 6, 6);
        break;
      case 'axe':
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(-2, -8, 4, 16);
        ctx.fillStyle = '#808080';
        ctx.fillRect(-8, -6, 8, 8);
        break;
      case 'holywater':
        ctx.fillStyle = '#4169e1';
        ctx.fillRect(-4, -6, 8, 10);
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(-2, -8, 4, 4);
        break;
    }

    ctx.restore();
  }
}
