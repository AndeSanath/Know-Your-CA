import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './CAProfile.css';

const CAProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [ca, setCa] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("Please login to post a review");
        if (!reviewText.trim()) return;

        setReviewLoading(true);
        try {
            const res = await axios.post(`http://localhost:5001/api/ca/review/${id}`, {
                userId: user.id,
                userName: user.name,
                rating,
                comment: reviewText
            });
            setCa(res.data);
            setReviewText("");
            setRating(5);
        } catch (err) {
            console.error("Review error:", err);
        } finally {
            setReviewLoading(false);
        }
    };

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

                    <section className="card aesthetic-card reviews-section">
                        <h2>Client Feedback ({ca.reviews?.length || 0})</h2>
                        
                        {/* New Review Form */}
                        <form className="review-form" onSubmit={handleReviewSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#f8fafc', borderRadius: '16px' }}>
                            <h3>Share your experience</h3>
                            <div className="rating-input" style={{ margin: '10px 0' }}>
                                {[1,2,3,4,5].map(star => (
                                    <span 
                                        key={star} 
                                        onClick={() => setRating(star)}
                                        style={{ cursor: 'pointer', fontSize: '1.5rem', color: rating >= star ? '#f59e0b' : '#cbd5e1' }}
                                    >★</span>
                                ))}
                            </div>
                            <textarea 
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="What was it like working with this CA?"
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '10px' }}
                            />
                            <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                                {reviewLoading ? 'Submitting...' : 'Post Review'}
                            </button>
                        </form>

                        <div className="reviews-list">
                            {ca.reviews && ca.reviews.length > 0 ? (
                                ca.reviews.map((r, i) => (
                                    <div key={i} className="review-item" style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>{r.userName}</strong>
                                            <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating)}</span>
                                        </div>
                                        <p style={{ margin: '5px 0', color: '#475569' }}>{r.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet. Be the first to share your experience!</p>
                            )}
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
