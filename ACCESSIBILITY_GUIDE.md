# FormSaathi Accessibility & Voice Module — Developer Guide

Welcome to the **FormSaathi Accessibility + Voice** documentation. This guide explains how to import, configure, and integrate the accessibility and speech components into any form or page within the FormSaathi application.

---

## 📁 Component Architecture & Directory Structure

All components are located under `src/components/`:

```
src/
├── components/
│   ├── VoiceControls.jsx          # Speech Synthesis & Speech Recognition
│   ├── AccessibilityControls.jsx  # Text Size Scaling & High Contrast
│   ├── LanguageSelector.jsx       # English, Hindi & Kannada Dropdown
│   ├── AccessibilityStatus.jsx    # Real-Time System Status Panel
│   └── AccessibilityHelp.jsx      # User Instructions & Keyboard Help
├── App.jsx                        # Example Integration & Orchestration
└── App.css                        # Design System & High-Contrast Tokens
```

---

## 1. `VoiceControls.jsx`

### Description
Encapsulates assistive audio features using native browser Web Speech APIs:
- **🔊 Read Aloud**: Reads questions or text aloud using `window.speechSynthesis`.
- **⏹️ Stop Reading**: Immediately halts ongoing audio playback safely.
- **🎤 Speak Answer**: Converts spoken user audio into text using `window.SpeechRecognition` (or `webkitSpeechRecognition`) and populates input fields.

### Props & Signatures

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `textToRead` | `string` | `''` | Text to read aloud when Read Aloud is triggered. |
| `selectedLang` | `string` | `'en'` | Language code (`'en'`, `'hi'`, `'kn'`). |
| `langTag` | `string` | `'en-IN'` | BCP 47 language tag (`'en-IN'`, `'hi-IN'`, `'kn-IN'`). |
| `onSpeechResult` | `function` | `(transcript) => {}` | Callback invoked with recognized speech text. |
| `isSpeaking` | `boolean` | `undefined` | Optional controlled state for whether audio is speaking. |
| `setIsSpeaking` | `function` | `undefined` | Setter for speaking state. |
| `isListening` | `boolean` | `undefined` | Optional controlled state for microphone listening. |
| `setIsListening` | `function` | `undefined` | Setter for listening state. |
| `speechError` | `string` | `undefined` | Optional error message string. |
| `setSpeechError` | `function` | `undefined` | Setter for error message state. |
| `onButtonKeyDown` | `function` | `undefined` | Optional custom keyboard trigger handler (`Enter`/`Space`). |

### Usage Example

```jsx
import React, { useState } from 'react';
import VoiceControls from './components/VoiceControls';

function QuestionField() {
  const [answer, setAnswer] = useState('');
  const question = "What is your permanent residential address?";

  return (
    <div>
      <label htmlFor="address">{question}</label>
      <input 
        id="address" 
        value={answer} 
        onChange={(e) => setAnswer(e.target.value)} 
      />

      <VoiceControls
        textToRead={question}
        selectedLang="en"
        langTag="en-IN"
        onSpeechResult={(spokenText) => setAnswer(spokenText)}
      />
    </div>
  );
}
```

---

## 2. `AccessibilityControls.jsx`

### Description
Provides user controls for visual accessibility:
- **➕ Increase Text Size**: Steps font size up (+2px).
- **➖ Decrease Text Size**: Steps font size down (-2px).
- **↺ Reset Size**: Restores default font size (18px).
- **🌓 High Contrast**: Toggles high-contrast theme (WCAG AAA compliant).

### Props & Signatures

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `fontSize` | `number` | `18` | Current font size in pixels. |
| `minFontSize` | `number` | `14` | Minimum permissible font size in pixels. |
| `maxFontSize` | `number` | `26` | Maximum permissible font size in pixels. |
| `defaultFontSize` | `number` | `18` | Base default font size. |
| `onIncreaseText` | `function` | `Required` | Callback to increment font size. |
| `onDecreaseText` | `function` | `Required` | Callback to decrement font size. |
| `onResetText` | `function` | `Required` | Callback to reset font size. |
| `highContrast` | `boolean` | `false` | Current high contrast boolean state. |
| `onToggleContrast` | `function` | `Required` | Callback to toggle high contrast mode. |

### Usage Example

```jsx
import React, { useState } from 'react';
import AccessibilityControls from './components/AccessibilityControls';

function AppLayout() {
  const [fontSize, setFontSize] = useState(18);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className={highContrast ? 'high-contrast' : ''} style={{ fontSize: `${fontSize}px` }}>
      <AccessibilityControls
        fontSize={fontSize}
        minFontSize={14}
        maxFontSize={26}
        defaultFontSize={18}
        onIncreaseText={() => setFontSize((prev) => Math.min(prev + 2, 26))}
        onDecreaseText={() => setFontSize((prev) => Math.max(prev - 2, 14))}
        onResetText={() => setFontSize(18)}
        highContrast={highContrast}
        onToggleContrast={() => setHighContrast((prev) => !prev)}
      />
    </div>
  );
}
```

