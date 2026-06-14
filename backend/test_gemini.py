### This file is currently no longer needed

from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key= API_KEY)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="""
Extract health information as JSON.

Text:
I took my diabetes medicine today.
My sugar was 140.
Feeling tired.

Return only JSON.
"""
)

print(response.text)