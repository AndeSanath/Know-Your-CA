import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Home.css";

function Home() {
    const [cas, setCas] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        fetchCAs();
    }, []);

    const fetchCAs = async (searchTerm = "") => {
        setLoading(true);
        try {
            const url = searchTerm
                ? `http://localhost:5001/api/ca?search=${searchTerm}`
                : "http://localhost:5001/api/ca";
            const response = await fetch(url);
            const data = await response.json();
            setCas(data);
        } catch (error) {
            console.error("Error fetching CAs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCAs(search);
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <div style={{ position: "absolute", top: "1rem", right: "2rem" }}>
                    {user ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <button
                                onClick={() => navigate("/subscription")}
                                style={{ background: "rgba(255,255,255,0.2)", border: "1px solid white", color: "white", padding: "0.5rem 1rem", borderRadius: "20px", cursor: "pointer" }}
                            >
                                Subscription
                            </button>
                            <span style={{ color: "white" }}>Welcome, {user.name || "User"}</span>
                            <button
                                onClick={logout}
                                style={{ background: "transparent", border: "1px solid white", color: "white", padding: "0.5rem 1rem", borderRadius: "20px", cursor: "pointer" }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            style={{ background: "white", color: "var(--primary-color)", border: "none", padding: "0.5rem 1.5rem", borderRadius: "20px", fontWeight: "bold", cursor: "pointer" }}
                        >
                            Login / Sign Up
                        </button>
                    )}
                </div>
                <h1>Find Your Perfect CA</h1>
                <p>Connect with top Chartered Accountants for your business needs</p>
                <form onSubmit={handleSearch} className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by name, specialization, or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </header>

            {/* Pro Promo Banner */}
            {user && !user.isSubscribed && user.role === "user" && (
                <div className="pro-promo-banner" onClick={() => navigate("/subscription")}>
                    <div className="promo-content">
                        <h3>🚀 Unlock Unlimited Chats with Pro</h3>
                        <p>Get instant access to all expert CAs and priority support for just ₹499/mo.</p>
                    </div>
                    <button className="promo-btn">Join Pro Now</button>
                </div>
            )}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="ca-grid">
                    {cas.map((ca) => (
                        <div key={ca._id} className="ca-card">
                            <div
                                className="ca-image"
                                style={{ backgroundImage: `url(${ca.image})` }}
                                role="img"
                                aria-label={ca.name}
                            />
                            <div className="ca-details">
                                <div className="ca-header">
                                    <h3>{ca.name}</h3>
                                    <span className="rating">★ {ca.rating}</span>
                                </div>
                                <p className="specialization">{ca.specialization}</p>
                                <div className="ca-info">
                                    <span>📍 {ca.location}</span>
                                    <span>💼 {ca.experience}</span>
                                </div>
                                <p className="ca-about">{ca.about.substring(0, 80)}...</p>
                                <div className="ca-footer">
                                    <span className="price">{ca.price}</span>
                                    <button
                                        className="view-btn"
                                        onClick={() => navigate(`/ca/${ca._id}`)}
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!loading && cas.length === 0 && (
                <div className="no-macthes">No CAs found matching your criteria.</div>
            )}
        </div>
    );
}

export default Home;
