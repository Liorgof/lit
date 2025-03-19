from twikit import Client, TooManyRequests
from datetime import datetime
from random import randint
import asyncio
from scraper.db import save_tweet_to_mongo
MINIMUM_TWEETS = 10

async def scrape_and_store(collection, username, email, password, query=None):
    client = Client(language='en-US')
    if not client:
        client.login(auth_info_1=username, auth_info_2=email, password=password)
        client.save_cookies('cookies.json')
    else:
        client.load_cookies('cookies.json')

    tweet_count = 0
    tweets = None

    print(f"[DEBUG] Running scrape with query: {query}")

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
                'Likes': tweet.favorite_count
            }


            save_tweet_to_mongo(collection, tweet_data)

        print(f'{datetime.now()} - Got {tweet_count} tweets')

    print(f'{datetime.now()} - Done! Got {tweet_count} tweets')

