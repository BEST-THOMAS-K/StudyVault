import React, { useState, useRef, useEffect } from 'react';
import './AI.css'; // We'll create this file

function AI() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
        if (parsed.length > 0) {
          setCurrentConversationId(parsed[0].id);
          setMessages(parsed[0].messages);
        }
      } catch (e) {
        console.error('Failed to load conversations:', e);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('ai_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const saveCurrentConversation = () => {
    if (messages.length > 1) {
      const existingIndex = conversations.findIndex(c => c.id === currentConversationId);
      const updatedConversation = {
        id: currentConversationId || Date.now(),
        title: messages[1]?.text?.slice(0, 30) + '...' || 'New Chat',
        messages: messages,
        timestamp: new Date().toISOString()
      };

      let updatedConversations;
      if (existingIndex >= 0) {
        updatedConversations = [...conversations];
        updatedConversations[existingIndex] = updatedConversation;
      } else {
        updatedConversations = [updatedConversation, ...conversations];
        setCurrentConversationId(updatedConversation.id);
      }
      setConversations(updatedConversations);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMessage = { id: Date.now(), text: userText, sender: 'user' };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const conversationHistory = messages
        .filter(msg => msg.id !== 1)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

      conversationHistory.push({
        role: 'user',
        parts: [{ text: userText }]
      });

      const response = await fetch('http://localhost:8000/api/ai/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversation: conversationHistory }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error');
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: 'ai'
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Save after getting response
      setTimeout(() => {
        saveCurrentConversation();
      }, 100);

    } catch (err) {
      console.error(err);
      setError('Error: ' + (err.message || 'Failed to get response. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = () => {
    if (messages.length > 1) {
      saveCurrentConversation();
    }
    const newId = Date.now();
    setCurrentConversationId(newId);
    setMessages([{ id: 1, text: "Hello! I'm your AI Assistant. How can I help you today?", sender: 'ai' }]);
    setError(null);
  };

  const loadConversation = (id) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setCurrentConversationId(id);
      setMessages(conv.messages);
    }
  };

  const deleteConversation = (id, e) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    if (currentConversationId === id) {
      if (updated.length > 0) {
        setCurrentConversationId(updated[0].id);
        setMessages(updated[0].messages);
      } else {
        startNewConversation();
      }
    }
    localStorage.setItem('ai_conversations', JSON.stringify(updated));
  };

  return (
    <div className="ai-container">
      {/* Sidebar - History */}
      <div className={`ai-sidebar ${isHistoryOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={startNewConversation}>
            ✨ New Chat
          </button>
          <button className="toggle-sidebar-btn" onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
            {isHistoryOpen ? '◀' : '▶'}
          </button>
        </div>
        <div className="conversation-list">
          {conversations.length === 0 ? (
            <div className="empty-history">No conversations yet</div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${currentConversationId === conv.id ? 'active' : ''}`}
                onClick={() => loadConversation(conv.id)}
              >
                <span className="conv-title">{conv.title}</span>
                <button 
                  className="delete-conv-btn"
                  onClick={(e) => deleteConversation(conv.id, e)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="chat-header">
          <div className="header-left">
            {!isHistoryOpen && (
              <button className="toggle-sidebar-btn" onClick={() => setIsHistoryOpen(true)}>
                ☰
              </button>
            )}
            <h2>💬 AI Assistant</h2>
          </div>
          <div className="header-right">
            <span className="status-dot"></span>
            <span className="status-text">Online</span>
          </div>
        </div>

        <div className="messages-container">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-avatar">
                {msg.sender === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-bubble">
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message ai">
              <div className="message-avatar">🤖</div>
              <div className="message-bubble loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSend} className="input-form">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="chat-input"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="send-button"
          >
            {loading ? '⏳' : '✈️'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AI;