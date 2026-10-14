/**
 * GITFUNK CHARACTER RENDERER & ANIMATOR
 * Premium, ultra-expressive 60 FPS vector character rigs.
 * Sophisticated, non-neon colorful palette with dynamic mouth phonemes,
 * animated hair physics, glowing accessories, and expressive direction poses.
 */

class CharacterRenderer {
  constructor() {
    this.playerPose = 'idle';
    this.playerPoseTimer = 0;

    this.opponentPose = 'idle';
    this.opponentPoseTimer = 0;

    this.speakerBeatScale = 1.0;
    this.stageBounce = 0;
  }

  triggerPlayerPose(pose, duration = 0.30) {
    this.playerPose = pose;
    this.playerPoseTimer = duration;
  }

  triggerOpponentPose(pose, duration = 0.30) {
    this.opponentPose = pose;
    this.opponentPoseTimer = duration;
  }

  triggerBeat() {
    this.speakerBeatScale = 1.30;
    this.stageBounce = 4.5;
  }

  update(dt) {
    if (this.playerPoseTimer > 0) {
      this.playerPoseTimer -= dt;
      if (this.playerPoseTimer <= 0) {
        this.playerPose = 'idle';
      }
    }

    if (this.opponentPoseTimer > 0) {
      this.opponentPoseTimer -= dt;
      if (this.opponentPoseTimer <= 0) {
        this.opponentPose = 'idle';
      }
    }

    this.speakerBeatScale += (1.0 - this.speakerBeatScale) * 14 * dt;
    this.stageBounce += (0 - this.stageBounce) * 10 * dt;
  }

  render(ctx, width, height, songTime, opponentId = 'octobot', playerId = 'juana') {
    ctx.save();

    // 1. Stage Lighting & Platform
    this.renderStage(ctx, width, height, songTime);

    // 2. Center Speakers & Mascot "Gitty DJ"
    this.renderSpeakersAndGitty(ctx, width * 0.5, height * 0.72, songTime);

    // 3. Opponent Character (Left Stage)
    const oppX = width * 0.22;
    const oppY = height * 0.76;
    this.renderCharacterById(ctx, opponentId, oppX, oppY, this.opponentPose, songTime, false);

    // 4. Player Character (Right Stage)
    const playerX = width * 0.78;
    const playerY = height * 0.76;
    this.renderCharacterById(ctx, playerId || 'juana', playerX, playerY, this.playerPose, songTime, true);

    ctx.restore();
  }

  renderCharacterById(ctx, charId, x, y, pose, songTime, isPlayer = false) {
    ctx.save();
    if (charId === 'octobot') {
      this.renderOctoBot(ctx, x, y, pose, songTime, isPlayer);
    } else if (charId === 'glitch') {
      this.renderGlitchMonster(ctx, x, y, pose, songTime, isPlayer);
    } else if (charId === 'framework') {
      this.renderFrameworkMaster(ctx, x, y, pose, songTime, isPlayer);
    } else if (charId === 'vite') {
      this.renderTurboVite(ctx, x, y, pose, songTime, isPlayer);
    } else if (charId === 'dragon') {
      this.renderCyberDragon(ctx, x, y, pose, songTime, isPlayer);
    } else {
      this.renderJuana(ctx, x, y, pose, songTime, isPlayer);
    }
    ctx.restore();
  }

