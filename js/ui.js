class UI {
  constructor() {
    this.healthFill = document.getElementById('health-fill');
    this.enemyHealthFill = document.getElementById('enemy-health-fill');
    this.heartsCount = document.getElementById('hearts-count');
    this.scoreCount = document.getElementById('score-count');
    this.subweaponIcon = document.getElementById('subweapon-icon');
    this.themeName = document.getElementById('theme-name');
    this.hud = document.getElementById('hud');
    this.titleScreen = document.getElementById('title-screen');
    this.controlsScreen = document.getElementById('controls-screen');
    this.themeScreen = document.getElementById('theme-screen');
    this.gameOverScreen = document.getElementById('game-over-screen');
    this.finalScore = document.getElementById('final-score');
    this.themeToast = document.getElementById('theme-toast');
    this.toastText = document.getElementById('toast-text');

    this.targetHealth = 100;
    this.currentHealth = 100;
    this.targetEnemyHealth = 100;
    this.currentEnemyHealth = 100;
    
    this.toastTimeout = null;
    
    this.setupThemeButtons();
  }

  setupThemeButtons() {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const themeName = option.dataset.theme;
        themeManager.setTheme(themeName);
        this.updateActiveTheme();
        this.showThemeToast(themeManager.getTheme().name);
      });
    });
  }

  updateActiveTheme() {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
      if (option.dataset.theme === themeManager.currentTheme) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }

  showThemeToast(themeName) {
    this.toastText.textContent = `Theme: ${themeName}`;
    this.themeToast.classList.remove('hidden');
    
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    
    this.toastTimeout = setTimeout(() => {
      this.themeToast.classList.add('hidden');
    }, 2000);
  }

  showHUD() {
    this.hud.classList.add('visible');
  }

  hideHUD() {
    this.hud.classList.remove('visible');
  }

  showTitle() {
    this.titleScreen.classList.remove('hidden');
    this.controlsScreen.classList.add('hidden');
    this.themeScreen.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.hideHUD();
  }

  showControls() {
    this.controlsScreen.classList.remove('hidden');
  }

  hideControls() {
    this.controlsScreen.classList.add('hidden');
  }

  showThemes() {
    this.themeScreen.classList.remove('hidden');
    this.updateActiveTheme();
  }

  hideThemes() {
    this.themeScreen.classList.add('hidden');
  }

  showGameOver(score) {
    this.gameOverScreen.classList.remove('hidden');
    this.finalScore.textContent = `Score: ${score}`;
    this.hideHUD();
  }

  hideGameOver() {
    this.gameOverScreen.classList.add('hidden');
  }

  startGame() {
    this.titleScreen.classList.add('hidden');
    this.controlsScreen.classList.add('hidden');
    this.themeScreen.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.showHUD();
  }

  update(player, bossHealth = null) {
    const theme = themeManager.getTheme();
    
    this.targetHealth = (player.health / player.maxHealth) * 100;
    this.currentHealth += (this.targetHealth - this.currentHealth) * 0.1;
    this.healthFill.style.width = `${Math.max(0, this.currentHealth)}%`;

    if (bossHealth !== null) {
      this.targetEnemyHealth = bossHealth;
      this.currentEnemyHealth += (this.targetEnemyHealth - this.currentEnemyHealth) * 0.1;
      this.enemyHealthFill.style.width = `${Math.max(0, this.currentEnemyHealth)}%`;
    }

    this.heartsCount.textContent = player.hearts;
    this.scoreCount.textContent = player.score;
    
    this.subweaponIcon.textContent = this.getSubweaponSymbol(player.subweapon);
    this.themeName.textContent = theme.name;
  }

  getSubweaponSymbol(subweapon) {
    switch (subweapon) {
      case 'dagger': return '🗡';
      case 'axe': return '🪓';
      case 'holywater': return '💧';
      default: return '-';
    }
  }

  drawMinimap(ctx, level, player, camera) {
    const theme = themeManager.getTheme();
    const mapX = 700;
    const mapY = 520;
    const mapW = 90;
    const mapH = 70;
    const scaleX = mapW / (level.width * 32);
    const scaleY = mapH / (level.height * 32);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(mapX - 2, mapY - 2, mapW + 4, mapH + 4);

    ctx.fillStyle = theme.tileColors.stone.dark;
    for (let y = 0; y < level.height; y++) {
      for (let x = 0; x < level.width; x++) {
        const tile = level.getTileAt(x, y);
        if (tile.solid) {
          ctx.fillRect(
            mapX + x * 32 * scaleX,
            mapY + y * 32 * scaleY,
            Math.ceil(32 * scaleX),
            Math.ceil(32 * scaleY)
          );
        }
      }
    }

    ctx.fillStyle = theme.uiColors.accent;
    ctx.fillRect(
      mapX + player.x * scaleX - 1,
      mapY + player.y * scaleY - 1,
      3,
      3
    );

    ctx.strokeStyle = theme.tileColors.stone.light;
    ctx.strokeRect(mapX - 2, mapY - 2, mapW + 4, mapH + 4);
  }
}

const ui = new UI();
