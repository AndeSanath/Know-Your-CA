import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Experts.css';

function Experts() {
  const [cas, setCas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCAs();
  }, []);

  const fetchCAs = (search = '') => {
    setLoading(true);
    axios.get(`http://localhost:5001/api/ca${search ? `?search=${search}` : ''}`)
      .then(res => {
        setCas(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCAs(searchTerm);
  };

  return (
    <div className="experts-page container">
      <div className="experts-header">
        <h1>Find Your Financial <span>Expert</span></h1>
        <p>Browse through our directory of verified Chartered Accountants.</p>
        
        <form className="search-bar card" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search by name, location, or specialization..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <div className="experts-grid">
        {loading ? (
          <div className="loading-state">Finding experts...</div>
        ) : cas.length > 0 ? (
          cas.map((ca, i) => (
            <div key={ca._id} className="expert-card card animate-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="expert-avatar-container">
                <div className="expert-avatar">
                  {ca.name.charAt(0)}
                </div>
                <div className="verified-status">✓</div>
              </div>
              <div className="expert-info">
                <h3>{ca.name}</h3>
                <p className="specialization">{ca.specialization}</p>
                <div className="expert-meta">
                  <span>📍 {ca.location}</span>
                  <span>💼 {ca.experience} Yrs</span>
                  <span>⭐ {ca.rating}</span>
                </div>
                <Link to={`/ca/${ca._id}`} className="btn btn-primary w-100">
                  View Profile
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No experts found matching your search.</div>
        )}
      </div>
    </div>
  );
}

export default Experts;
