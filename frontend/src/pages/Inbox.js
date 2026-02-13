import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Home.css"; // Reuse card styles

function Inbox() {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchInbox();
        }
    }, [user]);

    const fetchInbox = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/chat/inbox/${user.id}`);
            const data = await response.json();
            setConversations(data);
        } catch (error) {
            console.error("Error fetching inbox:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="home-container" style={{ paddingTop: "2rem" }}>
            <button className="view-btn" onClick={() => navigate("/")} style={{ marginLeft: "2rem", marginBottom: "2rem" }}>
                &larr; Back to Home
            </button>
            <header className="home-header" style={{ padding: "2rem", marginBottom: "2rem", borderRadius: "1rem", margin: "0 2rem 2rem 2rem" }}>
                <h1>Your Inbox</h1>
            </header>

            <div className="ca-grid" style={{ gridTemplateColumns: "1fr" }}>
                {conversations.length === 0 ? (
                    <div className="no-matches">No messages yet.</div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.userId}
                            className="ca-card"
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", cursor: "pointer" }}
                            onClick={() => navigate(`/chat/${conv.userId}`)}
                        >
                            <div>
                                <h3 style={{ margin: "0 0 0.5rem 0", color: "#1e293b" }}>{conv.name}</h3>
                                <p style={{ margin: 0, color: "#64748b" }}>{conv.lastMessage}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                                    {new Date(conv.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Inbox;
