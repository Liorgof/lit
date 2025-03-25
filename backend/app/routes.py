from flask import Blueprint, request, jsonify
import asyncio
import os
from dotenv import load_dotenv
from scraper.db import twitter_collection, wikipedia_collection
from scraper.twitter_scraper import scrape_and_store
from wiki_api import save_wikipedia_summary_and_links, fetch_wikipedia_data
import wikipedia

# יצירת ה-Blueprint של הראוטים
main = Blueprint('main', __name__)

# דף הבית - בדיקה שהשרת פעיל
@main.route('/')
def home():
    return jsonify({"message": "Welcome to the Twitter Scraper API!"})

# הפעלת סקרייפינג
@main.route('/scrape', methods=['POST'])
def scrape_tweets():
    data = request.get_json()
    custom_query = data.get('query')

    if not custom_query:
        return jsonify({"error": "Query is required"}), 400

    collection = twitter_collection()
    try:
    # הרצה אסינכרונית של פונקציית הסקרייפינג
        asyncio.run(scrape_and_store(collection, query=custom_query))
        return jsonify({"message": f"Scraping completed for query: {custom_query}"})
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# שליפה של טוויטים עם פאגינציה
@main.route('/tweets', methods=['GET'])
def get_tweets_json():
    collection = twitter_collection()

    page = int(request.args.get('page', 1))
    per_page = 10
    skip = (page - 1) * per_page

    tweets = list(
        collection.find({}, {'_id': 0})
        .sort('Scraped_At', -1)  # DESCENDING = Newest first
        .skip(skip)
        .limit(per_page)
    )

    return jsonify(tweets)



@main.route('/wikipedia', methods=['POST'])
def wikipedia_endpoint():
    data = request.get_json()
    query = data.get('query')

    if not query:
        return jsonify({"error": "Query is required"}), 400

    collection = wikipedia_collection()

    try:
        asyncio.run(save_wikipedia_summary_and_links(collection, query))
        return jsonify({"message": f"Successfully saved summary and links for '{query}' to MongoDB."})

    except wikipedia.exceptions.PageError:
        return jsonify({"error": f"No page found for query '{query}'."}), 404
    except wikipedia.exceptions.DisambiguationError as e:
        return jsonify({
            "error": f"Query '{query}' resulted in a disambiguation.",
            "options": e.options
        }), 400
