
# Manual testing of ai parsing until stt is implemented

from extractor import extract_health_log

result = extract_health_log(
    """
    I took metformin today.
    My sugar was 140.
    Feeling tired.
    Walked for 20 minutes.
    """
)

print(result)
