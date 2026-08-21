import React from 'react';

const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi',
  kn: 'Kannada',
};

export const getTextSizeCategory = (fontSize) => {
  if (fontSize < 18) return 'Small';
  if (fontSize === 18) return 'Normal';
  if (fontSize <= 22) return 'Large';
  return 'Extra Large';
};

function AccessibilityStatus({
  selectedLang = 'en',
  fontSize = 18,
  highContrast = false,
  isSpeaking = false,
  isListening = false,
  speechError = '',
}) {
  const languageDisplay = LANGUAGE_NAMES[selectedLang] || 'English';
  const textSizeDisplay = getTextSizeCategory(fontSize);
  const highContrastDisplay = highContrast ? 'ON' : 'OFF';
  const readAloudDisplay = isSpeaking ? 'Speaking' : 'Ready';

  let voiceInputDisplay = 'Ready';
  let voiceInputClass = 'status-pill-ready';

  if (isListening) {
    voiceInputDisplay = 'Listening';
    voiceInputClass = 'status-pill-listening';
  } else if (speechError) {
    voiceInputDisplay = 'Error';
    voiceInputClass = 'status-pill-error';
  }

  return (
    <section
      className="accessibility-status-panel"
      aria-label="Accessibility Status Panel"
      role="region"
      tabIndex={0}
    >
      <div className="status-panel-header">
        <h2 className="status-panel-title">📊 Accessibility Status</h2>
        <span className="status-live-tag" aria-hidden="true">
          Live
        </span>
      </div>

      <div className="status-grid">
        {/* 1. Read Aloud */}
        <div className="status-card">
          <span className="status-card-label">🔊 Read Aloud</span>
          <span
            className={`status-pill ${
              isSpeaking ? 'status-pill-speaking' : 'status-pill-ready'
            }`}
          >
            {readAloudDisplay}
          </span>
        </div>

        {/* 2. Voice Input */}
        <div className="status-card">
          <span className="status-card-label">🎤 Voice Input</span>
          <span className={`status-pill ${voiceInputClass}`}>
            {voiceInputDisplay}
          </span>
        </div>

        {/* 3. Text Size */}
        <div className="status-card">
          <span className="status-card-label">🔠 Text Size</span>
          <span className="status-pill status-pill-info">
            {textSizeDisplay} ({fontSize}px)
          </span>
        </div>

        {/* 4. High Contrast */}
        <div className="status-card">
          <span className="status-card-label">🌓 High Contrast</span>
          <span
            className={`status-pill ${
              highContrast ? 'status-pill-contrast-on' : 'status-pill-neutral'
            }`}
          >
            {highContrastDisplay}
          </span>
        </div>

        {/* 5. Language */}
        <div className="status-card">
          <span className="status-card-label">🌐 Language</span>
          <span className="status-pill status-pill-lang">
            {languageDisplay}
          </span>
        </div>
      </div>
    </section>
  );
}

export default AccessibilityStatus;
