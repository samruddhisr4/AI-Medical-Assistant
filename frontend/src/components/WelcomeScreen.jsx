import './WelcomeScreen.css';

const SAMPLE_PROMPTS = [
    { icon: '🤒', text: 'I have a headache and high fever for 2 days' },
    { icon: '❤️', text: 'My heart is racing and I feel short of breath' },
    { icon: '🦴', text: 'I have severe back pain after lifting something heavy' },
    { icon: '😴', text: 'I have been feeling extremely fatigued and sleep too much' },
    { icon: '🤢', text: 'I feel nauseous and have stomach cramps' },
    { icon: '😰', text: 'I am experiencing anxiety and panic attacks' },
];

function WelcomeScreen({ onPromptClick }) {
    return (
        <div className="welcome-screen">
            <div className="welcome-content">
                {/* Hero */}
                <div className="welcome-hero">
                    <div className="hero-glow"></div>
                    <div className="hero-icon">🩺</div>
                    <h1 className="welcome-title">Your AI Medical Assistant</h1>
                    <p className="welcome-subtitle">
                        Describe your symptoms and get structured health insights, specialist recommendations, and guidance — instantly.
                    </p>
                </div>

                {/* Disclaimer Banner */}
                <div className="disclaimer-banner" role="alert">
                    <span>⚕️</span>
                    <p>
                        <strong>Important:</strong> MediAssist is for informational purposes only. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.
                    </p>
                </div>

                {/* Prompt Grid */}
                <div className="prompts-section">
                    <p className="prompts-label">Try asking about...</p>
                    <div className="prompts-grid">
                        {SAMPLE_PROMPTS.map(({ icon, text }) => (
                            <button
                                key={text}
                                className="prompt-card"
                                onClick={() => onPromptClick(text)}
                            >
                                <span className="prompt-icon">{icon}</span>
                                <span className="prompt-text">{text}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feature Pills */}
                <div className="feature-pills">
                    {[
                        { icon: '🔍', label: 'Symptom Analysis' },
                        { icon: '👨‍⚕️', label: 'Doctor Recommendations' },
                        { icon: '⚡', label: 'Urgency Assessment' },
                        { icon: '🔐', label: 'Session History' },
                    ].map(({ icon, label }) => (
                        <div key={label} className="feature-pill">
                            <span>{icon}</span>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WelcomeScreen;
