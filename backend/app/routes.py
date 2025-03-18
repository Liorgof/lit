from flask import Blueprint, request, jsonify
import asyncio
import os
from configparser import ConfigParser
from scraper.db import connect_to_mongo
from scraper.twitter_scraper import scrape_and_store
from dotenv import load_dotenv



# יצירת ה-Blueprint של הראוטים
main = Blueprint('main', __name__)

# פונקציית עזר לקרוא את פרטי המשתמש מהקובץ config.ini
def load_user():
    load_dotenv()
    return {
        "username": os.getenv('X_USERNAME'),
        "email": os.getenv('X_EMAIL'),
        "password": os.getenv('X_PASSWORD')
    }

#דף הבית  
@main.route('/')
def home():
    return jsonify({"message": "Welcome to the Twitter Scraper API!"})

@main.route('/scrape', methods=['POST'])
def scrape_tweets():
    # קבלת השאילתה מה-Request
    data = request.get_json()
    print(data)
    custom_query = data.get('query')

    if not custom_query:
        return jsonify({"error": "Query is required"}), 400

    # טוען config ומתחבר למסד הנתונים
    creds = load_user()
    collection = connect_to_mongo()

    print(f"[DEBUG] Starting scraping with query: {custom_query}")

    # שולח את השאילתה לסקרייפר
    asyncio.run(scrape_and_store(collection, creds['username'], creds['email'], creds['password'], query=custom_query))

    print("[DEBUG] Finished scraping.")

    return jsonify({"message": f"Scraping completed for query: {custom_query}"})


#מחזיר טוויטים לפי עמודים (pagination)
@main.route('/tweets', methods=['GET'])
def get_tweets_json():
    collection = connect_to_mongo()

    # עמוד מבוקש, ברירת מחדל עמוד ראשון
    page = int(request.args.get('page', 1))
    per_page = 10
    skip = (page - 1) * per_page

    tweets = list(
        collection.find({}, {'_id': 0})
        .skip(skip)
        .limit(per_page)
    )

    return jsonify(tweets)
