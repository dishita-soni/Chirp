#!/usr/bin/env python3
"""
Fetch tweets from X API v2 with images for the recommendation system.
Fetches 50 productivity-related tweets and 50 meme tweets.
"""

import os
import json
from searchtweets import ResultStream, gen_request_parameters
from dotenv import load_dotenv

load_dotenv()


def fetch_tweets():
    """Fetch 100 tweets (50 productivity, 50 memes) with images."""

    # Load credentials directly from environment variables
    bearer_token = os.getenv("SEARCHTWEETS_BEARER_TOKEN")

    if not bearer_token:
        raise ValueError("SEARCHTWEETS_BEARER_TOKEN not found in .env file")

    # Construct search_args manually (bypassing load_credentials)
    search_args = {
        "bearer_token": bearer_token,
        "endpoint": "https://api.twitter.com/2/tweets/search/recent"
    }

    # Define search queries
    queries = {
        "productivity": {
            "query": '(productivity OR burnout OR "work life balance" OR "work-life balance") -is:retweet has:images lang:en',
            "max_results": 10,
        },
        "memes": {
            "query": "(meme OR memes OR funny) -is:retweet has:images lang:en",
            "max_results": 10,
        },
    }

    # Tweet fields to request
    tweet_fields = "id,text,author_id,created_at,public_metrics,attachments"
    expansions = "attachments.media_keys,author_id"
    media_fields = "media_key,type,url,preview_image_url"
    user_fields = "id,name,username,profile_image_url"

    all_tweets = []

    for theme, params in queries.items():
        print(f"\n📥 Fetching {params['max_results']} tweets for theme: {theme}")

        # Generate request parameters
        query = gen_request_parameters(
            query=params["query"],
            results_per_call=params["max_results"],
            tweet_fields=tweet_fields,
            expansions=expansions,
            media_fields=media_fields,
            user_fields=user_fields,
            granularity=None
        )

        # Fetch tweets
        rs = ResultStream(
            request_parameters=query, max_results=params["max_results"], **search_args
        )

        tweets_data = list(rs.stream())

        # Process and enhance tweet data
        for tweet_obj in tweets_data:
            # Extract includes (media and users)
            includes = tweet_obj.get("includes", {})
            media_lookup = {m["media_key"]: m for m in includes.get("media", [])}
            user_lookup = {u["id"]: u for u in includes.get("users", [])}

            # Get the actual tweet data
            tweet_data = tweet_obj.get("data", {})

            # Get author info
            author_id = tweet_data.get("author_id")
            author = user_lookup.get(author_id, {})

            # Get media (images)
            attachments = tweet_data.get("attachments", {})
            media_keys = attachments.get("media_keys", [])
            images = []

            for media_key in media_keys:
                media = media_lookup.get(media_key, {})
                if media.get("type") == "photo":
                    images.append({"url": media.get("url"), "media_key": media_key})

            # Only include tweets with at least one image
            if not images:
                continue

            # Build structured tweet object
            tweet = {
                "id": tweet_data.get("id"),
                "text": tweet_data.get("text"),
                "created_at": tweet_data.get("created_at"),
                "author": {
                    "id": author.get("id"),
                    "name": author.get("name"),
                    "username": author.get("username"),
                    "profile_image": author.get("profile_image_url"),
                },
                "metrics": tweet_data.get("public_metrics", {}),
                "images": images,
                "theme_hint": theme,  # Track which query fetched this
            }

            all_tweets.append(tweet)
            print(f"  ✓ @{tweet['author']['username']}: {tweet['text'][:50]}...")

    print(f"\n✅ Total tweets fetched: {len(all_tweets)}")

    # Save to JSON
    output_file = "tweets.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_tweets, f, indent=2, ensure_ascii=False)

    print(f"💾 Saved to {output_file}")

    return all_tweets


if __name__ == "__main__":
    try:
        tweets = fetch_tweets()
        print(f"\n🎉 Successfully fetched {len(tweets)} tweets with images!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure you have:")
        print("1. Created a .env file with SEARCHTWEETS_BEARER_TOKEN")
        print(
            "2. Installed required packages: pip install searchtweets-v2 python-dotenv"
        )
