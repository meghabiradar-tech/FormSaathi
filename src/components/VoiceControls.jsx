import { useState, useEffect, useRef } from 'react';

function VoiceControls({
  textToRead = '',
  selectedLang = 'en',
  langTag = 'en-IN',
  onSpeechResult,
  onButtonKeyDown,
  isSpeaking: externalIsSpeaking,
  setIsSpeaking: externalSetIsSpeaking,
  isListening: externalIsListening,
  setIsListening: externalSetIsListening,
  speechError: externalSpeechError,
  setSpeechError: externalSetSpeechError,
}) {
  const [internalIsSpeaking, setInternalIsSpeaking] = useState(false);
  const [internalIsListening, setInternalIsListening] = useState(false);
  const [internalSpeechError, setInternalSpeechError] = useState('');
  const [availableVoices, setAvailableVoices] = useState([]);
  const [kannadaVoiceAvailable, setKannadaVoiceAvailable] = useState(false);

  const isSpeaking = externalIsSpeaking !== undefined ? externalIsSpeaking : internalIsSpeaking;
  const setIsSpeaking = externalSetIsSpeaking || setInternalIsSpeaking;

  const isListening = externalIsListening !== undefined ? externalIsListening : internalIsListening;
  const setIsListening = externalSetIsListening || setInternalIsListening;

  const speechError = externalSpeechError !== undefined ? externalSpeechError : internalSpeechError;
  const setSpeechError = externalSetSpeechError || setInternalSpeechError;

  const recognitionRef = useRef(null);

  // Load and listen for available system speech synthesis voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      setAvailableVoices(voices);

      const hasKnVoice = voices.some(
        (v) =>
          v.lang.toLowerCase() === 'kn-in' ||
          v.lang.toLowerCase().startsWith('kn') ||
          v.name.toLowerCase().includes('kannada')
      );
      setKannadaVoiceAvailable(hasKnVoice);
    };

    checkVoices();
    window.speechSynthesis.onvoiceschanged = checkVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Helper to match voice by tag, prefix, or language name
  const findMatchingVoice = (targetLangTag, langCode) => {
    const voices = availableVoices.length > 0 ? availableVoices : (window.speechSynthesis?.getVoices() || []);
    if (!voices || voices.length === 0) return null;

    let matched = voices.find((v) => v.lang.toLowerCase() === targetLangTag.toLowerCase());
    if (matched) return matched;

    matched = voices.find((v) =>
      v.lang.toLowerCase().replace('_', '-').startsWith(langCode.toLowerCase())
    );
    if (matched) return matched;

    const langName = langCode === 'kn' ? 'kannada' : langCode === 'hi' ? 'hindi' : 'english';
    matched = voices.find((v) => v.name.toLowerCase().includes(langName));
    return matched || null;
  };

  // Cleanup speech synthesis & recognition on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Handler for Read Aloud
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.abort();
      setIsListening(false);
    }

    window.speechSynthesis.cancel();

    // Check voice for selected language
    const matchedVoice = findMatchingVoice(langTag, selectedLang);

    // If Kannada is selected and no Kannada voice is available on this device, do not error
    if (selectedLang === 'kn' && !matchedVoice) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = langTag;

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    setIsSpeaking(true);

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        console.warn('Speech synthesis notice:', event);
      }
      setIsSpeaking(false);
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis handled gracefully:', err);
      setIsSpeaking(false);
    }
  };

  // Handler for Stop Reading (safely stops ongoing speech or does nothing if idle)
  const handleStopReading = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Handler for Speak Answer (Speech-to-Text via Web Speech Recognition)
  const handleSpeakAnswer = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setSpeechError('');

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        'Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.'
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langTag;
      recognition.continuous = false;
      recognition.interimResults = true;

      setIsListening(true);

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError('');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript && onSpeechResult) {
          onSpeechResult(transcript);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError(
            '⚠️ Microphone access was denied. Please allow microphone permissions in your browser.'
          );
        } else if (event.error === 'no-speech') {
          setSpeechError('⚠️ No speech was detected. Please try speaking again.');
        } else if (event.error === 'network') {
          setSpeechError('⚠️ Network connection issue occurred during speech recognition.');
        } else if (event.error !== 'aborted') {
          setSpeechError(`⚠️ Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setSpeechError('Unable to start speech recognition.');
      setIsListening(false);
    }
  };

  const handleKeyDown = (e, callback) => {
    if (onButtonKeyDown) {
      onButtonKeyDown(e, callback);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className="voice-controls-wrapper">
      {/* Voice Action Buttons */}
      <div className="voice-buttons-row">
        <button
          type="button"
          id="read-aloud-btn"
          className={`btn btn-action btn-read-aloud ${isSpeaking ? 'btn-speaking' : ''}`}
          onClick={handleReadAloud}
          onKeyDown={(e) => handleKeyDown(e, handleReadAloud)}
          aria-pressed={isSpeaking}
          aria-label="Read question aloud"
        >
          <span>🔊</span> Read Aloud
        </button>

        {/* 1. Visible Stop Reading Button */}
        <button
          type="button"
          id="stop-reading-btn"
          className="btn btn-secondary btn-stop"
          onClick={handleStopReading}
          onKeyDown={(e) => handleKeyDown(e, handleStopReading)}
          aria-label="Stop reading aloud"
        >
          <span>⏹️</span> Stop Reading
        </button>

        <button
          type="button"
          id="speak-answer-btn"
          className={`btn btn-action btn-speak-answer ${isListening ? 'btn-listening' : ''}`}
          onClick={handleSpeakAnswer}
          onKeyDown={(e) => handleKeyDown(e, handleSpeakAnswer)}
          aria-pressed={isListening}
          aria-label={isListening ? 'Stop listening' : 'Speak your answer using microphone'}
        >
          <span>🎤</span> {isListening ? 'Listening...' : 'Speak Answer'}
        </button>
      </div>

      {/* Informative Message for Devices without Kannada TTS Voice */}
      {selectedLang === 'kn' && !kannadaVoiceAvailable && (
        <div className="status-message status-info" role="status" aria-live="polite">
          <span className="status-message-icon">ℹ️</span>
          <span>Kannada voice is not available on this device. Kannada text is still supported.</span>
        </div>
      )}

      {/* Live Status Announcements */}
      {isListening && (
        <div className="status-message status-listening" role="status" aria-live="polite">
          <span className="status-message-icon">🎙️</span>
          <span>Listening... Speak your address clearly now. (Press Space or Enter to stop)</span>
        </div>
      )}

      {/* Error Announcements */}
      {speechError && (
        <div className="status-message status-error" role="alert">
          <span className="status-message-icon">⚠️</span>
          <span>{speechError}</span>
        </div>
      )}
    </div>
  );
}

export default VoiceControls;
