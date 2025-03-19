from flask import Blueprint, request, jsonify
import asyncio
import os
from dotenv import load_dotenv
from scraper.db import connect_to_mongo
from scraper.twitter_scraper import scrape_and_store

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

    collection = connect_to_mongo()

    # הרצה אסינכרונית של פונקציית הסקרייפינג
    asyncio.run(scrape_and_store(collection, query=custom_query))

    return jsonify({"message": f"Scraping completed for query: {custom_query}"})

# שליפה של טוויטים עם פאגינציה
@main.route('/tweets', methods=['GET'])
def get_tweets_json():
    collection = connect_to_mongo()

    page = int(request.args.get('page', 1))
    per_page = 10
    skip = (page - 1) * per_page

    tweets = list(
        collection.find({}, {'_id': 0})
        .skip(skip)
        .limit(per_page)
    )

    return jsonify(tweets)
