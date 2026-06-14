
## this entire file can be discarded

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Manual testing of ai parsing until stt is implemented
import json
import requests
from datetime import datetime
from extractor import extract_health_log

log = extract_health_log(
    """
    I took metformin today.
    My sugar was 140.
    Feeling tired.
    Walked for 20 minutes.
    """
)

print(log)

data = log.model_dump()

patient_id = "test_patient_001" # temp, until frontend integration
data["patientId"] = patient_id
data["timestamp"] = datetime.now().isoformat()

# print(data)
# print(json.dumps(data, indent=2))

# # ip change later ig?
# response = requests.post(
#     "http://127.0.0.1:5000/save-log",
#     json=data
# )

response = requests.post(
    "https://unrented-deception-engine.ngrok-free.dev/save-log",
    headers={
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json"
    },
    json=data,
    verify=False
)

print(response.status_code)
print(response.text)