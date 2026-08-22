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
        <h2 className="section-title">Accessibility Settings</h2>
        <span className="size-badge" aria-label={`Current text size: ${textPercentage} percent`}>
          Text Size: {textPercentage}%
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
          ➖ Decrease Text Size
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
          ➕ Increase Text Size
        </button>

        {fontSize !== defaultFontSize && (
          <button
            type="button"
            id="reset-text-btn"
            className="btn btn-secondary"
            onClick={onResetText}
            onKeyDown={(e) => handleKeyDown(e, onResetText)}
            aria-label="Reset text size to default"
          >
            ↺ Reset Size
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
          🌓 {highContrast ? 'Normal Contrast' : 'High Contrast'}
        </button>
      </div>
    </section>
  );
}

export default AccessibilityControls;
