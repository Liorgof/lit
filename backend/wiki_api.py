import wikipedia
from scraper.db import save_to_mongo
import asyncio
from datetime import datetime, timezone


async def fetch_wikipedia_data(query):
    summary = await asyncio.to_thread(wikipedia.summary, query)
    page = await asyncio.to_thread(wikipedia.page, query)
    return summary, page.links

async def save_wikipedia_summary_and_links(collection, query):
    try:
        summary, links = await fetch_wikipedia_data(query)

        wiki_data = {
            'Query': query,
            'Summary': summary,
            'Links': links[:10],
            'Scraped_At': datetime.now(timezone.utc)
        }

        await asyncio.to_thread(save_to_mongo, collection, wiki_data)

        print(f"Successfully saved summary and links for '{query}' to MongoDB.")

    except wikipedia.exceptions.PageError as e:
        print(f"No page found for query '{query}'.")
        raise e 

    except wikipedia.exceptions.DisambiguationError as e:
        print(f"Query '{query}' resulted in a disambiguation. Options are: {e.options}")
        raise e