  // ============================================================
  // STAGE, SPOTLIGHTS & SPEAKERS
  // ============================================================
  renderStage(ctx, width, height, songTime) {
    const beamAngle = Math.sin(songTime * 2.2) * 0.14;

    // Left Spotlight (Soft Indigo/Violet glow)
    ctx.save();
    ctx.translate(width * 0.22, 0);
    ctx.rotate(beamAngle);
    const grad1 = ctx.createLinearGradient(0, 0, 0, height);
    grad1.addColorStop(0, 'rgba(139, 92, 246, 0.22)');
    grad1.addColorStop(0.6, 'rgba(139, 92, 246, 0.06)');
    grad1.addColorStop(1, 'transparent');
    ctx.fillStyle = grad1;
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.lineTo(40, 0);
    ctx.lineTo(210, height);
    ctx.lineTo(-210, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Right Spotlight (Soft Sky-Blue glow)
    ctx.save();
    ctx.translate(width * 0.78, 0);
    ctx.rotate(-beamAngle);
    const grad2 = ctx.createLinearGradient(0, 0, 0, height);
    grad2.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
    grad2.addColorStop(0.6, 'rgba(56, 189, 248, 0.06)');
    grad2.addColorStop(1, 'transparent');
    ctx.fillStyle = grad2;
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.lineTo(40, 0);
    ctx.lineTo(210, height);
    ctx.lineTo(-210, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Stage Platform (Clean Slate with Subtle Rim)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.85 + this.stageBounce, width * 0.45, 70, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner Subtle Arc
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.85 + this.stageBounce, width * 0.41, 60, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  renderSpeakersAndGitty(ctx, x, y, songTime) {
    ctx.save();
    ctx.translate(x, y + this.stageBounce);

    const scale = this.speakerBeatScale;

    // Dual Speaker System Cabinet
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(-96, -58, 192, 120, 14);
    ctx.fill();
    ctx.stroke();

    // Metallic Corner Protectors
    ctx.fillStyle = '#4b5563';
    [[-96, -58], [80, -58], [-96, 46], [80, 46]].forEach(([cx, cy]) => {
      ctx.fillRect(cx, cy, 16, 16);
    });

    // Left Subwoofer (Deep Indigo Rim)
    ctx.save();
    ctx.translate(-48, 10);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#030712';
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3.5;
    ctx.stroke();
    // Inner Dust Cap
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right Subwoofer (Sky Blue Rim)
    ctx.save();
    ctx.translate(48, 10);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#030712';
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.5;
    ctx.stroke();
    // Inner Dust Cap
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Equalizer LED Display Center Bar
    ctx.fillStyle = '#030712';
    ctx.fillRect(-32, -48, 64, 22);
    ctx.strokeStyle = '#1f2937';
    ctx.strokeRect(-32, -48, 64, 22);

    for (let i = 0; i < 6; i++) {
      const eqHeight = 4 + Math.abs(Math.sin(songTime * 12 + i * 1.1)) * 13;
      ctx.fillStyle = i % 2 === 0 ? '#10b981' : '#38bdf8';
      ctx.fillRect(-26 + i * 9, -28 - eqHeight, 6, eqHeight);
    }

    // Mascot "Gitty DJ" sitting comfortably on top
    const gittyBob = Math.sin(songTime * 8) * 4;
    ctx.translate(0, -70 + gittyBob);

    // Gitty Dress
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(-18, 20);
    ctx.lineTo(18, 20);
    ctx.lineTo(12, -4);
    ctx.lineTo(-12, -4);
    ctx.closePath();
    ctx.fill();

    // Gitty Head
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, -16, 17, 0, Math.PI * 2);
    ctx.fill();

    // Cat Ear Headphones
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-16, -26); ctx.lineTo(-26, -38); ctx.lineTo(-9, -30); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(16, -26); ctx.lineTo(26, -38); ctx.lineTo(9, -30); ctx.closePath(); ctx.fill();

    // Headphone Arc
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, -20, 18, Math.PI * 0.8, Math.PI * 0.2, true);
    ctx.stroke();

    // Face Details
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-5, -15, 2.5, 0, Math.PI * 2);
    ctx.arc(5, -15, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -10, 4, 0, Math.PI);
    ctx.stroke();

    // Cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.beginPath();
    ctx.arc(-10, -11, 3.5, 0, Math.PI * 2);
    ctx.arc(10, -11, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ============================================================
  // 1. JUANA "CODE-GIRL" (PROTAGONISTA)
  // ============================================================
  renderJuana(ctx, x, y, pose, songTime, isPlayer = true) {
    ctx.save();
    ctx.translate(x, y);
    if (!isPlayer) ctx.scale(-1, 1);

    let dx = 0, dy = 0, rot = 0;
    const idleBob = Math.sin(songTime * 8) * 5;
    const hairSway = Math.cos(songTime * 8) * 3;

    if (pose === 'idle') {
      dy = idleBob;
    } else if (pose === 'left') {
      dx = -24; dy = -8; rot = -0.14;
    } else if (pose === 'down') {
      dy = 18; dx = 3; rot = 0.04;
    } else if (pose === 'up') {
      dy = -28; rot = -0.06;
    } else if (pose === 'right') {
      dx = 26; dy = -10; rot = 0.14;
    } else if (pose === 'miss') {
      dx = (Math.random() - 0.5) * 8;
      dy = 10;
    }

    ctx.translate(dx, dy);
    ctx.rotate(rot);

    // Ground Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.38)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 38, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Legs & Dark Denim Trousers
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-16, -46, 11, 52, 4);
    ctx.roundRect(6, -46, 11, 52, 4);
    ctx.fill();

    // Sneakers (Sky Blue body with clean white sole & laces)
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(-21, 2, 17, 12, 3);
    ctx.roundRect(5, 2, 17, 12, 3);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-21, 10, 17, 4);
    ctx.fillRect(5, 10, 17, 4);

    // 2. Stylish Indigo Developer Hoodie
    const hoodieGrad = ctx.createLinearGradient(0, -98, 0, -38);
    hoodieGrad.addColorStop(0, '#6366f1');
    hoodieGrad.addColorStop(1, '#4338ca');
    ctx.fillStyle = hoodieGrad;
    ctx.beginPath();
    ctx.roundRect(-23, -98, 46, 58, 14);
    ctx.fill();

