from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

def connect_to_mongo():
    mongo_uri = os.getenv('MONGO_URI')
    client = MongoClient(mongo_uri)
    db = client['data']
    collection = db['tweets']
    return collection

def save_tweet_to_mongo(collection, tweet_data):
    collection.insert_one(tweet_data)

