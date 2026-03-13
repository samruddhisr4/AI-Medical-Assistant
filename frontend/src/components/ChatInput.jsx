import { useState, useRef, useCallback } from 'react';
import VoiceInput from './VoiceInput';
import './ChatInput.css';

const QUICK_PROMPTS = [
    'I have a headache and fever',
    'My chest feels tight',
    'I have been feeling anxious lately',
    'What should I do for back pain?',
];

function ChatInput({ onSend, isLoading }) {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        onSend(input.trim());
        setInput('');
        // Reset height
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        textareaRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e) => {
        setInput(e.target.value);
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
        }
    };

    // Called when voice recognition returns a final transcript
    const handleVoiceTranscript = useCallback((transcript) => {
        setInput((prev) => {
            const updated = prev ? `${prev} ${transcript}` : transcript;
            return updated;
        });
        textareaRef.current?.focus();
    }, []);

    return (
        <div className="input-container">
            {/* Quick prompts */}
            <div className="quick-prompts" role="list">
                {QUICK_PROMPTS.map((prompt) => (
                    <button
                        key={prompt}
                        className="quick-prompt-btn"
                        onClick={() => onSend(prompt)}
                        disabled={isLoading}
                        role="listitem"
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            <div className="input-row">
                <div className="input-wrapper">
                    <textarea
                        ref={textareaRef}
                        id="chat-input"
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe your symptoms or ask a health question..."
                        disabled={isLoading}
                        rows={1}
                        className="chat-textarea"
                        aria-label="Type your health question"
                    />
                    <div className="input-hint">Press Enter to send · Shift+Enter for new line</div>
                </div>

                {/* Voice Input */}
                <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />

                <button
                    id="send-button"
                    className={`send-btn ${isLoading ? 'loading' : ''}`}
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    aria-label="Send message"
                >
                    {isLoading ? (
                        <svg className="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}

export default ChatInput;
