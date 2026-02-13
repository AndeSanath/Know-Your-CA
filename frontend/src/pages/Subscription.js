import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./Subscription.css";

function Subscription() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handlePurchase = async (planType) => {
        if (!user) {
            navigate("/login");
            return;
        }

        // Only Pro plan is functional in this mock
        if (planType !== "Pro") {
            alert(`The ${planType} plan integration is coming soon! Please try the Pro plan.`);
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/subscription/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id || user._id }),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Subscription Successful! Welcome to the Pro family.");

                if (data.token) {
                    localStorage.setItem("token", data.token);
                    window.location.reload();
                } else {
                    window.location.reload();
                }
            } else {
                alert("Subscription failed. Please try again.");
            }
        } catch (error) {
            console.error("Error purchasing subscription:", error);
        }
    };

    return (
        <div className="subscription-container">
            <div className="subscription-header">
                <h1>Elevate Your Experience</h1>
                <p>Choose the perfect plan to connect with expert Chartered Accountants and grow your business.</p>
            </div>

            <div className="pricing-grid">
                {/* Basic Plan */}
                <div className="pricing-card">
                    <h2 className="plan-name">Basic</h2>
                    <div className="plan-price">₹0<span>/mo</span></div>
                    <ul className="plan-features">
                        <li>Browse all CA Profiles</li>
                        <li>Read Reviews</li>
                        <li>Limited Search results</li>
                        <li>No Chat access</li>
                    </ul>
                    <button className="subscribe-btn btn-outline" onClick={() => navigate("/")}>
                        Get Started
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="pricing-card featured">
                    <div className="badge">Most Popular</div>
                    <h2 className="plan-name">Pro</h2>
                    <div className="plan-price">₹499<span>/mo</span></div>
                    <ul className="plan-features">
                        <li>Unlimited Chats with CAs</li>
                        <li>Priority Response</li>
                        <li>Full Search results</li>
                        <li>Verified Badge access</li>
                        <li>Expert consultation logs</li>
                    </ul>
                    <button className="subscribe-btn btn-primary" onClick={() => handlePurchase("Pro")}>
                        Go Pro Now
                    </button>
                </div>

                {/* Elite Plan */}
                <div className="pricing-card elite">
                    <h2 className="plan-name">Elite</h2>
                    <div className="plan-price">₹1499<span>/mo</span></div>
                    <ul className="plan-features">
                        <li>Everything in Pro</li>
                        <li>Dedicated Relationship Manager</li>
                        <li>GST Filing Assistance</li>
                        <li>Income Tax E-filing</li>
                        <li>Annual Audit review</li>
                    </ul>
                    <button className="subscribe-btn btn-elite" onClick={() => handlePurchase("Elite")}>
                        Go Elite
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Subscription;
