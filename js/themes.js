class ThemeManager {
  constructor() {
    this.themes = {
      classic: {
        name: 'Classic',
        background: { r: 10, g: 5, b: 5 },
        backgroundGradient: ['#1a0a0a', '#0a0505', '#1a0a0a'],
        tileColors: {
          stone: { main: '#3a3a3a', dark: '#2a2a2a', light: '#4a4a4a' },
          wall: { main: '#4a3a2a', dark: '#3a2a1a', accent: '#2a1a0a' },
          platform: { main: '#5a4a3a', light: '#6a5a4a', dark: '#4a3a2a' }
        },
        playerColors: {
          hair: '#8b4513',
          skin: '#deb887',
          clothes: '#4a2a0a',
          pants: '#3a1a00'
        },
        enemyColors: {
          bat: { body: '#4a2a4a', wing: '#2a1a2a' },
          skeleton: { bone: '#e8dcc8', dark: '#d4c8b4' },
          zombie: { skin: '#3a5a3a', dark: '#2a4a2a' }
        },
        uiColors: {
          health: '#c41e3a',
          hearts: '#c41e3a',
          text: '#d4a574',
          accent: '#ffd700'
        },
        particles: {
          fire: 'rgba(255, 150, 50, 1)',
          blood: 'rgba(180, 0, 0, 1)'
        },
        postProcess: { r: 10, g: -5, b: -10 },
        ambientLight: 0
      },
      midnight: {
        name: 'Midnight',
        background: { r: 5, g: 5, b: 20 },
        backgroundGradient: ['#0a0a2a', '#050520', '#0a0a2a'],
        tileColors: {
          stone: { main: '#2a2a4a', dark: '#1a1a3a', light: '#3a3a5a' },
          wall: { main: '#3a3a5a', dark: '#2a2a4a', accent: '#1a1a3a' },
          platform: { main: '#4a4a6a', light: '#5a5a7a', dark: '#3a3a5a' }
        },
        playerColors: {
          hair: '#4a3060',
          skin: '#c0b0d0',
          clothes: '#2a2050',
          pants: '#1a1040'
        },
        enemyColors: {
          bat: { body: '#5a3a6a', wing: '#3a2a4a' },
          skeleton: { bone: '#d0d0e8', dark: '#b0b0d0' },
          zombie: { skin: '#3a4a5a', dark: '#2a3a4a' }
        },
        uiColors: {
          health: '#6a5acd',
          hearts: '#9370db',
          text: '#b0b0d0',
          accent: '#add8e6'
        },
        particles: {
          fire: 'rgba(150, 150, 255, 1)',
          blood: 'rgba(100, 50, 150, 1)'
        },
        postProcess: { r: -10, g: -5, b: 20 },
        ambientLight: -10
      },
      blood: {
        name: 'Blood Moon',
        background: { r: 20, g: 5, b: 5 },
        backgroundGradient: ['#2a0505', '#1a0000', '#2a0505'],
        tileColors: {
          stone: { main: '#4a2a2a', dark: '#3a1a1a', light: '#5a3a3a' },
          wall: { main: '#5a3030', dark: '#4a2020', accent: '#3a1010' },
          platform: { main: '#6a4040', light: '#7a5050', dark: '#5a3030' }
        },
        playerColors: {
          hair: '#5a2020',
          skin: '#d0a090',
          clothes: '#3a1515',
          pants: '#2a0a0a'
        },
        enemyColors: {
          bat: { body: '#6a2a3a', wing: '#4a1a2a' },
          skeleton: { bone: '#d8c8c0', dark: '#c0b0a0' },
          zombie: { skin: '#4a3a3a', dark: '#3a2a2a' }
        },
        uiColors: {
          health: '#ff4444',
          hearts: '#ff6666',
          text: '#ffaaaa',
          accent: '#ff8888'
        },
        particles: {
          fire: 'rgba(255, 100, 50, 1)',
          blood: 'rgba(255, 0, 0, 1)'
        },
        postProcess: { r: 30, g: -10, b: -15 },
        ambientLight: 5
      },
      gameboy: {
        name: 'Game Boy',
        background: { r: 15, g: 56, b: 15 },
        backgroundGradient: ['#306230', '#0f380f', '#306230'],
        tileColors: {
          stone: { main: '#8bac0f', dark: '#306230', light: '#9bbc0f' },
          wall: { main: '#8bac0f', dark: '#306230', accent: '#0f380f' },
          platform: { main: '#9bbc0f', light: '#9bbc0f', dark: '#8bac0f' }
        },
        playerColors: {
          hair: '#0f380f',
          skin: '#9bbc0f',
          clothes: '#306230',
          pants: '#0f380f'
        },
        enemyColors: {
          bat: { body: '#306230', wing: '#0f380f' },
          skeleton: { bone: '#9bbc0f', dark: '#8bac0f' },
          zombie: { skin: '#306230', dark: '#0f380f' }
        },
        uiColors: {
          health: '#9bbc0f',
          hearts: '#9bbc0f',
          text: '#9bbc0f',
          accent: '#9bbc0f'
        },
        particles: {
          fire: 'rgba(155, 188, 15, 1)',
          blood: 'rgba(48, 98, 48, 1)'
        },
        postProcess: { r: -100, g: 20, b: -100 },
        ambientLight: 0,
        gameboyMode: true
      },
      sepia: {
        name: 'Sepia',
        background: { r: 20, g: 15, b: 10 },
        backgroundGradient: ['#3a3020', '#1a1510', '#3a3020'],
        tileColors: {
          stone: { main: '#5a5040', dark: '#4a4030', light: '#6a6050' },
          wall: { main: '#6a5a40', dark: '#5a4a30', accent: '#4a3a20' },
          platform: { main: '#7a6a50', light: '#8a7a60', dark: '#6a5a40' }
        },
        playerColors: {
          hair: '#4a3a20',
          skin: '#c0a080',
          clothes: '#5a4a30',
          pants: '#4a3a20'
        },
        enemyColors: {
          bat: { body: '#5a4a3a', wing: '#3a2a1a' },
          skeleton: { bone: '#d0c0a0', dark: '#b0a080' },
          zombie: { skin: '#5a5040', dark: '#4a4030' }
        },
        uiColors: {
          health: '#c09050',
          hearts: '#d0a060',
          text: '#c0a080',
          accent: '#e0c090'
        },
        particles: {
          fire: 'rgba(200, 150, 80, 1)',
          blood: 'rgba(100, 60, 30, 1)'
        },
        postProcess: { r: 20, g: 10, b: -20 },
        ambientLight: 5
      },
      neon: {
        name: 'Neon',
        background: { r: 5, g: 0, b: 15 },
        backgroundGradient: ['#150030', '#0a0020', '#150030'],
        tileColors: {
          stone: { main: '#1a1a3a', dark: '#0a0a2a', light: '#2a2a4a' },
          wall: { main: '#2a1a4a', dark: '#1a0a3a', accent: '#0a0020' },
          platform: { main: '#3a2a5a', light: '#4a3a6a', dark: '#2a1a4a' }
        },
        playerColors: {
          hair: '#ff00ff',
          skin: '#00ffff',
          clothes: '#ff0080',
          pants: '#8000ff'
        },
        enemyColors: {
          bat: { body: '#ff00ff', wing: '#8000ff' },
          skeleton: { bone: '#00ffff', dark: '#00c0c0' },
          zombie: { skin: '#00ff80', dark: '#00c060' }
        },
        uiColors: {
          health: '#ff0080',
          hearts: '#ff00ff',
          text: '#00ffff',
          accent: '#ffff00'
        },
        particles: {
          fire: 'rgba(255, 0, 255, 1)',
          blood: 'rgba(0, 255, 255, 1)'
        },
        postProcess: { r: 0, g: 0, b: 0 },
        ambientLight: 0,
        neonGlow: true
      }
    };

    this.currentTheme = 'classic';
    this.themeList = ['classic', 'midnight', 'blood', 'gameboy', 'sepia', 'neon'];
  }

  getTheme() {
    return this.themes[this.currentTheme];
  }

  setTheme(themeName) {
    if (this.themes[themeName]) {
      this.currentTheme = themeName;
      this.updateUIColors();
      return true;
    }
    return false;
  }

  nextTheme() {
    const currentIndex = this.themeList.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % this.themeList.length;
    this.currentTheme = this.themeList[nextIndex];
    this.updateUIColors();
    return this.themes[this.currentTheme];
  }

  updateUIColors() {
    const theme = this.getTheme();
    const root = document.documentElement;
    
    document.getElementById('theme-name').textContent = theme.name;
    
    const healthFill = document.getElementById('health-fill');
    if (healthFill) {
      healthFill.style.background = `linear-gradient(180deg, ${theme.uiColors.health} 0%, ${this.darkenColor(theme.uiColors.health, 30)} 100%)`;
    }
  }

  darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
  }

  applyPostProcess(ctx, canvas) {
    const theme = this.getTheme();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    if (theme.gameboyMode) {
      const gbColors = [
        { r: 15, g: 56, b: 15 },
        { r: 48, g: 98, b: 48 },
        { r: 139, g: 172, b: 15 },
        { r: 155, g: 188, b: 15 }
      ];

      for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        const colorIndex = Math.min(3, Math.floor(gray / 64));
        const gbColor = gbColors[colorIndex];
        
        data[i] = gbColor.r;
        data[i + 1] = gbColor.g;
        data[i + 2] = gbColor.b;
      }
    } else {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + theme.postProcess.r));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + theme.postProcess.g));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + theme.postProcess.b));
      }
    }

    ctx.putImageData(imageData, 0, 0);

    if (theme.neonGlow) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.filter = 'blur(2px)';
      ctx.globalAlpha = 0.3;
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    }
  }
}

const themeManager = new ThemeManager();
