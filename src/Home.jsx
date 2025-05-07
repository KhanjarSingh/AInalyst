import React, { useState } from 'react';
import './Home.css';
import PromptGenerator from './PromptGenerator';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(true);
    }
  };

  return (
    <div className="home-container">
      <div className="search-section">
        <h1>Company Search</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter company name..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
        {showResults && <PromptGenerator company={searchQuery} />}
      </div>
    </div>
  );
};

export default Home;
