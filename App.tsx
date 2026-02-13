import React, { useState, useRef, useEffect, useCallback } from 'react';
import CameraView, { CameraHandle } from './components/CameraView';
import ModeBar from './components/ModeBar';
import ControlPanel from './components/ControlPanel';
import { AppMode, Language } from './types';
import { analyzeImage } from './services/geminiService';
import { speak, stopSpeaking } from './services/ttsService';
import { ANALYSIS_INTERVAL_MS, MODE_LABELS, UI_LABELS } from './constants';
import { Search, Globe } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.SCENE);
  const [language, setLanguage] = useState<Language>('fr');
  // Auto-start active to true
  const [isActive, setIsActive] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDescription, setLastDescription] = useState<string>("");
  const [objectQuery, setObjectQuery] = useState<string>("");
  const [showObjectInput, setShowObjectInput] = useState(false);

  // Refs
  const cameraRef = useRef<CameraHandle>(null);
  const intervalRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const t = UI_LABELS[language];

  // Haptics helper
  const vibrate = (pattern: number | number[]) => {
    if (navigator.vibrate) navigator.vibrate(pattern);
  };

  // Safe speak wrapper that passes current language
  const speakInLang = useCallback((text: string) => {
      speak(text, { lang: language });
  }, [language]);

  // Initial welcome (might be blocked by browser policy until interaction)
  useEffect(() => {
    // Attempt to speak welcome message
    setLastDescription(t.welcome);
    // We don't call speak here automatically because browsers block auto-audio.
    // However, the app starts in ACTIVE mode, so the loop will trigger audio soon.
  }, []);

  // Mode change announcement
  useEffect(() => {
    const label = MODE_LABELS[language][currentMode];
    speakInLang(`${t.modeChange} ${label}`);
    vibrate(50);
  }, [currentMode, language, speakInLang]);

  // Main Analysis Loop
  const performAnalysis = useCallback(async () => {
    if (!cameraRef.current || isProcessing) return;

    // For Object mode, we need a query
    if (currentMode === AppMode.OBJECT && !objectQuery) {
        setShowObjectInput(true);
        setIsActive(false); // Pause until input
        speakInLang(t.searchPrompt);
        return;
    }

    setIsProcessing(true);
    
    try {
      const imageBase64 = cameraRef.current.capture();
      if (!imageBase64) {
        // Camera might not be ready yet
        setIsProcessing(false);
        return; 
      }
      
      const text = await analyzeImage(imageBase64, currentMode, language, objectQuery);
      
      setLastDescription(text);
      speakInLang(text);
      
    } catch (error) {
      console.error(error);
      const errorMsg = "Erreur.";
      setLastDescription(errorMsg);
      speakInLang(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  }, [currentMode, isProcessing, objectQuery, language, speakInLang, t]);

  // Loop Management
  useEffect(() => {
    if (isActive) {
      // Immediate first run if not processing
      performAnalysis();
      
      intervalRef.current = window.setInterval(performAnalysis, ANALYSIS_INTERVAL_MS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      stopSpeaking();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, currentMode, performAnalysis]);

  // Handlers
  const handleToggleActive = () => {
    vibrate(50);
    const newState = !isActive;
    setIsActive(newState);
    if (!newState) {
        stopSpeaking();
        speakInLang(t.pause);
    } else {
        speakInLang(t.start);
    }
  };

  const handleRepeat = () => {
    vibrate(50);
    if (lastDescription) {
      speakInLang(lastDescription);
    }
  };

  const handleModeChange = (mode: AppMode) => {
    if (isProcessing) return;
    setIsActive(false); // Pause on mode switch
    setCurrentMode(mode);
    
    // Clear object query if leaving object mode
    if (mode !== AppMode.OBJECT) {
        setObjectQuery("");
        setShowObjectInput(false);
    } else {
        setShowObjectInput(true);
    }
  };

  const toggleLanguage = () => {
    const langs: Language[] = ['fr', 'en', 'ar'];
    const idx = langs.indexOf(language);
    const nextLang = langs[(idx + 1) % langs.length];
    setLanguage(nextLang);
    // Clear description on lang change to avoid confusion
    setLastDescription("");
  };

  // Object Search Input Handler
  const handleObjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (objectQuery.trim()) {
        setShowObjectInput(false);
        speakInLang(`${t.objectSearchStart} ${objectQuery} ${t.objectSearchSwipe}`);
        setIsActive(true);
    }
  };

  // Swipe Logic
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const threshold = 50; // min swipe distance

    // Only Scene and Object modes now
    const modes = [AppMode.SCENE, AppMode.OBJECT];
    const currentIndex = modes.indexOf(currentMode);

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe Left -> Next Mode
        const nextIndex = (currentIndex + 1) % modes.length;
        handleModeChange(modes[nextIndex]);
      } else {
        // Swipe Right -> Prev Mode
        const prevIndex = (currentIndex - 1 + modes.length) % modes.length;
        handleModeChange(modes[prevIndex]);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div 
      className="flex flex-col h-screen bg-black text-white overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header className="flex-none p-4 bg-yellow-400 text-black flex items-center justify-between z-20 shadow-md">
        <div className="flex items-center gap-2">
            <h1 className="text-xl font-black uppercase tracking-tighter">AccessiLens</h1>
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-red-600 animate-pulse' : 'bg-gray-600'}`}></div>
        </div>
        
        <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 font-bold bg-black text-yellow-400 px-3 py-1 rounded-full text-sm active:scale-95 transition-transform"
        >
            <Globe className="w-4 h-4" />
            <span>{language.toUpperCase()}</span>
        </button>
      </header>

      {/* Mode Selector */}
      <nav className="flex-none z-20">
        <ModeBar 
            currentMode={currentMode} 
            currentLang={language}
            onModeChange={handleModeChange} 
            disabled={isProcessing && isActive}
        />
      </nav>

      {/* Camera Viewport (Main Content) */}
      <main className="flex-grow relative bg-gray-900">
        <CameraView ref={cameraRef} isActive={isActive} language={language} />
        
        {/* Object Search Overlay */}
        {showObjectInput && currentMode === AppMode.OBJECT && (
            <div className="absolute inset-0 bg-black/90 z-30 flex flex-col items-center justify-center p-6 text-center">
                <Search className="w-16 h-16 text-yellow-400 mb-4" />
                <h2 className="text-2xl font-bold mb-6 text-white">{t.searchPrompt}</h2>
                <form onSubmit={handleObjectSubmit} className="w-full max-w-sm">
                    <input 
                        type="text" 
                        value={objectQuery}
                        onChange={(e) => setObjectQuery(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className="w-full p-4 text-xl text-black rounded-lg border-4 border-yellow-400 mb-4 focus:outline-none focus:ring-4 ring-white"
                        autoFocus
                    />
                    <button 
                        type="submit"
                        className="w-full bg-yellow-400 text-black font-bold py-4 rounded-lg text-xl uppercase tracking-wider active:scale-95 transition-transform"
                    >
                        {t.validate}
                    </button>
                    <button 
                        type="button"
                        onClick={() => handleModeChange(AppMode.SCENE)}
                        className="w-full mt-4 text-gray-400 font-bold py-2 underline"
                    >
                        {t.cancel}
                    </button>
                </form>
            </div>
        )}

        {/* Last Description Display */}
        <div 
            className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t-2 border-yellow-400 p-4 min-h-[120px] max-h-[40%] overflow-y-auto"
            aria-live="polite"
        >
            <p className={`text-xl md:text-2xl font-medium leading-relaxed text-white ${language === 'ar' ? 'text-right font-sans' : ''}`}>
                {lastDescription}
            </p>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="flex-none z-20 pb-safe">
        <ControlPanel 
            isActive={isActive} 
            language={language}
            onToggleActive={handleToggleActive} 
            onRepeat={handleRepeat}
            isProcessing={isProcessing}
        />
      </footer>
    </div>
  );
};

export default App;