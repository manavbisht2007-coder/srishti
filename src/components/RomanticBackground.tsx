import React, { useEffect, useRef } from 'react';

interface RomanticEntity {
  id: string;
  type: 'dove' | 'letter' | 'cupid' | 'balloon' | 'swans';
  x: number;
  y: number;
  scale: number;
  speedX: number;
  direction: 1 | -1; // 1: moving right, -1: moving left
  bobPhase: number;
  bobSpeed: number;
  wingPhase: number;
  wingSpeed: number;
}

interface AmbientHeart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  wobbleSpeed: number;
  wobbleOffset: number;
  opacity: number;
  hueOffset: number;
}

export const RomanticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Ambient floating sweet hearts & fairy sparkles
    const hearts: AmbientHeart[] = [];
    for (let i = 0; i < 32; i++) {
      hearts.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 0.7 + 0.35,
        wobbleSpeed: Math.random() * 0.03 + 0.015,
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.45 + 0.25,
        hueOffset: Math.random() * 15,
      });
    }

    // Continuous motion romantic characters:
    // 1. Cute Flying Love Dove (with flapping wings carrying a rose)
    // 2. Winged Love Letter (pastel pink envelope with fluttering angel wings)
    // 3. Cute Chibi Cupid (floating with tiny angel wings & heart bow)
    // 4. Pastel Heart Hot Air Balloon (gently bobbing across the sky)
    // 5. Twin Love Swans (gliding together forming a heart curve)
    const entities: RomanticEntity[] = [
      {
        id: 'dove-1',
        type: 'dove',
        x: width * 0.15,
        y: height * 0.18,
        scale: 0.85,
        speedX: 0.75,
        direction: 1,
        bobPhase: 0,
        bobSpeed: 0.025,
        wingPhase: 0,
        wingSpeed: 0.14,
      },
      {
        id: 'letter-1',
        type: 'letter',
        x: width * 0.8,
        y: height * 0.28,
        scale: 0.8,
        speedX: -0.6,
        direction: -1,
        bobPhase: Math.PI / 3,
        bobSpeed: 0.035,
        wingPhase: 0,
        wingSpeed: 0.18,
      },
      {
        id: 'balloon-1',
        type: 'balloon',
        x: width * 0.25,
        y: height * 0.52,
        scale: 0.9,
        speedX: 0.45,
        direction: 1,
        bobPhase: Math.PI * 0.8,
        bobSpeed: 0.018,
        wingPhase: 0,
        wingSpeed: 0.05,
      },
      {
        id: 'cupid-1',
        type: 'cupid',
        x: width * 0.88,
        y: height * 0.68,
        scale: 0.82,
        speedX: -0.7,
        direction: -1,
        bobPhase: Math.PI * 1.4,
        bobSpeed: 0.03,
        wingPhase: 0,
        wingSpeed: 0.16,
      },
      {
        id: 'swans-1',
        type: 'swans',
        x: width * 0.12,
        y: height * 0.85,
        scale: 0.88,
        speedX: 0.5,
        direction: 1,
        bobPhase: Math.PI / 2,
        bobSpeed: 0.02,
        wingPhase: 0,
        wingSpeed: 0.06,
      },
    ];

    let animId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      // 1. Soft romantic ambient sunbeams / rose-gold light streaks
      ctx.save();
      for (let i = 0; i < 4; i++) {
        const beamX = width * 0.2 + i * (width * 0.22) + Math.sin(time * 0.4 + i) * 25;
        const grad = ctx.createLinearGradient(beamX, 0, beamX + 70, height);
        grad.addColorStop(0, 'rgba(255, 182, 193, 0.18)'); // soft baby pink
        grad.addColorStop(0.5, 'rgba(255, 228, 236, 0.08)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(beamX - 35, 0);
        ctx.lineTo(beamX + 45, 0);
        ctx.lineTo(beamX + 170, height);
        ctx.lineTo(beamX - 70, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 2. Continuous floating sweet hearts & fairy sparkles
      ctx.save();
      for (let i = 0; i < hearts.length; i++) {
        const h = hearts[i];
        h.y -= h.speedY;
        h.x += Math.sin(time * h.wobbleSpeed * 60 + h.wobbleOffset) * 0.45;

        if (h.y < -30) {
          h.y = height + 30;
          h.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.fillStyle = `rgba(251, 143, 175, ${h.opacity})`;
        ctx.shadowColor = 'rgba(255, 182, 193, 0.6)';
        ctx.shadowBlur = 6;

        // Draw cute baby pink heart
        const s = h.size * 0.5;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.35);
        ctx.bezierCurveTo(-s * 0.7, -s * 0.6, -s * 1.3, s * 0.2, 0, s * 1.3);
        ctx.bezierCurveTo(s * 1.3, s * 0.2, s * 0.7, -s * 0.6, 0, s * 0.35);
        ctx.fill();

        // Tiny heart highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(-s * 0.3, 0, s * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
      ctx.restore();

      // 3. Update & render continuous motion romantic characters
      entities.forEach((ent) => {
        ent.x += ent.speedX;
        ent.bobPhase += ent.bobSpeed;
        ent.wingPhase += ent.wingSpeed;

        const bobY = Math.sin(ent.bobPhase) * 11;
        const currentY = ent.y + bobY;

        // Wrap around screen boundaries with margin
        const margin = 260;
        if (ent.direction === 1 && ent.x > width + margin) {
          ent.x = -margin;
        } else if (ent.direction === -1 && ent.x < -margin) {
          ent.x = width + margin;
        }

        ctx.save();
        ctx.translate(ent.x, currentY);
        ctx.scale(ent.scale * (ent.direction === -1 ? -1 : 1), ent.scale);

        if (ent.type === 'dove') {
          drawCuteLoveDove(ctx, ent.wingPhase);
        } else if (ent.type === 'letter') {
          drawCuteWingedLetter(ctx, ent.wingPhase);
        } else if (ent.type === 'cupid') {
          drawCuteChibiCupid(ctx, ent.wingPhase, time);
        } else if (ent.type === 'balloon') {
          drawCuteHeartBalloon(ctx, time);
        } else if (ent.type === 'swans') {
          drawCuteLoveSwans(ctx, ent.wingPhase);
        }

        ctx.restore();
      });

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full opacity-75"
      style={{ touchAction: 'none' }}
    />
  );
};

// =========================================================================
// Cute Cartoon Romantic Continuous Motion Renderers
// =========================================================================

// 1. CUTE LOVE DOVE (White & baby pink dove carrying a tiny rose stem)
function drawCuteLoveDove(ctx: CanvasRenderingContext2D, wingPhase: number) {
  const wingFlap = Math.sin(wingPhase) * 18;

  ctx.save();

  // Tail feathers
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(-28, 0);
  ctx.lineTo(-44, -8);
  ctx.lineTo(-46, -1);
  ctx.lineTo(-44, 6);
  ctx.closePath();
  ctx.fill();

  // Dove Body (Plump round pearlescent white)
  const bodyGrad = ctx.createLinearGradient(0, -18, 0, 18);
  bodyGrad.addColorStop(0, '#ffffff');
  bodyGrad.addColorStop(0.7, '#fff0f5');
  bodyGrad.addColorStop(1, '#ffd1dc');

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 28, 16, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Flapping Wing (Back wing)
  ctx.fillStyle = '#fce4ec';
  ctx.beginPath();
  ctx.moveTo(-4, -6);
  ctx.quadraticCurveTo(-14, -28 - wingFlap, 4, -32 - wingFlap);
  ctx.quadraticCurveTo(8, -18 - wingFlap * 0.5, 6, -6);
  ctx.closePath();
  ctx.fill();

  // Flapping Wing (Front wing)
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffd1dc';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-2, -2);
  ctx.quadraticCurveTo(-12, -26 - wingFlap, 6, -30 - wingFlap);
  ctx.quadraticCurveTo(12, -16 - wingFlap * 0.5, 8, -2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Little head
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(22, -6, 11, 0, Math.PI * 2);
  ctx.fill();

  // Golden / peach beak
  ctx.fillStyle = '#f6ad55';
  ctx.beginPath();
  ctx.moveTo(31, -7);
  ctx.lineTo(40, -4);
  ctx.lineTo(31, -2);
  ctx.closePath();
  ctx.fill();

  // Rose stem held in beak
  ctx.strokeStyle = '#48bb78';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(34, -4);
  ctx.quadraticCurveTo(42, 4, 46, 12);
  ctx.stroke();

  // Tiny red rose flower bud
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(47, 13, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.arc(46, 12, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Big cute glossy eye
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(24, -8, 2.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(23.2, -9, 1, 0, Math.PI * 2);
  ctx.fill();

  // Sweet rosy blush
  ctx.fillStyle = 'rgba(251, 113, 133, 0.6)';
  ctx.beginPath();
  ctx.arc(19, -4, 3.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 2. CUTE WINGED LOVE LETTER (Pastel baby pink envelope with fluttering angel wings)
function drawCuteWingedLetter(ctx: CanvasRenderingContext2D, wingPhase: number) {
  const flap = Math.sin(wingPhase) * 14;

  ctx.save();

  // Flapping angel wings behind envelope
  // Left Wing
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#fbcfe8';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-16, -2);
  ctx.quadraticCurveTo(-34, -22 - flap, -42, -14 - flap);
  ctx.quadraticCurveTo(-36, 4 - flap * 0.5, -16, 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right Wing
  ctx.beginPath();
  ctx.moveTo(16, -2);
  ctx.quadraticCurveTo(34, -22 - flap, 42, -14 - flap);
  ctx.quadraticCurveTo(36, 4 - flap * 0.5, 16, 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Baby pink envelope body
  ctx.fillStyle = '#fff0f5';
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-22, -14, 44, 28, 4);
  ctx.fill();
  ctx.stroke();

  // Envelope flap fold lines
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-22, -14);
  ctx.lineTo(0, 2);
  ctx.lineTo(22, -14);
  ctx.stroke();

  // Red wax seal heart
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  const s = 5.5;
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(-s * 0.7, -s * 0.6, -s * 1.3, s * 0.2, 0, s * 1.3);
  ctx.bezierCurveTo(s * 1.3, s * 0.2, s * 0.7, -s * 0.6, 0, s * 0.35);
  ctx.fill();

  ctx.restore();
}

// 3. CUTE CHIBI CUPID (Floating with tiny angel wings & heart arrow)
function drawCuteChibiCupid(ctx: CanvasRenderingContext2D, wingPhase: number, time: number) {
  const wingFlap = Math.sin(wingPhase) * 12;

  ctx.save();

  // Tiny angel wings
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffd1dc';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-6, -4);
  ctx.quadraticCurveTo(-20, -24 - wingFlap, -4, -22 - wingFlap);
  ctx.quadraticCurveTo(0, -12, -2, -2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Chibi Body (soft warm ivory skin)
  ctx.fillStyle = '#ffe4d6';
  ctx.beginPath();
  ctx.ellipse(0, 6, 12, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // White cloth sash
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(0, 8, 11, 4, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Round Chibi Head
  ctx.fillStyle = '#ffe4d6';
  ctx.beginPath();
  ctx.arc(0, -10, 14, 0, Math.PI * 2);
  ctx.fill();

  // Blonde / golden curls
  ctx.fillStyle = '#fcd34d';
  ctx.beginPath();
  ctx.arc(-8, -20, 5.5, 0, Math.PI * 2);
  ctx.arc(0, -23, 6, 0, Math.PI * 2);
  ctx.arc(8, -20, 5.5, 0, Math.PI * 2);
  ctx.arc(-11, -14, 4.5, 0, Math.PI * 2);
  ctx.arc(11, -14, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Golden Halo ring
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(0, -28, 10, 3.5, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Cute closed eye smiles
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-4, -10, 2.5, Math.PI * 0.1, Math.PI * 0.9);
  ctx.arc(4, -10, 2.5, Math.PI * 0.1, Math.PI * 0.9);
  ctx.stroke();

  // Rosy cheeks
  ctx.fillStyle = 'rgba(251, 113, 133, 0.7)';
  ctx.beginPath();
  ctx.arc(-7, -7, 3, 0, Math.PI * 2);
  ctx.arc(7, -7, 3, 0, Math.PI * 2);
  ctx.fill();

  // Tiny Cupid Bow with pink heart arrow
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(14, 2, 8, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();

  // Heart arrow tip
  ctx.fillStyle = '#f43f5e';
  const s = 4;
  ctx.save();
  ctx.translate(18, 2);
  ctx.rotate(Math.PI / 2);
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(-s * 0.7, -s * 0.6, -s * 1.3, s * 0.2, 0, s * 1.3);
  ctx.bezierCurveTo(s * 1.3, s * 0.2, s * 0.7, -s * 0.6, 0, s * 0.35);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

// 4. CUTE PASTEL HEART HOT AIR BALLOON
function drawCuteHeartBalloon(ctx: CanvasRenderingContext2D, time: number) {
  const sway = Math.sin(time * 1.5) * 0.05;

  ctx.save();
  ctx.rotate(sway);

  // Big Sweet Heart-Shaped Balloon Canopy
  const s = 22;
  const balloonGrad = ctx.createLinearGradient(0, -s * 2, 0, 0);
  balloonGrad.addColorStop(0, '#f472b6'); // hot baby pink
  balloonGrad.addColorStop(0.5, '#fbcfe8'); // pastel pink
  balloonGrad.addColorStop(1, '#fff0f5');

  ctx.fillStyle = balloonGrad;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.5);
  ctx.bezierCurveTo(-s * 1.4, -s * 2.2, -s * 2.2, -s * 0.4, 0, s * 1.1);
  ctx.bezierCurveTo(s * 2.2, -s * 0.4, s * 1.4, -s * 2.2, 0, -s * 0.5);
  ctx.fill();

  // Decorative white scallop stripes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.5);
  ctx.quadraticCurveTo(-s * 0.8, -s * 0.8, 0, s * 1.1);
  ctx.moveTo(0, -s * 0.5);
  ctx.quadraticCurveTo(s * 0.8, -s * 0.8, 0, s * 1.1);
  ctx.stroke();

  // Ropes
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-10, s * 1.1);
  ctx.lineTo(-6, s * 1.7);
  ctx.moveTo(10, s * 1.1);
  ctx.lineTo(6, s * 1.7);
  ctx.stroke();

  // Wicker Basket
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.roundRect(-8, s * 1.7, 16, 11, 2);
  ctx.fill();

  // Tiny bunting flags on basket
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(-6, s * 1.7);
  ctx.lineTo(-2, s * 1.7);
  ctx.lineTo(-4, s * 1.7 + 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(2, s * 1.7);
  ctx.lineTo(6, s * 1.7);
  ctx.lineTo(4, s * 1.7 + 4);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// 5. CUTE PAIR OF LOVE SWANS (Gliding gracefully with necks forming a heart)
function drawCuteLoveSwans(ctx: CanvasRenderingContext2D, wingPhase: number) {
  const ripple = Math.sin(wingPhase * 1.2) * 2;

  ctx.save();

  // Water ripple reflection
  ctx.strokeStyle = 'rgba(255, 182, 193, 0.5)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, 14 + ripple, 36, 4, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Left Swan
  ctx.save();
  ctx.translate(-14, 0);

  // Swan body
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(0, 6, 16, 9, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Left Swan curved neck (forms left half of heart)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(8, 4);
  ctx.bezierCurveTo(16, -6, 12, -22, 14, -14);
  ctx.stroke();

  // Head & Beak
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(14, -14, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(17, -13, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(13.5, -15, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right Swan
  ctx.save();
  ctx.translate(14, 0);
  ctx.scale(-1, 1);

  // Swan body
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(0, 6, 16, 9, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Right Swan curved neck (forms right half of heart)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(8, 4);
  ctx.bezierCurveTo(16, -6, 12, -22, 14, -14);
  ctx.stroke();

  // Head & Beak
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(14, -14, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(17, -13, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(13.5, -15, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Glowing heart above where their beaks meet
  ctx.fillStyle = '#f43f5e';
  const hs = 4;
  ctx.save();
  ctx.translate(0, -18);
  ctx.beginPath();
  ctx.moveTo(0, hs * 0.35);
  ctx.bezierCurveTo(-hs * 0.7, -hs * 0.6, -hs * 1.3, hs * 0.2, 0, hs * 1.3);
  ctx.bezierCurveTo(hs * 1.3, hs * 0.2, hs * 0.7, -hs * 0.6, 0, hs * 0.35);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}