    // Git Branch Emblem on Chest
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -86);
    ctx.lineTo(0, -62);
    ctx.moveTo(0, -76);
    ctx.quadraticCurveTo(9, -74, 9, -66);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(0, -86, 3, 0, Math.PI * 2);
    ctx.arc(0, -62, 3, 0, Math.PI * 2);
    ctx.arc(9, -66, 3, 0, Math.PI * 2);
    ctx.fill();

    // Hoodie Cords
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-6, -92);
    ctx.lineTo(-8, -68);
    ctx.moveTo(6, -92);
    ctx.lineTo(8, -68);
    ctx.stroke();

    // 3. Head & Skin Tone
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -120, 23, 0, Math.PI * 2);
    ctx.fill();

    // Blush Cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.38)';
    ctx.beginPath();
    ctx.arc(-12, -116, 4.5, 0, Math.PI * 2);
    ctx.arc(12, -116, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Layered Violet Hair with Highlights
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(0, -126, 26, Math.PI * 0.85, Math.PI * 2.15);
    ctx.fill();

    // Flowing bangs & side locks with physics sway
    ctx.beginPath();
    ctx.moveTo(-25, -124);
    ctx.quadraticCurveTo(-30 + hairSway, -96, -19, -94);
    ctx.lineTo(-14, -114);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(25, -124);
    ctx.quadraticCurveTo(30 - hairSway, -96, 19, -94);
    ctx.lineTo(14, -114);
    ctx.closePath();
    ctx.fill();

    // 5. Cat-Ear Cyber Headphones
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(0, -127, 25, Math.PI * 0.8, Math.PI * 0.2, true);
    ctx.stroke();

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(-28, -128, 8, 18, 4);
    ctx.roundRect(20, -128, 8, 18, 4);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-24, -119, 3.5, 0, Math.PI * 2);
    ctx.arc(24, -119, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 6. Expressive Anime Eyes
    if (pose === 'miss') {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      // Dizzy X-Eyes
      ctx.beginPath();
      ctx.moveTo(-13, -124); ctx.lineTo(-5, -116);
      ctx.moveTo(-5, -124); ctx.lineTo(-13, -116);
      ctx.moveTo(5, -124); ctx.lineTo(13, -116);
      ctx.moveTo(13, -124); ctx.lineTo(5, -116);
      ctx.stroke();
    } else {
      // Large Expressive Eyes with Gradient Irises
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(-9, -120, 5, 7, 0, 0, Math.PI * 2);
      ctx.ellipse(9, -120, 5, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iris Sky Highlights
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(-9, -119, 3, 0, Math.PI * 2);
      ctx.arc(9, -119, 3, 0, Math.PI * 2);
      ctx.fill();
      // White Catchlights
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-10, -122, 1.5, 0, Math.PI * 2);
      ctx.arc(8, -122, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Expressive Singing Mouth
    if (pose === 'idle') {
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, -109, 4.5, 0, Math.PI);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.ellipse(0, -108, 5.5, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Teeth bar
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-3.5, -112, 7, 3);
    }

    // 8. Microphone in Hand with Dynamic Audio Cord
    ctx.save();
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.roundRect(15, -88, 7, 18, 3);
    ctx.fill();
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.arc(18.5, -94, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // S-curve mic cord
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(18, -70);
    ctx.quadraticCurveTo(28, -50, 16, -30);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // ============================================================
  // 2. OCTO-BOT (GUARDIÁN DEL REPOSITORIO GITHUB)
  // ============================================================
  renderOctoBot(ctx, x, y, pose, songTime, isPlayer = false) {
    ctx.save();
    ctx.translate(x, y);
    if (isPlayer) ctx.scale(-1, 1);

    let dx = 0, dy = Math.sin(songTime * 6) * 6, rot = 0;
    if (pose === 'left') { dx = -22; rot = -0.15; }
    else if (pose === 'right') { dx = 22; rot = 0.15; }
    else if (pose === 'up') { dy -= 26; }
    else if (pose === 'down') { dy += 18; }

    ctx.translate(dx, dy);
    ctx.rotate(rot);

    // Floating Plasma Thruster Glow Underneath
    const thrusterGrad = ctx.createRadialGradient(0, 16, 2, 0, 26, 30);
    thrusterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.65)');
    thrusterGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = thrusterGrad;
    ctx.beginPath();
    ctx.ellipse(0, 22, 28, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. 6 Articulated Mechanical Tentacles with Joint Nodes
    for (let i = 0; i < 6; i++) {
      const angleOffset = (i - 2.5) * 0.46;
      const wave = Math.sin(songTime * 8 + i * 1.1) * 15;

      ctx.save();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 6.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(angleOffset * 22, -10);
      ctx.quadraticCurveTo(angleOffset * 38 + wave, 22, angleOffset * 52 + wave * 1.4, 44);
      ctx.stroke();

      // Glowing Suction Nodes
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(angleOffset * 52 + wave * 1.4, 44, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Titanium Dome Body with Gloss Shading
    const bodyGrad = ctx.createRadialGradient(-12, -52, 6, 0, -46, 46);
    bodyGrad.addColorStop(0, '#38bdf8');
    bodyGrad.addColorStop(0.55, '#0369a1');
    bodyGrad.addColorStop(1, '#082f49');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, -46, 40, Math.PI, 0, false);
    ctx.lineTo(38, -10);
    ctx.quadraticCurveTo(0, 0, -38, -10);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 2.8;
    ctx.stroke();

    // 3. LED Screen Digital Visor
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(-30, -62, 60, 28, 9);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // 4. Expressive Digital LED Matrix Eyes
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;

    if (pose === 'idle') {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(-20, -47); ctx.lineTo(-13, -54); ctx.lineTo(-6, -47);
      ctx.moveTo(6, -47); ctx.lineTo(13, -54); ctx.lineTo(20, -47);
      ctx.stroke();
    } else if (pose === 'left' || pose === 'right') {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(-18, -54); ctx.lineTo(-9, -48); ctx.lineTo(-18, -42);
      ctx.moveTo(18, -54); ctx.lineTo(9, -48); ctx.lineTo(18, -42);
      ctx.stroke();
    } else {
      // Big Circular Singing Eyes
      ctx.beginPath();
      ctx.arc(-13, -48, 5.5, 0, Math.PI * 2);
      ctx.arc(13, -48, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Antenna with Blinking Commit Status LED
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, -86);
    ctx.lineTo(0, -108);
    ctx.stroke();

    ctx.fillStyle = Math.sin(songTime * 10) > 0 ? '#10b981' : '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, -111, 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ============================================================
  // 3. GLITCH NULL (CONFLICTO DE RAMAS)
  // ============================================================
  renderGlitchMonster(ctx, x, y, pose, songTime, isPlayer = false) {
    ctx.save();
    ctx.translate(x, y);
    if (isPlayer) ctx.scale(-1, 1);

    const glitchOffset = (Math.random() - 0.5) * (pose !== 'idle' ? 14 : 6);
    const floatY = Math.sin(songTime * 5) * 9;
    ctx.translate(glitchOffset, floatY);

    // Shadow Entity Cloak Wisps
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.beginPath();
    ctx.moveTo(-38, 16);
    ctx.lineTo(38, 16);
    ctx.lineTo(28, -62);
    ctx.lineTo(-28, -62);
    ctx.closePath();
    ctx.fill();

    // Chromatic Aberration Layers (Rose & Cyan)
    ctx.fillStyle = 'rgba(244, 63, 94, 0.45)';
    ctx.fillRect(-34 + glitchOffset, -104, 68, 52);
    ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
    ctx.fillRect(-30 - glitchOffset, -102, 68, 52);

    // CRT Monitor Head Frame
    ctx.fillStyle = '#090d16';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.roundRect(-32, -106, 64, 56, 8);
    ctx.fill();
    ctx.stroke();

    // Terminal Screen
    ctx.fillStyle = '#020617';
    ctx.fillRect(-26, -100, 52, 44);

    // Scanlines Effect
    ctx.fillStyle = 'rgba(244, 63, 94, 0.18)';
    for (let l = -98; l < -58; l += 5) {
      ctx.fillRect(-26, l, 52, 2);
    }

    // ASCII Corrupted Text
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    if (pose === 'idle') {
      ctx.fillText('<< HEAD', 0, -74);
    } else if (pose === 'miss') {
      ctx.fillText('404_NULL', 0, -74);
    } else {
      ctx.fillText('!MERGE!', 0, -74);
    }

    // Floating Matrix Data Bits
    for (let i = 0; i < 5; i++) {
      const bitX = Math.sin(songTime * 6 + i * 1.8) * 48;
      const bitY = -62 + Math.cos(songTime * 4 + i * 1.4) * 32;
      ctx.fillStyle = i % 2 === 0 ? '#f43f5e' : '#38bdf8';
      ctx.fillRect(bitX, bitY, 8, 8);
    }

    ctx.restore();
  }

  // ============================================================
  // 4. MASTER FRAMEWORK (DJ ANDROIDE)
  // ============================================================
  renderFrameworkMaster(ctx, x, y, pose, songTime, isPlayer = false) {
    ctx.save();
    ctx.translate(x, y);
    if (isPlayer) ctx.scale(-1, 1);

    const bob = Math.sin(songTime * 8) * 4.5;
    ctx.translate(0, bob);

    // High-Tech Cyber Armor Body
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.roundRect(-26, -92, 52, 64, 12);
    ctx.fill();
    ctx.stroke();

    // Armor Plate Accents
    ctx.fillStyle = '#312e81';
    ctx.fillRect(-18, -80, 36, 12);

    // Legs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-19, -28, 13, 38);
    ctx.fillRect(6, -28, 13, 38);
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(-21, 5, 17, 9);
    ctx.fillRect(4, 5, 17, 9);

    // Cyber Visor Helmet
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.arc(0, -118, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(-22, -125, 44, 17, 7);
    ctx.fill();
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Rotating Framework Icon
    const fwIcons = ['⚛️', '💚', '🅰️', '🧡'];
    const fwIdx = Math.floor(songTime * 1.6) % fwIcons.length;
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(fwIcons[fwIdx], 0, -111);

    // Floating Holographic Turntable Deck
    ctx.save();
    ctx.translate(0, -52);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.28)';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 56, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Spinning Vinyl Hologram
    ctx.save();
    ctx.rotate(songTime * 8);
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.ellipse(0, 0, 38, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.restore();

    ctx.restore();
  }

  // ============================================================
  // 5. TURBO-VITE SPEEDSTER
  // ============================================================
  renderTurboVite(ctx, x, y, pose, songTime, isPlayer = false) {
    ctx.save();
    ctx.translate(x, y);
    if (isPlayer) ctx.scale(-1, 1);

    const speedTilt = (pose !== 'idle') ? 0.18 : 0.06;
    const hoverY = Math.sin(songTime * 12) * 5.5;
    ctx.translate(0, hoverY);
    ctx.rotate(speedTilt);

    // Twin Rocket Thruster Flares
    const flameH = 15 + Math.random() * 14;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-17, 6); ctx.lineTo(-11, 6 + flameH); ctx.lineTo(-5, 6);
    ctx.moveTo(5, 6); ctx.lineTo(11, 6 + flameH); ctx.lineTo(17, 6);
    ctx.fill();

    // Aerodynamic Amber Suit
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.roundRect(-20, -88, 40, 58, 9);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Legs & Speed Boots
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-15, -30, 10, 38);
    ctx.fillRect(5, -30, 10, 38);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-19, 1, 15, 9);
    ctx.fillRect(4, 1, 15, 9);

    // Head & Golden Lightning Hair
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(0, -112, 19, 0, Math.PI * 2);
    ctx.fill();

    // Lightning Bolt Spikes
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-17, -122); ctx.lineTo(-34, -142); ctx.lineTo(-13, -130);
    ctx.lineTo(0, -150); ctx.lineTo(9, -130);
    ctx.lineTo(28, -144); ctx.lineTo(15, -122);
    ctx.closePath();
    ctx.fill();

    // Speed Goggles Visor
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.roundRect(-19, -118, 38, 13, 5);
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-15, -114, 11, 4.5);
    ctx.fillRect(4, -114, 11, 4.5);

    // Electric Sparks
    if (Math.random() < 0.4) {
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(24, -62);
      ctx.lineTo(36, -72);
      ctx.lineTo(30, -82);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ============================================================
  // 6. CYBER-DAEMON DRAGON (JEFE CLI)
  // ============================================================
  renderCyberDragon(ctx, x, y, pose, songTime, isPlayer = false) {
    ctx.save();
    ctx.translate(x, y);
    if (isPlayer) ctx.scale(-1, 1);

    const wingFlap = Math.sin(songTime * 8) * 0.38;
    const breath = Math.sin(songTime * 6) * 4.5;
    ctx.translate(0, breath);

    // 1. Articulated Mechanical Cyber Wings
    ctx.save();
    ctx.translate(-22, -92);
    ctx.rotate(-0.3 + wingFlap);
    ctx.fillStyle = '#7f1d1d';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-76, -55);
    ctx.lineTo(-48, 12);
    ctx.lineTo(-22, 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(22, -92);
    ctx.rotate(0.3 - wingFlap);
    ctx.fillStyle = '#7f1d1d';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(76, -55);
    ctx.lineTo(48, 12);
    ctx.lineTo(22, 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 2. Armored Body & Magma Reactor Core
    const bodyGrad = ctx.createLinearGradient(0, -115, 0, -20);
    bodyGrad.addColorStop(0, '#450a0a');
    bodyGrad.addColorStop(1, '#1c1917');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(-32, -104, 64, 84, 15);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3.2;
    ctx.stroke();

    // Magma Core Diamond
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, -84);
    ctx.lineTo(15, -62);
    ctx.lineTo(0, -40);
    ctx.lineTo(-15, -62);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // 3. Cyber Horns & Dragon Head
    ctx.fillStyle = '#292524';
    ctx.beginPath();
    ctx.roundRect(-26, -140, 52, 40, 9);
    ctx.fill();

    // Cyber Horns
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-19, -140); ctx.lineTo(-42, -172); ctx.lineTo(-11, -150);
    ctx.moveTo(19, -140); ctx.lineTo(42, -172); ctx.lineTo(11, -150);
    ctx.fill();

    // Glowing Crimson Eyes
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.moveTo(-18, -126); ctx.lineTo(-7, -130); ctx.lineTo(-9, -122);
    ctx.moveTo(18, -126); ctx.lineTo(7, -130); ctx.lineTo(9, -122);
    ctx.fill();

    // Dragon Jaws & Breathing Plasma Blast
    if (pose !== 'idle') {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-18, -110, 36, 12);
      ctx.fillStyle = 'rgba(251, 146, 60, 0.85)';
      ctx.beginPath();
      ctx.arc(0, -98 + Math.sin(songTime * 20) * 4, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

window.CharacterRenderer = CharacterRenderer;
