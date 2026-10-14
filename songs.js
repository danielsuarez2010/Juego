/**
 * GITFUNK SONG DATA & RHYTHM NOTE CHARTS
 * Musical call-and-response charts with Hold / Sustain Notes and Double Notes (Chords)
 * Featuring real harmonic structures and progressive difficulty.
 */

function generateSongChart(bpm, duration, difficulty) {
  bpm = bpm || 110;
  duration = duration || 50;
  difficulty = difficulty || 'normal';
  if (difficulty === 'medium') difficulty = 'normal';

  const beatSec = 60 / bpm;
  const notes = [];
  
  // Melodic phrasing phrases (lanes: 0=Left, 1=Down, 2=Up, 3=Right)
  // Structured musical phrases: Intro motif, Verse phrasing, Climax / Chorus
  const phrases = [
    { pattern: [0, 1, 2, 3], holds: [0, 0, 0, 0.5] },
    { pattern: [3, 2, 1, 0], holds: [0, 0, 0, 0.6] },
    { pattern: [0, 2, 1, 3], holds: [0, 0.4, 0, 0.4] },
    { pattern: [1, 0, 3, 2], holds: [0, 0, 0, 0.8] },
    { pattern: [2, 0, 3, 1], holds: [0, 0.5, 0, 0.5] },
    { pattern: [0, 3, 1, 2], holds: [0, 0, 0.6, 0] },
    { pattern: [1, 2, 0, 3], holds: [0, 0.4, 0, 0.7] },
    { pattern: [3, 1, 2, 0], holds: [0, 0, 0, 0.9] }
  ];

  let currentBeat = 4; // 1 measure intro groove, then Call & Response starts on beat 4!
  const totalBeats = Math.floor(duration / beatSec);

  while (currentBeat < totalBeats - 4) {
    const phraseIdx = Math.floor(currentBeat / 8) % phrases.length;
    const { pattern, holds } = phrases[phraseIdx];

    if (difficulty === 'easy') {
      // EASY: 4-beat caller -> 4-beat player echo, simple hold notes
      for (let i = 0; i < pattern.length; i++) {
        const noteBeat = currentBeat + i * (4 / pattern.length);
        const holdSec = (i === 3) ? (beatSec * 0.8) : 0;
        notes.push({
          time: parseFloat((noteBeat * beatSec).toFixed(3)),
          lane: pattern[i],
          isOpponent: true,
          hold: holdSec
        });
      }
      for (let i = 0; i < pattern.length; i++) {
        const noteBeat = currentBeat + 4 + i * (4 / pattern.length);
        const holdSec = (i === 3) ? (beatSec * 0.8) : 0;
        notes.push({
          time: parseFloat((noteBeat * beatSec).toFixed(3)),
          lane: pattern[i],
          isOpponent: false,
          hold: holdSec
        });
      }
      currentBeat += 8;

    } else if (difficulty === 'normal') {
      // NORMAL: Call & response + hold notes + occasional double notes
      for (let i = 0; i < pattern.length; i++) {
        const noteBeat = currentBeat + i * (4 / pattern.length);
        const holdSec = (holds[i] > 0) ? (beatSec * holds[i]) : 0;
        notes.push({
          time: parseFloat((noteBeat * beatSec).toFixed(3)),
          lane: pattern[i],
          isOpponent: true,
          hold: holdSec
        });
      }

      for (let i = 0; i < pattern.length; i++) {
        const noteBeat = currentBeat + 4 + i * (4 / pattern.length);
        const holdSec = (holds[i] > 0) ? (beatSec * holds[i]) : 0;
        notes.push({
          time: parseFloat((noteBeat * beatSec).toFixed(3)),
          lane: pattern[i],
          isOpponent: false,
          hold: holdSec
        });
      }

      // Normal Double Note (Chord) at measure transition
      if (currentBeat % 16 === 8) {
        const doubleTime = parseFloat(((currentBeat + 6.5) * beatSec).toFixed(3));
        notes.push({ time: doubleTime, lane: 0, isOpponent: false, hold: 0, isChord: true });
        notes.push({ time: doubleTime, lane: 3, isOpponent: false, hold: 0, isChord: true });
      }

      currentBeat += 8;

    } else {
      // HARD (DIFÍCIL): Rapid 16th-notes, extensive long sustain holds, frequent double notes & duet measures!
      for (let i = 0; i < pattern.length; i++) {
        const noteBeat = currentBeat + i * (4 / pattern.length);
        const holdSec = (holds[i] > 0) ? (beatSec * holds[i] * 1.2) : 0;
        notes.push({
          time: parseFloat((noteBeat * beatSec).toFixed(3)),
          lane: pattern[i],
          isOpponent: true,
          hold: holdSec
        });

        // Extra 16th note cascade
        if (i === 1) {
          notes.push({
            time: parseFloat(((noteBeat + 0.5) * beatSec).toFixed(3)),
            lane: (pattern[i] + 2) % 4,
            isOpponent: true,
            hold: 0
          });
        }
      }

      for (let i = 0; i < pattern.length; i++) {
        const noteBeat = currentBeat + 4 + i * (4 / pattern.length);
        const holdSec = (holds[i] > 0) ? (beatSec * holds[i] * 1.2) : 0;
        notes.push({
          time: parseFloat((noteBeat * beatSec).toFixed(3)),
          lane: pattern[i],
          isOpponent: false,
          hold: holdSec
        });

        if (i === 1) {
          notes.push({
            time: parseFloat(((noteBeat + 0.5) * beatSec).toFixed(3)),
            lane: (pattern[i] + 2) % 4,
            isOpponent: false,
            hold: 0
          });
        }
      }

      // Hard Double Notes (Chords) on beat 7
      if (currentBeat % 8 === 0) {
        const chordTime = parseFloat(((currentBeat + 7) * beatSec).toFixed(3));
        const lanePair = (currentBeat % 16 === 0) ? [0, 2] : [1, 3];
        notes.push({ time: chordTime, lane: lanePair[0], isOpponent: false, hold: 0, isChord: true });
        notes.push({ time: chordTime, lane: lanePair[1], isOpponent: false, hold: 0, isChord: true });
      }

      // Hard Long Hold Note with overlapping tap
      if (currentBeat % 32 === 24) {
        const longHoldTime = parseFloat(((currentBeat + 4) * beatSec).toFixed(3));
        notes.push({ time: longHoldTime, lane: 1, isOpponent: false, hold: beatSec * 2.5 });
        notes.push({ time: parseFloat(((currentBeat + 5) * beatSec).toFixed(3)), lane: 3, isOpponent: false, hold: 0 });
        notes.push({ time: parseFloat(((currentBeat + 6) * beatSec).toFixed(3)), lane: 2, isOpponent: false, hold: 0 });
      }

      currentBeat += 8;
    }
  }

  notes.sort((a, b) => a.time - b.time);
  return notes;
}

