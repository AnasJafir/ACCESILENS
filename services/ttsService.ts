import { TtsOptions, Language } from "../types";

let synth: SpeechSynthesis | null = window.speechSynthesis;
let voices: SpeechSynthesisVoice[] = [];

// Initialize voices
if (synth) {
  const loadVoices = () => {
    voices = synth!.getVoices();
  };
  loadVoices();
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
  }
}

const getVoiceForLanguage = (lang: Language): SpeechSynthesisVoice | undefined => {
    const langCodeMap: Record<Language, string> = {
        fr: 'fr',
        en: 'en',
        ar: 'ar'
    };
    const prefix = langCodeMap[lang];
    // Try to find an exact match or prefix match
    return voices.find(v => v.lang.startsWith(prefix));
};

export const speak = (text: string, options: TtsOptions = {}) => {
  if (!synth) return;

  // Cancel any currently playing speech
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set voice based on language option or default to French logic if not provided (though App should provide it)
  // We expect options.lang to be passed now
  let voice: SpeechSynthesisVoice | undefined;
  
  if (options.lang) {
     voice = getVoiceForLanguage(options.lang as Language);
  }

  // Fallback to French if no language specified
  if (!voice && !options.lang) {
      voice = getVoiceForLanguage('fr');
  }

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }

  utterance.rate = options.rate || 1.0;
  utterance.pitch = options.pitch || 1.0;
  utterance.volume = options.volume || 1.0;

  synth.speak(utterance);
};

export const stopSpeaking = () => {
  if (synth) {
    synth.cancel();
  }
};

export const isSpeaking = () => {
  return synth ? synth.speaking : false;
};