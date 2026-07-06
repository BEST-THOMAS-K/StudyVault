import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyChG5vYzsjJa1cgzRrVRG0GjpGeYclI37M';

const genAI = new GoogleGenerativeAI(API_KEY);

function AI() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now(), text: input.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const userText = input.trim();
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const history = messages
        .filter(msg => msg.id !== 1)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

      const chat = model.startChat({ history });

      const result = await chat.sendMessage(userText);
      const responseText = result.response.text();

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: responseText,
        sender: 'ai'
      }]);
    } catch (err) {
      console.error(err);
      setError('Error: ' + (err.message || 'Failed to get response. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '20px', borderRadius: '12px', color: 'white', textAlign: 'center', marginBottom: '20px' }}>
        <h1>🤖 AI Assistant</h1>
        <p>Powered by Google Gemini 1.5 Flash</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#f8fafc', borderRadius: '12px', marginBottom: '20px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
            <div style={{
              maxWidth: '75%',
              padding: '14px 18px',
              borderRadius: '20px',
              background: msg.sender === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#ffffff',
              color: msg.sender === 'user' ? 'white' : '#1f2937',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div style={{ padding: '14px 18px', background: '#fff', borderRadius: '20px', width: 'fit-content' }}>🤖 Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>{error}</div>}

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          style={{ flex: 1, padding: '16px', borderRadius: '9999px', border: '2px solid #e2e8f0', fontSize: '16px', outline: 'none' }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{ padding: '0 32px', borderRadius: '9999px', background: loading || !input.trim() ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Sending...' : 'Send ✨'}
        </button>
      </form>
    </div>
  );
}

export default AI;