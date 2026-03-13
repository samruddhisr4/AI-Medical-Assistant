import './Sidebar.css';

function Sidebar({ isOpen, onClose, onClear, sessionId, messageCount }) {
    const handleClear = () => {
        if (window.confirm('Clear all conversation history? This cannot be undone.')) {
            onClear();
            onClose();
        }
    };

    const shortSession = sessionId ? sessionId.slice(0, 8).toUpperCase() : '—';

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Navigation sidebar">
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <div className="sidebar-icon">🩺</div>
                    <span>MediAssist</span>
                </div>
                <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">✕</button>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section-label">Session</div>
                <div className="session-card">
                    <div className="session-row">
                        <span className="session-label">Session ID</span>
                        <span className="session-value">#{shortSession}</span>
                    </div>
                    <div className="session-row">
                        <span className="session-label">Messages</span>
                        <span className="session-value">{messageCount}</span>
                    </div>
                </div>

                <div className="sidebar-section-label">About</div>
                <div className="about-card">
                    <p>MediAssist uses AI to provide structured health information based on your symptoms.</p>
                    <div className="about-note">
                        <span>⚕️</span>
                        <span>Not a substitute for professional medical advice.</span>
                    </div>
                </div>

                <div className="sidebar-section-label">Features</div>
                <ul className="feature-list">
                    {[
                        { icon: '🔍', text: 'Symptom Analysis' },
                        { icon: '🏥', text: 'Doctor Recommendations' },
                        { icon: '📊', text: 'Urgency Assessment' },
                        { icon: '💬', text: 'Conversation History' },
                        { icon: '🔒', text: 'Session-based Privacy' },
                    ].map(({ icon, text }) => (
                        <li key={text} className="feature-item">
                            <span>{icon}</span>
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button
                    id="clear-history-btn"
                    className="clear-btn"
                    onClick={handleClear}
                    disabled={messageCount === 0}
                >
                    <span>🗑️</span>
                    Clear Conversation
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
