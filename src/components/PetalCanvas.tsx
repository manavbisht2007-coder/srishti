import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface PetalCanvasHandle {
  burst: (count?: number, originX?: number, originY?: number) => void;
}

interface PetalCanvasProps {
  onPetalAdded?: (amount: number) => void;
}

interface PetalParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  angularSpeed: number;
  speedX: number;
  speedY: number;
  opacity: number;
  isBurst: boolean;
}

const PETAL_COLORS = [
  '#ffd9dc', // soft blush
  '#ffb2ba', // rose pink
  '#dca9ad', // vintage mauve
  '#ffffff', // ivory white
  '#fed65b', // champagne gold
  '#e8b4b8', // dusty rose
  '#ffe088', // warm gilded
];

export const PetalCanvas = forwardRef<PetalCanvasHandle, PetalCanvasProps>(({ onPetalAdded }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<PetalParticle[]>([]);
  const animFrameId = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    burst: (count = 50, originX?: number, originY?: number) => {
      triggerBurst(count, originX, originY);
      onPetalAdded?.(count);
    },
  }));

  const triggerBurst = (count = 50, originX?: number, originY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    const baseX = originX !== undefined ? originX : width / 2;
    const baseY = originY !== undefined ? originY : height * 0.65;

    for (let i = 0; i < count; i++) {
      const p: PetalParticle = {
        x: baseX + (Math.random() - 0.5) * 350,
        y: baseY + (Math.random() - 0.5) * 120,
        size: Math.random() * 9 + 6,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        angle: Math.random() * 360,
        angularSpeed: (Math.random() - 0.5) * 4,
        speedX: (Math.random() - 0.5) * 9,
        speedY: -(Math.random() * 6 + 4),
        opacity: Math.random() * 0.4 + 0.6,
        isBurst: true,
      };
      petalsRef.current.push(p);
    }

    if (petalsRef.current.length > 280) {
      petalsRef.current = petalsRef.current.slice(petalsRef.current.length - 220);
    }
  };

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

    // Initial ambient drifting petals
    petalsRef.current = [];
    for (let i = 0; i < 48; i++) {
      petalsRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 7 + 5,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        angle: Math.random() * 360,
        angularSpeed: (Math.random() - 0.5) * 1.8,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: Math.random() * 1.4 + 0.8,
        opacity: Math.random() * 0.4 + 0.55,
        isBurst: false,
      });
    }

    let windTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      windTime += 0.015;
      const windForce = Math.sin(windTime) * 0.6;

      for (let i = 0; i < petalsRef.current.length; i++) {
        const p = petalsRef.current[i];

        if (p.isBurst) {
          p.speedY += 0.16; // gravity
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.speedY > 1.5) {
            p.isBurst = false;
            p.speedY = Math.random() * 1.5 + 0.9;
          }
        } else {
          p.x += p.speedX + windForce * 0.4 + Math.sin(p.angle * (Math.PI / 180)) * 0.4;
          p.y += p.speedY;
        }

        p.angle += p.angularSpeed;

        // Reset if past screen bottom
        if (p.y > height + 30) {
          p.y = -20;
          p.x = Math.random() * width;
          p.isBurst = false;
          p.speedY = Math.random() * 1.4 + 0.8;
          p.speedX = (Math.random() - 0.5) * 1.5;
        }

        // Draw petal as organic curved ellipse
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        // Slightly teardrop/petal shape
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
});

PetalCanvas.displayName = 'PetalCanvas';
