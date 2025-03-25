from twikit import Client, TooManyRequests
from datetime import datetime, timezone
from random import randint
import asyncio
import os
from dotenv import load_dotenv
from scraper.db import save_to_mongo

MINIMUM_TWEETS = 10
dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path=dotenv_path, override=True)

async def scrape_and_store(collection, query=None):
    username = os.getenv('X_USERNAME')
    email = os.getenv('X_EMAIL')
    password = os.getenv('X_PASSWORD')
    client = Client(language='en-US')

    # Optionally login again and save cookies if needed
    # await client.login(auth_info_1=username, auth_info_2=email, password=password)
    # client.save_cookies('cookies.json')

    client.load_cookies('cookies.json')
    tweet_count = 0
    tweets = None
    success = False  # Track if any tweets were saved

    print(f"[DEBUG] Running scrape with query: {query}")

    try:
        while tweet_count < MINIMUM_TWEETS:
            try:
                if tweets is None:
                    print(f'{datetime.now()} - Getting tweets for query: {query}')
                    tweets = await client.search_tweet(query, product='Top')
                else:
                    wait_time = randint(5, 10)
                    print(f'{datetime.now()} - Getting next tweets after {wait_time} seconds ...')
                    await asyncio.sleep(wait_time)
                    tweets = await tweets.next()

            except TooManyRequests as e:
                rate_limit_reset = datetime.fromtimestamp(e.rate_limit_reset)
                print(f'{datetime.now()} - Rate limit reached. Waiting until {rate_limit_reset}')
                wait_time = (rate_limit_reset - datetime.now()).total_seconds()
                await asyncio.sleep(wait_time)
                continue

            if not tweets:
                print(f'{datetime.now()} - No more tweets found')
                break

            for tweet in tweets:
                tweet_count += 1
                tweet_data = {
                    'Tweet_count': tweet_count,
                    'Username': tweet.user.name,
                    'Text': tweet.text,
                    'Created_At': tweet.created_at,
                    'Retweets': tweet.retweet_count,
                    'Likes': tweet.favorite_count,
                    'Scraped_At': datetime.now(timezone.utc)
                }

                save_to_mongo(collection, tweet_data)

            print(f'{datetime.now()} - Got {tweet_count} tweets')
            success = True

    except Exception as e:
        print(f'[ERROR] Scraping failed: {e}')
        raise e

    if not success:
        raise Exception("No tweets were scraped – possible query issue or rate limiting.")

    print(f'{datetime.now()} - Done! Got {tweet_count} tweets')
