
import React, { useState, useEffect } from 'react';
import { TutorMessage, Lesson } from '../types';
import { INITIAL_LESSONS } from '../constants';
import { getArtFeedback, getNewCreativePrompt } from '../services/geminiService';

interface TutorPanelProps {
  canvasRef: HTMLCanvasElement | null;
  currentTask: string;
  setCurrentTask: (task: string) => void;
}

const TutorPanel: React.FC<TutorPanelProps> = ({ canvasRef, currentTask, setCurrentTask }) => {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey there! I'm Arty. I'm here to help you become an art legend! What are we creating today?",
      timestamp: Date.now()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showLessons, setShowLessons] = useState(false);

  const askFeedback = async () => {
    if (!canvasRef) return;
    
    setIsTyping(true);
    const imageData = canvasRef.toDataURL('image/png');
    
    const feedback = await getArtFeedback(imageData, currentTask);
    
    const newMessage: TutorMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: feedback || "I'm speechless! (Mostly because my brain glitched). Tell me more about what you're drawing!",
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(false);
  };

  const generateNewPrompt = async () => {
    setIsTyping(true);
    const prompt = await getNewCreativePrompt();
    setCurrentTask(prompt);
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Ooh, I've got a challenge for you: **"${prompt}"**. You in?`,
      timestamp: Date.now()
    }]);
    setIsTyping(false);
  };

  const selectLesson = (lesson: Lesson) => {
    setCurrentTask(lesson.title);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Great choice! Lesson: **${lesson.title}**. ${lesson.description} **Goal:** ${lesson.objective}`,
      timestamp: Date.now()
    }]);
    setShowLessons(false);
  };

  return (
    <div className="w-full md:w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-sm">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
            🎨
          </div>
          <span className="font-bold text-slate-700">Arty, AI Tutor</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/30">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`max-w-[90%] p-3 rounded-2xl text-sm shadow-sm ${
              msg.role === 'assistant' 
              ? 'bg-white border border-slate-100 self-start text-slate-700 rounded-tl-none' 
              : 'bg-indigo-600 text-white self-end rounded-tr-none'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className="bg-white border border-slate-100 self-start p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>

      {showLessons && (
        <div className="absolute inset-0 z-20 bg-white p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg text-slate-800">Choose a Skill</h2>
            <button onClick={() => setShowLessons(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
          </div>
          {INITIAL_LESSONS.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => selectLesson(lesson)}
              className="text-left p-4 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <h4 className="font-bold text-slate-700 group-hover:text-indigo-600">{lesson.title}</h4>
              <p className="text-xs text-slate-500 mt-1">{lesson.description}</p>
            </button>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
        <button 
          onClick={askFeedback}
          disabled={isTyping}
          className="w-full py-2 px-4 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
        >
          <span>Critique My Work</span>
          <span className="text-lg">✨</span>
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={generateNewPrompt}
            className="py-2 px-3 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-200"
          >
            New Challenge
          </button>
          <button 
            onClick={() => setShowLessons(true)}
            className="py-2 px-3 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors border border-slate-200"
          >
            Skill Lessons
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorPanel;
