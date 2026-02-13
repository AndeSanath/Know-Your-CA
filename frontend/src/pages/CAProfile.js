import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Home.css"; // Reusing styles

function CAProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [ca, setCa] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCA();
    }, [id]);

    const fetchCA = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/ca/${id}`);
            const data = await response.json();
            setCa(data);
        } catch (error) {
            console.error("Error fetching CA:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChat = () => {
        if (!user) {
            alert("Please login to chat with this CA");
            navigate("/login");
            return;
        }

        // Check Subscription
        if (!user.isSubscribed && user.role === "user") {
            const confirmSub = window.confirm("You need a subscription to chat with CAs. Go to Subscription page?");
            if (confirmSub) {
                navigate("/subscription");
            }
            return;
        }

        if (!ca.userId) {
            alert("This CA is not available for chat (No linked account).");
            return;
        }

        navigate(`/chat/${ca.userId}`, { state: { caName: ca.name } });
    };

    const handleAddReview = async (rating, comment) => {
        try {
            const response = await fetch(`http://localhost:5001/api/ca/${id}/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id || user._id,
                    userName: user.name,
                    rating,
                    comment
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setCa(data.ca); // Update CA data with new review
                alert("Review submitted successfully!");
            } else {
                alert("Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!ca) return <div className="no-matches">CA not found</div>;

    return (
        <div className="home-container" style={{ paddingTop: "2rem" }}>
            <button className="view-btn" onClick={() => navigate(-1)} style={{ marginLeft: "2rem" }}>
                &larr; Back
            </button>
            <div className="ca-card" style={{ maxWidth: "800px", margin: "2rem auto" }}>
                <div
                    className="ca-image"
                    style={{ backgroundImage: `url(${ca.image})`, height: "300px" }}
                />
                <div className="ca-details">
                    <div className="ca-header">
                        <h1 style={{ margin: 0 }}>{ca.name}</h1>
                        <span className="rating" style={{ fontSize: "1.2rem" }}>★ {ca.rating}</span>
                    </div>
                    <p className="specialization" style={{ fontSize: "1.2rem" }}>{ca.specialization}</p>

                    <div className="ca-info" style={{ fontSize: "1.1rem", marginTop: "1rem" }}>
                        <span>📍 {ca.location}</span>
                        <span>💼 {ca.experience}</span>
                    </div>

                    <div style={{ margin: "2rem 0", lineHeight: "1.6", color: "#475569" }}>
                        <h3>About</h3>
                        <p>{ca.about}</p>
                    </div>

                    <div className="ca-footer" style={{ marginTop: "2rem" }}>
                        <span className="price" style={{ fontSize: "1.5rem" }}>{ca.price}</span>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                className="view-btn"
                                style={{ backgroundColor: "#2563eb", color: "white", padding: "1rem 2rem" }}
                                onClick={handleChat}
                            >
                                Chat with {ca.name.split(" ")[0]}
                            </button>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="reviews-section" style={{ marginTop: "3rem", borderTop: "1px solid #e2e8f0", paddingTop: "2rem" }}>
                        <h2>Reviews</h2>

                        {/* Add Review Form */}
                        {user && user.role === "user" && (
                            <div className="add-review" style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem" }}>
                                <h3>Leave a Review</h3>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const rating = e.target.rating.value;
                                    const comment = e.target.comment.value;
                                    handleAddReview(rating, comment);
                                    e.target.reset();
                                }}>
                                    <div style={{ marginBottom: "1rem" }}>
                                        <label style={{ marginRight: "1rem" }}>Rating:</label>
                                        <select name="rating" required style={{ padding: "0.5rem" }}>
                                            <option value="5">5 - Excellent</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="3">3 - Good</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="1">1 - Poor</option>
                                        </select>
                                    </div>
                                    <div style={{ marginBottom: "1rem" }}>
                                        <textarea name="comment" placeholder="Write your review here..." required style={{ width: "100%", padding: "0.5rem", minHeight: "80px" }} />
                                    </div>
                                    <button type="submit" className="view-btn" style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}>Submit Review</button>
                                </form>
                            </div>
                        )}

                        {/* Reviews List */}
                        <div className="reviews-list">
                            {ca.reviews && ca.reviews.length > 0 ? (
                                ca.reviews.map((review, index) => (
                                    <div key={index} className="review-item" style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f1f5f9" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                            <strong>{review.userName}</strong>
                                            <span style={{ color: "#fbbf24" }}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                                        </div>
                                        <p style={{ margin: 0, color: "#475569" }}>{review.comment}</p>
                                        <small style={{ color: "#94a3b8" }}>{new Date(review.createdAt).toLocaleDateString()}</small>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet. Be the first to review!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CAProfile;
