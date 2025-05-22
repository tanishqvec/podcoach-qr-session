
import React, { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Mic, Volume2 } from 'lucide-react';

interface WaveAnimationProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  isActive?: boolean;
}

export const WaveAnimation: React.FC<WaveAnimationProps> = ({
  size = "md",
  className,
  isActive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 20;
    
    const drawFrame = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, width, height);
      
      // Draw subtle grid background
      const gridColor = 'rgba(255, 255, 255, 0.03)';
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;
      
      const gridSize = 20;
      const timeFactor = timestamp * 0.0001;
      
      // Horizontal lines
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        const flowOffset = Math.sin(y * 0.01 + timeFactor * 5) * 5;
        ctx.lineTo(width, y + flowOffset);
        ctx.stroke();
      }
      
      // Vertical lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        const flowOffset = Math.cos(x * 0.01 + timeFactor * 5) * 5;
        ctx.lineTo(x + flowOffset, height);
        ctx.stroke();
      }
      
      // Draw circular glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw pulsing edge
      const pulseStrength = Math.sin(timestamp * 0.001) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 0.9, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + pulseStrength * 0.1})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      requestIdRef.current = requestAnimationFrame(drawFrame);
    };
    
    requestIdRef.current = requestAnimationFrame(drawFrame);
    
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [isActive]);
  
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
        width={300} 
        height={300}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Mic className="h-8 w-8 text-white/30" />
      </div>
    </div>
  );
};
