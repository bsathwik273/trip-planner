import os

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai


# Load environment variables from .env
load_dotenv()

# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

# Create Gemini client
client = genai.Client(api_key=api_key)

# Create FastAPI app
app = FastAPI()


# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "Triply backend is running"
    }


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "message": "File received successfully"
    }

@app.post("/extract-places")
async def extract_places(file: UploadFile = File(...)):

    image_bytes = await file.read()

    prompt = """
You are an AI travel place extraction system.

Analyze this travel image and identify ONLY specific travel
places that are actually visible or explicitly mentioned.

Rules:
1. Do NOT assume the location is Goa.
2. Do NOT invent places.
3. Do NOT use information from previous images.
4. Identify places from visible text, signs, landmarks,
   captions, menus, or other clear evidence.
5. Ignore generic words such as "India", "travel", "beach",
   "hotel", etc. unless they are part of a specific place name.
6. If you are not confident that something is a specific place,
   do not include it.
7. Multiple places may be present in one image.

Return ONLY valid JSON in exactly this structure:

{
  "places": [
    {
      "name": "Place name",
      "city": "City or null",
      "region": "State/Region or null",
      "country": "Country or null",
      "confidence": 0.0
    }
  ]
}

Confidence must be a number between 0 and 1.

If no specific place can be identified, return:

{
  "places": []
}
"""

    for attempt in range(3):

        try:

            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=[
                    {
                        "inline_data": {
                            "mime_type": file.content_type,
                            "data": image_bytes,
                        }
                    },
                    prompt
                ],
            )

            raw_text = response.text.strip()

            # Remove markdown code fences if Gemini adds them
            if raw_text.startswith("```"):
                raw_text = raw_text.replace("```json", "")
                raw_text = raw_text.replace("```", "")
                raw_text = raw_text.strip()

            import json

            places_data = json.loads(raw_text)

            return {
                "filename": file.filename,
                "places": places_data.get("places", [])
            }

        except Exception as error:

            print(f"Gemini attempt {attempt + 1} failed:", error)

            if attempt == 2:
                return {
                    "filename": file.filename,
                    "places": [],
                    "error": "Gemini is temporarily unavailable. Please try again."
                }