const CHARACTERS_DATA = [
  {
    id: "juana",
    name: "Juana 'Code-Girl'",
    subtitle: "Protagonista Frontend",
    icon: "👩‍💻",
    description: "Desarrolladora apasionada con auriculares rítmicos y micrófono sintetizador.",
    unlockRequiredLevelId: null, // Default character
    unlockHint: "Disponible desde el inicio"
  },
  {
    id: "octobot",
    name: "Octo-Bot",
    subtitle: "El Guardián del Repositorio",
    icon: "🐙",
    description: "Robot pulpo cibernético con 8 tentáculos que dominan ramas y commits.",
    unlockRequiredLevelId: "first-commit",
    unlockHint: "Supera 'First Commit' en Fácil, Normal y Difícil"
  },
  {
    id: "glitch",
    name: "Glitch Null",
    subtitle: "El Conflicto de Ramas",
    icon: "👾",
    description: "Entidad misteriosa nacida de ramas divergentes y errores 404.",
    unlockRequiredLevelId: "merge-conflict",
    unlockHint: "Supera 'Merge Conflict' en Fácil, Normal y Difícil"
  },
  {
    id: "framework",
    name: "Master Framework",
    subtitle: "DJ Cibernético Reactivo",
    icon: "⚡",
    description: "Androide DJ con pantalla que alterna React, Vue, Angular y Svelte.",
    unlockRequiredLevelId: "framework-showdown",
    unlockHint: "Supera 'Framework Showdown' en Fácil, Normal y Difícil"
  },
  {
    id: "vite",
    name: "Turbo-Vite Speedster",
    subtitle: "La Androide de Bundlers Ultrarrápidos",
    icon: "🏎️",
    description: "Androide con propulsores HMR a velocidad instantánea de compilación.",
    unlockRequiredLevelId: "vite-speed",
    unlockHint: "Supera 'Vite Lightning Speed' en Fácil, Normal y Difícil"
  },
  {
    id: "dragon",
    name: "Cyber-Daemon Dragon",
    subtitle: "Jefe Supremo del Kernel y Terminal",
    icon: "🐉",
    description: "Majestuoso dragón cibernético que escupe comandos bash de superusuario.",
    unlockRequiredLevelId: "terminal-dragon",
    unlockHint: "Supera 'Terminal Dragon CLI' en Fácil, Normal y Difícil"
  }
];

