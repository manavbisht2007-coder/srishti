import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { ThemeMode } from '../types';

export interface PetalCanvasHandle {
  burst: (count?: number, originX?: number, originY?: number) => void;
}

interface PetalCanvasProps {
  theme?: ThemeMode;
  onPetalAdded?: (amount: number) => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  angularSpeed: number;
  speedX: number;
  speedY: number;
  opacity: number;
  type: 'petal' | 'bubble' | 'star' | 'pearl';
  wobbleSpeed: number;
  wobbleOffset: number;
}

const ROMANTIC_COLORS = [
  '#ffd9dc', // soft blush
  '#ffb2ba', // rose pink
  '#dca9ad', // vintage mauve
  '#ffffff', // ivory white
  '#fed65b', // champagne gold
  '#e8b4b8', // dusty rose
  '#ffe088', // warm gilded
];

const AQUATIC_COLORS = [
  '#90e0ef', // soft cyan
  '#caf0f8', // light aqua
  '#48cae4', // tropical blue
  '#ffffff', // pearl white
  '#fed65b', // golden sand
  '#ffb4a2', // soft coral pink
  '#bde0fe', // sky blue
];

export const PetalCanvas = forwardRef<PetalCanvasHandle, PetalCanvasProps>(({ theme = 'romantic', onPetalAdded }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameId = useRef<number | null>(null);
  const isRunningRef = useRef(false);

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

    const isAquatic = theme === 'aquatic';
    const colorPalette = isAquatic ? AQUATIC_COLORS : ROMANTIC_COLORS;

    for (let i = 0; i < count; i++) {
      let particleType: Particle['type'] = 'petal';
      if (isAquatic) {
        const rand = Math.random();
        if (rand < 0.5) particleType = 'bubble';
        else if (rand < 0.75) particleType = 'pearl';
        else particleType = 'star';
      }

      const p: Particle = {
        x: baseX + (Math.random() - 0.5) * 360,
        y: baseY + (Math.random() - 0.5) * 140,
        size: isAquatic ? Math.random() * 11 + 6 : Math.random() * 9 + 6,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        angle: Math.random() * 360,
        angularSpeed: (Math.random() - 0.5) * 3.5,
        speedX: (Math.random() - 0.5) * 9,
        speedY: -(Math.random() * 6.5 + 3.5),
        opacity: Math.random() * 0.4 + 0.6,
        type: particleType,
        wobbleSpeed: Math.random() * 0.08 + 0.03,
        wobbleOffset: Math.random() * Math.PI * 2,
      };
      particlesRef.current.push(p);
    }

    // Keep memory bounded
    if (particlesRef.current.length > 300) {
      particlesRef.current = particlesRef.current.slice(particlesRef.current.length - 240);
    }

    // Start animation loop if not currently running
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      runAnimation();
    }
  };

  const runAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      isRunningRef.current = false;
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      isRunningRef.current = false;
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Filter out particles that have left the screen entirely (DO NOT LOOP/CONTINUOUSLY RECYCLE)
    particlesRef.current = particlesRef.current.filter((p) => {
      // Check boundaries:
      if (p.type === 'bubble') {
        // Bubbles float up and out, or fall then rise
        return p.y > -40 && p.x > -40 && p.x < width + 40 && p.opacity > 0.05;
      }
      return p.y < height + 40 && p.x > -40 && p.x < width + 40;
    });

    if (particlesRef.current.length === 0) {
      // Stop animation loop when all showered particles have finished!
      ctx.clearRect(0, 0, width, height);
      isRunningRef.current = false;
      return;
    }

    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];

      if (p.type === 'bubble') {
        p.speedY += 0.08; // Gentle buoyancy transition
        if (p.speedY > -0.5) {
          p.speedY = -Math.abs(p.speedY * 0.7) - 1.2; // Float up!
        }
        p.x += p.speedX * 0.6 + Math.sin(p.angle * 0.05 + p.wobbleOffset) * 1.2;
        p.y += p.speedY;
        p.opacity -= 0.003;
      } else {
        // Petal / Star / Pearl gravity physics
        p.speedY += 0.15;
        p.x += p.speedX;
        p.y += p.speedY;
      }

      p.angle += p.angularSpeed;

      // Draw particle based on type
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);

      if (p.type === 'bubble') {
        // Shiny translucent soap/sea bubble
        ctx.fillStyle = 'rgba(202, 240, 248, 0.28)';
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Little white highlight crescent
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(-p.size * 0.35, -p.size * 0.35, p.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'star') {
        // Mini sea star
        ctx.fillStyle = p.color;
        const spikes = 5;
        const outerRadius = p.size;
        const innerRadius = p.size * 0.5;
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(0, -outerRadius);
        for (let j = 0; j < spikes; j++) {
          let xCoord = Math.cos(rot) * outerRadius;
          let yCoord = Math.sin(rot) * outerRadius;
          ctx.lineTo(xCoord, yCoord);
          rot += step;

          xCoord = Math.cos(rot) * innerRadius;
          yCoord = Math.sin(rot) * innerRadius;
          ctx.lineTo(xCoord, yCoord);
          rot += step;
        }
        ctx.lineTo(0, -outerRadius);
        ctx.closePath();
        ctx.fill();
      } else if (p.type === 'pearl') {
        // Shimmering pearl
        const gradient = ctx.createRadialGradient(-p.size * 0.2, -p.size * 0.2, 1, 0, 0, p.size);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.6, '#caf0f8');
        gradient.addColorStop(1, '#90e0ef');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.75, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Romantic Petal: curved organic ellipse
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    animFrameId.current = requestAnimationFrame(runAnimation);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // IMPORTANT: Empty on mount so flowers do NOT shower continuously!
    particlesRef.current = [];
    isRunningRef.current = false;

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
