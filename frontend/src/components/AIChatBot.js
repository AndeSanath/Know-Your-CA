import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './AIChatBot.css';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! I am your AI assistant. How can I help you today regarding Chartered Accountants or financial services?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const rawHistory = updatedMessages.slice(0, -1).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const firstUserIndex = rawHistory.findIndex(m => m.role === 'user');
      const history = firstUserIndex !== -1 ? rawHistory.slice(firstUserIndex) : [];

      const response = await axios.post('http://localhost:5001/api/ai/chat', {
        message: input,
        history: history
      });

      setMessages(prev => [...prev, { role: 'model', text: response.data.text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = error.response?.data?.error || "Sorry, I'm having trouble connecting right now.";
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`ai-chatbot-container ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="ai-chatbot-toggle" onClick={() => setIsOpen(true)}>
          <span className="bot-icon">✨</span>
          <span className="bot-text">Ask AI</span>
        </button>
      )}

      {isOpen && (
        <div className="ai-chatbot-window">
          <div className="ai-chatbot-header">
            <div className="header-info">
              <span className="bot-icon-small">✨</span>
              <h3>CA Assistant</h3>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>&times;</button>
          </div>

          <div className="ai-chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-content">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message model loading">
                <div className="message-content">
                  <div className="dot-typing">
                    <div></div><div></div><div></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="ai-chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatBot;
