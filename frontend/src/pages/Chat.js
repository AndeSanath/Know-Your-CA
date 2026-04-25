import React, { useEffect, useState, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Chat.css';

const socket = io('http://localhost:5001');

function Chat() {
  const { receiverId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const messagesEndRef = useRef(null);
  const caName = location.state?.caName || "Expert";

  const WORD_LIMIT = 350;

  useEffect(() => {
    if (!user || !receiverId) return;

    const currentUserId = (user.id || user._id).toString();

    // Fetch message history
    axios.get(`http://localhost:5001/api/chat/${currentUserId}/${receiverId}`)
      .then(res => {
        setMessages(res.data);
        const count = res.data
          .filter(m => m.sender.toString() === currentUserId)
          .reduce((acc, m) => acc + (m.content || "").trim().split(/\s+/).length, 0);
        setWordCount(count);
      })
      .catch(err => console.error("History fetch error:", err));

    const handleMessage = (msg) => {
      const msgSender = msg.sender.toString();
      const msgReceiver = msg.receiver.toString();
      const targetId = receiverId.toString();

      // Check if message belongs to this chat
      if (
        (msgSender === currentUserId && msgReceiver === targetId) ||
        (msgSender === targetId && msgReceiver === currentUserId)
      ) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.find(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
        
        if (msgSender === currentUserId) {
           setWordCount(prev => prev + (msg.content || "").trim().split(/\s+/).length);
        }
      }
    };

    socket.on('receiveMessage', handleMessage);
    return () => socket.off('receiveMessage', handleMessage);
  }, [receiverId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user || !receiverId) return;

    const currentUserId = (user.id || user._id).toString();
    const newWords = message.trim().split(/\s+/).length;
    
    if (!user.isSubscribed && (wordCount + newWords) > WORD_LIMIT) {
      alert(`Word limit reached! Please subscribe.`);
      navigate('/subscription');
      return;
    }

    const messageData = {
      sender: currentUserId,
      receiver: receiverId.toString(),
      content: message,
      timestamp: new Date()
    };

    // Optimistic Update
    setMessages(prev => [...prev, { ...messageData, _id: Date.now() }]);
    
    socket.emit('sendMessage', messageData);
    setMessage('');
  };

  if (!user) return <div className="loading-state">Redirecting...</div>;

  return (
    <div className="chat-page container">
      <div className="chat-container card">
        <div className="chat-header">
          <div className="chat-user-info">
            <div className="avatar-small">{caName.charAt(0)}</div>
            <div>
              <h3>{caName}</h3>
              <span className="status-online">Online</span>
            </div>
          </div>
          {!user.isSubscribed && (
            <div className="word-limit-info">
              <div className="limit-bar">
                <div className="limit-progress" style={{ width: `${Math.min(100, (wordCount / WORD_LIMIT) * 100)}%` }}></div>
              </div>
              <span>{wordCount} / {WORD_LIMIT} free words</span>
            </div>
          )}
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => {
            if (!m.sender) return null;
            const isSent = m.sender.toString() === (user.id || user._id).toString();
            return (
              <div key={m._id || i} className={`chat-message ${isSent ? 'sent' : 'received'}`}>
                <div className="message-bubble">
                  {m.content}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={sendMessage}>
          <input 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            placeholder="Type your message..."
          />
          <button type="submit" className="btn btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;