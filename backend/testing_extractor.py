
# Manual testing of ai parsing until stt is implemented

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