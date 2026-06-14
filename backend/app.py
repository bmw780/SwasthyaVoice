from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from extractor import extract_health_log
import speech_recognition as sr
import tempfile
import os
import subprocess

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Firebase Setup
# Place your downloaded firebase_key.json in this backend/ folder
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()


@app.route("/")
def home():
    return "SwasthyaVoice Backend Running!"


# ── Audio upload → STT → AI extraction → return structured log ────────────────
@app.route("/upload-audio", methods=["POST"])
def upload_audio():
    """
    Receives audio/webm from the browser, converts to WAV,
    runs speech-to-text, passes text through Gemini extractor,
    and returns the structured HealthLog JSON.
    """
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]

    # Save webm to temp file
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp_webm:
        audio_file.save(tmp_webm.name)
        webm_path = tmp_webm.name

    wav_path = webm_path.replace(".webm", ".wav")

    try:
        # Convert webm → wav using ffmpeg
        subprocess.run(
            ["ffmpeg", "-y", "-i", webm_path, wav_path],
            check=True,
            capture_output=True,
        )

        # Speech-to-Text with Google (free, no API key needed)
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)

        try:
            transcript = recognizer.recognize_google(audio_data)
        except sr.UnknownValueError:
            return jsonify({"error": "Could not understand audio"}), 422
        except sr.RequestError as e:
            return jsonify({"error": f"STT service error: {e}"}), 503

        # Extract structured health data via Gemini
        health_log = extract_health_log(transcript)

        return jsonify({
            "transcript": transcript,
            "health_log": health_log.model_dump(),
        })

    finally:
        os.unlink(webm_path)
        if os.path.exists(wav_path):
            os.unlink(wav_path)


# ── Text-only extraction (useful for testing without audio) ───────────────────
@app.route("/extract-text", methods=["POST"])
def extract_text():
    """
    Accepts { "text": "..." } and returns structured HealthLog.
    """
    body = request.get_json()
    if not body or "text" not in body:
        return jsonify({"error": "Missing 'text' field"}), 400

    health_log = extract_health_log(body["text"])
    return jsonify({
        "transcript": body["text"],
        "health_log": health_log.model_dump(),
    })


# ── Firestore: save health log ────────────────────────────────────────────────
@app.route("/save-log", methods=["POST"])
def save_log():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    doc_ref = db.collection("health_logs").add(data)
    return jsonify({
        "status": "success",
        "message": "Health log saved",
        "id": doc_ref[1].id,
    })


# ── Firestore: get logs for a patient ────────────────────────────────────────
@app.route("/logs/<patient_id>", methods=["GET"])
def get_logs(patient_id):
    docs = (
        db.collection("health_logs")
        .where("patientId", "==", patient_id)
        # .porder_by("timestamp", direction=firestore.Query.DESCENDING)
        .stream()
    )
    logs = []
    for doc in docs:
        log = doc.to_dict()
        log["id"] = doc.id
        logs.append(log)
    return jsonify(logs)


# ── Firestore: alerts ─────────────────────────────────────────────────────────
@app.route("/alert", methods=["POST"])
def create_alert():
    data = request.get_json()
    db.collection("alerts").add(data)
    return jsonify({"status": "success", "message": "Alert stored successfully"})


@app.route("/alerts/<patient_id>", methods=["GET"])
def get_alerts(patient_id):
    docs = (
        db.collection("alerts")
        .where("patientId", "==", patient_id)
        .stream()
    )
    alerts = []
    for doc in docs:
        alert = doc.to_dict()
        alert["id"] = doc.id
        alerts.append(alert)
    return jsonify(alerts)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
