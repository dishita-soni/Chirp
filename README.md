# AI-Powered Tweet Recommendation System

An intelligent Twitter feed that uses Google Gemini AI to score and rank tweets based on your interests. Built for a hackathon to demonstrate proof-of-concept AI-powered content curation.

## Features

- Fetches 100 tweets from X (Twitter) API with images
- AI-powered scoring using Google Gemini
- Two themed feeds:
  - **Productivity & Work-Life Balance**: Helpful advice and insights
  - **Funny Memes**: Humorous content and entertainment
- Twitter-like UI built with React
- Local caching to avoid API rate limits

## Architecture

```
X API → tweets.json → Gemini AI Scoring → scored_tweets.json → React Feed
```

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install searchtweets-v2 google-generativeai python-dotenv
```

Or use the requirements file:
```bash
pip install -r requirements.txt
```

### 2. Configure API Keys

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# X (Twitter) API v2 Credentials
SEARCHTWEETS_BEARER_TOKEN=your_twitter_bearer_token_here

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

**Where to get API keys:**
- X API: https://developer.twitter.com/en/portal/dashboard
- Gemini API: https://makersuite.google.com/app/apikey

### 3. Fetch Tweets

Run the fetch script to download 100 tweets with images:

```bash
python fetch_tweets.py
```

This will create `tweets.json` with ~100 tweets (50 productivity, 50 memes).

### 4. Score Tweets with AI

Run the scoring script to evaluate tweets using Gemini:

```bash
python score_tweets.py
```

This will:
- Score each tweet (0-10) against both themes
- Filter to high-scoring tweets (7+)
- Create `scored_tweets.json` with ranked results

### 5. Copy Scored Data to React App

```bash
cp scored_tweets.json tweet-recommender/src/scored_tweets.json
```

### 6. Run the React App

```bash
cd tweet-recommender
npm install
npm start
```

The app will open at http://localhost:3000

## Demo Flow

1. **Select a theme** - Choose between Productivity or Memes
2. **View AI-curated feed** - See tweets ranked by relevance
3. **Switch themes** - Watch the feed completely change based on AI scoring
4. **Hover over scores** - See why the AI scored each tweet

## Project Structure

```
.
├── fetch_tweets.py          # Fetch tweets from X API
├── score_tweets.py          # Score tweets with Gemini AI
├── prompts.json             # Theme definitions and scoring criteria
├── tweets.json              # Cached tweets (generated)
├── scored_tweets.json       # AI-scored results (generated)
├── .env                     # API keys (create this)
├── .env.example             # API keys template
├── requirements.txt         # Python dependencies
└── tweet-recommender/       # React frontend
    ├── src/
    │   ├── App.js           # Main app component
    │   ├── App.css          # App styles
    │   ├── components/
    │   │   ├── Tweet.js     # Tweet card component
    │   │   └── Tweet.css    # Tweet styles
    │   └── scored_tweets.json  # Copy of scored data
    └── package.json
```

## How It Works

### 1. Tweet Collection
The `fetch_tweets.py` script searches X for:
- **Productivity**: `"productivity OR burnout OR work-life balance" has:images`
- **Memes**: `"meme OR memes OR funny" has:images`

### 2. AI Scoring
The `score_tweets.py` script sends each tweet to Gemini with:
- The tweet text
- Author info
- Scoring criteria for each theme

Gemini returns a score (0-10) and explanation.

### 3. Feed Rendering
React app displays tweets sorted by score, with:
- Author profile and name
- Tweet text and images
- Engagement metrics
- AI score badge

## Customization

### Add More Themes

Edit `prompts.json`:

```json
{
  "productivity": { ... },
  "memes": { ... },
  "your_theme": {
    "theme": "Your Theme Name",
    "prompt": "Brief description",
    "scoring_instruction": "Detailed scoring criteria..."
  }
}
```

Then update `App.js` themes object.

### Adjust Scoring Threshold

In `score_tweets.py`, change the filter threshold:

```python
high_scoring = [t for t in scored_tweets if t["score"] >= 6]  # Lower threshold
```

### Fetch More Tweets

In `fetch_tweets.py`, adjust `max_results`:

```python
"max_results": 100  # Increase per theme
```

## Hackathon Tips

1. **Demo the "magic"**: Switch between themes to show how AI completely reorders the feed
2. **Explain the scores**: Hover over score badges to show AI reasoning
3. **Show the data**: Open `scored_tweets.json` to show raw AI scores
4. **Emphasize personalization**: This is proof-of-concept for infinite customization

## Troubleshooting

### No tweets fetched
- Check your X API bearer token in `.env`
- Verify you have Essential access (free tier)
- Try broader search queries

### AI scoring fails
- Verify Gemini API key in `.env`
- Check you have free tier quota remaining
- Lower the batch size if hitting rate limits

### React app shows empty feed
- Ensure you copied `scored_tweets.json` to `tweet-recommender/src/`
- Check that scoring produced high-scoring tweets (7+)
- Look in browser console for errors

## Future Enhancements

- Real-time scoring (score tweets on-demand)
- User prompt input (type your own theme)
- Multiple theme mixing
- Engagement prediction
- Export curated feed

## Tech Stack

- **Backend**: Python 3.x
- **AI**: Google Gemini API (gemini-1.5-flash)
- **Data Source**: X (Twitter) API v2
- **Frontend**: React 18
- **Styling**: CSS3

## License

MIT - Built for hackathon demonstration purposes.
