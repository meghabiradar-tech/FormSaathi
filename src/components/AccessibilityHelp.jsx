import React from 'react';

const HELP_ITEMS = [
  {
    icon: '🔊',
    title: 'Read Aloud',
    description: 'Listen to the current question.',
  },
  {
    icon: '⏹️',
    title: 'Stop Reading',
    description: 'Stop the current voice reading.',
  },
  {
    icon: '🎤',
    title: 'Speak Answer',
    description: 'Speak your answer instead of typing.',
  },
  {
    icon: '🔠',
    title: 'Text Size',
    description: 'Make the text larger or smaller.',
  },
  {
    icon: '🌓',
    title: 'High Contrast',
    description: 'Increase contrast to make the page easier to see.',
  },
  {
    icon: '🌐',
    title: 'Language',
    description: 'Choose English, Hindi, or Kannada.',
  },
  {
    icon: '⌨️',
    title: 'Keyboard',
    description: 'Use Tab to move between controls and Enter/Space to activate buttons.',
  },
];

function AccessibilityHelp() {
  return (
    <section
      className="accessibility-help-section"
      aria-label="How to Use Accessibility Features"
      role="region"
      tabIndex={0}
    >
      <div className="help-header">
        <div className="help-title-wrapper">
          <span className="help-title-icon" aria-hidden="true">
            ♿
          </span>
          <h2 className="help-title">How to Use Accessibility Features</h2>
        </div>
        <span className="help-subtitle">Quick Accessibility Guide</span>
      </div>

      <ul className="help-list" role="list">
        {HELP_ITEMS.map((item, index) => (
          <li key={index} className="help-item" role="listitem">
            <div className="help-icon-wrapper" aria-hidden="true">
              <span className="help-icon">{item.icon}</span>
            </div>
            <div className="help-content">
              <strong className="help-item-title">{item.title}</strong>
              <span className="help-item-desc">{item.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AccessibilityHelp;
