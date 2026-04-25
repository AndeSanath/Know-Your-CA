import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [cas, setCas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5001/api/ca')
      .then(res => {
        setCas(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = [
    { name: 'Taxation', icon: '📝', desc: 'GST, Income Tax & Corporate Tax' },
    { name: 'Auditing', icon: '🔍', desc: 'Internal & Statutory Audits' },
    { name: 'Finance', icon: '💰', desc: 'Fundraising & Valuations' },
    { name: 'Law', icon: '⚖️', desc: 'Company Law & Compliance' }
  ];

  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="container animate-up">
          <div className="hero-badge">AI-Powered Platform</div>
          <h1>Connect with <span>Top CAs</span> Instantly</h1>
          <p>KnowYourCA is India's most trusted platform to find, chat, and collaborate with verified Chartered Accountants.</p>
          <div className="hero-btns">
            <a href="#experts" className="btn btn-primary">Find an Expert</a>
            <a href="#about" className="btn btn-outline">Learn More</a>
          </div>
        </div>
      </header>

      <section className="container explore-section">
        <div className="section-header centered animate-up delay-1">
          <h2>Explore by Specialization</h2>
          <p>Choose the right category to find an expert tailored to your needs.</p>
        </div>
        <div className="category-grid">
          {categories.map((cat, i) => (
            <div key={i} className={`category-card card animate-up delay-${i % 4 + 1}`}>
              <div className="cat-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <main className="container" id="experts">
        <section className="ca-grid-section">
          <div className="section-header animate-up delay-2">
            <h2>Recommended Professionals</h2>
            <p>Verified experts with proven track records in financial services.</p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading experts...</p>
            </div>
          ) : (
            <div className="ca-grid">
              {cas.map((ca, i) => (
                <Link to={`/ca/${ca._id}`} key={ca._id} className={`ca-card card animate-up delay-${(i % 3) + 1}`}>
                  <div className="ca-avatar-container">
                    <div className="ca-avatar">
                      {ca.name.charAt(0)}
                    </div>
                    <div className="ca-status-dot"></div>
                  </div>
                  <div className="ca-info">
                    <h3>{ca.name}</h3>
                    <div className="ca-stats">
                      <span className="stat">
                        <strong>{ca.experience}</strong> Exp
                      </span>
                      <span className="stat">
                        <strong>{ca.rating}</strong> ★
                      </span>
                    </div>
                    <p className="ca-specialization">{ca.specialization}</p>
                    <div className="ca-footer-meta">
                      <span className="price-info">{ca.price}</span>
                      <span className="btn btn-sm">View Profile</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <section className="about-section" id="about">
        <div className="container">
          <div className="about-layout">
            <div className="about-content animate-up">
              <h2>Why Choose <span>KnowYourCA</span>?</h2>
              <p>We bridge the gap between businesses and financial experts through technology and transparency.</p>
              
              <ul className="feature-list">
                <li className="animate-up delay-1">
                  <div className="feature-icon">🛡️</div>
                  <div>
                    <h4>Verified Professionals</h4>
                    <p>Every CA on our platform undergoes a rigorous verification process.</p>
                  </div>
                </li>
                <li className="animate-up delay-2">
                  <div className="feature-icon">💬</div>
                  <div>
                    <h4>Real-time Consultation</h4>
                    <p>Chat directly with experts and get your queries resolved instantly.</p>
                  </div>
                </li>
                <li className="animate-up delay-3">
                  <div className="feature-icon">🤖</div>
                  <div>
                    <h4>AI-Powered Support</h4>
                    <p>Use our AI Assistant for quick financial advice and platform navigation.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="about-stats card animate-up delay-2">
              <div className="stat-item">
                <h3>500+</h3>
                <p>Verified CAs</p>
              </div>
              <div className="stat-item">
                <h3>10k+</h3>
                <p>Consultations</p>
              </div>
              <div className="stat-item">
                <h3>4.9/5</h3>
                <p>User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="main-footer">
        <div className="container">
          <p>&copy; 2024 KnowYourCA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;