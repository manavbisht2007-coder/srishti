import React, { useEffect, useRef } from 'react';

interface SeaCreature {
  id: string;
  type: 'seal' | 'otter' | 'shark' | 'beluga' | 'whale' | 'fish';
  x: number;
  y: number;
  scale: number;
  speedX: number;
  direction: 1 | -1; // 1: moving right, -1: moving left
  depth: number;
  bobPhase: number;
  bobSpeed: number;
  tailPhase: number;
  tailSpeed: number;
  subType?: 'clownfish' | 'tang';
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
        radius: Math.random() * 5 + 3,
        speedY: Math.random() * 0.8 + 0.4,
        wobbleSpeed: Math.random() * 0.04 + 0.02,
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.35 + 0.2,
      });
    }

    // Realistic yet cartoonish creatures:
    // 1. Beluga Whale
    // 2. Sea Otter
    // 3. Harbor Seal
    // 4. Reef Shark
    // 5. Humpback Whale
    // 6. Tropical Fish (Clownfish & Blue Tang)
    const creatures: SeaCreature[] = [
      {
        id: 'beluga-1',
        type: 'beluga',
        x: width * 0.15,
        y: height * 0.2,
        scale: 0.88,
        speedX: 0.65,
        direction: 1,
        depth: 0.8,
        bobPhase: 0,
        bobSpeed: 0.02,
        tailPhase: 0,
        tailSpeed: 0.06,
      },
      {
        id: 'otter-1',
        type: 'otter',
        x: width * 0.75,
        y: height * 0.14,
        scale: 0.82,
        speedX: -0.45,
        direction: -1,
        depth: 0.95,
        bobPhase: Math.PI / 3,
        bobSpeed: 0.03,
        tailPhase: 0,
        tailSpeed: 0.08,
      },
      {
        id: 'seal-1',
        type: 'seal',
        x: width * 0.42,
        y: height * 0.45,
        scale: 0.8,
        speedX: 0.8,
        direction: 1,
        depth: 0.85,
        bobPhase: Math.PI,
        bobSpeed: 0.028,
        tailPhase: 0,
        tailSpeed: 0.09,
      },
      {
        id: 'fish-clown-1',
        type: 'fish',
        subType: 'clownfish',
        x: width * 0.28,
        y: height * 0.38,
        scale: 0.65,
        speedX: 0.95,
        direction: 1,
        depth: 0.9,
        bobPhase: Math.PI * 0.4,
        bobSpeed: 0.05,
        tailPhase: 0,
        tailSpeed: 0.22,
      },
      {
        id: 'fish-tang-1',
        type: 'fish',
        subType: 'tang',
        x: width * 0.65,
        y: height * 0.55,
        scale: 0.68,
        speedX: -1.1,
        direction: -1,
        depth: 0.9,
        bobPhase: Math.PI * 1.2,
        bobSpeed: 0.045,
        tailPhase: 0,
        tailSpeed: 0.2,
      },
      {
        id: 'shark-1',
        type: 'shark',
        x: width * 0.88,
        y: height * 0.68,
        scale: 0.85,
        speedX: -0.85,
        direction: -1,
        depth: 0.9,
        bobPhase: Math.PI * 1.5,
        bobSpeed: 0.035,
        tailPhase: 0,
        tailSpeed: 0.09,
      },
      {
        id: 'whale-1',
        type: 'whale',
        x: width * 0.18,
        y: height * 0.84,
        scale: 1.05,
        speedX: 0.5,
        direction: 1,
        depth: 0.75,
        bobPhase: Math.PI / 2,
        bobSpeed: 0.016,
        tailPhase: 0,
        tailSpeed: 0.05,
      },
    ];

    let animId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      // 1. Subtle sunlight rays piercing the water surface
      ctx.save();
      for (let i = 0; i < 4; i++) {
        const beamX = width * 0.2 + i * (width * 0.22) + Math.sin(time * 0.4 + i) * 25;
        const grad = ctx.createLinearGradient(beamX, 0, beamX + 70, height);
        grad.addColorStop(0, 'rgba(202, 240, 248, 0.11)');
        grad.addColorStop(0.5, 'rgba(144, 224, 239, 0.03)');
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

        ctx.fillStyle = 'rgba(202, 240, 248, 0.25)';
        ctx.strokeStyle = 'rgba(144, 224, 239, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Bubble highlight reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Draw & update each realistic + cartoonish sea creature
      creatures.forEach((c) => {
        c.x += c.speedX;
        c.bobPhase += c.bobSpeed;
        c.tailPhase += c.tailSpeed;

        const bobY = Math.sin(c.bobPhase) * 11;
        const currentY = c.y + bobY;

        // Wrap around screen boundaries with margin
        const margin = 280;
        if (c.direction === 1 && c.x > width + margin) {
          c.x = -margin;
        } else if (c.direction === -1 && c.x < -margin) {
          c.x = width + margin;
        }

        ctx.save();
        ctx.translate(c.x, currentY);
        ctx.scale(c.scale * (c.direction === -1 ? -1 : 1), c.scale);

        if (c.type === 'seal') {
          drawRealisticCartoonSeal(ctx, c.tailPhase);
        } else if (c.type === 'otter') {
          drawRealisticCartoonOtter(ctx, time);
        } else if (c.type === 'shark') {
          drawRealisticCartoonShark(ctx, c.tailPhase);
        } else if (c.type === 'beluga') {
          drawRealisticCartoonBeluga(ctx, c.tailPhase, time);
        } else if (c.type === 'whale') {
          drawRealisticCartoonWhale(ctx, c.tailPhase, time);
        } else if (c.type === 'fish') {
          drawRealisticCartoonFish(ctx, c.tailPhase, c.subType || 'clownfish');
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

// =========================================================================
// Realistic + Cartoonish Sea Creature Renderers
// Balanced with anatomical contours, subtle gradients, glossy eyes & cute charm
// =========================================================================

// 1. REALISTIC + CARTOONISH HARBOR SEAL
function drawRealisticCartoonSeal(ctx: CanvasRenderingContext2D, tailPhase: number) {
  const tailSway = Math.sin(tailPhase) * 7;
  const flipperWave = Math.sin(tailPhase * 1.3) * 5;

  ctx.save();

  // Hind flippers (realistic webbed tail flippers)
  ctx.fillStyle = '#8396a8';
  ctx.beginPath();
  ctx.moveTo(-45, 0);
  ctx.quadraticCurveTo(-62, -14 + tailSway, -74, -8 + tailSway);
  ctx.quadraticCurveTo(-60, 2 + tailSway, -74, 12 + tailSway);
  ctx.quadraticCurveTo(-58, 8 + tailSway, -42, 6);
  ctx.closePath();
  ctx.fill();

  // Seal Body - Smooth torpedo shape with realistic dorsal slope
  const bodyGrad = ctx.createLinearGradient(0, -25, 0, 25);
  bodyGrad.addColorStop(0, '#9bb0c1'); // Dorsal steel-slate
  bodyGrad.addColorStop(0.5, '#b8cad6'); // Mid-tone
  bodyGrad.addColorStop(1, '#e5edf2'); // Cream/pale ventral belly

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(38, -6);
  ctx.bezierCurveTo(46, -2, 46, 12, 32, 16);
  ctx.bezierCurveTo(15, 24, -18, 22, -45, 4);
  ctx.bezierCurveTo(-38, -12, -12, -22, 15, -18);
  ctx.bezierCurveTo(28, -16, 34, -10, 38, -6);
  ctx.closePath();
  ctx.fill();

  // Realistic mottled ring-spots along the back and flank
  ctx.fillStyle = 'rgba(105, 124, 140, 0.45)';
  const spots = [
    { x: -28, y: -4, r: 2.8 },
    { x: -20, y: -10, r: 3.2 },
    { x: -12, y: -14, r: 2.5 },
    { x: -2, y: -12, r: 3.5 },
    { x: 8, y: -10, r: 2.8 },
    { x: -8, y: -4, r: 3 },
    { x: 2, y: -2, r: 2.2 },
    { x: -18, y: 4, r: 2.6 },
  ];
  spots.forEach((s) => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Front Pectoral Flipper (anatomically curved with gentle claws)
  ctx.fillStyle = '#8ea1b3';
  ctx.beginPath();
  ctx.moveTo(10, 8);
  ctx.quadraticCurveTo(8, 24 + flipperWave, -4, 30 + flipperWave);
  ctx.quadraticCurveTo(2, 20 + flipperWave, 18, 12);
  ctx.closePath();
  ctx.fill();

  // Seal Muzzle & Whisker pads
  ctx.fillStyle = '#f0f4f8';
  ctx.beginPath();
  ctx.ellipse(36, 6, 9, 6.5, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Realistic dark nose
  ctx.fillStyle = '#222831';
  ctx.beginPath();
  ctx.arc(41, 4, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // Gentle mouth line
  ctx.strokeStyle = '#222831';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(38, 8, 3.5, 0.1, Math.PI * 0.9);
  ctx.stroke();

  // Big glossy dark cartoon eye with light reflections
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.arc(28, -4, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(26.5, -6, 2, 0, Math.PI * 2);
  ctx.arc(30, -2.5, 1, 0, Math.PI * 2);
  ctx.fill();

  // Delicate white whiskers
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(40, 5);
  ctx.lineTo(52, 2);
  ctx.moveTo(40, 7);
  ctx.lineTo(51, 8);
  ctx.moveTo(40, 9);
  ctx.lineTo(49, 13);
  ctx.stroke();

  // Sweet rosy blush
  ctx.fillStyle = 'rgba(255, 168, 180, 0.55)';
  ctx.beginPath();
  ctx.arc(22, 4, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 2. REALISTIC + CARTOONISH SEA OTTER
function drawRealisticCartoonOtter(ctx: CanvasRenderingContext2D, time: number) {
  const rockBob = Math.sin(time * 2.5) * 2;

  ctx.save();
  ctx.rotate(0.06);

  // Muscular flattened tail
  ctx.fillStyle = '#593a1f';
  ctx.beginPath();
  ctx.moveTo(-38, 2);
  ctx.quadraticCurveTo(-60, 6, -72, 14);
  ctx.quadraticCurveTo(-54, 18, -35, 8);
  ctx.closePath();
  ctx.fill();

  // Fur Body (Chestnut to deep otter brown)
  const furGrad = ctx.createLinearGradient(0, -20, 0, 20);
  furGrad.addColorStop(0, '#784e27');
  furGrad.addColorStop(1, '#533519');

  ctx.fillStyle = furGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 45, 23, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cream/Golden chest & belly
  ctx.fillStyle = '#ffeedb';
  ctx.beginPath();
  ctx.ellipse(3, 2, 28, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hind webbed flipper feet
  ctx.fillStyle = '#533519';
  ctx.beginPath();
  ctx.ellipse(-26, 14, 7, 5, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Scalloped seashell held in paws
  ctx.fillStyle = '#ffb3c6';
  ctx.beginPath();
  ctx.arc(0, -3 + rockBob, 8.5, 0, Math.PI * 2);
  ctx.fill();
  // Shell ridges
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 5 + rockBob);
  ctx.lineTo(-4, -8 + rockBob);
  ctx.moveTo(0, 5 + rockBob);
  ctx.lineTo(0, -10 + rockBob);
  ctx.moveTo(0, 5 + rockBob);
  ctx.lineTo(4, -8 + rockBob);
  ctx.stroke();

  // Paws holding shell
  ctx.fillStyle = '#3f2711';
  ctx.beginPath();
  ctx.arc(-8, -2 + rockBob, 4.5, 0, Math.PI * 2);
  ctx.arc(8, -2 + rockBob, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Otter Head
  ctx.fillStyle = '#784e27';
  ctx.beginPath();
  ctx.arc(33, -4, 18, 0, Math.PI * 2);
  ctx.fill();

  // Cream muzzle
  ctx.fillStyle = '#ffeedb';
  ctx.beginPath();
  ctx.ellipse(38, 1, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Small rounded ears
  ctx.fillStyle = '#533519';
  ctx.beginPath();
  ctx.arc(26, -20, 4.5, 0, Math.PI * 2);
  ctx.arc(39, -20, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Black button nose
  ctx.fillStyle = '#1c1c18';
  ctx.beginPath();
  ctx.arc(44, -1, 3.2, 0, Math.PI * 2);
  ctx.fill();

  // Peaceful smiling closed eyes
  ctx.strokeStyle = '#1c1c18';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(31, -7, 3.5, Math.PI * 0.1, Math.PI * 0.9);
  ctx.stroke();

  // Soft whiskers
  ctx.strokeStyle = '#ffeedb';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(42, 1);
  ctx.lineTo(52, -1);
  ctx.moveTo(42, 3);
  ctx.lineTo(51, 6);
  ctx.stroke();

  // Rosy blush
  ctx.fillStyle = 'rgba(255, 143, 163, 0.6)';
  ctx.beginPath();
  ctx.arc(24, -2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 3. REALISTIC + CARTOONISH REEF SHARK
function drawRealisticCartoonShark(ctx: CanvasRenderingContext2D, tailPhase: number) {
  const tailSway = Math.sin(tailPhase * 1.3) * 8;

  ctx.save();

  // Prominent Dorsal Fin
  const dorsalGrad = ctx.createLinearGradient(0, -38, 0, -15);
  dorsalGrad.addColorStop(0, '#0077b6');
  dorsalGrad.addColorStop(1, '#48cae4');
  ctx.fillStyle = dorsalGrad;
  ctx.beginPath();
  ctx.moveTo(-4, -16);
  ctx.quadraticCurveTo(8, -36, 18, -38);
  ctx.quadraticCurveTo(12, -22, 18, -14);
  ctx.closePath();
  ctx.fill();

  // Tail Fin (Heterocercal caudal fin with upper & lower lobes)
  ctx.fillStyle = '#0077b6';
  ctx.beginPath();
  ctx.moveTo(-45, 0);
  ctx.quadraticCurveTo(-62, -22 + tailSway, -70, -26 + tailSway);
  ctx.quadraticCurveTo(-58, 0 + tailSway, -68, 18 + tailSway);
  ctx.quadraticCurveTo(-56, 14 + tailSway, -42, 4);
  ctx.closePath();
  ctx.fill();

  // Streamlined Torpedo Body (Ocean gradient countershading)
  const sharkGrad = ctx.createLinearGradient(0, -22, 0, 22);
  sharkGrad.addColorStop(0, '#0077b6');
  sharkGrad.addColorStop(0.6, '#48cae4');
  sharkGrad.addColorStop(1, '#caf0f8');

  ctx.fillStyle = sharkGrad;
  ctx.beginPath();
  ctx.moveTo(45, 0);
  ctx.bezierCurveTo(42, -16, 10, -24, -42, 0);
  ctx.bezierCurveTo(-15, 24, 25, 20, 45, 0);
  ctx.closePath();
  ctx.fill();

  // White ventral underbelly
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(42, 2);
  ctx.quadraticCurveTo(12, 22, -38, 8);
  ctx.quadraticCurveTo(8, 6, 42, 2);
  ctx.closePath();
  ctx.fill();

  // Swept Pectoral Fin
  ctx.fillStyle = '#0096c7';
  ctx.beginPath();
  ctx.moveTo(8, 8);
  ctx.quadraticCurveTo(-6, 28, -16, 30);
  ctx.quadraticCurveTo(-6, 16, 14, 10);
  ctx.closePath();
  ctx.fill();

  // 4 Realistic Gill Slits
  ctx.strokeStyle = '#0077b6';
  ctx.lineWidth = 1.3;
  ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(12 - i * 4, -4);
    ctx.lineTo(10 - i * 4, 6);
    ctx.stroke();
  }

  // Friendly Cartoon Eye
  ctx.fillStyle = '#03045e';
  ctx.beginPath();
  ctx.arc(30, -5, 5, 0, Math.PI * 2);
  ctx.fill();

  // Sparkle highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(28.5, -6.5, 1.8, 0, Math.PI * 2);
  ctx.arc(31.5, -3.5, 0.9, 0, Math.PI * 2);
  ctx.fill();

  // Gentle smile
  ctx.strokeStyle = '#03045e';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(34, 4, 6, 0.1, Math.PI * 0.85);
  ctx.stroke();

  // Cheek blush
  ctx.fillStyle = 'rgba(255, 154, 162, 0.6)';
  ctx.beginPath();
  ctx.arc(22, 2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 4. REALISTIC + CARTOONISH BELUGA WHALE
function drawRealisticCartoonBeluga(ctx: CanvasRenderingContext2D, tailPhase: number, time: number) {
  const tailSway = Math.sin(tailPhase) * 6;

  ctx.save();

  // Tail Flukes with central notch
  ctx.fillStyle = '#e2f1f8';
  ctx.beginPath();
  ctx.moveTo(-48, 0);
  ctx.quadraticCurveTo(-64, -16 + tailSway, -74, -18 + tailSway);
  ctx.quadraticCurveTo(-62, 0 + tailSway, -74, 16 + tailSway);
  ctx.quadraticCurveTo(-60, 10 + tailSway, -46, 4);
  ctx.closePath();
  ctx.fill();

  // Beluga Body with subtle pearlescent cyan ambient shading
  const belugaGrad = ctx.createLinearGradient(0, -25, 0, 25);
  belugaGrad.addColorStop(0, '#ffffff');
  belugaGrad.addColorStop(0.7, '#f4faff');
  belugaGrad.addColorStop(1, '#d8eef8');

  ctx.fillStyle = belugaGrad;
  ctx.beginPath();
  ctx.moveTo(42, -4);
  ctx.bezierCurveTo(46, -18, 12, -26, -46, 0);
  ctx.bezierCurveTo(-20, 26, 24, 24, 42, -4);
  ctx.closePath();
  ctx.fill();

  // Signature bulbous melon forehead
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(36, -8, 17, 0, Math.PI * 2);
  ctx.fill();

  // Dorsal ridge (belugas don't have dorsal fins, but a soft ridge)
  ctx.strokeStyle = '#c5e6f5';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10, -18);
  ctx.lineTo(-28, -10);
  ctx.stroke();

  // Paddle-like pectoral flipper
  ctx.fillStyle = '#dbeff8';
  ctx.beginPath();
  ctx.ellipse(6, 12, 14, 7, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Friendly dark eye
  ctx.fillStyle = '#1c1c18';
  ctx.beginPath();
  ctx.arc(28, -3, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(26.5, -4.5, 1.6, 0, Math.PI * 2);
  ctx.fill();

  // Signature joyous curved beluga smile
  ctx.strokeStyle = '#0077b6';
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(42, 6, 8, Math.PI * 0.7, Math.PI * 1.25, true);
  ctx.stroke();

  // Rosy cheek
  ctx.fillStyle = 'rgba(255, 182, 193, 0.65)';
  ctx.beginPath();
  ctx.arc(22, 5, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Occasional heart-shaped bubble rising
  const heartFloat = (time * 18) % 65;
  if (heartFloat < 38) {
    ctx.fillStyle = 'rgba(255, 154, 162, 0.75)';
    ctx.beginPath();
    ctx.arc(48 + heartFloat * 0.35, -24 - heartFloat * 0.55, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// 5. REALISTIC + CARTOONISH HUMPBACK WHALE
function drawRealisticCartoonWhale(ctx: CanvasRenderingContext2D, tailPhase: number, time: number) {
  const tailSway = Math.sin(tailPhase * 0.8) * 8;

  ctx.save();

  // Tail flukes with serrated trailing edge and central notch
  ctx.fillStyle = '#1d3557';
  ctx.beginPath();
  ctx.moveTo(-54, 0);
  ctx.quadraticCurveTo(-75, -24 + tailSway, -88, -26 + tailSway);
  ctx.quadraticCurveTo(-74, 0 + tailSway, -88, 24 + tailSway);
  ctx.quadraticCurveTo(-70, 16 + tailSway, -52, 6);
  ctx.closePath();
  ctx.fill();

  // Whale body: Slate deep navy blue with countershading
  const whaleGrad = ctx.createLinearGradient(0, -30, 0, 30);
  whaleGrad.addColorStop(0, '#1d3557');
  whaleGrad.addColorStop(0.5, '#2b4c7e');
  whaleGrad.addColorStop(1, '#f1faee');

  ctx.fillStyle = whaleGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 62, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ventral throat grooves / pleats
  ctx.fillStyle = '#f1faee';
  ctx.beginPath();
  ctx.moveTo(52, 8);
  ctx.quadraticCurveTo(16, 34, -44, 14);
  ctx.quadraticCurveTo(0, 8, 52, 8);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#a8dadc';
  ctx.lineWidth = 1.2;
  for (let i = -2; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(42 - i * 16, 12);
    ctx.lineTo(36 - i * 16, 26);
    ctx.stroke();
  }

  // Realistic knobby tubercles along jaw
  ctx.fillStyle = '#2b4c7e';
  const bumps = [
    { x: 50, y: -4 },
    { x: 44, y: -10 },
    { x: 34, y: -16 },
    { x: 22, y: -20 },
  ];
  bumps.forEach((b) => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Long realistic humpback pectoral fin (white underside)
  ctx.fillStyle = '#f1faee';
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.quadraticCurveTo(-10, 34, -28, 40);
  ctx.quadraticCurveTo(-16, 24, 18, 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#457b9d';
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.quadraticCurveTo(-8, 30, -24, 34);
  ctx.quadraticCurveTo(-14, 20, 18, 14);
  ctx.closePath();
  ctx.fill();

  // Closed serene smiling eye
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(38, -6, 5, Math.PI * 0.1, Math.PI * 0.9);
  ctx.stroke();

  // Soft rosy blush
  ctx.fillStyle = 'rgba(230, 57, 70, 0.4)';
  ctx.beginPath();
  ctx.arc(28, 0, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // Blowhole water mist fountain!
  const spoutCycle = Math.sin(time * 2.2);
  if (spoutCycle > 0.2) {
    ctx.save();
    ctx.translate(14, -30);
    ctx.fillStyle = 'rgba(168, 218, 220, 0.75)';
    ctx.strokeStyle = 'rgba(241, 250, 238, 0.9)';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-10, -18, -14, -24);
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(0, -22, 2, -28);
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(10, -18, 16, -22);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-14, -26, 2.5, 0, Math.PI * 2);
    ctx.arc(2, -31, 3, 0, Math.PI * 2);
    ctx.arc(16, -24, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// 6. REALISTIC + CARTOONISH TROPICAL FISH (Clownfish & Blue Tang)
function drawRealisticCartoonFish(
  ctx: CanvasRenderingContext2D,
  tailPhase: number,
  subType: 'clownfish' | 'tang'
) {
  const tailSway = Math.sin(tailPhase) * 6;

  ctx.save();

  if (subType === 'clownfish') {
    // Clownfish (Orange with realistic 3 white stripes with black borders)
    // Tail fin
    ctx.fillStyle = '#ff7b00';
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.quadraticCurveTo(-26, -12 + tailSway, -32, -10 + tailSway);
    ctx.quadraticCurveTo(-28, 0 + tailSway, -32, 10 + tailSway);
    ctx.quadraticCurveTo(-26, 12 + tailSway, -16, 2);
    ctx.closePath();
    ctx.fill();

    // Body
    ctx.fillStyle = '#ff7b00';
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3 White stripes
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#1c1c18';
    ctx.lineWidth = 1;

    // Head stripe
    ctx.beginPath();
    ctx.ellipse(8, 0, 3, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Middle stripe
    ctx.beginPath();
    ctx.ellipse(-2, 0, 3.2, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Tail stripe
    ctx.beginPath();
    ctx.ellipse(-12, 0, 2.5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eye
    ctx.fillStyle = '#1c1c18';
    ctx.beginPath();
    ctx.arc(13, -3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(12, -4, 1.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Blue Tang (Royal blue with yellow tail & black palette mark)
    // Yellow tail
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(-30, -12 + tailSway);
    ctx.lineTo(-24, 0 + tailSway);
    ctx.lineTo(-30, 12 + tailSway);
    ctx.closePath();
    ctx.fill();

    // Oval body
    ctx.fillStyle = '#0077b6';
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Black palette pattern
    ctx.fillStyle = '#03045e';
    ctx.beginPath();
    ctx.ellipse(-4, -4, 12, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#1c1c18';
    ctx.beginPath();
    ctx.arc(14, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(13, -5, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
