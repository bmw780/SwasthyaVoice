import { useState, useRef, useEffect } from "react";
import HealthLogCard from "../components/HealthLogCard";
import auth from "../config";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000";

function Chat() {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState("");
    const [healthLogs, setHealthLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [patientId, setPatientId] = useState(null);
    const [fetchingLogs, setFetchingLogs] = useState(false);

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "bot",
            text: "Welcome! Tap the mic and tell me about your health today — your sugar levels, medication, symptoms, or activity.",
        },
    ]);

    const recorderRef = useRef(null);
    const streamRef = useRef(null);
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    // Get logged-in user's UID as patientId
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setPatientId(user.uid);
                loadPreviousLogs(user.uid);
            } else {
                navigate("/login");
            }
        });
        return () => unsubscribe();
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // ── Load previous logs from Firestore via backend ──────────────────────
    const loadPreviousLogs = async (uid) => {
        setFetchingLogs(true);
        try {
            const res = await fetch(`${BACKEND_URL}/logs/${uid}`);
            if (res.ok) {
                const logs = await res.json();
                if (logs.length > 0) {
                    setHealthLogs(logs);
                }
            }
        } catch (e) {
            console.warn("Could not load previous logs:", e);
        } finally {
            setFetchingLogs(false);
        }
    };

    // ── Format bot reply from structured health log ─────────────────────────
    const buildBotReply = (transcript, log) => {
        const lines = [`📝 I heard: "${transcript}"\n`];

        if (log.measurements?.length > 0) {
            log.measurements.forEach((m) => {
                const label = m.type.replace(/_/g, " ");
                lines.push(`🩸 ${label}: ${m.value}${m.unit ? " " + m.unit : ""}`);
            });
        }
        if (log.medications?.length > 0) {
            log.medications.forEach((med) => {
                const icon = med.status === "taken" ? "✅" : med.status === "missed" ? "❌" : "❓";
                lines.push(`${icon} Medication – ${med.name}: ${med.status}`);
            });
        }
        if (log.symptoms?.length > 0) {
            log.symptoms.forEach((s) => {
                lines.push(`🤒 Symptom: ${s.name}${s.severity ? ` (${s.severity})` : ""}`);
            });
        }
        if (log.activities?.length > 0) {
            log.activities.forEach((a) => {
                lines.push(`🚶 Activity: ${a.name}${a.duration_minutes ? ` – ${a.duration_minutes} mins` : ""}`);
            });
        }

        lines.push("\n✅ Log saved to your health record.");
        return lines.join("\n");
    };

    // ── Send audio blob to backend ──────────────────────────────────────────
    const processAudioBlob = async (audioBlob) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");

            const response = await fetch(`${BACKEND_URL}/upload-audio`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Backend error");
            }

            const { transcript, health_log } = await response.json();

            // Add user transcript bubble
            setMessages((prev) => [
                ...prev,
                { id: Date.now(), sender: "user", text: transcript },
            ]);

            // Persist to Firestore
            const logWithMeta = {
                ...health_log,
                patientId,
                timestamp: new Date().toISOString(),
            };

            await fetch(`${BACKEND_URL}/save-log`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(logWithMeta),
            });

            // Show bot reply
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "bot",
                    text: buildBotReply(transcript, health_log),
                },
            ]);

            // Prepend to local log list
            setHealthLogs((prev) => [logWithMeta, ...prev]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    sender: "bot",
                    text: `⚠️ Error: ${error.message}. Make sure the backend is running on port 5000.`,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // ── Recording controls ──────────────────────────────────────────────────
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: "audio/webm" });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                streamRef.current?.getTracks().forEach((t) => t.stop());
                await processAudioBlob(audioBlob);
            };

            recorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setRecording(true);
        } catch (error) {
            console.error("Microphone access denied:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    sender: "bot",
                    text: "⚠️ Microphone access denied. Please allow microphone permission and try again.",
                },
            ]);
        }
    };

    const stopRecording = () => {
        if (recorderRef.current) {
            recorderRef.current.stop();
            setRecording(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row gap-4 p-4">

            {/* Chat Panel */}
            <div className="w-full lg:w-105 lg:mx-auto h-[92vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                    <span className="text-lg font-bold">🎙️ SwasthyaVoice AI</span>
                    <button
                        onClick={() => navigate("/home")}
                        className="text-sm underline opacity-80 hover:opacity-100"
                    >
                        Dashboard →
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-3 rounded-xl max-w-[85%] whitespace-pre-line text-sm ${
                                msg.sender === "user"
                                    ? "bg-green-200 self-end"
                                    : "bg-gray-100 self-start"
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}

                    {loading && (
                        <div className="bg-gray-100 self-start p-3 rounded-xl text-sm text-gray-500 animate-pulse">
                            ⏳ Processing your voice log…
                        </div>
                    )}

                    {audioURL && (
                        <div className="bg-gray-50 p-3 rounded-xl border text-sm">
                            <p className="font-semibold mb-1">🎤 Latest Recording</p>
                            <audio controls src={audioURL} className="w-full" />
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* Footer */}
                <div className="border-t p-4">
                    <button
                        onClick={recording ? stopRecording : startRecording}
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : recording
                                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                                : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        {loading ? "Processing…" : recording ? "⏹ Stop Recording" : "🎤 Start Recording"}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2">
                        Speak your sugar level, medication, symptoms, and activity
                    </p>
                </div>
            </div>

            {/* Health Logs Panel */}
            {healthLogs.length > 0 && (
                <div className="w-full lg:w-80 overflow-y-auto">
                    <h2 className="font-bold text-lg mb-3 text-gray-700">📋 Health Logs</h2>
                    {fetchingLogs && (
                        <p className="text-sm text-gray-400 mb-2">Loading previous logs…</p>
                    )}
                    <div className="flex flex-col gap-3">
                        {healthLogs.map((log, i) => (
                            <HealthLogCard key={`${log.timestamp}-${i}`} log={log} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;
