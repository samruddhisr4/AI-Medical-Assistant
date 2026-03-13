import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ─── helpers ─────────────────────────────────────── */
function tryParse(str) {
  try { return JSON.parse(str); } catch { return str; }
}

/* ─── Sidebar ─────────────────────────────────────── */
function Sidebar({ onNewChat, onClear, hasMessages, user, onLogout }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-top">
        <button className="new-chat-btn" onClick={onNewChat}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New chat
        </button>

        {hasMessages && (
          <>
            <div className="sidebar-label">Today</div>
            <div className="chat-history-item active">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Health consultation
            </div>
          </>
        )}
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-footer-btn" style={{ cursor: 'default' }}>
          <div className="msg-avatar user-av" style={{ width: '20px', height: '20px', fontSize: '10px' }}>
            {user?.name?.[0] || 'U'}
          </div>
          {user?.name || 'User'}
        </div>

        <button className="sidebar-footer-btn" onClick={onLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log out
        </button>

        {hasMessages && (
          <button className="sidebar-footer-btn" onClick={onClear} style={{ color: 'var(--danger)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
            Clear chat
          </button>
        )}
      </div>
    </nav>
  );
}

/* ─── Welcome Screen ──────────────────────────────── */
const SUGGESTIONS = [
  { icon: '🤒', text: 'I have a headache and fever since yesterday' },
  { icon: '❤️', text: 'My heart is racing and I feel breathless' },
  { icon: '🦴', text: 'I have sharp back pain after lifting something' },
  { icon: '😰', text: 'I have been feeling anxious and can\'t sleep' },
];

function WelcomeScreen({ onSend }) {
  return (
    <div className="welcome">
      <div className="welcome-inner">
        <div className="welcome-icon">🩺</div>
        <h1 className="welcome-heading">How can I help you today?</h1>
        <p className="welcome-sub">
          Describe your symptoms and I'll provide a structured health assessment — possible causes, doctor recommendations, and guidance.
        </p>
        <div className="suggest-grid">
          {SUGGESTIONS.map(({ icon, text }) => (
            <button key={text} className="suggest-card" onClick={() => onSend(text)}>
              <span className="suggest-card-icon">{icon}</span>
              <span className="suggest-card-text">{text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Structured Response ─────────────────────────── */
const URGENCY = {
  low: { label: '🟢 Low urgency', cls: 'low' },
  medium: { label: '🟡 Moderate urgency', cls: 'medium' },
  high: { label: '🔴 High urgency – see a doctor soon', cls: 'high' },
  emergency: { label: '🚨 Emergency – seek immediate care', cls: 'emergency' },
};

function StructuredResponse({ data }) {
  if (typeof data === 'string') return <p style={{ lineHeight: 1.7, color: 'var(--text-muted)' }}>{data}</p>;

  const urg = URGENCY[data.urgencyLevel] || URGENCY.low;

  return (
    <>
      {data.urgencyLevel && (
        <div className={`urgency-line ${urg.cls}`}>{urg.label}</div>
      )}

      {data.summary && (
        <p className="response-summary">{data.summary}</p>
      )}

      {data.symptoms?.length > 0 && (
        <div className="response-section">
          <div className="response-section-title">Key Observations</div>
          <div className="response-tags">
            {data.symptoms.map((s, i) => <span key={i} className="tag symptom">{s}</span>)}
          </div>
        </div>
      )}

      {data.possibleCauses?.length > 0 && (
        <div className="response-section">
          <div className="response-section-title">Potential Considerations</div>
          <ul className="response-causes">
            {data.possibleCauses.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}

      {data.recommendedDoctors?.length > 0 && (
        <div className="response-section">
          <div className="response-section-title">Recommended Consultation</div>
          <div className="response-tags">
            {data.recommendedDoctors.map((d, i) => <span key={i} className="tag doctor">{d}</span>)}
          </div>
        </div>
      )}

      {data.generalAdvice && (
        <div className="response-section">
          <div className="response-section-title">Next Steps & Guidance</div>
          <p className="response-advice">{data.generalAdvice}</p>
        </div>
      )}

      {data.disclaimer && (
        <p className="response-disclaimer">{data.disclaimer}</p>
      )}
    </>
  );
}

/* ─── Message Row ─────────────────────────────────── */
function MessageRow({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`message-row ${isUser ? 'user-msg' : 'bot-msg'}`}>
      <div className="message-header">
        <div className={`msg-avatar ${isUser ? 'user-av' : 'bot-av'}`}>
          {isUser ? 'You' : '🩺'}
        </div>
        <span className="msg-name">{isUser ? 'You' : 'MediAssist'}</span>
      </div>
      <div className="msg-body">
        {isUser
          ? <p>{message.content}</p>
          : <StructuredResponse data={message.content} />
        }
      </div>
    </div>
  );
}

/* ─── Voice Hook ──────────────────────────────────── */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

function useVoice(onResult) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    if (!SR) return;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = 'en-US';
    r.onresult = (e) => { onResult(e.results[0][0].transcript); setListening(false); };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recRef.current = r;
  }, [onResult]);

  const toggle = () => {
    if (!recRef.current) return;
    if (listening) { recRef.current.stop(); } else { recRef.current.start(); setListening(true); }
  };

  return { listening, toggle, supported: !!SR };
}

/* ─── Chat Input ──────────────────────────────────── */
function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState('');
  const ref = useRef(null);

  const handleVoice = (transcript) => {
    setText(p => p ? `${p} ${transcript}` : transcript);
    ref.current?.focus();
  };

  const { listening, toggle, supported } = useVoice(handleVoice);

  const resize = () => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    ref.current.style.height = `${Math.min(ref.current.scrollHeight, 200)}px`;
  };

  const send = () => {
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');
    if (ref.current) ref.current.style.height = 'auto';
  };

  return (
    <div className="input-area">
      <div className="input-area-inner">
        <div className="input-box">
          <textarea
            ref={ref}
            id="chat-input"
            className="chat-input"
            value={text}
            rows={1}
            placeholder="Message MediAssist..."
            disabled={isLoading}
            onChange={e => { setText(e.target.value); resize(); }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            aria-label="Type your health question"
          />
          <div className="input-actions">
            {supported && (
              <button
                id="voice-btn"
                className={`icon-btn${listening ? ' listening' : ''}`}
                onClick={toggle}
                disabled={isLoading}
                aria-label={listening ? 'Stop voice' : 'Voice input'}
                title={listening ? 'Stop' : 'Speak'}
              >
                {listening ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                )}
              </button>
            )}
            <button
              id="send-button"
              className="send-btn"
              onClick={send}
              disabled={isLoading || !text.trim()}
              aria-label="Send"
            >
              {isLoading ? (
                <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <p className="input-hint">MediAssist can make mistakes. Always consult a real doctor for medical decisions.</p>
      </div>
    </div>
  );
}

/* ─── Auth Component ──────────────────────────────── */
function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await axios.post(`${API_BASE}${endpoint}`, formData);
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="welcome-icon">🩺</div>
        <h1 className="welcome-heading">{isLogin ? 'Welcome back' : 'Create account'}</h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              className="chat-input"
              style={{ marginBottom: '12px', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}
              placeholder="Full Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}
          <input
            className="chat-input"
            style={{ marginBottom: '12px', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            className="chat-input"
            style={{ marginBottom: '12px', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required
          />
          {error && <p style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
          <button className="send-btn" style={{ width: '100%', height: '44px', marginBottom: '16px' }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Log in' : 'Sign up')}
          </button>
        </form>
        <p className="input-hint">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <span
            style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: '600' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  );
}

/* ─── App ─────────────────────────────────────────── */
export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mediassist_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  /* Config axios defaults */
  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  /* Load history */
  useEffect(() => {
    if (!user) return;
    axios.get(`${API_BASE}/chat/history`)
      .then(res => {
        if (res.data.messages?.length) {
          setMessages(res.data.messages.map(m => ({
            id: m._id || uuidv4(),
            role: m.role,
            content: m.role === 'assistant' ? tryParse(m.content) : m.content,
            timestamp: new Date(m.timestamp),
          })));
        }
      })
      .catch(() => { });
  }, [user]);

  /* Auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleLogin = (userData) => {
    localStorage.setItem('mediassist_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('mediassist_user');
    setUser(null);
    setMessages([]);
  };

  const handleSend = async (text) => {
    if (!text.trim() || loading) return;
    setMessages(p => [...p, { id: uuidv4(), role: 'user', content: text, timestamp: new Date() }]);
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/chat`, { message: text });
      setMessages(p => [...p, { id: uuidv4(), role: 'assistant', content: res.data.response, timestamp: new Date() }]);
    } catch {
      setMessages(p => [...p, {
        id: uuidv4(), role: 'assistant',
        content: { summary: 'Sorry, I could not connect to the server. Please try again.', disclaimer: 'Check your connection or token.' },
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async (isSilent = false) => {
    if (!isSilent && !window.confirm('Clear this conversation?')) return;
    try { await axios.delete(`${API_BASE}/chat/history`); } catch { }
    setMessages([]);
  };

  const handleNewChat = () => handleClear(true);

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Sidebar
        onNewChat={handleNewChat}
        onClear={() => handleClear(false)}
        hasMessages={messages.length > 0}
        user={user}
        onLogout={handleLogout}
      />

      <div className="main">
        {/* Minimal top bar */}
        <div className="topbar">
          <span className="topbar-title">MediAssist</span>
        </div>

        {/* Chat */}
        <div className="chat-area">
          {messages.length === 0 ? (
            <WelcomeScreen onSend={handleSend} />
          ) : (
            <div className="messages-wrap">
              {messages.map(msg => <MessageRow key={msg.id} message={msg} />)}
              {loading && (
                <div className="typing-row">
                  <div className="message-header">
                    <div className="msg-avatar bot-av">🩺</div>
                    <span className="msg-name">MediAssist</span>
                  </div>
                  <div className="typing-dots">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <ChatInput onSend={handleSend} isLoading={loading} />
      </div>
    </div>
  );
}
