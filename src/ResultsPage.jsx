import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PromptGenerator from './PromptGenerator';
import './Home.css';

const ResultsPage = () => {
  const { company } = useParams();
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="search-section">
        <div className="header-section">
          <button 
            onClick={() => navigate('/')} 
            className="back-button"
          >
            ← Back to Search
          </button>
          <h1>Search Results</h1>
        </div>
        <PromptGenerator company={decodeURIComponent(company)} />
      </div>
    </div>
  );
};

export default ResultsPage; 