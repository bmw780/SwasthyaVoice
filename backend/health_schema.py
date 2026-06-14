
from pydantic import BaseModel
from typing import Literal
from enum import Enum


class MedicationStatus(str, Enum):
    TAKEN = "taken"
    MISSED = "missed"
    UNKNOWN = "unknown"

class Medication(BaseModel):
    name: str
    status: MedicationStatus


class MeasurementType(str, Enum):
    BLOOD_SUGAR = "blood_sugar"
    BLOOD_PRESSURE = "blood_pressure"
    HEART_RATE = "heart_rate"
    WEIGHT = "weight"
    BODY_TEMPERATURE = "body_temperature"
    OXYGEN_SATURATION = "oxygen_saturation"
    SLEEP_DURATION = "sleep_duration"

class Measurement(BaseModel):
    type: MeasurementType
    value: float
    unit: str | None = None


class Symptom(BaseModel):
    name: str
    severity: Literal[
        "mild",
        "moderate",
        "severe"
    ] | None = None


class Activity(BaseModel):
    name: str
    duration_minutes: int | None = None


class HealthLog(BaseModel):
    raw_text: str

    measurements: list[Measurement] = []
    medications: list[Medication] = []
    symptoms: list[Symptom] = []
    activities: list[Activity] = []

