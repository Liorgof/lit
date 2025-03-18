import asyncio
from configparser import ConfigParser
from scraper.db import connect_to_mongo
from scraper.twitter_scraper import scrape_and_store

# טוען קובץ קונפיג
config = ConfigParser()
config.read('config.ini')

username = config['X'].get('username')
email = config['X'].get('email')
password = config['X'].get('password')

# מדפיס כדי לוודא שיש מידע
print(f"username: {username}, email: {email}, password: {password}")

# חיבור למסד הנתונים
collection = connect_to_mongo()

# הרצת הסקרייפר
asyncio.run(scrape_and_store(collection, username, email, password))
