import React from 'react';
import { Play, Pause, Repeat, Mic } from 'lucide-react';
import { UI_LABELS } from '../constants';
import { Language } from '../types';

interface ControlPanelProps {
  isActive: boolean;
  language: Language;
  onToggleActive: () => void;
  onRepeat: () => void;
  isProcessing: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ isActive, language, onToggleActive, onRepeat, isProcessing }) => {
  const t = UI_LABELS[language];

  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900 border-t-2 border-gray-700">
      
      <button
        onClick={onToggleActive}
        className={`
          col-span-1 h-24 rounded-2xl flex flex-col items-center justify-center text-xl font-bold border-4 shadow-lg active:scale-95 transition-transform
          ${isActive 
            ? 'bg-red-600 border-red-400 text-white animate-pulse-slow' 
            : 'bg-green-600 border-green-400 text-white'}
        `}
        aria-label={isActive ? t.pause : t.start}
      >
        {isActive ? <Pause className="w-10 h-10 mb-1" /> : <Play className="w-10 h-10 mb-1 ml-1" />}
        <span>{isActive ? t.pause : t.start}</span>
      </button>

      <button
        onClick={onRepeat}
        className="col-span-1 h-24 bg-blue-600 border-4 border-blue-400 text-white rounded-2xl flex flex-col items-center justify-center text-xl font-bold shadow-lg active:scale-95 transition-transform"
        aria-label={t.repeat}
      >
        <Repeat className="w-10 h-10 mb-1" />
        <span>{t.repeat}</span>
      </button>

      {/* Visual Indicator of Processing */}
      {isProcessing && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-yellow-400 px-6 py-4 rounded-xl border-2 border-yellow-400 z-50 pointer-events-none">
          <div className="flex flex-col items-center animate-pulse">
            <Mic className="w-10 h-10 mb-2" />
            <span className="text-xl font-bold">{t.analyzing}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;