---

## 3. `LanguageSelector.jsx`

### Description
Provides an accessible `<select>` dropdown for switching application and speech languages between **English**, **Hindi (हिंदी)**, and **Kannada (ಕನ್ನಡ)**.

### Exported Constants & Props

```javascript
export const DEFAULT_LANGUAGES = [
  { code: 'en', langTag: 'en-IN', name: 'English' },
  { code: 'hi', langTag: 'hi-IN', name: 'Hindi (हिंदी)' },
  { code: 'kn', langTag: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)' },
];
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `selectedLang` | `string` | `'en'` | Active language code (`'en'`, `'hi'`, `'kn'`). |
| `onLanguageChange` | `function` | `Required` | Callback receiving the selected language code. |
| `languages` | `Array` | `DEFAULT_LANGUAGES` | Optional custom array of language objects. |
| `disabled` | `boolean` | `false` | Disables dropdown during active transactions. |

### Usage Example

```jsx
import React, { useState } from 'react';
import LanguageSelector, { DEFAULT_LANGUAGES } from './components/LanguageSelector';

function LanguageHeader() {
  const [lang, setLang] = useState('en');

  return (
    <LanguageSelector
      selectedLang={lang}
      onLanguageChange={(newLang) => setLang(newLang)}
    />
  );
}
```

---

## 4. `AccessibilityStatus.jsx`

### Description
A live accessibility telemetry panel that displays real-time status:
1. **🔊 Read Aloud**: `Speaking` (active) or `Ready` (idle).
2. **🎤 Voice Input**: `Listening` (active), `Error` (microphone/network issue), or `Ready`.
3. **🔠 Text Size**: `Small`, `Normal`, `Large`, or `Extra Large` with exact pixel measurement.
4. **🌓 High Contrast**: `ON` or `OFF`.
5. **🌐 Language**: Active language name (`English`, `Hindi`, or `Kannada`).

### Props & Signatures

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `selectedLang` | `string` | `'en'` | Active language code. |
| `fontSize` | `number` | `18` | Active font size in pixels. |
| `highContrast` | `boolean` | `false` | Active contrast mode. |
| `isSpeaking` | `boolean` | `false` | True when text is currently being read aloud. |
| `isListening` | `boolean` | `false` | True when microphone is listening for input. |
| `speechError` | `string` | `''` | Current speech error string (if any). |

### Usage Example

```jsx
import React from 'react';
import AccessibilityStatus from './components/AccessibilityStatus';

function StatusSection({ lang, fontSize, highContrast, isSpeaking, isListening, error }) {
  return (
    <AccessibilityStatus
      selectedLang={lang}
      fontSize={fontSize}
      highContrast={highContrast}
      isSpeaking={isSpeaking}
      isListening={isListening}
      speechError={error}
    />
  );
}
```

---

## 5. `AccessibilityHelp.jsx`

### Description
A beginner-friendly informational guide card titled **"♿ How to Use Accessibility Features"** containing self-explanatory instructions for each feature:
- 🔊 **Read Aloud**: *"Listen to the current question."*
- ⏹️ **Stop Reading**: *"Stop the current voice reading."*
- 🎤 **Speak Answer**: *"Speak your answer instead of typing."*
- 🔠 **Text Size**: *"Make the text larger or smaller."*
- 🌓 **High Contrast**: *"Increase contrast to make the page easier to see."*
- 🌐 **Language**: *"Choose English, Hindi, or Kannada."*
- ⌨️ **Keyboard**: *"Use Tab to move between controls and Enter/Space to activate buttons."*

### Usage Example

```jsx
import React from 'react';
import AccessibilityHelp from './components/AccessibilityHelp';

