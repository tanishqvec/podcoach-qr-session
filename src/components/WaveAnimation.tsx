// components/wave-animation.tsx
import React, { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Mic, Volume2 } from 'lucide-react';

interface WaveAnimationProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  isActive?: boolean;
  isSpeaking?: boolean;
  speakerType?: "ai" | "user" | "idle"; // This is crucial
}

export const WaveAnimation: React.FC<WaveAnimationProps> = ({
  size = "md",
  className,
  isActive = true,
  isSpeaking = false,
  speakerType = "idle", // Default to idle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions dynamically
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    } else {
      canvas.width = 300; // Fallback size
      canvas.height = 300;
    }

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 20;

    const drawFrame = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent background
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid background
      const gridColor = 'rgba(255, 255, 255, 0.03)';
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;

      const gridSize = 20;
      const timeFactor = timestamp * 0.0001;

      // Horizontal and vertical lines with movement
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        const amplitudeFactor = isSpeaking ? 3 : 1;
        const flowOffset = Math.sin(y * 0.01 + timeFactor * 5) * 5 * amplitudeFactor;
        ctx.lineTo(width, y + flowOffset);
        ctx.stroke();
      }
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        const amplitudeFactor = isSpeaking ? 3 : 1;
        const flowOffset = Math.cos(x * 0.01 + timeFactor * 5) * 5 * amplitudeFactor;
        ctx.lineTo(x + flowOffset, height);
        ctx.stroke();
      }

      // Draw circular glow - color is key here
      let glowColor1, glowColor2;

      if (isSpeaking) {
        if (speakerType === 'ai') {
          // GREEN glow for AI speaking (matching the image)
          glowColor1 = 'rgba(0, 255, 0, 0.2)'; // Green
          glowColor2 = 'rgba(0, 255, 0, 0.05)'; // Green
        } else if (speakerType === 'user') {
          // PURPLE glow for user speaking (matching the image)
          glowColor1 = 'rgba(255, 0, 255, 0.2)'; // Purple
          glowColor2 = 'rgba(255, 0, 255, 0.05)'; // Purple
        } else {
          // Default white glow if isSpeaking but speakerType is 'idle' (fallback)
          glowColor1 = 'rgba(255, 255, 255, 0.15)';
          glowColor2 = 'rgba(255, 255, 255, 0.05)';
        }
      } else {
        // Dimmer glow when not speaking
        glowColor1 = 'rgba(255, 255, 255, 0.1)';
        glowColor2 = 'rgba(255, 255, 255, 0.05)';
      }

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      gradient.addColorStop(0, glowColor1);
      gradient.addColorStop(0.7, glowColor2);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw pulsing edge
      const pulseBase = isSpeaking ? 0.7 : 0.5;
      const pulseStrength = Math.sin(timestamp * (isSpeaking ? 0.002 : 0.001)) * 0.3 + pulseBase;

      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 0.9, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + pulseStrength * 0.1})`;
      ctx.lineWidth = isSpeaking ? 2 : 1;
      ctx.stroke();

      requestIdRef.current = requestAnimationFrame(drawFrame);
    };

    requestIdRef.current = requestAnimationFrame(drawFrame);

    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [isActive, isSpeaking, speakerType, size]);

    const getCanvasDimensions = () => {
      switch (size) {
        case "sm": return { width: 96, height: 96 };
        case "md": return { width: 160, height: 160 };
        case "lg": return { width: 256, height: 256 };
        default: return { width: 160, height: 160 };
      }
    };
    const { width: initialCanvasWidth, height: initialCanvasHeight } = getCanvasDimensions();

  const containerClasses = {
    "w-24 h-24": size === "sm",
    "w-40 h-40": size === "md",
    "w-64 h-64": size === "lg",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full overflow-hidden",
        containerClasses,
        className
      )}
      style={{
        boxShadow: '0 0 20px 10px rgba(255, 255, 255, 0.05), inset 0 0 15px rgba(255, 255, 255, 0.05)',
        backgroundColor: '#000000',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <canvas
        ref={canvasRef}
        width={initialCanvasWidth}
        height={initialCanvasHeight}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {isSpeaking ? ( // Only show icon if speaking
          speakerType === 'ai' ? (
            <Volume2 className="h-8 w-8 text-green-300" /> // Green for AI icon
          ) : (
            <Mic className="h-8 w-8 text-purple-300" /> // Purple for User icon
          )
        ) : (
          <Mic className="h-8 w-8 text-white/30" /> // Dim mic when idle
        )}
      </div>
    </div>
  );
};