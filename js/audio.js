class AudioManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.musicPlaying = false;
  }

  init() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  createOscillator(frequency, type, duration, volume = 0.3) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playWhip() {
    if (!this.audioContext) return;
    
    const noise = this.audioContext.createBufferSource();
    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.15, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / buffer.length, 2);
    }
    
    noise.buffer = buffer;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioContext.destination);
    
    noise.start();
  }

  playJump() {
    this.createOscillator(200, 'square', 0.1, 0.2);
    setTimeout(() => this.createOscillator(300, 'square', 0.1, 0.15), 50);
  }

  playHit() {
    this.createOscillator(150, 'sawtooth', 0.2, 0.3);
    this.createOscillator(100, 'square', 0.15, 0.2);
  }

  playEnemyDeath() {
    this.createOscillator(400, 'square', 0.1, 0.2);
    setTimeout(() => this.createOscillator(300, 'square', 0.1, 0.15), 50);
    setTimeout(() => this.createOscillator(200, 'square', 0.15, 0.1), 100);
  }

  playPickup() {
    this.createOscillator(523, 'square', 0.1, 0.2);
    setTimeout(() => this.createOscillator(659, 'square', 0.1, 0.2), 80);
    setTimeout(() => this.createOscillator(784, 'square', 0.15, 0.2), 160);
  }

  playSecretFound() {
    const notes = [392, 440, 494, 523, 587, 659];
    notes.forEach((freq, i) => {
      setTimeout(() => this.createOscillator(freq, 'square', 0.15, 0.2), i * 80);
    });
  }

  playCandleBreak() {
    this.createOscillator(800, 'square', 0.05, 0.15);
    this.createOscillator(600, 'sawtooth', 0.08, 0.1);
  }

  playDamage() {
    this.createOscillator(100, 'sawtooth', 0.3, 0.4);
    this.createOscillator(80, 'square', 0.2, 0.3);
  }

  playSubweapon() {
    this.createOscillator(600, 'square', 0.1, 0.2);
    this.createOscillator(800, 'triangle', 0.15, 0.15);
  }
}

const audio = new AudioManager();
