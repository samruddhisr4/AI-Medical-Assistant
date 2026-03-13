import { useState, useEffect, useRef } from 'react';
import './VoiceInput.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function VoiceInput({ onTranscript, disabled }) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported] = useState(!!SpeechRecognition);
    const [interim, setInterim] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!isSupported) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let interimText = '';
            let finalText = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalText += transcript;
                } else {
                    interimText += transcript;
                }
            }
            setInterim(interimText);
            if (finalText) {
                onTranscript(finalText);
                setInterim('');
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterim('');
        };

        recognition.onerror = (e) => {
            console.error('Speech recognition error:', e.error);
            setIsListening(false);
            setInterim('');
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.abort();
        };
    }, [isSupported, onTranscript]);

    const toggle = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    if (!isSupported) return null;

    return (
        <div className="voice-wrapper">
            {interim && (
                <div className="interim-text">
                    <span className="interim-dot"></span>
                    "{interim}..."
                </div>
            )}
            <button
                id="voice-input-btn"
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={toggle}
                disabled={disabled}
                title={isListening ? 'Stop listening' : 'Voice input'}
                aria-label={isListening ? 'Stop voice recognition' : 'Start voice recognition'}
            >
                {isListening ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                )}
            </button>
        </div>
    );
}

export default VoiceInput;
