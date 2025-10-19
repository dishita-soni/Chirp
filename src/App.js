import React, { useState, useEffect } from 'react';
import './App.css';
import Tweet from './components/Tweet';
import scoredTweetsData from './scored_tweets.json';

function App() {
  const [selectedTheme, setSelectedTheme] = useState('productivity');
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const themes = {
    productivity: {
      name: 'Productivity & Work-Life Balance',
      description: 'Helpful takes about productivity, burnout, and work–life balance',
      icon: '💼'
    },
    memes: {
      name: 'Funny Memes',
      description: 'Funny memes and humorous content',
      icon: '😂'
    }
  };

  useEffect(() => {
    loadTweets(selectedTheme);
  }, [selectedTheme]);

  const loadTweets = (theme) => {
    setLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setTweets(scoredTweetsData[theme] || []);
      setLoading(false);
    }, 300);
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();

    // Match search query to themes
    if (query.includes('productivity') || query.includes('work') || query.includes('balance')) {
      handleThemeChange('productivity');
    } else if (query.includes('meme') || query.includes('funny') || query.includes('humor')) {
      handleThemeChange('memes');
    }
    // Clear search after submitting
    setSearchQuery('');
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <span className="logo-icon">𝕏</span>
            <span className="logo-text">AI Feed</span>
          </h1>
          <p className="tagline">Personalized recommendations powered by AI</p>
        </div>
      </header>

      <div className="search-section">
        <div className="search-container">
          <h2>Search for a theme:</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder='Try "productivity", "memes", "work", or "funny"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <main className="main-content">
        <div className="feed-header">
          <h2>{themes[selectedTheme].name}</h2>
          <span className="tweet-count">
            {tweets.length} tweet{tweets.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading tweets...</p>
          </div>
        ) : tweets.length > 0 ? (
          <div className="tweets-container">
            {tweets.map((tweet) => (
              <Tweet key={tweet.id} tweet={tweet} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No tweets found for this theme</p>
            <p className="empty-hint">Try running the scoring script first!</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built with AI-powered recommendations using Google Gemini</p>
      </footer>
    </div>
  );
}

export default App;
