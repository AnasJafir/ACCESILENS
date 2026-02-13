import React from 'react';
import { AppMode, Language } from '../types';
import { MODE_LABELS } from '../constants';
import { Home, Search } from 'lucide-react';

interface ModeBarProps {
  currentMode: AppMode;
  currentLang: Language;
  onModeChange: (mode: AppMode) => void;
  disabled: boolean;
}

const ICONS = {
  [AppMode.SCENE]: Home,
  [AppMode.OBJECT]: Search,
};

const ModeBar: React.FC<ModeBarProps> = ({ currentMode, currentLang, onModeChange, disabled }) => {
  return (
    <div className="flex w-full bg-gray-900 border-b-2 border-gray-700">
      {(Object.keys(ICONS) as AppMode[]).map((mode) => {
        const Icon = ICONS[mode];
        const isActive = currentMode === mode;
        
        return (
          <button
            key={mode}
            onClick={() => !disabled && onModeChange(mode)}
            disabled={disabled}
            className={`flex-1 flex flex-col items-center justify-center py-6 px-1 transition-colors
              ${isActive ? 'bg-yellow-400 text-black' : 'bg-black text-gray-400 hover:bg-gray-800'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              focus:outline-none focus-visible:ring-4 focus-visible:ring-white z-10
            `}
            aria-label={`${MODE_LABELS[currentLang][mode]}, ${isActive ? 'Actif' : ''}`}
            aria-pressed={isActive}
          >
            <Icon className="w-10 h-10 mb-2" strokeWidth={2.5} />
            <span className="text-lg font-bold uppercase tracking-wide">{MODE_LABELS[currentLang][mode]}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ModeBar;