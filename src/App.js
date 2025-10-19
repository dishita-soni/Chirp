import React, { useState, useEffect } from 'react';
import './App.css';
import Tweet from './components/Tweet';
import scoredTweetsData from './scored_tweets.json';

function App() {
  const [selectedTheme, setSelectedTheme] = useState('productivity');
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);

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

      <div className="theme-selector">
        <div className="theme-selector-inner">
          <h2>Choose your feed:</h2>
          <div className="theme-buttons">
            {Object.keys(themes).map((themeKey) => (
              <button
                key={themeKey}
                className={`theme-button ${selectedTheme === themeKey ? 'active' : ''}`}
                onClick={() => handleThemeChange(themeKey)}
              >
                <span className="theme-icon">{themes[themeKey].icon}</span>
                <div className="theme-info">
                  <span className="theme-name">{themes[themeKey].name}</span>
                  <span className="theme-desc">{themes[themeKey].description}</span>
                </div>
              </button>
            ))}
          </div>
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
