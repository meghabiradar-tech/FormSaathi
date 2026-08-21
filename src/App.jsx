import { useState, useEffect } from 'react';
import LanguageSelector, { DEFAULT_LANGUAGES } from './components/LanguageSelector';
import AccessibilityControls from './components/AccessibilityControls';
import VoiceControls from './components/VoiceControls';
import AccessibilityStatus from './components/AccessibilityStatus';
import AccessibilityHelp from './components/AccessibilityHelp';
import './App.css';

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 26;
const DEFAULT_FONT_SIZE = 18;

const TRANSLATIONS = {
  en: {
    question: 'What is your permanent residential address?',
    placeholder: 'Type your address here or use voice...',
  },
  hi: {
    question: 'आपका स्थायी आवासीय पता क्या है?',
    placeholder: 'अपना पता यहाँ लिखें या आवाज़ का उपयोग करें...',
  },
  kn: {
    question: 'ನಿಮ್ಮ ಶಾಶ್ವತ ವಸತಿ ವಿಳಾಸವೇನು?',
    placeholder: 'ನಿಮ್ಮ ವಿಳಾಸವನ್ನು ಇಲ್ಲಿ ನಮೂದಿಸಿ ಅಥವಾ ಧ್ವನಿ ಬಳಸಿ...',
  },
};

function App() {
  // State for Language selection with persistence
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      const saved = localStorage.getItem('formsaathi_lang');
      if (saved && ['en', 'hi', 'kn'].includes(saved)) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'en';
  });

  // State for Text Size with persistence
  const [fontSize, setFontSize] = useState(() => {
    try {
      const saved = localStorage.getItem('formsaathi_font_size');
      const parsed = Number(saved);
      if (parsed >= MIN_FONT_SIZE && parsed <= MAX_FONT_SIZE) {
        return parsed;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_FONT_SIZE;
  });

  // State for High Contrast with persistence
  const [highContrast, setHighContrast] = useState(() => {
    try {
      const saved = localStorage.getItem('formsaathi_high_contrast');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [answer, setAnswer] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');

  // Active language configuration
  const currentLangConfig =
    DEFAULT_LANGUAGES.find((l) => l.code === selectedLang) || DEFAULT_LANGUAGES[0];
  const questionText = TRANSLATIONS[selectedLang]?.question || TRANSLATIONS.en.question;
  const inputPlaceholder = TRANSLATIONS[selectedLang]?.placeholder || TRANSLATIONS.en.placeholder;

  // Persist language selection
  useEffect(() => {
    try {
      localStorage.setItem('formsaathi_lang', selectedLang);
    } catch {
      // Ignore
    }
  }, [selectedLang]);

  // Persist font size preference
  useEffect(() => {
    try {
      localStorage.setItem('formsaathi_font_size', fontSize.toString());
    } catch {
      // Ignore
    }
  }, [fontSize]);

  // Persist high contrast preference
  useEffect(() => {
    try {
      localStorage.setItem('formsaathi_high_contrast', highContrast.toString());
    } catch {
      // Ignore
    }
  }, [highContrast]);

  // Handlers for adjusting text size within safe bounds
  const handleIncreaseText = () => {
    setFontSize((prev) => Math.min(prev + 2, MAX_FONT_SIZE));
  };

  const handleDecreaseText = () => {
    setFontSize((prev) => Math.max(prev - 2, MIN_FONT_SIZE));
  };

  const handleResetText = () => {
    setFontSize(DEFAULT_FONT_SIZE);
  };

  // Handler for toggling high contrast mode
  const handleToggleContrast = () => {
    setHighContrast((prev) => !prev);
  };

  return (
    <div
      className={`app-container ${highContrast ? 'high-contrast' : ''}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <div className="card" role="region" aria-label="FormSaathi Accessibility Assistant">
        {/* Header Section */}
        <header className="header">
          <h1 className="title">FormSaathi</h1>
          <p className="subtitle">
            FormSaathi helps users access and complete digital forms.
          </p>
        </header>

        {/* 1. Language Selector Component */}
        <LanguageSelector
          selectedLang={selectedLang}
          onLanguageChange={setSelectedLang}
        />

        {/* 2. Sample Form Question Section */}
        <main className="form-section">
          <h2 className="section-title">Sample Form Question</h2>

          {/* Accessible Label linked to the Input */}
          <label htmlFor="address-input" id="address-label" className="question-label">
            {questionText}
          </label>

          {/* Step 1 in Tab Order: Address Input */}
          <div className="input-container">
            <input
              id="address-input"
              type="text"
              className="text-input"
              placeholder={inputPlaceholder}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              aria-labelledby="address-label"
              autoComplete="street-address"
            />
          </div>

          {/* Step 2 & 3 in Tab Order: Voice Controls Component */}
          <VoiceControls
            textToRead={questionText}
            selectedLang={selectedLang}
            langTag={currentLangConfig.langTag}
            onSpeechResult={(spokenTranscript) => setAnswer(spokenTranscript)}
            isSpeaking={isSpeaking}
            setIsSpeaking={setIsSpeaking}
            isListening={isListening}
            setIsListening={setIsListening}
            speechError={speechError}
            setSpeechError={setSpeechError}
          />
        </main>

        {/* Step 4-6 in Tab Order: Accessibility Controls Component */}
        <AccessibilityControls
          fontSize={fontSize}
          minFontSize={MIN_FONT_SIZE}
          maxFontSize={MAX_FONT_SIZE}
          defaultFontSize={DEFAULT_FONT_SIZE}
          onIncreaseText={handleIncreaseText}
          onDecreaseText={handleDecreaseText}
          onResetText={handleResetText}
          highContrast={highContrast}
          onToggleContrast={handleToggleContrast}
        />

        {/* Step 7 in Tab Order: Real-Time Accessibility Status Panel */}
        <AccessibilityStatus
          selectedLang={selectedLang}
          fontSize={fontSize}
          highContrast={highContrast}
          isSpeaking={isSpeaking}
          isListening={isListening}
          speechError={speechError}
        />

        {/* Step 8 in Tab Order: Accessibility Help Section */}
        <AccessibilityHelp />
      </div>
    </div>
  );
}

export default App;