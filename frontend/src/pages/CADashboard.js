import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './CAProfile.css'; // Reuse profile card styles

const CADashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        messages: 0,
        subscribers: '1.2k',
        rating: 0,
        reviewsCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch CA profile to get current rating and reviews
                const caRes = await axios.get(`http://localhost:5001/api/ca/${user.id}`);
                
                // Fetch inbox to count conversations
                const inboxRes = await axios.get(`http://localhost:5001/api/chat/inbox/${user.id}`);
                
                setStats({
                    messages: inboxRes.data.length,
                    subscribers: '1.2k', // Simulated
                    rating: caRes.data.rating,
                    reviewsCount: caRes.data.reviews?.length || 0
                });
            } catch (err) {
                console.error("Dashboard error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchDashboardData();
    }, [user]);

    if (loading) return <div className="loading">Loading Dashboard...</div>;

    return (
        <div className="container dashboard-page" style={{ paddingTop: '40px' }}>
            <header className="dashboard-header card animate-up">
                <h1>Welcome back, {user.name}!</h1>
                <p>Here is how your profile is performing today.</p>
            </header>

            <div className="profile-main-grid">
                <div className="profile-details-column">
                    <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="card aesthetic-card stats-card">
                            <h3>Total Conversations</h3>
                            <div className="stat-value" style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>
                                {stats.messages}
                            </div>
                            <p>Active chat threads with clients</p>
                        </div>
                        <div className="card aesthetic-card stats-card">
                            <h3>Average Rating</h3>
                            <div className="stat-value" style={{ fontSize: '3rem', fontWeight: 800, color: '#f59e0b' }}>
                                {stats.rating} ⭐
                            </div>
                            <p>Based on {stats.reviewsCount} reviews</p>
                        </div>
                    </div>

                    <section className="card aesthetic-card" style={{ marginTop: '24px' }}>
                        <h2>Recent Activity</h2>
                        <p>No new alerts at the moment. You're all caught up!</p>
                    </section>
                </div>

                <aside className="profile-sidebar-column">
                    <div className="card aesthetic-card help-card">
                        <h3>Quick Actions</h3>
                        <button className="btn btn-primary w-100" style={{ marginBottom: '10px' }} onClick={() => window.location.href='/inbox'}>View Inbox</button>
                        <button className="btn btn-outline w-100">Edit Profile</button>
                    </div>
                    
                    <div className="card aesthetic-card help-card" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)', color: 'white' }}>
                        <h3 style={{ color: 'white' }}>Premium Pro</h3>
                        <p>You are using the standard CA profile. Upgrade to get featured at the top of search results!</p>
                        <button className="btn btn-text" style={{ color: 'white', fontWeight: 'bold' }}>Learn More →</button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CADashboard;
