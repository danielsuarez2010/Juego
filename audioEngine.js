/**
 * GITFUNK AUDIO ENGINE
 * High-quality procedural music composer & synthesizer using Web Audio API.
 * Real, catchy, structured musical songs (grooving drum kits, funky basslines,
 * polyphonic harmonic pads, catchy arpeggios, and distinct expressive character vocals).
 */

class GitFunkAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.vocalsGain = null;
    this.sfxGain = null;

    this.isInitialized = false;
    this.isPlaying = false;
    this.currentSong = null;
    this.songStartTime = 0;
    this.performanceStartTime = 0;

    // Volume settings
    this.masterVolume = 0.85;
    this.musicVolume = 0.70;
    this.vocalsVolume = 0.90;
    this.sfxVolume = 0.80;

    this.noiseBuffer = null;
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();

          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);

          this.musicGain = this.ctx.createGain();
          this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
          this.musicGain.connect(this.masterGain);

          this.vocalsGain = this.ctx.createGain();
          this.vocalsGain.gain.setValueAtTime(this.vocalsVolume, this.ctx.currentTime);
          this.vocalsGain.connect(this.masterGain);

          this.sfxGain = this.ctx.createGain();
          this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
          this.sfxGain.connect(this.masterGain);

          this.generateNoiseBuffer();
          this.isInitialized = true;
        }
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("AudioContext init warning:", e);
    }
  }

  generateNoiseBuffer() {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } catch (e) {
      console.warn("Noise buffer error:", e);
    }
  }

  setVolume(type, val) {
    val = Math.max(0, Math.min(1, val));
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    try {
      if (type === 'master' && this.masterGain) {
        this.masterVolume = val;
        this.masterGain.gain.setTargetAtTime(val, t, 0.05);
      } else if (type === 'music' && this.musicGain) {
        this.musicVolume = val;
        this.musicGain.gain.setTargetAtTime(val, t, 0.05);
      } else if (type === 'vocals' && this.vocalsGain) {
        this.vocalsVolume = val;
        this.vocalsGain.gain.setTargetAtTime(val, t, 0.05);
      } else if (type === 'sfx' && this.sfxGain) {
        this.sfxVolume = val;
        this.sfxGain.gain.setTargetAtTime(val, t, 0.05);
      }
    } catch (e) {}
  }

  // ==========================================
  // DRUMS & PERCUSSION
  // ==========================================
  playKick(time = 0) {
    if (!this.ctx) return;
    try {
      const t = time || this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.09);

      gain.gain.setValueAtTime(1.0, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(t);
      osc.stop(t + 0.25);
    } catch (e) {}
  }

  playSnare(time = 0) {
    if (!this.ctx || !this.noiseBuffer) return;
    try {
      const t = time || this.ctx.currentTime;

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(850, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.75, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.musicGain);

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.08);

      oscGain.gain.setValueAtTime(0.5, t);
      oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.10);

      osc.connect(oscGain);
      oscGain.connect(this.musicGain);

      noiseSource.start(t);
      noiseSource.stop(t + 0.20);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch (e) {}
  }

  playHiHat(time = 0, open = false) {
    if (!this.ctx || !this.noiseBuffer) return;
    try {
      const t = time || this.ctx.currentTime;
      const duration = open ? 0.18 : 0.045;

      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(9500, t);
      filter.Q.setValueAtTime(3.5, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(open ? 0.35 : 0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      noise.start(t);
      noise.stop(t + duration + 0.01);
    } catch (e) {}
  }

  // ==========================================
  // HARMONY, PADS & BASSLINES
  // ==========================================
  playChordPad(frequencies, time = 0, duration = 1.0) {
    if (!this.ctx || !frequencies) return;
    try {
      const t = time || this.ctx.currentTime;
      frequencies.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, t);
        filter.frequency.linearRampToValueAtTime(1400, t + duration * 0.4);
        filter.frequency.linearRampToValueAtTime(500, t + duration);

        gain.gain.setValueAtTime(0.0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.06);
        gain.gain.setValueAtTime(0.12, t + duration - 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + duration + 0.05);
      });
    } catch (e) {}
  }

  playBassNote(freq, time = 0, duration = 0.32) {
    if (!this.ctx) return;
    try {
      const t = time || this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      sub.type = 'sine';
      sub.frequency.setValueAtTime(freq * 0.5, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(130, t + duration);

      gain.gain.setValueAtTime(0.55, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(t);
      sub.start(t);
      osc.stop(t + duration + 0.02);
      sub.stop(t + duration + 0.02);
    } catch (e) {}
  }

  playArpNote(freq, time = 0, duration = 0.14) {
    if (!this.ctx) return;
    try {
      const t = time || this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq * 2, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, t);
      filter.frequency.exponentialRampToValueAtTime(400, t + duration);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(t);
      osc.stop(t + duration + 0.01);
    } catch (e) {}
  }

  // ==========================================
  // CHARACTER VOCAL SYNTHESIZER
  // ==========================================
  playVocal(characterId, lane, time = 0, duration = 0.22, isSustain = false) {
    if (!this.ctx) return;
    try {
      const t = time || this.ctx.currentTime;
      duration = Math.max(0.16, duration);

      // Pentatonic / Musical Chord Tone Frequencies per Character
      const scales = {
        juana:     [261.63, 293.66, 329.63, 392.00], // C4, D4, E4, G4
        octobot:   [196.00, 246.94, 293.66, 392.00], // G3, B3, D4, G4
        glitch:    [146.83, 174.61, 220.00, 261.63], // D3, F3, A3, C4
        framework: [220.00, 277.18, 329.63, 440.00], // A3, C#4, E4, A4
        vite:      [329.63, 415.30, 493.88, 659.25], // E4, G#4, B4, E5
        dragon:    [110.00, 146.83, 164.81, 220.00]  // A2, D3, E3, A3
      };

      const charScale = scales[characterId] || scales.juana;
      const baseFreq = charScale[lane % charScale.length] || 330;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      if (characterId === 'octobot') {
        // FM Modulated Robot
        const mod = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, t);
        mod.type = 'sine';
        mod.frequency.setValueAtTime(baseFreq * 2, t);
        modGain.gain.setValueAtTime(baseFreq * 0.9, t);
        mod.connect(modGain);
        modGain.connect(osc.frequency);
        mod.start(t);
        mod.stop(t + duration + 0.05);

      } else if (characterId === 'glitch') {
        // Bitcrushed 8-bit Pulse
        osc.type = 'square';
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.setValueAtTime(baseFreq * 1.06, t + 0.03);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, t);

      } else if (characterId === 'framework') {
        // Cyber SuperSaw
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq, t);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1300, t);
        filter.Q.setValueAtTime(2.2, t);

      } else if (characterId === 'vite') {
        // Fast Resonant Pluck
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq, t);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2500, t);
        filter.frequency.exponentialRampToValueAtTime(750, t + duration);
        filter.Q.setValueAtTime(4.0, t);

      } else if (characterId === 'dragon') {
        // Heavy Sub-Bass Overdrive
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq, t);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, t);
        filter.Q.setValueAtTime(5.0, t);

      } else {
        // Juana Formant Vocals
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.02, t + 0.04);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1600, t);
        filter.Q.setValueAtTime(2.5, t);
      }

      // Envelope
      gain.gain.setValueAtTime(0.0, t);
      gain.gain.linearRampToValueAtTime(0.7, t + 0.02);
      if (isSustain) {
        gain.gain.setValueAtTime(0.7, t + duration - 0.05);
      } else {
        gain.gain.setValueAtTime(0.7, t + duration * 0.6);
      }
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.vocalsGain);

      osc.start(t);
      osc.stop(t + duration + 0.05);

    } catch (e) {}
  }

  // ==========================================
  // JINGLES & SFX
  // ==========================================
  playHitSound(rating) {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      let freq = 600;
      if (rating === 'sick') freq = 880;
      else if (rating === 'good') freq = 660;
      else if (rating === 'bad') freq = 440;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.07);
    } catch (e) {}
  }

  playMissSound() {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, t);
      osc.frequency.linearRampToValueAtTime(45, t + 0.14);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.18);
    } catch (e) {}
  }

  playCountdownBeep(isGo = false) {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isGo ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isGo ? 880 : 440, t);

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (isGo ? 0.35 : 0.14));

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + (isGo ? 0.4 : 0.16));
    } catch (e) {}
  }

  playVictoryFanfare() {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const startTime = t + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch (e) {}
  }

  playGameOverFanfare() {
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const notes = [311.13, 293.66, 277.18, 261.63, 196.00];
      notes.forEach((freq, idx) => {
        const startTime = t + idx * 0.18;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {}
  }

  // ==========================================
  // SONG PLAYBACK SEQUENCER
  // ==========================================
  startSong(songData) {
    this.init();
    this.stopSong();

    this.currentSong = songData;
    this.isPlaying = true;

    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.songStartTime = this.ctx.currentTime + 2.0;
      this.performanceStartTime = performance.now() + 2000;

      const bpm = songData.bpm || 110;
      const beatSec = 60 / bpm;
      const totalBeats = Math.ceil((songData.duration + 4) / beatSec);

      const chordMap = {
        "Am":  [220.00, 261.63, 329.63],
        "F":   [174.61, 220.00, 261.63],
        "C":   [130.81, 164.81, 196.00],
        "G":   [196.00, 246.94, 293.66],
        "Dm":  [146.83, 174.61, 220.00],
        "Bb":  [116.54, 146.83, 174.61],
        "Em":  [164.81, 196.00, 246.94],
        "D":   [146.83, 185.00, 220.00],
        "F#m": [185.00, 220.00, 277.18],
        "A":   [220.00, 277.18, 329.63],
        "E":   [164.81, 207.65, 246.94],
        "Cm":  [130.81, 155.56, 196.00],
        "Ab":  [103.83, 130.81, 155.56],
        "Eb":  [155.56, 196.00, 233.08]
      };

      const progression = songData.chordProgression || ["Am", "F", "C", "G"];

      for (let beat = 0; beat < totalBeats; beat++) {
        const beatTime = this.songStartTime + beat * beatSec;

        // 1. Drums
        if (beat % 2 === 0) {
          this.playKick(beatTime);
        } else {
          this.playSnare(beatTime);
        }

        this.playHiHat(beatTime, false);
        this.playHiHat(beatTime + beatSec * 0.5, (beat % 2 === 1));

        // 2. Chords & Bassline (every 4 beats)
        if (beat % 4 === 0) {
          const chordName = progression[Math.floor(beat / 4) % progression.length];
          const freqs = chordMap[chordName] || chordMap["Am"];
          this.playChordPad(freqs, beatTime, beatSec * 3.8);

          const rootFreq = freqs[0] * 0.5;
          // Walking 8th-note bassline
          this.playBassNote(rootFreq, beatTime, beatSec * 0.9);
          this.playBassNote(rootFreq * 1.25, beatTime + beatSec, beatSec * 0.9);
          this.playBassNote(rootFreq * 1.5, beatTime + beatSec * 2, beatSec * 0.9);
          this.playBassNote(rootFreq * 1.25, beatTime + beatSec * 3, beatSec * 0.9);

          // Rhythmic Arpeggio Hooks
          freqs.forEach((f, idx) => {
            this.playArpNote(f, beatTime + idx * (beatSec * 0.5), beatSec * 0.4);
          });
        }
      }
    } else {
      this.performanceStartTime = performance.now() + 2000;
    }
  }

  getSongTime() {
    if (!this.isPlaying) return 0;
    if (this.ctx && this.ctx.state !== 'suspended') {
      return this.ctx.currentTime - this.songStartTime;
    } else {
      return (performance.now() - this.performanceStartTime) / 1000;
    }
  }

  stopSong() {
    this.isPlaying = false;
  }
}

window.audioEngine = new GitFunkAudioEngine();
