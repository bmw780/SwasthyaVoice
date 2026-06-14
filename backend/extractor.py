import json
from google import genai
from health_schema import HealthLog
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key= API_KEY)

PROMPT = """
You are a healthcare information extraction engine.

Extract information from the user's health statement.

Return ONLY valid JSON.

Schema:

{{
  "raw_text": "",
  "measurements": [
    {{
      "type": "",
      "value": 0,
      "unit": ""
    }}
  ],
  "medications": [
    {{
      "name": "",
      "status": "taken"
    }}
  ],
  "symptoms": [
    {{
      "name": "",
      "severity": null
    }}
  ],
  "activities": [
    {{
      "name": "",
      "duration_minutes": 0
    }}
  ]
}}

Measurement names should be normalized.
Put underscore between terms with multiple words 

Activity names must be normalized.
Use lowercase.
Use present-tense activity names.

Examples:
walked -> walking
walk -> walking
ran -> running
run -> running
cycled -> cycling
yoga -> yoga

Medication status must be one of:
- taken
- missed
- unknown

Symptom severity must be one of:
- mild
- moderate
- severe

User input:

{user_text}
"""

def extract_health_log(text: str):

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=PROMPT.format(
            user_text=text
        )
    )

    cleaned = response.text.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]

    cleaned = cleaned.strip()

    print(cleaned)

    data = json.loads(cleaned)

    # print(repr(response.text))

    # data = json.loads(response.text)

    return HealthLog.model_validate(data)