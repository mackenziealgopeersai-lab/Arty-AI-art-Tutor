
import React, { useState, useCallback } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import TutorPanel from './components/TutorPanel';
import { Tool } from './types';

const App: React.FC = () => {
  const [currentTool, setTool] = useState<Tool>('brush');
  const [currentColor, setColor] = useState('#3b82f6');
  const [lineWidth, setLineWidth] = useState(5);
  const [currentTask, setCurrentTask] = useState('Free Draw');
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);

  const handleClear = () => {
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    }
  };

  const handleUndo = () => {
    // Basic undo logic usually requires a stack within the Canvas component
    // For this prototype, we'll focus on the AI integration
    console.log("Undo requested");
  };

  const handleSave = () => {
    if (!canvasElement) return;
    const link = document.createElement('a');
    link.download = `arty-masterpiece-${Date.now()}.png`;
    link.href = canvasElement.toDataURL('image/png');
    link.click();
  };

  const handleDrawingChange = useCallback(() => {
    // Could trigger auto-saving or progressive feedback here
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 border-b flex justify-between items-center z-20">
        <h1 className="font-marker text-xl text-indigo-600">Arty Studio</h1>
        <div className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          Working on: {currentTask}
        </div>
      </div>

      <Toolbar 
        currentTool={currentTool}
        setTool={setTool}
        currentColor={currentColor}
        setColor={setColor}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
        onClear={handleClear}
        onUndo={handleUndo}
        onSave={handleSave}
      />

      <main className="flex-1 flex flex-col relative h-full">
        {/* Desktop Header Overlay */}
        <div className="hidden md:flex absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border border-slate-200 shadow-sm items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Goal</span>
          <span className="font-semibold text-slate-700">{currentTask}</span>
        </div>

        <div className="flex-1 w-full h-full relative p-4 md:p-8">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-8 border-white bg-white">
            <Canvas 
              tool={currentTool}
              color={currentColor}
              lineWidth={lineWidth}
              onSaveRef={setCanvasElement}
              onDrawingChange={handleDrawingChange}
            />
          </div>
        </div>
      </main>

      <TutorPanel 
        canvasRef={canvasElement}
        currentTask={currentTask}
        setCurrentTask={setCurrentTask}
      />
    </div>
  );
};

export default App;
