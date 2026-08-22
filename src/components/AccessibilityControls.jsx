import React from 'react';

function AccessibilityControls({
  fontSize = 18,
  minFontSize = 14,
  maxFontSize = 26,
  defaultFontSize = 18,
  onIncreaseText,
  onDecreaseText,
  onResetText,
  highContrast = false,
  onToggleContrast,
  onButtonKeyDown,
}) {
  const textPercentage = Math.round((fontSize / defaultFontSize) * 100);

  const handleKeyDown = (e, callback) => {
    if (onButtonKeyDown) {
      onButtonKeyDown(e, callback);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <section className="settings-section" aria-label="Accessibility Display Settings">
      <div className="settings-header">
        <div className="section-title-wrapper">
          <span className="section-icon" aria-hidden="true">
            🎛️
          </span>
          <h2 className="section-title">Display & Contrast Controls</h2>
        </div>
        <span
          className="size-badge"
          aria-label={`Current text size: ${textPercentage} percent, ${fontSize} pixels`}
        >
          Size: {textPercentage}% ({fontSize}px)
        </span>
      </div>

      <div className="controls-row">
        <button
          type="button"
          id="decrease-text-btn"
          className="btn btn-secondary"
          onClick={onDecreaseText}
          onKeyDown={(e) => handleKeyDown(e, onDecreaseText)}
          disabled={fontSize <= minFontSize}
          aria-label="Decrease text size"
        >
          <span>➖</span> Decrease Text Size
        </button>

        <button
          type="button"
          id="increase-text-btn"
          className="btn btn-secondary"
          onClick={onIncreaseText}
          onKeyDown={(e) => handleKeyDown(e, onIncreaseText)}
          disabled={fontSize >= maxFontSize}
          aria-label="Increase text size"
        >
          <span>➕</span> Increase Text Size
        </button>

        {fontSize !== defaultFontSize && (
          <button
            type="button"
            id="reset-text-btn"
            className="btn btn-secondary btn-reset"
            onClick={onResetText}
            onKeyDown={(e) => handleKeyDown(e, onResetText)}
            aria-label="Reset text size to default"
          >
            <span>↺</span> Reset Size
          </button>
        )}

        <button
          type="button"
          id="toggle-contrast-btn"
          className={`btn btn-secondary ${highContrast ? 'active-contrast' : ''}`}
          onClick={onToggleContrast}
          onKeyDown={(e) => handleKeyDown(e, onToggleContrast)}
          aria-pressed={highContrast}
          aria-label="Toggle high contrast accessibility mode"
        >
          <span>🌓</span> {highContrast ? 'Normal Contrast' : 'High Contrast'}
        </button>
      </div>
    </section>
  );
}

export default AccessibilityControls;
