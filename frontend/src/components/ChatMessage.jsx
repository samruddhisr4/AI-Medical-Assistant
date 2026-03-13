import './ChatMessage.css';

const URGENCY_CONFIG = {
    low: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Low Risk', icon: '✅' },
    medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Moderate', icon: '⚠️' },
    high: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'High Risk', icon: '🔴' },
    emergency: { color: '#dc2626', bg: 'rgba(220,38,38,0.15)', label: '🚨 EMERGENCY', icon: '🆘' },
};

function formatTime(date) {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function AssistantCard({ content }) {
    if (typeof content === 'string') {
        return <div className="plain-response">{content}</div>;
    }

    const urgency = URGENCY_CONFIG[content.urgencyLevel] || URGENCY_CONFIG.low;

    return (
        <div className="response-card">
            {/* Urgency Badge */}
            {content.urgencyLevel && (
                <div
                    className="urgency-badge"
                    style={{ color: urgency.color, background: urgency.bg, borderColor: urgency.color }}
                >
                    <span>{urgency.icon}</span>
                    <span>{urgency.label}</span>
                </div>
            )}

            {/* Summary */}
            {content.summary && (
                <div className="card-section">
                    <h3 className="section-title">
                        <span className="section-icon">📋</span> Summary
                    </h3>
                    <p className="section-text">{content.summary}</p>
                </div>
            )}

            {/* Symptoms */}
            {content.symptoms && content.symptoms.length > 0 && (
                <div className="card-section">
                    <h3 className="section-title">
                        <span className="section-icon">🩻</span> Identified Symptoms
                    </h3>
                    <ul className="tag-list">
                        {content.symptoms.map((s, i) => (
                            <li key={i} className="tag tag-symptom">{s}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Possible Causes */}
            {content.possibleCauses && content.possibleCauses.length > 0 && (
                <div className="card-section">
                    <h3 className="section-title">
                        <span className="section-icon">🔍</span> Possible Causes
                    </h3>
                    <ul className="causes-list">
                        {content.possibleCauses.map((c, i) => (
                            <li key={i} className="cause-item">
                                <span className="cause-bullet">•</span>
                                {c}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Recommended Doctors */}
            {content.recommendedDoctors && content.recommendedDoctors.length > 0 && (
                <div className="card-section">
                    <h3 className="section-title">
                        <span className="section-icon">👨‍⚕️</span> Recommended Specialists
                    </h3>
                    <ul className="tag-list">
                        {content.recommendedDoctors.map((d, i) => (
                            <li key={i} className="tag tag-doctor">{d}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* General Advice */}
            {content.generalAdvice && (
                <div className="card-section advice-section">
                    <h3 className="section-title">
                        <span className="section-icon">💡</span> General Advice
                    </h3>
                    <p className="section-text">{content.generalAdvice}</p>
                </div>
            )}

            {/* Disclaimer */}
            {content.disclaimer && (
                <div className="disclaimer">
                    <span>⚕️</span>
                    <p>{content.disclaimer}</p>
                </div>
            )}
        </div>
    );
}

function ChatMessage({ message }) {
    const isUser = message.role === 'user';

    return (
        <div className={`message-wrapper ${isUser ? 'user-wrapper' : 'assistant-wrapper'}`}>
            {!isUser && (
                <div className="avatar assistant-avatar">🩺</div>
            )}

            <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
                {isUser ? (
                    <p className="user-text">{message.content}</p>
                ) : (
                    <AssistantCard content={message.content} />
                )}
                <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>

            {isUser && (
                <div className="avatar user-avatar">👤</div>
            )}
        </div>
    );
}

export default ChatMessage;
