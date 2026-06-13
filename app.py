from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)

# Firebase Setup
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# Home Route
@app.route("/")
def home():
    return "PowerBudies Backend Running!"

# Save Health Log
@app.route("/save-log", methods=["POST"])
def save_log():

    data = request.json

    db.collection("health_logs").add(data)

    return jsonify({
        "status": "success",
        "message": "Health log saved"
    })

# Get Logs By Patient ID
@app.route("/logs/<patient_id>", methods=["GET"])
def get_logs(patient_id):

    docs = db.collection("health_logs") \
             .where("patientId", "==", patient_id) \
             .stream()

    logs = []

    for doc in docs:
        log = doc.to_dict()
        log["id"] = doc.id
        logs.append(log)

    return jsonify(logs)

# Store Alert
@app.route("/alert", methods=["POST"])
def create_alert():

    data = request.json

    db.collection("alerts").add(data)

    return jsonify({
        "status": "success",
        "message": "Alert stored successfully"
    })

# Get Alerts By Patient ID
@app.route("/alerts/<patient_id>", methods=["GET"])
def get_alerts(patient_id):

    docs = db.collection("alerts") \
             .where("patientId", "==", patient_id) \
             .stream()

    alerts = []

    for doc in docs:
        alert = doc.to_dict()
        alert["id"] = doc.id
        alerts.append(alert)

    return jsonify(alerts)

if __name__ == "__main__":
    app.run(debug=True)