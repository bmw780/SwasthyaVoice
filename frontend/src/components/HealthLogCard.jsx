function HealthLogCard({ log }) {
    const time = log.timestamp
        ? new Date(log.timestamp).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
          })
        : "";

    return (
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500 text-sm">
            {time && <p className="text-xs text-gray-400 mb-2">{time}</p>}

            {/* Measurements */}
            {log.measurements?.map((m, i) => (
                <p key={i} className="text-gray-700">
                    🩸 <span className="capitalize">{m.type.replace(/_/g, " ")}</span>:{" "}
                    <span className="font-semibold">{m.value}</span>
                    {m.unit ? ` ${m.unit}` : ""}
                </p>
            ))}

            {/* Legacy flat fields (backwards-compat) */}
            {log.bloodSugar && !log.measurements && (
                <p>🩸 Sugar: <span className="font-semibold">{log.bloodSugar}</span></p>
            )}

            {/* Medications */}
            {log.medications?.map((med, i) => (
                <p key={i}>
                    {med.status === "taken" ? "✅" : med.status === "missed" ? "❌" : "❓"}{" "}
                    {med.name}: <span className="capitalize">{med.status}</span>
                </p>
            ))}

            {log.medicineTaken !== undefined && !log.medications && (
                <p>💊 Medicine: {log.medicineTaken ? "✅ Taken" : "❌ Missed"}</p>
            )}

            {/* Symptoms */}
            {log.symptoms?.map((s, i) => (
                <p key={i} className="text-orange-600">
                    🤒 {s.name}{s.severity ? ` (${s.severity})` : ""}
                </p>
            ))}

            {log.symptom && !log.symptoms && (
                <p className="text-orange-600">🤒 Symptom: {log.symptom}</p>
            )}

            {/* Activities */}
            {log.activities?.map((a, i) => (
                <p key={i} className="text-blue-600">
                    🚶 {a.name}{a.duration_minutes ? ` – ${a.duration_minutes} mins` : ""}
                </p>
            ))}

            {log.activity && !log.activities && (
                <p className="text-blue-600">🚶 {log.activity}</p>
            )}

            {/* Raw text */}
            {log.raw_text && (
                <p className="text-gray-400 italic mt-2 text-xs border-t pt-2">
                    "{log.raw_text}"
                </p>
            )}
        </div>
    );
}

export default HealthLogCard;
