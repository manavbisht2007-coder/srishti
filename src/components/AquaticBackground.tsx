import React, { useEffect, useRef } from 'react';

interface SeaCreature {
  id: string;
  type: 'seal' | 'otter' | 'shark' | 'beluga' | 'whale';
  x: number;
  y: number;
  scale: number;
  speedX: number;
  direction: 1 | -1; // 1: moving right, -1: moving left
  depth: number;
  bobPhase: number;
  bobSpeed: number;
  tailPhase: number;
  spoutTimer?: number;
  bubblesTimer?: number;
}

interface AmbientBubble {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  wobbleSpeed: number;
  wobbleOffset: number;
  opacity: number;
}

export const AquaticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initial ambient rising bubbles
    const bubbles: AmbientBubble[] = [];
    for (let i = 0; i < 28; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 6 + 3,
        speedY: Math.random() * 0.9 + 0.5,
        wobbleSpeed: Math.random() * 0.04 + 0.02,
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.4 + 0.25,
      });
    }

    // Initialize the 5 distinct cute cartoon creatures requested:
    // 1. Cute Seal
    // 2. Cute Otter
    // 3. Cute Shark
    // 4. Cute Beluga Whale
    // 5. Cute Normal Whale
    const creatures: SeaCreature[] = [
      {
        id: 'beluga-1',
        type: 'beluga',
        x: width * 0.15,
        y: height * 0.22,
        scale: 0.85,
        speedX: 0.7,
        direction: 1,
        depth: 0.8,
        bobPhase: 0,
        bobSpeed: 0.025,
        tailPhase: 0,
        bubblesTimer: 0,
      },
      {
        id: 'otter-1',
        type: 'otter',
        x: width * 0.7,
        y: height * 0.16,
        scale: 0.8,
        speedX: -0.45,
        direction: -1,
        depth: 0.95,
        bobPhase: Math.PI / 3,
        bobSpeed: 0.035,
        tailPhase: 0,
      },
      {
        id: 'seal-1',
        type: 'seal',
        x: width * 0.4,
        y: height * 0.48,
        scale: 0.75,
        speedX: 0.85,
        direction: 1,
        depth: 0.85,
        bobPhase: Math.PI,
        bobSpeed: 0.03,
        tailPhase: 0,
      },
      {
        id: 'shark-1',
        type: 'shark',
        x: width * 0.85,
        y: height * 0.65,
        scale: 0.8,
        speedX: -0.9,
        direction: -1,
        depth: 0.9,
        bobPhase: Math.PI * 1.5,
        bobSpeed: 0.04,
        tailPhase: 0,
      },
      {
        id: 'whale-1',
        type: 'whale',
        x: width * 0.2,
        y: height * 0.82,
        scale: 1.05,
        speedX: 0.55,
        direction: 1,
        depth: 0.75,
        bobPhase: Math.PI / 2,
        bobSpeed: 0.018,
        tailPhase: 0,
        spoutTimer: 0,
      },
    ];

    let animId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      // 1. Draw subtle ambient sunbeams caustics
      ctx.save();
      for (let i = 0; i < 4; i++) {
        const beamX = width * 0.25 + i * (width * 0.2) + Math.sin(time * 0.5 + i) * 30;
        const grad = ctx.createLinearGradient(beamX, 0, beamX + 60, height);
        grad.addColorStop(0, 'rgba(202, 240, 248, 0.12)');
        grad.addColorStop(0.6, 'rgba(144, 224, 239, 0.04)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(beamX - 40, 0);
        ctx.lineTo(beamX + 40, 0);
        ctx.lineTo(beamX + 160, height);
        ctx.lineTo(beamX - 80, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 2. Draw & update ambient rising bubbles
      ctx.save();
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.y -= b.speedY;
        b.x += Math.sin(time * b.wobbleSpeed * 60 + b.wobbleOffset) * 0.4;

        if (b.y < -20) {
          b.y = height + 20;
          b.x = Math.random() * width;
        }

        ctx.fillStyle = 'rgba(202, 240, 248, 0.22)';
        ctx.strokeStyle = 'rgba(144, 224, 239, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Bubble highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Draw & update each cute cartoon creature
      creatures.forEach((c) => {
        // Move horizontally
        c.x += c.speedX;
        c.bobPhase += c.bobSpeed;
        c.tailPhase += 0.08;

        const bobY = Math.sin(c.bobPhase) * 12;
        const currentY = c.y + bobY;

        // Wrap around screen edges smoothly
        const margin = 260;
        if (c.direction === 1 && c.x > width + margin) {
          c.x = -margin;
        } else if (c.direction === -1 && c.x < -margin) {
          c.x = width + margin;
        }

        ctx.save();
        ctx.translate(c.x, currentY);
        ctx.scale(c.scale * (c.direction === -1 ? -1 : 1), c.scale);

        // Render specific cartoon sea creature
        if (c.type === 'seal') {
          drawCuteSeal(ctx, c.tailPhase);
        } else if (c.type === 'otter') {
          drawCuteOtter(ctx, time);
        } else if (c.type === 'shark') {
          drawCuteShark(ctx, c.tailPhase);
        } else if (c.type === 'beluga') {
          drawCuteBeluga(ctx, c.tailPhase, time);
        } else if (c.type === 'whale') {
          drawCuteWhale(ctx, c.tailPhase, time);
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
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
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
};

// -------------------------------------------------------------
// Vector Drawing Helpers for Cute Cartoon Sea Creatures
// -------------------------------------------------------------

// 1. CUTE SEAL
function drawCuteSeal(ctx: CanvasRenderingContext2D, tailPhase: number) {
  const tailSway = Math.sin(tailPhase) * 6;

  // Body: plump round silver-grey
  ctx.save();

  // Shadow/underbelly
  ctx.fillStyle = '#b0c4de';
  ctx.beginPath();
  ctx.ellipse(0, 5, 48, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Main coat
  ctx.fillStyle = '#d2dbe5';
  ctx.beginPath();
  ctx.ellipse(0, 0, 46, 26, 0, 0, Math.PI * 2);
  ctx.fill();

  // White belly patch
  ctx.fillStyle = '#f5f7fa';
  ctx.beginPath();
  ctx.ellipse(4, 8, 28, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cute speckles/spots on back
  ctx.fillStyle = '#9aaec4';
  ctx.beginPath();
  ctx.arc(-18, -10, 2.5, 0, Math.PI * 2);
  ctx.arc(-8, -14, 3, 0, Math.PI * 2);
  ctx.arc(4, -12, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Back flipper (tail)
  ctx.fillStyle = '#b0c4de';
  ctx.beginPath();
  ctx.moveTo(-40, 2);
  ctx.quadraticCurveTo(-54, -6 + tailSway, -62, -2 + tailSway);
  ctx.quadraticCurveTo(-54, 8 + tailSway, -42, 6);
  ctx.closePath();
  ctx.fill();

  // Front flipper (waving)
  ctx.fillStyle = '#b0c4de';
  ctx.beginPath();
  ctx.ellipse(6, 14 + Math.sin(tailPhase * 1.2) * 3, 15, 8, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Cute Seal Face
  // Snout muzzle
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(34, 4, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Nose (cute rounded inverted triangle)
  ctx.fillStyle = '#2b2d42';
  ctx.beginPath();
  ctx.arc(38, 2, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Cute smiling mouth curve
  ctx.strokeStyle = '#2b2d42';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(36, 6, 3, 0, Math.PI);
  ctx.stroke();

  // Big Shiny Cartoon Eyes
  ctx.fillStyle = '#1c1c18';
  ctx.beginPath();
  ctx.arc(28, -6, 5, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(26.5, -7.5, 1.8, 0, Math.PI * 2);
  ctx.arc(29.5, -4.5, 0.9, 0, Math.PI * 2);
  ctx.fill();

  // Cute Whiskers
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(40, 2);
  ctx.lineTo(50, 0);
  ctx.moveTo(40, 4);
  ctx.lineTo(49, 5);
  ctx.stroke();

  // Rosy cheeks
  ctx.fillStyle = 'rgba(255, 182, 193, 0.65)';
  ctx.beginPath();
  ctx.arc(22, 2, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 2. CUTE OTTER (Floating on back holding a seashell)
function drawCuteOtter(ctx: CanvasRenderingContext2D, time: number) {
  const rockBob = Math.sin(time * 2.5) * 2;

  ctx.save();
  ctx.rotate(0.08); // Slight cozy float tilt

  // Fur Body (Chestnut brown)
  ctx.fillStyle = '#8b5a2b';
  ctx.beginPath();
  ctx.ellipse(0, 0, 44, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail resting on water
  ctx.fillStyle = '#6b4423';
  ctx.beginPath();
  ctx.moveTo(-40, 2);
  ctx.quadraticCurveTo(-58, 6, -65, 12);
  ctx.quadraticCurveTo(-52, 16, -36, 8);
  ctx.closePath();
  ctx.fill();

  // Cream Belly (exposed as it floats on back)
  ctx.fillStyle = '#ffeedb';
  ctx.beginPath();
  ctx.ellipse(2, 2, 26, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cute Little Back Feet
  ctx.fillStyle = '#6b4423';
  ctx.beginPath();
  ctx.arc(-26, 14, 7, 0, Math.PI * 2);
  ctx.fill();

  // Paws holding a pink scallop seashell on tummy
  ctx.fillStyle = '#ffafcc';
  ctx.beginPath();
  ctx.arc(0, -2 + rockBob, 8, 0, Math.PI * 2);
  ctx.fill();
  // Shell ribs
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 6 + rockBob);
  ctx.lineTo(-4, -6 + rockBob);
  ctx.moveTo(0, 6 + rockBob);
  ctx.lineTo(0, -8 + rockBob);
  ctx.moveTo(0, 6 + rockBob);
  ctx.lineTo(4, -6 + rockBob);
  ctx.stroke();

  // Tiny Paws holding it
  ctx.fillStyle = '#54361c';
  ctx.beginPath();
  ctx.arc(-8, -1 + rockBob, 4.5, 0, Math.PI * 2);
  ctx.arc(8, -1 + rockBob, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Cute Head
  ctx.fillStyle = '#8b5a2b';
  ctx.beginPath();
  ctx.arc(32, -4, 18, 0, Math.PI * 2);
  ctx.fill();

  // Cream muzzle
  ctx.fillStyle = '#ffeedb';
  ctx.beginPath();
  ctx.ellipse(36, 1, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tiny rounded ears
  ctx.fillStyle = '#6b4423';
  ctx.beginPath();
  ctx.arc(26, -20, 4.5, 0, Math.PI * 2);
  ctx.arc(38, -20, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Black button nose
  ctx.fillStyle = '#1c1c18';
  ctx.beginPath();
  ctx.arc(42, -1, 3, 0, Math.PI * 2);
  ctx.fill();

  // Happy closed eye smiles
  ctx.strokeStyle = '#1c1c18';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(30, -7, 3.5, Math.PI * 0.1, Math.PI * 0.9);
  ctx.stroke();

  // Rosy blush
  ctx.fillStyle = 'rgba(255, 143, 163, 0.6)';
  ctx.beginPath();
  ctx.arc(24, -2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 3. CUTE SHARK (Chibi round baby shark with happy smile)
function drawCuteShark(ctx: CanvasRenderingContext2D, tailPhase: number) {
  const tailSway = Math.sin(tailPhase * 1.4) * 8;

  ctx.save();

  // Cute Dorsal Fin
  ctx.fillStyle = '#48cae4';
  ctx.beginPath();
  ctx.moveTo(-2, -18);
  ctx.quadraticCurveTo(8, -36, 18, -38);
  ctx.quadraticCurveTo(12, -22, 18, -16);
  ctx.closePath();
  ctx.fill();

  // Tail Fin (Caudal)
  ctx.fillStyle = '#48cae4';
  ctx.beginPath();
  ctx.moveTo(-42, 0);
  ctx.quadraticCurveTo(-58, -20 + tailSway, -64, -24 + tailSway);
  ctx.quadraticCurveTo(-56, 0 + tailSway, -64, 20 + tailSway);
  ctx.quadraticCurveTo(-54, 16 + tailSway, -42, 4);
  ctx.closePath();
  ctx.fill();

  // Main Chibi Shark Body (Pastel marine blue)
  ctx.fillStyle = '#48cae4';
  ctx.beginPath();
  ctx.ellipse(0, 0, 48, 26, 0, 0, Math.PI * 2);
  ctx.fill();

  // White Clean Underbelly
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(38, 2);
  ctx.quadraticCurveTo(8, 26, -38, 10);
  ctx.quadraticCurveTo(0, 4, 38, 2);
  ctx.closePath();
  ctx.fill();

  // Pectoral Fin (Swimming)
  ctx.fillStyle = '#0096c7';
  ctx.beginPath();
  ctx.moveTo(4, 8);
  ctx.quadraticCurveTo(-6, 26, -14, 28);
  ctx.quadraticCurveTo(-4, 14, 12, 10);
  ctx.closePath();
  ctx.fill();

  // Big Shiny Happy Eye
  ctx.fillStyle = '#03045e';
  ctx.beginPath();
  ctx.arc(28, -6, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Eye shines
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(26.5, -8, 2, 0, Math.PI * 2);
  ctx.arc(29.5, -4.5, 1, 0, Math.PI * 2);
  ctx.fill();

  // Big Happy Smile with tiny white chibi tooth!
  ctx.strokeStyle = '#03045e';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(32, 5, 7, 0, Math.PI * 0.85);
  ctx.stroke();

  // Cute tiny tooth
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(34, 5);
  ctx.lineTo(37, 5);
  ctx.lineTo(35.5, 8.5);
  ctx.closePath();
  ctx.fill();

  // Cheek blush
  ctx.fillStyle = 'rgba(255, 154, 162, 0.65)';
  ctx.beginPath();
  ctx.arc(20, 2, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 4. CUTE BELUGA WHALE (Pearl-white with bulbous melon forehead & happy smile)
function drawCuteBeluga(ctx: CanvasRenderingContext2D, tailPhase: number, time: number) {
  const tailSway = Math.sin(tailPhase) * 6;

  ctx.save();

  // Tail flukes
  ctx.fillStyle = '#e2f1f8';
  ctx.beginPath();
  ctx.moveTo(-45, 0);
  ctx.quadraticCurveTo(-62, -14 + tailSway, -68, -16 + tailSway);
  ctx.quadraticCurveTo(-58, 0 + tailSway, -68, 14 + tailSway);
  ctx.quadraticCurveTo(-58, 10 + tailSway, -44, 4);
  ctx.closePath();
  ctx.fill();

  // Soft shaded body
  ctx.fillStyle = '#d0e8f2';
  ctx.beginPath();
  ctx.ellipse(0, 3, 50, 27, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pure White Beluga Body
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(0, 0, 48, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Iconic Round Bulbous Melon Forehead
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(36, -8, 17, 0, Math.PI * 2);
  ctx.fill();

  // Pectoral flipper (waving softly)
  ctx.fillStyle = '#d0e8f2';
  ctx.beginPath();
  ctx.ellipse(4, 12, 14, 7, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Dark friendly eye
  ctx.fillStyle = '#1c1c18';
  ctx.beginPath();
  ctx.arc(28, -2, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(26.5, -3.5, 1.6, 0, Math.PI * 2);
  ctx.fill();

  // Signature Happy Beluga Smile
  ctx.strokeStyle = '#48cae4';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(42, 6, 8, Math.PI * 0.7, Math.PI * 1.2, true);
  ctx.stroke();

  // Rosy cheek
  ctx.fillStyle = 'rgba(255, 182, 193, 0.7)';
  ctx.beginPath();
  ctx.arc(22, 6, 5, 0, Math.PI * 2);
  ctx.fill();

  // Occasional cute tiny musical note or heart bubble
  const heartFloat = (time * 20) % 60;
  if (heartFloat < 35) {
    ctx.fillStyle = 'rgba(255, 154, 162, 0.8)';
    ctx.beginPath();
    ctx.arc(48 + heartFloat * 0.4, -22 - heartFloat * 0.6, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// 5. CUTE NORMAL WHALE (Humpback / Blue Whale with blowhole spout)
function drawCuteWhale(ctx: CanvasRenderingContext2D, tailPhase: number, time: number) {
  const tailSway = Math.sin(tailPhase * 0.8) * 8;

  ctx.save();

  // Tail flukes
  ctx.fillStyle = '#1d3557';
  ctx.beginPath();
  ctx.moveTo(-52, 0);
  ctx.quadraticCurveTo(-72, -22 + tailSway, -84, -25 + tailSway);
  ctx.quadraticCurveTo(-72, 0 + tailSway, -84, 22 + tailSway);
  ctx.quadraticCurveTo(-68, 16 + tailSway, -50, 6);
  ctx.closePath();
  ctx.fill();

  // Whale body (Rich navy blue)
  ctx.fillStyle = '#1d3557';
  ctx.beginPath();
  ctx.ellipse(0, 0, 60, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  // White / Pale ridged belly (pleats)
  ctx.fillStyle = '#f1faee';
  ctx.beginPath();
  ctx.moveTo(50, 8);
  ctx.quadraticCurveTo(15, 34, -42, 14);
  ctx.quadraticCurveTo(0, 8, 50, 8);
  ctx.closePath();
  ctx.fill();

  // Pleat stripes
  ctx.strokeStyle = '#a8dadc';
  ctx.lineWidth = 1.2;
  for (let i = -2; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(40 - i * 16, 12);
    ctx.lineTo(34 - i * 16, 26);
    ctx.stroke();
  }

  // Long gentle flipper
  ctx.fillStyle = '#457b9d';
  ctx.beginPath();
  ctx.moveTo(8, 10);
  ctx.quadraticCurveTo(-8, 32, -24, 38);
  ctx.quadraticCurveTo(-14, 22, 16, 14);
  ctx.closePath();
  ctx.fill();

  // Happy closed eye
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(38, -6, 5, Math.PI * 0.1, Math.PI * 0.9);
  ctx.stroke();

  // Soft cheek blush
  ctx.fillStyle = 'rgba(230, 57, 70, 0.4)';
  ctx.beginPath();
  ctx.arc(28, 0, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Blowhole water fountain / spout!
  const spoutCycle = Math.sin(time * 2.2);
  if (spoutCycle > 0.2) {
    ctx.save();
    ctx.translate(14, -30);
    ctx.fillStyle = 'rgba(168, 218, 220, 0.75)';
    ctx.strokeStyle = 'rgba(241, 250, 238, 0.9)';
    ctx.lineWidth = 1.5;

    // Spouting water fountain streams
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-10, -18, -14, -24);
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(0, -22, 2, -28);
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(10, -18, 16, -22);
    ctx.stroke();

    // Spout water droplets
    ctx.beginPath();
    ctx.arc(-14, -26, 2.5, 0, Math.PI * 2);
    ctx.arc(2, -31, 3, 0, Math.PI * 2);
    ctx.arc(16, -24, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}