function HelpFooter() {
  return <AccessibilityHelp />;
}
```

---

## 🌐 Kannada Voice Fallback Behavior

### Background
While modern desktop and mobile browsers support Kannada Unicode script rendering out of the box, some operating systems (e.g., standard Windows/Linux installations without Indian Language Packs) do not bundle a native Kannada SpeechSynthesis text-to-speech (TTS) voice.

### How Our Fallback Works
1. `VoiceControls.jsx` queries available system voices using `window.speechSynthesis.getVoices()`.
2. When Kannada (`kn`) is selected:
   - If a Kannada voice (`kn-IN`, `kn`, or matching `"kannada"`) is present, it uses that voice.
   - If **no** Kannada voice is installed:
     - It **never throws an exception** or generates console errors.
     - Kannada text (*"ನಿಮ್ಮ ಶಾಶ್ವತ ವಸತಿ ವಿಳಾಸವೇನು?"*) continues to display normally.
     - An informational notice automatically appears:
       > ℹ️ *Kannada voice is not available on this device. Kannada text is still supported.*
     - Clicking **Read Aloud** safely cancels without crashing.
     - **Speak Answer** continues to capture and transcribe Kannada speech if the browser speech recognition service supports it.

---

## 🌐 Browser Compatibility & Web Speech API Notes

| API | Chrome / Chromium / Edge | Firefox | Safari (iOS/macOS) |
| :--- | :--- | :--- | :--- |
| **SpeechSynthesis** (Read Aloud) | ✅ Full support with multiple voices | ✅ Supported (OS dependent) | ✅ Supported |
| **SpeechRecognition** (Speak Answer) | ✅ Full support (`webkitSpeechRecognition`) | ⚠️ Limited / Flags required | ✅ Supported on recent Safari |

### Best Practices for Developers
1. **Microphone Permissions**: If the user blocks microphone access, `VoiceControls.jsx` gracefully catches the `not-allowed` error and displays a clear alert banner asking the user to enable permissions.
2. **Audio Cancellation on Unmount**: When navigating across forms, all ongoing SpeechSynthesis and SpeechRecognition processes are automatically aborted in `useEffect` cleanup return functions.
3. **Mutual Exclusion**: Starting **Speak Answer** automatically stops **Read Aloud** to prevent speech synthesis feedback from entering the microphone.

---

## ⌨️ Keyboard Accessibility & Focus Conventions

- **Tab Order**: All interactive controls are organized in a natural visual flow:
  1. Language Selector (`#language-select`)
  2. Form Input fields
  3. Read Aloud (`#read-aloud-btn`)
  4. Stop Reading (`#stop-reading-btn`)
  5. Speak Answer (`#speak-answer-btn`)
  6. Decrease Text Size (`#decrease-text-btn`)
  7. Increase Text Size (`#increase-text-btn`)
  8. High Contrast Toggle (`#toggle-contrast-btn`)
  9. Accessibility Status & Help Cards
- **Keyboard Triggers**: Every button can be triggered using both **Enter** and **Space** keys.
- **Focus Rings**:
  - **Normal Mode**: 3px solid blue outline with glow (`outline: 3px solid #1d4ed8; outline-offset: 3px;`).
  - **High-Contrast Mode**: 4px bright yellow outline (`outline: 4px solid #ffff00 !important; outline-offset: 3px;`).

---

## 🚀 Complete Page Integration Example

Here is how all components come together in `App.jsx`:

```jsx
import React, { useState } from 'react';
import LanguageSelector, { DEFAULT_LANGUAGES } from './components/LanguageSelector';
import AccessibilityControls from './components/AccessibilityControls';
import VoiceControls from './components/VoiceControls';
import AccessibilityStatus from './components/AccessibilityStatus';
import AccessibilityHelp from './components/AccessibilityHelp';
import './App.css';

function FormSaathiPage() {
  const [selectedLang, setSelectedLang] = useState('en');
  const [fontSize, setFontSize] = useState(18);
  const [highContrast, setHighContrast] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');

  const currentLang = DEFAULT_LANGUAGES.find((l) => l.code === selectedLang) || DEFAULT_LANGUAGES[0];
  const question = "What is your permanent residential address?";

  return (
    <div className={`app-container ${highContrast ? 'high-contrast' : ''}`} style={{ fontSize: `${fontSize}px` }}>
      <div className="card">
        <h1>FormSaathi</h1>

        {/* 1. Language Dropdown */}
        <LanguageSelector selectedLang={selectedLang} onLanguageChange={setSelectedLang} />

        {/* 2. Form Field & Voice Controls */}
        <label htmlFor="address-input">{question}</label>
        <input 
          id="address-input" 
          value={answer} 
          onChange={(e) => setAnswer(e.target.value)} 
        />

        <VoiceControls
          textToRead={question}
          selectedLang={selectedLang}
          langTag={currentLang.langTag}
          onSpeechResult={(text) => setAnswer(text)}
          isSpeaking={isSpeaking}
          setIsSpeaking={setIsSpeaking}
          isListening={isListening}
          setIsListening={setIsListening}
          speechError={speechError}
          setSpeechError={setSpeechError}
        />

        {/* 3. Display Controls */}
        <AccessibilityControls
          fontSize={fontSize}
          onIncreaseText={() => setFontSize((s) => Math.min(s + 2, 26))}
          onDecreaseText={() => setFontSize((s) => Math.max(s - 2, 14))}
          onResetText={() => setFontSize(18)}
          highContrast={highContrast}
          onToggleContrast={() => setHighContrast((c) => !c)}
        />

        {/* 4. Live Status Panel */}
        <AccessibilityStatus
          selectedLang={selectedLang}
          fontSize={fontSize}
          highContrast={highContrast}
          isSpeaking={isSpeaking}
          isListening={isListening}
          speechError={speechError}
        />

        {/* 5. Help Guide */}
        <AccessibilityHelp />
      </div>
    </div>
  );
}

export default FormSaathiPage;
```
