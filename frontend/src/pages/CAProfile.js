import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CAProfile.css';

const CAProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ca, setCa] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCA = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/ca/${id}`);
                setCa(response.data);
            } catch (error) {
                console.error('Error fetching CA:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCA();
    }, [id]);

    if (loading) return <div className="loading-state"><div className="loader"></div></div>;
    if (!ca) return <div className="error-state">Expert not found</div>;

    return (
        <div className="profile-page-container">
            <header className="profile-header-section">
                <div className="profile-cover"></div>
                <div className="container">
                    <div className="profile-identity-card">
                        <div className="profile-avatar-large">
                            {ca.name.charAt(0)}
                            <div className="verified-status">✓</div>
                        </div>
                        <div className="profile-headline">
                            <h1>{ca.name}</h1>
                            <div className="profile-badges">
                                <span className="badge-spec">{ca.specialization}</span>
                                <span className="badge-loc">📍 {ca.location}</span>
                            </div>
                        </div>
                        <div className="profile-actions">
                            <Link to={`/chat/${ca._id}`} className="btn btn-primary">Message Now</Link>
                            <button className="btn btn-outline">Save Profile</button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container profile-main-grid">
                <div className="profile-details-column">
                    <section className="card aesthetic-card">
                        <h2>About the Professional</h2>
                        <p className="about-text">{ca.about}</p>
                    </section>

                    <section className="card aesthetic-card">
                        <h2>Services & Expertise</h2>
                        <div className="expertise-grid">
                            {ca.specialization.split(',').map(item => (
                                <div key={item} className="expertise-item">
                                    <span className="check-icon">✦</span>
                                    {item.trim()}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="card aesthetic-card">
                        <h2>Client Feedback</h2>
                        <div className="reviews-placeholder">
                            <div className="star-rating">⭐⭐⭐⭐⭐</div>
                            <p>Professional and highly efficient in handling our GST compliance.</p>
                            <span className="review-author">— Rajesh M., CEO of Techflow</span>
                        </div>
                    </section>
                </div>

                <aside className="profile-sidebar-column">
                    <div className="card aesthetic-card stats-card">
                        <div className="stat-row">
                            <span>Experience</span>
                            <strong>{ca.experience} Years</strong>
                        </div>
                        <div className="stat-row">
                            <span>Success Rate</span>
                            <strong>98%</strong>
                        </div>
                        <div className="stat-row">
                            <span>Response Time</span>
                            <strong>&lt; 2 Hours</strong>
                        </div>
                    </div>

                    <div className="card aesthetic-card help-card">
                        <h3>Need help choosing?</h3>
                        <p>Our AI assistant can help you decide if {ca.name} is the right fit for your specific case.</p>
                        <button className="btn btn-text" onClick={() => window.scrollTo(0, 1000)}>Ask AI Assistant →</button>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default CAProfile;