const SONGS_DATA = [
  {
    id: "first-commit",
    levelNumber: 1,
    title: "First Commit",
    opponentId: "octobot",
    opponentName: "Octo-Bot",
    opponentSubtitle: "El Guardián del Repositorio",
    bpm: 108,
    duration: 48,
    themeColor: "#38bdf8", // Sky blue clean palette
    chordProgression: ["Am", "F", "C", "G"],
    description: "Aprende los fundamentos de Git, qué es un repositorio y realiza tus primeros commits a compás de funk.",
    icon: "🐙",
    difficultyRank: "⭐☆☆☆☆ (Nivel 1)",
    story: [
      { speaker: "Octo-Bot", avatar: "🐙", text: "¡Beep boop! Bienvenida al repositorio Git, Juana. Para hacer tu primer commit debes dominar el ritmo del código." },
      { speaker: "Juana", avatar: "👩‍💻", text: "¡Lista! Crearé una rama limpia y sincronizaré cada cambio sin errores. ¡Que empiece la música!" }
    ]
  },
  {
    id: "merge-conflict",
    levelNumber: 2,
    title: "Merge Conflict",
    opponentId: "glitch",
    opponentName: "Glitch Null",
    opponentSubtitle: "El Conflicto de Ramas",
    bpm: 125,
    duration: 52,
    themeColor: "#f43f5e", // Rose
    chordProgression: ["Dm", "Bb", "F", "C"],
    description: "¡Alerta de ramas divergentes! Resuelve los conflictos de código y errores de sintaxis a ritmo acelerado.",
    icon: "👾",
    difficultyRank: "⭐⭐☆☆☆ (Nivel 2)",
    story: [
      { speaker: "Glitch Null", avatar: "👾", text: "<<<<<<< HEAD: ¡Error 404! Mis ramas han colisionado con tu código. ¡Jamás harás merge sin romper la build!" },
      { speaker: "Juana", avatar: "👩‍💻", text: "¡Un Merge Conflict! Revisaré las diferencias línea por línea y resolveré este bug con estilo." }
    ]
  },
  {
    id: "framework-showdown",
    levelNumber: 3,
    title: "Framework Showdown",
    opponentId: "framework",
    opponentName: "Master Framework",
    opponentSubtitle: "React vs Angular vs Vue vs Svelte",
    bpm: 140,
    duration: 56,
    themeColor: "#8b5cf6", // Violet
    chordProgression: ["Em", "C", "G", "D"],
    description: "La batalla de los titanes Frontend. Solos de sintetizador multi-hilo y combate de componentes reactivos.",
    icon: "⚡",
    difficultyRank: "⭐⭐⭐☆☆ (Nivel 3)",
    story: [
      { speaker: "Master Framework", avatar: "⚡", text: "Soy el guardián del Virtual DOM y los compiladores reactivos. ¿Podrás dominar React, Angular, Vue y Svelte en un solo compás?" },
      { speaker: "Juana", avatar: "👩‍💻", text: "¡Conozco su arquitectura de componentes y estado reactivo! ¡Vamos a dar el concierto definitivo!" }
    ]
  },
  {
    id: "vite-speed",
    levelNumber: 4,
    title: "Vite Lightning Speed",
    opponentId: "vite",
    opponentName: "Turbo-Vite Speedster",
    opponentSubtitle: "La Androide de Bundlers Ultrarrápidos",
    bpm: 156,
    duration: 54,
    themeColor: "#f59e0b", // Warm Amber
    chordProgression: ["F#m", "D", "A", "E"],
    description: "¡Velocidad extrema de Hot Module Replacement (HMR)! Ritmo frenético de Drum & Bass que pondrá a prueba tus reflejos.",
    icon: "🏎️",
    difficultyRank: "⭐⭐⭐⭐☆ (Nivel 4 - Rápido)",
    story: [
      { speaker: "Turbo-Vite", avatar: "🏎️", text: "¡Hola, Juana! Con Vite y ES Modules los bundles se recargan a la velocidad de la luz. ¡A ver si tus dedos resisten este tempo de 156 BPM!" },
      { speaker: "Juana", avatar: "👩‍💻", text: "¡Cero tiempo de espera en compilación! Mis dedos están en modo turbo HMR. ¡Acepto el desafío!" }
    ]
  },
  {
    id: "terminal-dragon",
    levelNumber: 5,
    title: "Terminal Dragon CLI",
    opponentId: "dragon",
    opponentName: "Cyber-Daemon Dragon",
    opponentSubtitle: "El Jefe Supremo del Kernel y la Terminal",
    bpm: 172,
    duration: 60,
    themeColor: "#ef4444", // Red
    chordProgression: ["Cm", "Ab", "Eb", "Bb"],
    description: "¡Dificultad Extrema! El dragón de la terminal lanza ráfagas de comandos `sudo` y `git push --force` con solos vertiginosos.",
    icon: "🐉",
    difficultyRank: "⭐⭐⭐⭐⭐ (Nivel 5 - Jefe Extremo)",
    story: [
      { speaker: "Cyber-Daemon", avatar: "🐉", text: "¡GROAAARR! Soy el Daemon raíz del sistema operativo. ¡Solo quien domine la terminal y el teclado sobrevivirá a mis comandos destructivos!" },
      { speaker: "Juana", avatar: "👩‍💻", text: "¡Tengo permisos de superusuario y la consola en mis manos! ¡No hay comando que no pueda ejecutar a tiempo!" }
    ]
  },
  {
    id: "pages-fiesta",
    levelNumber: 6,
    title: "GitHub Pages Fiesta",
    opponentId: "octobot",
    opponentName: "Octo-Bot & Gitty DJ",
    opponentSubtitle: "¡Despliegue a Producción!",
    bpm: 134,
    duration: 50,
    themeColor: "#10b981", // Emerald Green
    chordProgression: ["G", "Em", "C", "D"],
    description: "Celebra la publicación de tu proyecto web en GitHub Pages con un ritmo disco alegre y energizante.",
    icon: "🚀",
    difficultyRank: "⭐⭐⭐☆☆ (Nivel 6 - Celebración)",
    story: [
      { speaker: "Octo-Bot", avatar: "🐙", text: "¡Build completado y pruebas pasadas con éxito! Tu sitio web está listo para desplegarse gratis en GitHub Pages." },
      { speaker: "Juana", avatar: "👩‍💻", text: "¡Directo a producción para que todo el mundo pueda jugarlo en internet! ¡Fiesta en el servidor!" }
    ]
  }
];

window.generateSongChart = generateSongChart;
window.CHARACTERS_DATA = CHARACTERS_DATA;
window.SONGS_DATA = SONGS_DATA;
