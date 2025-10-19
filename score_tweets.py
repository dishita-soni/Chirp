#!/usr/bin/env python3
"""
Score tweets using Google Gemini API for the recommendation system.
Scores each tweet against both themes and filters to top-scoring ones.
"""

import os
import json
import time
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def score_tweet(tweet, theme_config, model):
    """Score a single tweet using Gemini API."""

    # Build the prompt
    prompt = f"""You are an AI that scores tweets for content recommendation.

Theme: {theme_config['theme']}
Scoring Criteria: {theme_config['scoring_instruction']}

Tweet to score:
Author: @{tweet['author']['username']}
Text: {tweet['text']}

Respond ONLY with valid JSON in this exact format:
{{"score": <number 0-10>, "reason": "<brief explanation>"}}"""

    try:
        response = model.generate_content(prompt)
        result_text = response.text.strip()

        # Remove markdown code blocks if present
        if result_text.startswith("```"):
            result_text = result_text.split("```")[1]
            if result_text.startswith("json"):
                result_text = result_text[4:]
            result_text = result_text.strip()

        result = json.loads(result_text)
        return result

    except Exception as e:
        print(f"  ⚠️  Error scoring tweet {tweet['id']}: {e}")
        return {"score": 0, "reason": "Error during scoring"}


def score_all_tweets():
    """Load tweets and score them against both themes."""

    # Load tweets
    print("📂 Loading tweets from tweets.json...")
    with open("tweets.json", "r", encoding="utf-8") as f:
        tweets = json.load(f)

    print(f"✓ Loaded {len(tweets)} tweets\n")

    # Load prompts
    with open("prompts.json", "r", encoding="utf-8") as f:
        prompts = json.load(f)

    # Initialize Gemini model
    model = genai.GenerativeModel("gemini-2.5-flash-lite")

    # Score tweets for each theme
    scored_results = {}

    for theme_key, theme_config in prompts.items():
        print(f"\n🤖 Scoring tweets for theme: {theme_config['theme']}")
        print("=" * 60)

        scored_tweets = []

        for i, tweet in enumerate(tweets, 1):
            print(
                f"  [{i}/{len(tweets)}] Scoring @{tweet['author']['username']}...",
                end=" ",
            )

            # Score the tweet
            score_result = score_tweet(tweet, theme_config, model)

            # Add score to tweet data
            tweet_with_score = {
                **tweet,
                "score": score_result["score"],
                "score_reason": score_result["reason"],
            }

            scored_tweets.append(tweet_with_score)
            print(f"Score: {score_result['score']}/10")

            # Rate limiting: small delay between API calls
            time.sleep(0.5)

        # Filter to only high-scoring tweets (7+)
        high_scoring = [t for t in scored_tweets if t["score"] >= 7]

        # Sort by score (highest first)
        high_scoring.sort(key=lambda x: x["score"], reverse=True)

        scored_results[theme_key] = high_scoring

        print(
            f"\n✅ {len(high_scoring)} tweets scored 7+ for '{theme_config['theme']}'"
        )

        # Show top 3
        print("\nTop 3 tweets:")
        for i, tweet in enumerate(high_scoring[:3], 1):
            print(f"  {i}. [{tweet['score']}/10] @{tweet['author']['username']}")
            print(f"     {tweet['text'][:80]}...")
            print(f"     Reason: {tweet['score_reason']}\n")

    # Save scored results
    output_file = "scored_tweets.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(scored_results, f, indent=2, ensure_ascii=False)

    print(f"\n💾 Saved scored tweets to {output_file}")

    # Summary
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    for theme_key, tweets_list in scored_results.items():
        theme_name = prompts[theme_key]["theme"]
        print(f"{theme_name}: {len(tweets_list)} tweets scored 7+")

    return scored_results


if __name__ == "__main__":
    try:
        results = score_all_tweets()
        print("\n🎉 Scoring complete!")

        # Check if we have enough tweets per theme
        for theme, tweets in results.items():
            if len(tweets) < 20:
                print(f"\n⚠️  Warning: Only {len(tweets)} tweets for '{theme}' theme")
                print("   Consider adjusting search queries or lowering threshold")

    except FileNotFoundError:
        print("\n❌ Error: tweets.json not found!")
        print("Run fetch_tweets.py first to download tweets.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure you have:")
        print("1. Created a .env file with GEMINI_API_KEY")
        print(
            "2. Installed required packages: pip install google-generativeai python-dotenv"
        )
