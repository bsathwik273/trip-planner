# ✈️ Triply — AI Trip Planner

Triply is an AI-powered travel planning application that transforms travel inspiration from **screenshots, saved images, and videos** into organized travel plans.

Instead of manually searching through saved Instagram posts, screenshots, and travel content, Triply extracts useful places and helps organize them into a **day-by-day itinerary**.

---

## 🚀 Features

### 📸 Travel Content Upload

Upload travel-related images and screenshots collected from:

* Instagram
* WhatsApp
* Google
* Travel websites
* Camera roll
* Other sources

### 🤖 AI Place Extraction

Triply uses **Google Gemini** to analyze uploaded images and identify specific travel destinations.

The AI can extract information such as:

* Place name
* City
* State / Region
* Country
* Confidence score

Triply avoids assuming a location and only returns places that can be identified from the provided image.

### 📍 Place Review

Extracted places are displayed before itinerary generation.

Users can review the detected locations and remove places that they don't want in their trip.

### 🗓️ Trip Planning

Users can provide trip preferences such as:

* Trip name
* Number of days
* Planning style

Triply then organizes the selected places into a trip itinerary.

## 🚀 Live App

[**Triply — Live App**](https://trip-planner-38oqez9f9-bsathwik273-4139.vercel.app/)


### 🧠 AI-Powered Architecture

The current system follows:

```text
User
 │
 ▼
React Frontend
 │
 │ Upload image
 ▼
FastAPI Backend
 │
 ▼
Google Gemini
 │
 │ Extract places
 ▼
Structured JSON
 │
 ▼
React Places Screen
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* Lucide React

### Backend

* Python
* FastAPI
* Uvicorn
* Python Multipart
* python-dotenv

### AI

* Google Gemini API
* `google-genai`

### Development Tools

* Visual Studio Code
* Git
* GitHub

---

## 📁 Project Structure

```text
trip-planner/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── public/
│
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

> `.env` and the Python virtual environment are excluded from Git using `.gitignore`.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bsathwik273/trip-planner.git
```

Move into the project:

```bash
cd trip-planner
```

---

# 🎨 Frontend Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🐍 Backend Setup

Move into the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory:

```text
GEMINI_API_KEY=your_gemini_api_key
```

Never commit the `.env` file to GitHub.

The API key should remain private.

---

## ▶️ Start the Backend

From the `backend` directory:

```bash
uvicorn main:app --reload
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation is available at:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

---

## 🔄 Current Application Flow

```text
1. User opens Triply
        ↓
2. User uploads travel images
        ↓
3. React sends images to FastAPI
        ↓
4. FastAPI sends image to Gemini
        ↓
5. Gemini analyzes the image
        ↓
6. Gemini returns structured place data
        ↓
7. React displays extracted places
        ↓
8. User reviews the places
        ↓
9. User configures the trip
        ↓
10. Triply generates an itinerary
```

---

## 📦 Example AI Response

For an image containing travel destinations, Gemini can return structured data such as:

```json
{
  "places": [
    {
      "name": "Nainital Lake",
      "city": "Nainital",
      "region": "Uttarakhand",
      "country": "India",
      "confidence": 0.95
    },
    {
      "name": "Bhimtal",
      "city": "Bhimtal",
      "region": "Uttarakhand",
      "country": "India",
      "confidence": 0.85
    }
  ]
}
```

This structured format allows the frontend to work with individual places instead of parsing plain text.

---

## 🗺️ Planned Improvements

Triply is currently under development.

### Travel Content

* [ ] Instagram Reel/video processing
* [ ] Video frame extraction
* [ ] OCR for text-heavy screenshots
* [ ] Better place recognition
* [ ] Duplicate place detection

### Trip Planning

* [ ] AI-generated itineraries
* [ ] Location-based grouping
* [ ] Travel-time optimization
* [ ] Opening-hours awareness
* [ ] Restaurant and activity recommendations
* [ ] Weather-aware planning

### Maps & Location

* [ ] Geocoding
* [ ] Interactive maps
* [ ] Distance calculation
* [ ] Route optimization
* [ ] Nearby-place discovery

### User Features

* [ ] Save trips
* [ ] Edit itineraries
* [ ] User accounts
* [ ] Trip history
* [ ] Share trips

### Infrastructure

* [ ] Deploy frontend
* [ ] Deploy backend
* [ ] Database integration
* [ ] Cloud storage
* [ ] Authentication
* [ ] Production monitoring

---

## 🔐 Security

Triply uses environment variables for sensitive credentials.

API keys should **never** be committed to GitHub.

The project `.gitignore` excludes:

```text
backend/.env
backend/venv/
backend/__pycache__/
*.pyc
```

---

## 📌 Project Status

**Current status:** 🚧 Active Development

The core pipeline is currently working:

```text
Image Upload
     ↓
FastAPI
     ↓
Gemini
     ↓
Place Extraction
     ↓
Structured JSON
     ↓
Places UI
```

The next major stage is deploying the application and then expanding the AI-powered itinerary generation and travel intelligence.

---

## 👨‍💻 Author

**Sathwik**

B.Tech Computer Science Engineering

GitHub:
https://github.com/bsathwik273

---

## 📄 License

This project is currently intended as a personal/educational project.
