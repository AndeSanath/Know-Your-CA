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
import AIChatBot from "./components/AIChatBot";
import Navbar from "./components/Navbar";
import Experts from "./pages/Experts";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experts" element={<Experts />} />
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
