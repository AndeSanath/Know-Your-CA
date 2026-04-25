import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CAProfile from "./pages/CAProfile";
import Inbox from "./pages/Inbox";
import Chat from "./pages/Chat";
import CreateProfile from "./pages/CreateProfile";
import Subscription from "./pages/Subscription";
import { Toaster, toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import Navbar from "./components/Navbar";
import CADashboard from "./pages/CADashboard";
import Experts from "./pages/Experts";
import AIChatBot from "./components/AIChatBot";

const socket = io('http://localhost:5001');

function App() {
  React.useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      // Show notification if user is the receiver
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { id } = JSON.parse(atob(token.split('.')[1]));
          if (msg.receiver === id) {
            toast(`New message from ${msg.senderName || 'Client'}`, {
              icon: '💬',
              position: 'top-right',
              style: { borderRadius: '16px', background: '#fff', color: '#0f172a', fontWeight: 'bold' }
            });
          }
        } catch (e) {}
      }
    });
    return () => socket.off('receiveMessage');
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Toaster />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experts" element={<Experts />} />
            <Route path="/dashboard" element={<CADashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/ca/:id" element={<CAProfile />} />
            <Route path="/chat/:receiverId" element={<Chat />} />
            <Route path="/inbox" element={<Inbox />} />
          </Routes>
          <AIChatBot />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
