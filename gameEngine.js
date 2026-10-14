/**
 * GITFUNK MAIN GAME ENGINE
 * Rhythm game loop, sustain hold-notes, chords, unlockable playable characters,
 * level launch modal with live difficulty picker & real-time high score display,
 * pure colorful vector arrows (no bounding boxes/outlines), and resilient UI navigation.
 */

class GitFunkGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.charRenderer = null;

    // States: 'TITLE', 'SONG_SELECT', 'CHAR_SELECT', 'GAMEPLAY', 'PAUSED', 'VICTORY', 'GAMEOVER', 'CODEX', 'TRIVIA'
    this.state = 'TITLE';

    // Current Song & Difficulty
    this.currentSong = null;
    this.selectedDifficulty = 'normal'; // 'easy', 'normal', 'hard'
    this.selectedPlayerCharacter = 'juana'; // 'juana', 'octobot', 'glitch', 'framework', 'vite', 'dragon'
    this.unlockedCharacters = ['juana'];

    this.songNotes = [];
    this.activeOpponentNotes = [];
    this.activePlayerNotes = [];

    // Active holding notes (for sustain notes)
    this.holdingNotes = [null, null, null, null]; // per lane

    // Timing & Physics (Balanced, enjoyable arrow speeds)
    this.lastTime = 0;
    this.scrollSpeed = 520;
    this.downscroll = true;
    this.receptorY = 0;

    // Player Stats & Health
    this.health = 0.5;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.hits = { sick: 0, good: 0, bad: 0, miss: 0 };
    this.totalNotes = 0;

    // Trivia Arena state & auto-advance timer
    this.triviaIndex = 0;
    this.triviaScore = 0;
    this.triviaStreak = 0;
    this.triviaAdvanceTimer = null;

    // High Scores Store & Unlocks
    this.highScores = this.loadHighScores();
    this.loadUnlockedCharacters();

    // Particles system
    this.particles = [];

    // Modern colorful lane palette: Purple, Sky-Blue, Emerald-Green, Rose-Pink
    this.laneColors = ['#a855f7', '#38bdf8', '#10b981', '#f43f5e'];
    this.laneKeys = [
      ['KeyD', 'ArrowLeft', 'KeyA'],
      ['KeyF', 'ArrowDown', 'KeyS'],
      ['KeyJ', 'ArrowUp', 'KeyW'],
      ['KeyK', 'ArrowRight', 'KeyD']
    ];
    this.activeKeys = [false, false, false, false];

    this.lastBeat = -1;
    this.ratingTimer = null;
    this.countdownTimer = null;
  }

  init() {
    this.canvas = document.getElementById('game-canvas') || document.getElementById('stage-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }
    this.charRenderer = new CharacterRenderer();

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.setupInputListeners();
    this.setupUIListeners();
    this.buildCodexUI();
    this.buildSongSelectUI();
    this.buildCharacterSelectUI();
    this.updateGlobalScoreBadge();

    requestAnimationFrame((t) => this.gameLoop(t));
    console.log("GitFunk Engine Initialized Successfully!");
  }

  // ==========================================
  // PERSISTENCE: HIGH SCORES & CHARACTER UNLOCKS
  // ==========================================
  loadHighScores() {
    try {
      const saved = localStorage.getItem('gitfunk_highscores_v2');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  loadUnlockedCharacters() {
    try {
      const savedChar = localStorage.getItem('gitfunk_selected_character');
      if (savedChar) this.selectedPlayerCharacter = savedChar;

      // Base unlocked protagonist
      const unlocked = ['juana'];

      // Check level completions across all 3 difficulties (Easy, Normal, Hard)
      (window.SONGS_DATA || []).forEach(song => {
        const scores = this.highScores[song.id];
        if (scores && scores.easy && scores.normal && scores.hard) {
          if (!unlocked.includes(song.opponentId)) {
            unlocked.push(song.opponentId);
          }
        }
      });

      this.unlockedCharacters = unlocked;
    } catch (e) {
      this.unlockedCharacters = ['juana'];
    }
  }

  saveHighScore(songId, difficulty, score, accuracy, maxCombo, grade) {
    if (!this.highScores[songId]) {
      this.highScores[songId] = {};
    }

    const currentBest = this.highScores[songId][difficulty] || { score: 0 };
    const isNewRecord = score > currentBest.score;

    if (isNewRecord) {
      this.highScores[songId][difficulty] = {
        score: score,
        accuracy: accuracy,
        maxCombo: maxCombo,
        grade: grade,
        date: new Date().toLocaleDateString()
      };
      try {
        localStorage.setItem('gitfunk_highscores_v2', JSON.stringify(this.highScores));
      } catch (e) {}
    }

    // Refresh unlocks
    this.loadUnlockedCharacters();
    this.updateGlobalScoreBadge();
    return isNewRecord;
  }

  getHighScore(songId, difficulty) {
    if (this.highScores[songId] && this.highScores[songId][difficulty]) {
      return this.highScores[songId][difficulty];
    }
    return null;
  }

  getTotalGlobalScore() {
    let total = 0;
    for (const sId in this.highScores) {
      for (const diff in this.highScores[sId]) {
        total += this.highScores[sId][diff].score || 0;
      }
    }
    return total;
  }

  updateGlobalScoreBadge() {
    const total = this.getTotalGlobalScore();
    const el = document.getElementById('nav-global-score');
    if (el) el.textContent = total.toLocaleString();
  }

  resizeCanvas() {
    if (!this.canvas) {
      this.canvas = document.getElementById('game-canvas') || document.getElementById('stage-canvas');
      if (this.canvas) this.ctx = this.canvas.getContext('2d');
    }
    const container = document.getElementById('screen-gameplay') || document.querySelector('.screens-viewport') || document.body;
    if (!container || !this.canvas) return;

    const w = container.clientWidth || 900;
    const h = container.clientHeight || 550;

    if (w > 0 && h > 0) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.receptorY = this.downscroll ? (this.canvas.height - 85) : 85;
    }
  }

  drawRoundRect(ctx, x, y, width, height, radius) {
    radius = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // ==========================================
  // INPUT HANDLING (TAP + SUSTAIN HOLD)
  // ==========================================
  setupInputListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        if (this.state === 'GAMEPLAY' || this.state === 'PAUSED') {
          this.togglePause();
        }
        return;
      }

      if (this.state !== 'GAMEPLAY') return;

      for (let lane = 0; lane < 4; lane++) {
        if (this.laneKeys[lane].includes(e.code)) {
          if (!this.activeKeys[lane]) {
            this.activeKeys[lane] = true;
            this.onPlayerPress(lane);
          }
          e.preventDefault();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.state !== 'GAMEPLAY') return;
      for (let lane = 0; lane < 4; lane++) {
        if (this.laneKeys[lane].includes(e.code)) {
          this.activeKeys[lane] = false;
          this.onPlayerRelease(lane);
        }
      }
    });
  }

  onPlayerPress(lane) {
    const poses = ['left', 'down', 'up', 'right'];
    const songTime = window.audioEngine.getSongTime();

    let sickLimit = 0.070;
    let goodLimit = 0.130;
    let badLimit = 0.190;
    let missDamage = 0.045;
    let hitBonus = 0.035;

    if (this.selectedDifficulty === 'easy') {
      sickLimit = 0.085;
      goodLimit = 0.150;
      badLimit = 0.220;
      missDamage = 0.030;
      hitBonus = 0.050;
    } else if (this.selectedDifficulty === 'hard') {
      sickLimit = 0.050;
      goodLimit = 0.095;
      badLimit = 0.145;
      missDamage = 0.065;
      hitBonus = 0.025;
    }

    let closestNote = null;
    let minDiff = 999;

    for (const note of this.activePlayerNotes) {
      if (!note.hit && note.lane === lane) {
        const diff = Math.abs(note.time - songTime);
        if (diff < minDiff && diff <= badLimit) {
          minDiff = diff;
          closestNote = note;
        }
      }
    }

    if (closestNote) {
      closestNote.hit = true;
      let rating = 'bad';
      let scoreGain = 50;
      let healthGain = hitBonus * 0.5;

      if (minDiff <= sickLimit) {
        rating = 'sick';
        scoreGain = this.selectedDifficulty === 'hard' ? 450 : (this.selectedDifficulty === 'normal' ? 350 : 250);
        healthGain = hitBonus * 1.2;
      } else if (minDiff <= goodLimit) {
        rating = 'good';
        scoreGain = this.selectedDifficulty === 'hard' ? 250 : (this.selectedDifficulty === 'normal' ? 200 : 150);
        healthGain = hitBonus;
      }

      this.score += scoreGain;
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      this.hits[rating]++;
      this.health = Math.min(1.0, this.health + healthGain);

      // If hold note, start holding tracking
      if (closestNote.hold && closestNote.hold > 0) {
        closestNote.isHolding = true;
        this.holdingNotes[lane] = closestNote;
      }

      this.charRenderer.triggerPlayerPose(poses[lane]);
      window.audioEngine.playVocal(this.selectedPlayerCharacter, lane, 0, (closestNote.hold ? closestNote.hold + 0.15 : 0.22), !!closestNote.hold);
      window.audioEngine.playHitSound(rating);
      this.showRating(rating);
      this.spawnHitParticles(lane);
      this.updateHUD();

    } else {
      this.hits.miss++;
      this.combo = 0;
      this.health = Math.max(0.0, this.health - missDamage);
      this.score = Math.max(0, this.score - 50);

      this.charRenderer.triggerPlayerPose('miss');
      window.audioEngine.playMissSound();
      this.showRating('miss');
      this.updateHUD();

      if (this.health <= 0.0) {
        this.triggerGameOver();
      }
    }
  }

  onPlayerRelease(lane) {
    if (this.holdingNotes[lane]) {
      const note = this.holdingNotes[lane];
      note.isHolding = false;
      this.holdingNotes[lane] = null;
    }
  }

  // ==========================================
  // LEVEL LAUNCH & DIFFICULTY PICKER MODAL
  // ==========================================
  openSongModal(song) {
    this.currentSong = song;
    const modal = document.getElementById('level-launch-modal');
    if (!modal) {
      this.startSong(song, this.selectedDifficulty);
      return;
    }

    const titleEl = document.getElementById('ll-song-title');
    const bpmEl = document.getElementById('ll-song-bpm');
    const descEl = document.getElementById('ll-song-desc');
    const oppAvatar = document.getElementById('ll-opp-avatar');
    const oppName = document.getElementById('ll-opp-name');
    const oppSub = document.getElementById('ll-opp-sub');

    if (titleEl) titleEl.textContent = `${song.icon} ${song.title}`;
    if (bpmEl) bpmEl.textContent = `⚡ ${song.bpm} BPM`;
    if (descEl) descEl.textContent = song.description;
    if (oppAvatar) oppAvatar.textContent = song.icon;
    if (oppName) oppName.textContent = song.opponentName;
    if (oppSub) oppSub.textContent = song.opponentSubtitle;

    this.updateLevelModalDifficultyButtons();
    modal.classList.add('active');
  }

  selectLevelModalDifficulty(diff) {
    this.selectedDifficulty = diff;
    this.updateLevelModalDifficultyButtons();
  }

  updateLevelModalDifficultyButtons() {
    const btns = document.querySelectorAll('.ll-diff-btn');
    btns.forEach(b => {
      const d = b.getAttribute('data-diff');
      b.classList.toggle('active', d === this.selectedDifficulty);
    });

    const scoreDisplay = document.getElementById('ll-score-display');
    if (scoreDisplay && this.currentSong) {
      const hs = this.getHighScore(this.currentSong.id, this.selectedDifficulty);
      if (hs) {
        scoreDisplay.innerHTML = `
          <div style="color:var(--color-emerald); font-weight:bold; font-size:1rem;">🏆 Récord Guardado: ${hs.score.toLocaleString()} PTS</div>
          <div style="font-size:0.82rem; color:var(--text-muted); margin-top:2px;">Precisión: ${hs.accuracy}% | Max Combo: ${hs.maxCombo} | Rango: ${hs.grade}</div>
        `;
      } else {
        scoreDisplay.innerHTML = `
          <div style="color:var(--color-amber); font-size:0.9rem; font-weight:600;">⭐ ¡Aún no has jugado este nivel en dificultad ${this.selectedDifficulty.toUpperCase()}!</div>
        `;
      }
    }
  }

  startSongFromModal() {
    document.getElementById('level-launch-modal')?.classList.remove('active');
    this.startSong(this.currentSong, this.selectedDifficulty);
  }

  // ==========================================
  // CHARACTER SELECT & UNLOCK SYSTEM
  // ==========================================
  openCharacterSelect() {
    this.buildCharacterSelectUI();
    document.getElementById('char-select-modal')?.classList.add('active');
  }

  buildCharacterSelectUI() {
    const grid = document.getElementById('char-select-grid');
    if (!grid) return;
    grid.innerHTML = '';

    (window.CHARACTERS_DATA || []).forEach(char => {
      const isUnlocked = this.unlockedCharacters.includes(char.id);
      const isSelected = this.selectedPlayerCharacter === char.id;

      const card = document.createElement('div');
      card.className = `char-locker-card ${isUnlocked ? 'unlocked' : 'locked'} ${isSelected ? 'selected' : ''}`;

      card.innerHTML = `
        <div class="char-locker-avatar">${char.icon}</div>
        <h4>${char.name}</h4>
        <p class="char-locker-sub">${char.subtitle}</p>
        <p class="char-locker-desc">${char.description}</p>
        <div class="char-locker-status">
          ${isUnlocked
            ? `<span class="badge-unlocked">${isSelected ? '✅ SELECCIONADO' : 'DESBLOQUEADO'}</span>`
            : `<span class="badge-locked">🔒 ${char.unlockHint}</span>`
          }
        </div>
      `;

      if (isUnlocked) {
        card.onclick = () => {
          this.selectedPlayerCharacter = char.id;
          try {
            localStorage.setItem('gitfunk_selected_character', char.id);
          } catch (e) {}
          this.buildCharacterSelectUI();
          this.updateHUDPlayerAvatar();
        };
      }

      grid.appendChild(card);
    });
  }

  updateHUDPlayerAvatar() {
    const p = (window.CHARACTERS_DATA || []).find(c => c.id === this.selectedPlayerCharacter);
    const hudPlayerHead = document.getElementById('hud-player-avatar');
    if (hudPlayerHead && p) hudPlayerHead.textContent = p.icon;
  }

  // ==========================================
  // HIGH SCORES MODAL
  // ==========================================
  openHighScoresModal() {
    const modal = document.getElementById('highscores-modal');
    if (!modal) return;
    const tableBody = document.getElementById('highscores-table-body');

    if (tableBody) {
      tableBody.innerHTML = '';
      (window.SONGS_DATA || []).forEach(song => {
        const row = document.createElement('tr');
        const easy = this.getHighScore(song.id, 'easy');
        const normal = this.getHighScore(song.id, 'normal');
        const hard = this.getHighScore(song.id, 'hard');

        row.innerHTML = `
          <td>
            <div style="font-weight:700; color:#fff;">${song.icon} ${song.title}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${song.opponentName} • ${song.bpm} BPM</div>
          </td>
          <td>
            <div style="color:${easy ? 'var(--color-emerald)' : 'var(--text-muted)'}; font-weight:700;">${easy ? easy.score.toLocaleString() : '---'}</div>
            <small style="font-size:0.72rem; color:var(--text-muted);">${easy ? `${easy.accuracy}% (${easy.grade})` : 'Sin jugar'}</small>
          </td>
          <td>
            <div style="color:${normal ? 'var(--color-amber)' : 'var(--text-muted)'}; font-weight:700;">${normal ? normal.score.toLocaleString() : '---'}</div>
            <small style="font-size:0.72rem; color:var(--text-muted);">${normal ? `${normal.accuracy}% (${normal.grade})` : 'Sin jugar'}</small>
          </td>
          <td>
            <div style="color:${hard ? 'var(--color-rose)' : 'var(--text-muted)'}; font-weight:700;">${hard ? hard.score.toLocaleString() : '---'}</div>
            <small style="font-size:0.72rem; color:var(--text-muted);">${hard ? `${hard.accuracy}% (${hard.grade})` : 'Sin jugar'}</small>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }
    modal.classList.add('active');
  }

  // ==========================================
  // SCREEN SWITCHER & NAVIGATION
  // ==========================================
  switchScreen(screenId) {
    clearTimeout(this.triviaAdvanceTimer);
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));

    const aliases = {
      'title-screen': 'screen-title',
      'screen-title': 'screen-title',
      'song-select-screen': 'screen-songs',
      'screen-songs': 'screen-songs',
      'gameplay-screen': 'screen-gameplay',
      'screen-gameplay': 'screen-gameplay',
      'codex-screen': 'screen-codex',
      'screen-codex': 'screen-codex',
      'trivia-screen': 'screen-trivia-arena',
      'screen-trivia-arena': 'screen-trivia-arena'
    };
    const targetId = aliases[screenId] || screenId;
    const target = document.getElementById(targetId) || document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
    }
    this.closeAllModals();
  }

  backToMenu() {
    clearTimeout(this.triviaAdvanceTimer);
    window.audioEngine.stopSong();
    this.switchScreen('screen-title');
    this.state = 'TITLE';
    this.closeAllModals();
  }

  closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }

  startStoryMode(difficulty = 'normal') {
    this.selectedDifficulty = difficulty;
    this.startSong(window.SONGS_DATA[0], difficulty);
  }

  openFreeplay() {
    window.audioEngine.init();
    this.buildSongSelectUI();
    this.switchScreen('screen-songs');
    this.state = 'SONG_SELECT';
  }

  openCodex() {
    window.audioEngine.init();
    this.switchScreen('screen-codex');
    this.state = 'CODEX';
    if (window.CODEX_DATA && window.CODEX_DATA.length > 0) {
      this.loadCodexItem(window.CODEX_DATA[0]);
    }
  }

  openSettings() {
    window.audioEngine.init();
    document.getElementById('settings-modal')?.classList.add('active');
  }

  // ==========================================
  // GAMEPLAY LIFECYCLE
  // ==========================================
  startSong(song, difficulty = 'normal') {
    window.audioEngine.init();
    this.closeAllModals();

    this.currentSong = song || window.SONGS_DATA[0];
    this.selectedDifficulty = difficulty;

    // Balanced arrow speed settings: Easy (440 px/s), Normal (520 px/s), Hard (620 px/s)
    if (difficulty === 'easy') this.scrollSpeed = 440;
    else if (difficulty === 'hard') this.scrollSpeed = 620;
    else this.scrollSpeed = 520;

    const chart = window.generateSongChart(this.currentSong.bpm, this.currentSong.duration, difficulty);
    this.songNotes = chart.map(n => ({ ...n, hit: false, missed: false, isHolding: false }));

    this.activeOpponentNotes = this.songNotes.filter(n => n.isOpponent);
    this.activePlayerNotes = this.songNotes.filter(n => !n.isOpponent);
    this.totalNotes = this.activePlayerNotes.length;
    this.holdingNotes = [null, null, null, null];

    this.health = 0.5;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.hits = { sick: 0, good: 0, bad: 0, miss: 0 };
    this.particles = [];
    this.lastBeat = -1;

    this.switchScreen('screen-gameplay');
    this.state = 'GAMEPLAY';

    requestAnimationFrame(() => this.resizeCanvas());

    const trackElem = document.getElementById('hud-track-title');
    if (trackElem) trackElem.textContent = this.currentSong.title;

    const oppHead = document.getElementById('hud-opp-avatar');
    if (oppHead) oppHead.textContent = this.currentSong.icon || '🐙';
    this.updateHUDPlayerAvatar();

    this.updateHUD();
    window.audioEngine.startSong(this.currentSong);
    this.runCountdown();
  }

  runCountdown() {
    const banner = document.getElementById('countdown-banner');
    if (!banner) return;

    banner.style.display = 'block';
    banner.classList.add('show');
    banner.textContent = "3";
    window.audioEngine.playCountdownBeep(false);

    clearTimeout(this.countdownTimer);
    this.countdownTimer = setTimeout(() => {
      if (this.state !== 'GAMEPLAY') return;
      banner.textContent = "2";
      window.audioEngine.playCountdownBeep(false);

      setTimeout(() => {
        if (this.state !== 'GAMEPLAY') return;
        banner.textContent = "1";
        window.audioEngine.playCountdownBeep(false);

        setTimeout(() => {
          if (this.state !== 'GAMEPLAY') return;
          banner.textContent = "GO!";
          window.audioEngine.playCountdownBeep(true);

          setTimeout(() => {
            banner.classList.remove('show');
            banner.style.display = 'none';
          }, 450);
        }, 500);
      }, 500);
    }, 500);
  }

  togglePause() {
    const modal = document.getElementById('modal-pause');
    if (this.state === 'GAMEPLAY') {
      this.state = 'PAUSED';
      if (window.audioEngine.ctx) window.audioEngine.ctx.suspend();
      modal?.classList.add('active');
    } else if (this.state === 'PAUSED') {
      this.state = 'GAMEPLAY';
      if (window.audioEngine.ctx) window.audioEngine.ctx.resume();
      modal?.classList.remove('active');
    }
  }

  restartSong() {
    this.closeAllModals();
    this.startSong(this.currentSong, this.selectedDifficulty);
  }

  nextSong() {
    this.closeAllModals();
    const curIdx = window.SONGS_DATA.findIndex(s => s.id === this.currentSong.id);
    const nextIdx = (curIdx + 1) % window.SONGS_DATA.length;
    this.startSong(window.SONGS_DATA[nextIdx], this.selectedDifficulty);
  }

  triggerVictory() {
    this.state = 'VICTORY';
    window.audioEngine.stopSong();
    window.audioEngine.playVictoryFanfare();

    const accuracy = this.calculateAccuracy();
    let grade = 'S';
    if (accuracy < 65) grade = 'D';
    else if (accuracy < 78) grade = 'C';
    else if (accuracy < 88) grade = 'B';
    else if (accuracy < 96) grade = 'A';

    const prevUnlocked = [...this.unlockedCharacters];

    const isNewRecord = this.saveHighScore(
      this.currentSong.id,
      this.selectedDifficulty,
      this.score,
      accuracy,
      this.maxCombo,
      grade
    );

    // Check if new character was unlocked
    const newUnlocked = this.unlockedCharacters.filter(c => !prevUnlocked.includes(c));

    const scoreEl = document.getElementById('v-score');
    const comboEl = document.getElementById('v-combo');
    const accEl = document.getElementById('v-acc');
    const recordBanner = document.getElementById('victory-new-record');
    const unlockBanner = document.getElementById('victory-unlock-alert');

    if (scoreEl) scoreEl.textContent = this.score.toLocaleString();
    if (comboEl) comboEl.textContent = this.maxCombo;
    if (accEl) accEl.textContent = `${accuracy}% (${grade})`;
    if (recordBanner) {
      recordBanner.style.display = isNewRecord ? 'block' : 'none';
    }
    if (unlockBanner) {
      if (newUnlocked.length > 0) {
        const charData = (window.CHARACTERS_DATA || []).find(c => c.id === newUnlocked[0]);
        unlockBanner.innerHTML = `🎉 ¡HAS DESBLOQUEADO A <strong>${charData ? charData.name : newUnlocked[0]}</strong> (${charData ? charData.icon : '✨'}) COMO PERSONAJE JUGABLE!`;
        unlockBanner.style.display = 'block';
      } else {
        unlockBanner.style.display = 'none';
      }
    }

    const modal = document.getElementById('modal-victory');
    modal?.classList.add('active');
  }

  triggerGameOver() {
    this.state = 'GAMEOVER';
    window.audioEngine.stopSong();
    window.audioEngine.playGameOverFanfare();

    const scoreEl = document.getElementById('go-score');
    if (scoreEl) scoreEl.textContent = this.score.toLocaleString();

    const modal = document.getElementById('modal-gameover');
    modal?.classList.add('active');
  }

  calculateAccuracy() {
    const totalHits = this.hits.sick + this.hits.good + this.hits.bad + this.hits.miss;
    if (totalHits === 0) return 100;
    const weighted = (this.hits.sick * 100 + this.hits.good * 75 + this.hits.bad * 40) / (totalHits * 100);
    return Math.round(weighted * 100);
  }

  // ==========================================
  // MAIN GAME LOOP & RENDERING
  // ==========================================
  gameLoop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    if (this.state === 'GAMEPLAY') {
      this.updateGameplay(dt);
    }

    if (this.state === 'GAMEPLAY' || this.state === 'PAUSED') {
      this.renderGameplay();
    }

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  updateGameplay(dt) {
    const songTime = window.audioEngine.getSongTime();
    const poses = ['left', 'down', 'up', 'right'];

    if (this.currentSong && songTime >= 0) {
      const beat = Math.floor(songTime * (this.currentSong.bpm / 60));
      if (beat !== this.lastBeat && beat >= 0) {
        this.lastBeat = beat;
        this.charRenderer.triggerBeat();
      }
    }

    // 1. Process Opponent Notes
    for (const note of this.activeOpponentNotes) {
      if (!note.hit && songTime >= note.time) {
        note.hit = true;
        this.charRenderer.triggerOpponentPose(poses[note.lane], (note.hold ? note.hold + 0.15 : 0.28));
        window.audioEngine.playVocal(this.currentSong.opponentId, note.lane, 0, (note.hold ? note.hold + 0.15 : 0.22), !!note.hold);
      }
    }

    // 2. Process Player Missed Notes
    const missTolerance = this.selectedDifficulty === 'hard' ? 0.14 : 0.18;
    for (const note of this.activePlayerNotes) {
      if (!note.hit && !note.missed && (songTime - note.time) > missTolerance) {
        note.missed = true;
        this.hits.miss++;
        this.combo = 0;
        const damage = this.selectedDifficulty === 'hard' ? 0.065 : (this.selectedDifficulty === 'normal' ? 0.045 : 0.030);
        this.health = Math.max(0.0, this.health - damage);
        this.score = Math.max(0, this.score - 50);

        this.charRenderer.triggerPlayerPose('miss');
        window.audioEngine.playMissSound();
        this.showRating('miss');
        this.updateHUD();

        if (this.health <= 0.0) {
          this.triggerGameOver();
          return;
        }
      }
    }

    // 3. Process Active Hold / Sustain Notes for Player
    for (let lane = 0; lane < 4; lane++) {
      const note = this.holdingNotes[lane];
      if (note && note.isHolding) {
        const holdEndTime = note.time + note.hold;
        if (songTime <= holdEndTime) {
          // Continuous scoring while holding
          this.score += 4;
          this.health = Math.min(1.0, this.health + 0.002);
          this.charRenderer.triggerPlayerPose(poses[lane], 0.15);
          if (Math.random() < 0.3) this.spawnHitParticles(lane);
        } else {
          // Completed sustain hold!
          note.isHolding = false;
          this.holdingNotes[lane] = null;
        }
      }
    }

    // 4. Update Characters & Particle Sparks
    this.charRenderer.update(dt);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.size = Math.max(0, p.size - dt * 10);
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // 5. Check Song Finish
    if (this.currentSong && songTime >= this.currentSong.duration) {
      this.triggerVictory();
    }
  }

  renderGameplay() {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const songTime = window.audioEngine.getSongTime();

    ctx.clearRect(0, 0, w, h);

    // 1. Stage & Characters (uses selected player character!)
    this.charRenderer.render(ctx, w, h, songTime, this.currentSong ? this.currentSong.opponentId : 'octobot', this.selectedPlayerCharacter);

    // 2. Highways & Receptors (pure colored arrow silhouettes, no bounding boxes)
    this.renderHighways(ctx, w, h);

    // 3. Scrolling Rhythm Notes & Hold Trails (pure colored arrows, no outlines)
    this.renderNotes(ctx, w, h, songTime);

    // 4. Particle Sparks
    this.renderParticles(ctx);
  }

  renderHighways(ctx, width, height) {
    const receptorY = this.receptorY;
    const laneWidth = 52;
    const gap = 12;
    const totalHighwayWidth = 4 * laneWidth + 3 * gap;

    const oppStartX = width * 0.08;
    const playerStartX = width * 0.92 - totalHighwayWidth;

    for (let i = 0; i < 4; i++) {
      const rx = oppStartX + i * (laneWidth + gap);
      this.drawReceptor(ctx, rx, receptorY, i, false, 0.40);
    }

    for (let i = 0; i < 4; i++) {
      const rx = playerStartX + i * (laneWidth + gap);
      const isPressed = this.activeKeys[i];
      this.drawReceptor(ctx, rx, receptorY, i, isPressed, 1.0);
    }
  }

  drawReceptor(ctx, x, y, lane, pressed, opacity = 1.0) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x + 26, y + 26);

    const scale = pressed ? 0.90 : 1.0;
    ctx.scale(scale, scale);

    // No outer box or rectangle! Pure clean receptor arrow with its color
    if (pressed) {
      ctx.shadowColor = this.laneColors[lane];
      ctx.shadowBlur = 16;
      this.drawArrow(ctx, 0, 0, lane, '#ffffff', 22);
      ctx.shadowBlur = 0;
      this.drawArrow(ctx, 0, 0, lane, this.laneColors[lane], 20);
    } else {
      // Semi-transparent receptor silhouette
      ctx.globalAlpha = opacity * 0.45;
      this.drawArrow(ctx, 0, 0, lane, this.laneColors[lane], 20);
    }
    ctx.restore();
  }

  renderNotes(ctx, width, height, songTime) {
    const laneWidth = 52;
    const gap = 12;
    const totalHighwayWidth = 4 * laneWidth + 3 * gap;

    const oppStartX = width * 0.08;
    const playerStartX = width * 0.92 - totalHighwayWidth;
    const receptorY = this.receptorY;

    const visibleNotes = this.songNotes.filter(n => {
      const timeDiff = n.time - songTime;
      const holdTime = n.hold || 0;
      return (timeDiff + holdTime) > -0.25 && timeDiff < 1.8;
    });

    for (const note of visibleNotes) {
      const startX = note.isOpponent ? oppStartX : playerStartX;
      const nx = startX + note.lane * (laneWidth + gap) + 26;
      const timeDiff = note.time - songTime;
      const distance = timeDiff * this.scrollSpeed;
      const ny = this.downscroll ? (receptorY - distance + 26) : (receptorY + distance + 26);

      // Draw Hold / Sustain Trail if present
      if (note.hold && note.hold > 0) {
        const holdHeight = note.hold * this.scrollSpeed;

        ctx.save();
        ctx.fillStyle = this.laneColors[note.lane];
        ctx.globalAlpha = note.isHolding ? 0.85 : 0.45;
        this.drawRoundRect(ctx, nx - 5, this.downscroll ? (ny - holdHeight) : ny, 10, holdHeight, 5);
        ctx.fill();
        ctx.restore();
      }

      if (note.hit && note.time < songTime - 0.05 && !note.isHolding) continue;

      ctx.save();
      ctx.translate(nx, ny);

      // Pure solid colorful arrow (NO square box, NO outline stroke!)
      this.drawArrow(ctx, 0, 0, note.lane, this.laneColors[note.lane], 22);

      ctx.restore();
    }
  }

  drawArrow(ctx, x, y, lane, color, size) {
    ctx.save();
    ctx.translate(x, y);

    // Lane 0: Left (270 deg / -90 deg), Lane 1: Down (180 deg), Lane 2: Up (0 deg), Lane 3: Right (90 deg)
    const angles = [Math.PI * 1.5, Math.PI, 0, Math.PI * 0.5];
    ctx.rotate(angles[lane]);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.85, size * 0.65);
    ctx.lineTo(size * 0.32, size * 0.42);
    ctx.lineTo(size * 0.32, size * 0.95);
    ctx.lineTo(-size * 0.32, size * 0.95);
    ctx.lineTo(-size * 0.32, size * 0.42);
    ctx.lineTo(-size * 0.85, size * 0.65);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  spawnHitParticles(lane) {
    const laneWidth = 52;
    const gap = 12;
    const totalHighwayWidth = 4 * laneWidth + 3 * gap;
    const playerStartX = this.canvas.width * 0.92 - totalHighwayWidth;

    const px = playerStartX + lane * (laneWidth + gap) + 26;
    const py = this.receptorY + 26;

    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 90;
      this.particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 5,
        color: this.laneColors[lane],
        life: 0.28
      });
    }
  }

  renderParticles(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ==========================================
  // HUD & RATINGS
  // ==========================================
  updateHUD() {
    const healthPercent = Math.max(0, Math.min(100, this.health * 100));
    const fillElem = document.getElementById('health-bar-fill');
    const anchorElem = document.getElementById('health-heads-anchor');

    if (fillElem) fillElem.style.width = `${healthPercent}%`;
    if (anchorElem) anchorElem.style.left = `${100 - healthPercent}%`;

    const scoreElem = document.getElementById('hud-score');
    const comboElem = document.getElementById('hud-combo');
    const accElem = document.getElementById('hud-accuracy');
    const trackElem = document.getElementById('hud-track-title');
    const diffElem = document.getElementById('hud-diff-label');

    if (scoreElem) scoreElem.textContent = this.score.toLocaleString();
    if (comboElem) comboElem.textContent = this.combo;
    if (accElem) accElem.textContent = `${this.calculateAccuracy()}%`;
    if (trackElem && this.currentSong) trackElem.textContent = this.currentSong.title;
    if (diffElem) {
      const diffLabels = { easy: 'FÁCIL 🟢', normal: 'NORMAL 🟡', hard: 'DIFÍCIL 🔴' };
      diffElem.textContent = diffLabels[this.selectedDifficulty] || this.selectedDifficulty.toUpperCase();
    }
  }

  showRating(rating) {
    const popup = document.getElementById('judgment-popup');
    if (!popup) return;

    popup.className = `judgment-popup show judgment-${rating}`;
    const labels = {
      sick: 'PERFECT!! ✨',
      good: 'GREAT! 👍',
      bad: 'OK',
      miss: 'MISS! ❌'
    };
    popup.textContent = labels[rating] || '';

    clearTimeout(this.ratingTimer);
    this.ratingTimer = setTimeout(() => {
      popup.classList.remove('show');
    }, 400);
  }

  // ==========================================
  // UI LISTENERS & BUILDING MENUS
  // ==========================================
  setupUIListeners() {
    document.querySelectorAll('.ll-diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const diff = btn.getAttribute('data-diff') || 'normal';
        this.selectLevelModalDifficulty(diff);
      });
    });
  }

  // ==========================================
  // SONG SELECTION UI
  // ==========================================
  buildSongSelectUI() {
    const listContainer = document.getElementById('song-select-grid');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    (window.SONGS_DATA || []).forEach((song) => {
      const card = document.createElement('div');
      card.className = 'song-card';

      const easyScore = this.getHighScore(song.id, 'easy');
      const normScore = this.getHighScore(song.id, 'normal');
      const hardScore = this.getHighScore(song.id, 'hard');

      card.innerHTML = `
        <div class="song-card-top">
          <h4>${song.icon} ${song.title}</h4>
          <div class="song-card-badges">
            <span class="song-badge-bpm">⚡ ${song.bpm} BPM</span>
            <span class="song-badge-rank">${song.difficultyRank}</span>
          </div>
        </div>
        <p>${song.description}</p>

        <div class="song-scores-strip">
          <div><small style="color:var(--color-emerald);">Fácil</small><strong>${easyScore ? easyScore.score.toLocaleString() : '---'}</strong></div>
          <div><small style="color:var(--color-amber);">Normal</small><strong>${normScore ? normScore.score.toLocaleString() : '---'}</strong></div>
          <div><small style="color:var(--color-rose);">Difícil</small><strong>${hardScore ? hardScore.score.toLocaleString() : '---'}</strong></div>
        </div>

        <button class="btn-clean primary" style="width:100%; font-size:0.85rem;">Elegir Dificultad & Jugar ▶</button>
      `;

      card.onclick = () => {
        this.openSongModal(song);
      };

      listContainer.appendChild(card);
    });
  }

  // ==========================================
  // CODEX UI
  // ==========================================
  buildCodexUI() {
    const sidebar = document.getElementById('codex-index-list');
    if (!sidebar) return;

    sidebar.innerHTML = '';
    (window.CODEX_DATA || []).forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.className = `codex-tab-item ${idx === 0 ? 'active' : ''}`;
      btn.innerHTML = `
        <span style="background:rgba(99,102,241,0.25); padding:2px 8px; border-radius:6px; font-size:0.75rem; color:var(--color-sky); font-weight:bold;">${item.id}</span>
        <span>${item.title.split('. ')[1] || item.title}</span>
      `;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.codex-tab-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.loadCodexItem(item);
      });
      sidebar.appendChild(btn);
    });

    if (window.CODEX_DATA && window.CODEX_DATA[0]) {
      this.loadCodexItem(window.CODEX_DATA[0]);
    }
  }

  loadCodexItem(item) {
    const contentArea = document.getElementById('codex-reader-view');
    if (!contentArea) return;

    contentArea.innerHTML = `
      <div>
        ${item.content}
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <span style="font-size:0.88rem; color:var(--color-emerald); font-weight:600;">💡 Pon a prueba tu conocimiento:</span>
          <button class="btn-clean primary btn-trivia-from-codex">🎯 Ir a la Trivia Arena</button>
        </div>
      </div>
    `;

    contentArea.querySelector('.btn-trivia-from-codex')?.addEventListener('click', () => {
      this.openTrivia();
    });
  }

  // ==========================================
  // TRIVIA ARENA (14 QUESTIONS WITH AUTO-ADVANCE & HINTS)
  // ==========================================
  openTrivia() {
    window.audioEngine.init();
    clearTimeout(this.triviaAdvanceTimer);
    this.triviaIndex = 0;
    this.triviaScore = 0;
    this.triviaStreak = 0;
    this.switchScreen('screen-trivia-arena');
    this.state = 'TRIVIA';
    this.loadTriviaArenaQuestion();
  }

  loadTriviaArenaQuestion() {
    clearTimeout(this.triviaAdvanceTimer);
    const list = window.CODEX_DATA || [];
    if (this.triviaIndex >= list.length) {
      this.showTriviaResults();
      return;
    }

    const item = list[this.triviaIndex];
    const quiz = item.quiz;

    const card = document.getElementById('trivia-active-question-card');
    const resCard = document.getElementById('trivia-results-card');
    const feedbackPanel = document.getElementById('trivia-feedback-panel');
    const hintBox = document.getElementById('trivia-hint-box');
    const hintText = document.getElementById('trivia-hint-text');

    if (card) card.style.display = 'flex';
    if (resCard) resCard.style.display = 'none';
    if (feedbackPanel) feedbackPanel.style.display = 'none';
    if (hintBox) hintBox.classList.remove('show');
    if (hintText) hintText.textContent = quiz.hint || "Lee con atención las opciones para identificar el concepto clave.";

    const phaseLabel = document.getElementById('trivia-phase-label');
    if (phaseLabel) phaseLabel.textContent = `Pregunta ${this.triviaIndex + 1} de ${list.length}`;

    const streakCount = document.getElementById('trivia-streak-count');
    if (streakCount) streakCount.textContent = `🔥 Racha: ${this.triviaStreak}`;

    const progressFill = document.getElementById('trivia-progress-fill');
    if (progressFill) progressFill.style.width = `${((this.triviaIndex) / list.length) * 100}%`;

    const questionPrompt = document.getElementById('trivia-question-prompt');
    if (questionPrompt) questionPrompt.textContent = quiz.question;

    const choicesContainer = document.getElementById('trivia-choices-container');
    if (choicesContainer) {
      choicesContainer.innerHTML = '';
      quiz.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'trivia-choice-btn';
        btn.innerHTML = `
          <span class="trivia-choice-letter">${['A', 'B', 'C', 'D'][idx]}</span>
          <span>${opt}</span>
        `;
        btn.onclick = () => this.handleTriviaChoice(idx, quiz.correct, quiz.explanation);
        choicesContainer.appendChild(btn);
      });
    }
  }

  toggleTriviaHint() {
    const hintBox = document.getElementById('trivia-hint-box');
    if (hintBox) {
      hintBox.classList.toggle('show');
    }
  }

  handleTriviaChoice(chosenIdx, correctIdx, explanation) {
    const btns = document.querySelectorAll('.trivia-choice-btn');
    btns.forEach(b => b.disabled = true);

    const feedbackPanel = document.getElementById('trivia-feedback-panel');
    const feedbackTitle = document.getElementById('trivia-feedback-title');
    const feedbackExp = document.getElementById('trivia-feedback-exp');

    if (chosenIdx === correctIdx) {
      if (btns[chosenIdx]) btns[chosenIdx].classList.add('correct');
      window.audioEngine.playHitSound('sick');
      this.triviaStreak++;
      this.triviaScore += 500 + this.triviaStreak * 50;
      if (feedbackTitle) feedbackTitle.innerHTML = `<span style="color:var(--color-emerald)">¡CORRECTO! 🎯 (+${500 + this.triviaStreak * 50} PTS)</span>`;
      if (feedbackPanel) feedbackPanel.className = 'trivia-feedback-panel show correct-fb';

      // Auto-advance to next question smoothly after 1.25s
      clearTimeout(this.triviaAdvanceTimer);
      this.triviaAdvanceTimer = setTimeout(() => {
        this.nextTriviaQuestion();
      }, 1250);
    } else {
      clearTimeout(this.triviaAdvanceTimer);
      if (btns[chosenIdx]) btns[chosenIdx].classList.add('wrong');
      if (btns[correctIdx]) btns[correctIdx].classList.add('correct');
      window.audioEngine.playMissSound();
      this.triviaStreak = 0;
      if (feedbackTitle) feedbackTitle.innerHTML = `<span style="color:var(--color-rose)">¡INCORRECTO! 💡</span>`;
      if (feedbackPanel) feedbackPanel.className = 'trivia-feedback-panel show wrong-fb';
    }

    if (feedbackExp) feedbackExp.textContent = explanation;
  }

  nextTriviaQuestion() {
    clearTimeout(this.triviaAdvanceTimer);
    this.triviaIndex++;
    this.loadTriviaArenaQuestion();
  }

  showTriviaResults() {
    clearTimeout(this.triviaAdvanceTimer);
    const card = document.getElementById('trivia-active-question-card');
    if (card) card.style.display = 'none';
    const resCard = document.getElementById('trivia-results-card');
    if (resCard) {
      resCard.style.display = 'flex';
      const scoreElem = document.getElementById('t-score');
      if (scoreElem) scoreElem.textContent = `+${this.triviaScore.toLocaleString()}`;
    }
    const progressFill = document.getElementById('trivia-progress-fill');
    if (progressFill) progressFill.style.width = `100%`;
  }
}

function launchGitFunk() {
  if (!window.game) {
    window.game = new GitFunkGame();
    window.game.init();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', launchGitFunk);
} else {
  launchGitFunk();
}
