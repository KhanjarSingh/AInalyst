import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const EXAMPLES = ['Boat', 'Propacity', 'Delhivery', 'Cred', 'Pharmeasy', 'Swiggy', 'Nykaa' ];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results/${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleExample = (example) => {
    setSearchQuery(example);
    navigate(`/results/${encodeURIComponent(example)}`);
  };

  return (
    <div className="home-hero-bg animated-bg">
      <div className="home-hero-container">
        <h1 className="home-hero-title">AI Competitor Research Assistant</h1>
        <p className="home-hero-subtitle">Instant insights into your startup's competitive landscape</p>
        <div className="home-search-card glass-card">
          <div className="home-search-icon rocket-animate">
            <span role="img" aria-label="rocket" className="home-emoji">🚀</span>
          </div>
          <form onSubmit={handleSearch} className="home-search-form">
            <label htmlFor="company-input" className="home-search-label">
              Enter a startup name
            </label>
            <div className="home-search-input-row">
              <input
                id="company-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter a startup name (eg., Notion)"
                className="home-search-input"
                autoComplete="off"
              />
              <button type="submit" className="home-search-submit" aria-label="Search">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
            <div className="home-search-examples">
              {EXAMPLES.map((ex, idx) => (
                <button
                  key={ex}
                  type="button"
                  className="home-example-chip"
                  onClick={() => handleExample(ex)}
                  tabIndex={0}
                >
                  {ex}
                </button>
              ))}
            </div>
          </form>
          <div className="home-search-side-graphic">
            <i className="fa-solid fa-network-wired"></i>
            <i className="fa-solid fa-chart-column"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 