
import React from 'react';
import { Tool } from '../types';
import { COLORS } from '../constants';

interface ToolbarProps {
  currentTool: Tool;
  setTool: (tool: Tool) => void;
  currentColor: string;
  setColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  onClear: () => void;
  onUndo: () => void;
  onSave: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentTool,
  setTool,
  currentColor,
  setColor,
  lineWidth,
  setLineWidth,
  onClear,
  onUndo,
  onSave
}) => {
  return (
    <div className="bg-white border-b md:border-b-0 md:border-r border-slate-200 p-4 w-full md:w-64 flex flex-col gap-6 overflow-y-auto h-full shadow-sm z-10">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">A</div>
        <h1 className="font-marker text-2xl tracking-tight text-slate-800">Arty Studio</h1>
      </div>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Tools</h3>
        <div className="grid grid-cols-2 gap-2">
          {(['pencil', 'brush', 'spray', 'eraser'] as Tool[]).map((t) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                currentTool === t 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-inner' 
                : 'bg-white border-slate-100 hover:border-indigo-100 text-slate-600'
              }`}
            >
              <span className="capitalize text-xs font-semibold">{t}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Size: {lineWidth}px</h3>
        <input 
          type="range" 
          min="1" 
          max="50" 
          value={lineWidth} 
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          className="w-full accent-indigo-500 cursor-pointer"
        />
      </section>

      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Colors</h3>
        <div className="grid grid-cols-5 gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-full aspect-square rounded-full border-2 transition-transform hover:scale-110 ${
                currentColor === c ? 'border-indigo-500 scale-110 shadow-md' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </section>

      <section className="mt-auto pt-4 flex flex-col gap-2">
        <button 
          onClick={onUndo}
          className="w-full py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition-colors"
        >
          Undo
        </button>
        <button 
          onClick={onClear}
          className="w-full py-2 px-4 rounded-xl border border-rose-100 text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
        >
          Start Fresh
        </button>
        <button 
          onClick={onSave}
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 mt-2"
        >
          Save My Masterpiece
        </button>
      </section>
    </div>
  );
};

export default Toolbar;
