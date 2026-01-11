
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Tool } from '../types';

interface CanvasProps {
  tool: Tool;
  color: string;
  lineWidth: number;
  onSaveRef: (ref: HTMLCanvasElement) => void;
  onDrawingChange: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ tool, color, lineWidth, onSaveRef, onDrawingChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      contextRef.current = ctx;
      onSaveRef(canvas);
    }

    const handleResize = () => {
      // Simple resize handler - in a real app we'd preserve the image
      const tempImage = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const newWidth = parent.clientWidth;
      const newHeight = parent.clientHeight;
      canvas.width = newWidth * dpr;
      canvas.height = newHeight * dpr;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;
      if (ctx && tempImage) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, newWidth, newHeight);
        ctx.putImageData(tempImage, 0, 0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onSaveRef]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { offsetX, offsetY } = getCoordinates(e);
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY,
      };
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = getCoordinates(e);

    const ctx = contextRef.current;
    ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
    ctx.lineWidth = lineWidth;

    if (tool === 'spray') {
      const radius = lineWidth * 2;
      for (let i = 0; i < 20; i++) {
        const x = offsetX + (Math.random() - 0.5) * radius;
        const y = offsetY + (Math.random() - 0.5) * radius;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    } else {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };

  const finishDrawing = () => {
    if (!isDrawing) return;
    contextRef.current?.closePath();
    setIsDrawing(false);
    
    // Save state for undo
    if (contextRef.current && canvasRef.current) {
      const imageData = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHistory(prev => [...prev.slice(-19), imageData]); // Keep last 20 steps
    }
    onDrawingChange();
  };

  // Public methods exposed via imperative logic in parent or props
  // For simplicity here, we'll just handle clear/undo inside this component
  // triggered by changes to props or a shared ref
  
  return (
    <div className="relative w-full h-full bg-white overflow-hidden cursor-crosshair touch-none">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={finishDrawing}
        className="block"
      />
    </div>
  );
};

export default Canvas;
