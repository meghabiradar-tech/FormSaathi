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
      <label htmlFor="language-select" className="language-label">
        🌐 Language:
      </label>
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
  );
}

export default LanguageSelector;
