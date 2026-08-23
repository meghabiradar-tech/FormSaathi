import React from 'react';

export const DEFAULT_LANGUAGES = [
  { code: 'en', langTag: 'en-IN', name: 'English' },
  { code: 'hi', langTag: 'hi-IN', name: 'Hindi (हिंदी)' },
  { code: 'kn', langTag: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)' },
];

function LanguageSelector({
  selectedLang = 'en',
  onLanguageChange,
  languages = DEFAULT_LANGUAGES,
  disabled = false,
}) {
  return (
    <div className="language-selector-container">
      <div className="language-label-wrapper">
        <span className="language-icon" aria-hidden="true">
          🌐
        </span>
        <label htmlFor="language-select" className="language-label">
          Language / भाषा / ಭಾಷೆ:
        </label>
      </div>
      <div className="select-wrapper">
        <select
          id="language-select"
          className="language-select"
          value={selectedLang}
          disabled={disabled}
          onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
          aria-label="Select form language"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default LanguageSelector;
