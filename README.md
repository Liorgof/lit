# Lit — Python Scraper with Flask + React

Lit is a full-stack application built with a **Flask backend** that runs a Python web scraper for Twitter (X) and Wikipedia, and a **React frontend** to interact with it. It connects to a MongoDB database and requires some credential setup via a `.env` file.

# 📁 Project Structure

lit/
├── backend/
│ ├── app/ # Flask app setup and routing
│ ├── scraper/ # Scraper logic and DB connection
│ │ ├── db.py
│ │ ├── twitter_scraper.py
│ │ └── wiki_api.py
│ ├── test_scraper.py # Test script for scraping
│ ├── run.py # Flask entry point
│ ├── .env # Environment variables (you create this)
│ ├── cookies.json # Optional for authentication/session
│ ├── requirements.txt
│ └── venv/ # Virtual environment (should not be committed)
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── App.js
│ │ ├── index.js
│ │ ├── TweetTable.js
│ │ ├── TwitterScraper.js
│ │ ├── WikipediaScraper.js
│ │ └── WikipediaTable.js
│ ├── package.json
│ └── package-lock.json
│
├── .gitignore
└── README.md

## ⚙️ Backend Setup (Flask + Scraper)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```
3. **Activate the virtual environment**:
   ```bash
   venv\Scripts\activate
   ```
4. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
5. **Create a `.env` file in the `backend/` folder with the following format**:
   ```bash
   MONGO_URI=your_mongo_connection_string
   X_USERNAME=your_x_username
   X_PASSWORD=your_x_password
   X_EMAIL=your_x_email
   ```
6. **Run the Flask backend:**
   ```bash
   	 python run.py
   It will start on `http://localhost:5000`
   ```

## 🌐 Frontend Setup (React)

1.  **Navigate to the frontend directory:**
    ```bash
     cd ../frontend
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```
3.  **Start the React development server:**
    ```bash
    npm start
    The frontend runs on `http://localhost:3000`.
    ```

## ⚠️ Environment Notes

- Do **not commit** `.env` or `cookies.json` (add to `.gitignore`)
- Make sure your MongoDB connection allows external access
- Store any login or session info securely

## 🧾 License

MIT License © 2025
