class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = 20;
    this.height = 40;
    this.speed = 3;
    this.jumpPower = -10;
    this.gravity = 0.5;
    this.onGround = false;
    this.direction = 1;
    
    this.health = 16;
    this.maxHealth = 16;
    this.hearts = 5;
    this.score = 0;
    
    this.whipLevel = 1;
    this.subweapon = null;
    this.subweapons = ['dagger', 'axe', 'holywater'];
    
    this.isAttacking = false;
    this.attackTimer = 0;
    this.attackDuration = 20;
    this.attackCooldown = 0;
    
    this.invulnerable = 0;
    this.knockback = 0;
    this.crouching = false;
    
    this.animFrame = 0;
    this.animTimer = 0;
    this.state = 'idle';
  }

  update(keys, level, enemies, projectiles, candles, pickups) {
    this.handleInput(keys, projectiles);
    this.applyPhysics();
    this.handleCollisions(level);
    this.updateAnimation();
    this.checkCombat(enemies, candles, pickups, projectiles);
    
    if (this.invulnerable > 0) this.invulnerable--;
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.knockback !== 0) {
      this.x += this.knockback;
      this.knockback *= 0.8;
      if (Math.abs(this.knockback) < 0.5) this.knockback = 0;
    }
  }

  handleInput(keys, projectiles) {
    if (this.knockback !== 0) return;

    this.crouching = keys.down && this.onGround;
    
    if (!this.isAttacking || !this.onGround) {
      if (keys.left && !this.crouching) {
        this.vx = -this.speed;
        this.direction = -1;
      } else if (keys.right && !this.crouching) {
        this.vx = this.speed;
        this.direction = 1;
      } else {
        this.vx = 0;
      }
    } else {
      this.vx = 0;
    }

    if (keys.jump && this.onGround && !this.crouching) {
      this.vy = this.jumpPower;
      this.onGround = false;
      audio.playJump();
    }

    if (keys.attack && !this.isAttacking && this.attackCooldown <= 0) {
      this.isAttacking = true;
      this.attackTimer = this.attackDuration;
      this.attackCooldown = 30;
      audio.playWhip();
    }

    if (keys.subweapon && this.subweapon && this.hearts > 0 && this.attackCooldown <= 0) {
      this.hearts--;
      this.attackCooldown = 25;
      this.fireSubweapon(projectiles);
    }

    if (this.isAttacking) {
      this.attackTimer--;
      if (this.attackTimer <= 0) {
        this.isAttacking = false;
      }
    }
  }

  fireSubweapon(projectiles) {
    let vx, vy;
    switch (this.subweapon) {
      case 'dagger':
        vx = this.direction * 8;
        vy = 0;
        break;
      case 'axe':
        vx = this.direction * 4;
        vy = -8;
        break;
      case 'holywater':
        vx = this.direction * 3;
        vy = -2;
        break;
    }
    
    projectiles.push(new Projectile(
      this.x + this.direction * 15,
      this.y - this.height / 2,
      vx,
      vy,
      this.subweapon
    ));
    audio.playSubweapon();
  }

  applyPhysics() {
    this.vy += this.gravity;
    this.vy = Math.min(this.vy, 12);
    
    this.x += this.vx;
    this.y += this.vy;
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

    this.x = Math.max(this.width / 2, Math.min(level.width * 32 - this.width / 2, this.x));
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
        break;
      case 'right':
        this.x = tileRight + this.width / 2;
        this.vx = 0;
        break;
    }
  }

  getWhipHitbox() {
    if (!this.isAttacking) return null;
    
    const progress = 1 - (this.attackTimer / this.attackDuration);
    const whipLength = 40 + this.whipLevel * 15;
    const whipY = this.crouching ? this.y - 15 : this.y - 25;
    
    return {
      x: this.x + (this.direction * whipLength * progress),
      y: whipY,
      width: 20,
      height: 10,
      damage: this.whipLevel
    };
  }

  checkCombat(enemies, candles, pickups, projectiles) {
    const whipHitbox = this.getWhipHitbox();
    
    if (whipHitbox) {
      for (const enemy of enemies) {
        if (!enemy.active) continue;
        
        if (this.hitboxIntersects(whipHitbox, {
          x: enemy.x,
          y: enemy.y - enemy.height / 2,
          width: enemy.width,
          height: enemy.height
        })) {
          const killed = enemy.takeDamage(whipHitbox.damage, this.direction);
          if (killed) {
            this.score += this.getEnemyScore(enemy.type);
            this.spawnEnemyDrop(enemy, pickups);
          }
        }
      }

      for (const candle of candles) {
        if (!candle.active) continue;
        
        if (this.hitboxIntersects(whipHitbox, {
          x: candle.x,
          y: candle.y,
          width: 16,
          height: 24
        })) {
          candle.destroy(pickups);
        }
      }
    }

    for (const proj of projectiles) {
      if (!proj.active || proj.friendly) continue;
      
      if (this.hitboxIntersects(
        { x: proj.x, y: proj.y, width: proj.width, height: proj.height },
        { x: this.x, y: this.y - this.height / 2, width: this.width, height: this.height }
      )) {
        this.takeDamage(proj.damage, proj.vx > 0 ? 1 : -1);
        proj.active = false;
      }
    }

    for (const enemy of enemies) {
      if (!enemy.active || this.invulnerable > 0) continue;
      
      if (this.hitboxIntersects(
        { x: enemy.x, y: enemy.y - enemy.height / 2, width: enemy.width, height: enemy.height },
        { x: this.x, y: this.y - this.height / 2, width: this.width, height: this.height }
      )) {
        this.takeDamage(enemy.damage, enemy.x < this.x ? 1 : -1);
      }
    }

    for (let i = pickups.length - 1; i >= 0; i--) {
      const pickup = pickups[i];
      if (!pickup.active) continue;
      
      if (this.hitboxIntersects(
        { x: pickup.x, y: pickup.y, width: 16, height: 16 },
        { x: this.x, y: this.y - this.height / 2, width: this.width, height: this.height }
      )) {
        this.collectPickup(pickup);
        pickups.splice(i, 1);
      }
    }
  }

  hitboxIntersects(a, b) {
    return Math.abs(a.x - b.x) < (a.width + b.width) / 2 &&
           Math.abs(a.y - b.y) < (a.height + b.height) / 2;
  }

  getEnemyScore(type) {
    switch (type) {
      case 'bat': return 100;
      case 'skeleton': return 200;
      case 'zombie': return 150;
      default: return 100;
    }
  }

  spawnEnemyDrop(enemy, pickups) {
    if (Math.random() < 0.3) {
      const dropType = Math.random();
      let type;
      if (dropType < 0.4) type = 'heart';
      else if (dropType < 0.6) type = 'bigheart';
      else if (dropType < 0.8) type = 'money';
      else type = 'meat';
      
      pickups.push(new Pickup(enemy.x, enemy.y - enemy.height / 2, type));
    }
  }

  collectPickup(pickup) {
    audio.playPickup();
    particles.emitSparkle(pickup.x, pickup.y);
    
    switch (pickup.type) {
      case 'heart':
        this.hearts = Math.min(this.hearts + 1, 99);
        break;
      case 'bigheart':
        this.hearts = Math.min(this.hearts + 5, 99);
        break;
      case 'money':
        this.score += 100;
        break;
      case 'meat':
        this.health = Math.min(this.health + 6, this.maxHealth);
        break;
      case 'whipup':
        this.whipLevel = Math.min(this.whipLevel + 1, 3);
        break;
      case 'dagger':
      case 'axe':
      case 'holywater':
        this.subweapon = pickup.type;
        break;
    }
  }

  takeDamage(amount, knockbackDir) {
    if (this.invulnerable > 0) return;
    
    this.health -= amount;
    this.invulnerable = 60;
    this.knockback = knockbackDir * 6;
    
    audio.playDamage();
    particles.emitBlood(this.x, this.y - this.height / 2);
    
    if (this.health <= 0) {
      this.health = 0;
    }
  }

  updateAnimation() {
    this.animTimer++;
    
    if (this.isAttacking) {
      this.state = 'attack';
    } else if (!this.onGround) {
      this.state = 'jump';
    } else if (this.crouching) {
      this.state = 'crouch';
    } else if (Math.abs(this.vx) > 0.5) {
      this.state = 'walk';
      if (this.animTimer > 6) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 4;
      }
    } else {
      this.state = 'idle';
      this.animFrame = 0;
    }
  }

  draw(ctx, camera) {
    ctx.save();
    
    const screenX = Math.floor(this.x - camera.x);
    const screenY = Math.floor(this.y - camera.y);
    
    if (this.invulnerable > 0 && this.invulnerable % 4 < 2) {
      ctx.globalAlpha = 0.5;
    }

    ctx.translate(screenX, screenY);
    
    if (this.direction < 0) {
      ctx.scale(-1, 1);
    }

    this.drawBody(ctx);
    
    if (this.isAttacking) {
      this.drawWhip(ctx);
    }

    ctx.restore();
  }

  drawBody(ctx) {
    const yOffset = this.crouching ? 10 : 0;
    const height = this.crouching ? 30 : 40;
    
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(-4, -height + yOffset, 8, 10);
    
    ctx.fillStyle = '#deb887';
    ctx.fillRect(-5, -height + 10 + yOffset, 10, 8);
    
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-3, -height + 12 + yOffset, 2, 2);
    ctx.fillRect(1, -height + 12 + yOffset, 2, 2);
    
    ctx.fillStyle = '#4a2a0a';
    ctx.fillRect(-6, -height + 18 + yOffset, 12, this.crouching ? 8 : 14);
    
    ctx.fillStyle = '#3a1a00';
    const walkOffset = this.state === 'walk' ? Math.sin(this.animFrame * Math.PI / 2) * 3 : 0;
    if (!this.crouching) {
      ctx.fillRect(-4, -8, 4, 8 + walkOffset);
      ctx.fillRect(0, -8, 4, 8 - walkOffset);
    }
    
    ctx.fillStyle = '#4a2a0a';
    if (this.isAttacking) {
      ctx.fillRect(6, -height + 22 + yOffset, 8, 3);
    } else {
      ctx.fillRect(6, -height + 20 + yOffset, 4, 3);
    }
    ctx.fillRect(-10, -height + 20 + yOffset, 4, 3);
  }

  drawWhip(ctx) {
    const progress = 1 - (this.attackTimer / this.attackDuration);
    const whipLength = (40 + this.whipLevel * 15) * progress;
    const whipY = this.crouching ? -15 : -25;
    
    ctx.strokeStyle = this.whipLevel >= 3 ? '#ffd700' : 
                      this.whipLevel >= 2 ? '#c0c0c0' : '#8b4513';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(10, whipY);
    
    const segments = 8;
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const x = 10 + whipLength * t;
      const wave = Math.sin(t * Math.PI * 2 + progress * Math.PI * 4) * 5 * (1 - progress);
      ctx.lineTo(x, whipY + wave);
    }
    
    ctx.stroke();
    
    if (this.whipLevel >= 2) {
      ctx.fillStyle = this.whipLevel >= 3 ? '#ffd700' : '#c0c0c0';
      ctx.beginPath();
      ctx.arc(10 + whipLength, whipY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

class Pickup {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.active = true;
    this.vy = -3;
    this.gravity = 0.2;
    this.bobOffset = Math.random() * Math.PI * 2;
    this.lifetime = 600;
  }

  update(level) {
    this.vy += this.gravity;
    this.y += this.vy;
    this.bobOffset += 0.1;
    this.lifetime--;
    
    if (this.lifetime <= 0) {
      this.active = false;
    }

    const tile = level.getTileAt(Math.floor(this.x / 32), Math.floor(this.y / 32));
    if (tile && tile.solid) {
      this.y = Math.floor(this.y / 32) * 32;
      this.vy = 0;
    }
  }

  draw(ctx, camera) {
    if (!this.active) return;
    
    const screenX = Math.floor(this.x - camera.x);
    const screenY = Math.floor(this.y - camera.y + Math.sin(this.bobOffset) * 2);
    
    if (this.lifetime < 120 && this.lifetime % 8 < 4) return;
    
    ctx.save();
    ctx.translate(screenX, screenY);

    switch (this.type) {
      case 'heart':
        ctx.fillStyle = '#c41e3a';
        ctx.fillRect(-4, -6, 8, 8);
        ctx.fillRect(-6, -8, 4, 4);
        ctx.fillRect(2, -8, 4, 4);
        break;
      case 'bigheart':
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(-6, -8, 12, 12);
        ctx.fillRect(-8, -10, 6, 6);
        ctx.fillRect(2, -10, 6, 6);
        break;
      case 'money':
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-6, -8, 12, 10);
        ctx.fillStyle = '#b8860b';
        ctx.fillRect(-4, -6, 8, 6);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-2, -4, 4, 2);
        break;
      case 'meat':
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(-8, -4, 16, 8);
        ctx.fillStyle = '#cd853f';
        ctx.fillRect(-6, -6, 12, 4);
        ctx.fillRect(-10, -2, 4, 4);
        break;
      case 'whipup':
        ctx.fillStyle = '#ff4500';
        ctx.fillRect(-6, -8, 12, 10);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-2, -6, 4, 6);
        ctx.fillRect(-4, -4, 8, 2);
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
