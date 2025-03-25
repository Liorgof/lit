from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

def twitter_collection():
    mongo_uri = os.getenv('MONGO_URI')
    client = MongoClient(mongo_uri)
    db = client['data']
    collection = db['tweets']
    return collection

def wikipedia_collection():
    mongo_uri = os.getenv('MONGO_URI')
    client = MongoClient(mongo_uri)
    db = client['data']
    collection = db['wiki']
    return collection

def save_to_mongo(collection, tweet_data):
    collection.insert_one(tweet_data)

