import React, { useState } from 'react';
import './Tweet.css';

function Tweet({ tweet }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(tweet.metrics.like_count || 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  return (
    <article className="tweet">
      <div className="tweet-header">
        <img
          src={tweet.author.profile_image || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'}
          alt={tweet.author.name}
          className="profile-image"
        />
        <div className="author-info">
          <span className="author-name">{tweet.author.name}</span>
          <span className="author-username">@{tweet.author.username}</span>
          <span className="separator">·</span>
          <span className="timestamp">{formatDate(tweet.created_at)}</span>
        </div>
        <div className="ai-score">
          <span className="score-badge" title={tweet.score_reason}>
            AI: {tweet.score}/10
          </span>
        </div>
      </div>

      <div className="tweet-content">
        <p className="tweet-text">{tweet.text}</p>

        {tweet.images && tweet.images.length > 0 && (
          <div className={`tweet-images images-${Math.min(tweet.images.length, 4)}`}>
            {tweet.images.slice(0, 4).map((image, index) => (
              <img
                key={image.media_key || index}
                src={image.url}
                alt=""
                className="tweet-image"
              />
            ))}
          </div>
        )}
      </div>

      <div className="tweet-footer">
        <div className="engagement-stats">
          <span className="stat reply">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/>
            </svg>
            {formatNumber(tweet.metrics.reply_count || 0)}
          </span>
          <span className="stat retweet">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
            </svg>
            {formatNumber(tweet.metrics.retweet_count || 0)}
          </span>
          <span
            className={`stat like ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              {isLiked ? (
                <path fill="currentColor" d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
              ) : (
                <path fill="currentColor" d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
              )}
            </svg>
            {formatNumber(likeCount)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default Tweet;
