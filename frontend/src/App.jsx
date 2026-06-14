import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import auth from "./config";
import HealthLogCard from "./components/HealthLogCard";

const BACKEND_URL = "http://localhost:5000";

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        const res = await fetch(`${BACKEND_URL}/logs/${user.uid}`);
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
      }
    });

    return () => unsubscribe();
  }, []);

  const latestLog = logs.length > 0 ? logs[0] : null;

  return (
    <div className="min-h-screen bg-cyan-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
          <div className="bg-[#fcb735] p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold">👤 Patient</h2>
            <p className="font-medium mt-2">
              {auth.currentUser?.email ?? "Patient"}
            </p>
            <p className="font-medium"></p>
          </div>

          <div className="bg-[#fcb735] p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold">🩸 Sugar Level</h2>
            <p className="text-3xl font-bold mt-2">
              {latestLog?.measurements?.[0]?.value ?? "N/A"}
            </p>
            <p>{latestLog?.measurements?.[0]?.unit ?? ""}</p>
          </div>

          <div className="bg-[#fcb735] p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold">💊 Medication</h2>
            <p className="mt-2 text-green-700 font-semibold">
              {latestLog?.medications?.[0]?.status ?? "No Data"}
            </p>
          </div>

          <div className="bg-[#fcb735] p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold">🚨 Alerts</h2>
            <p className="mt-2 text-red-600 font-semibold">
              None
            </p>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Recent Logs */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Recent Health Logs</h2>

            <div className="space-y-3">
              {logs.length === 0 ? (
                <p>No logs yet.</p>
              ) : (
                logs.slice(0, 5).map((log, i) => (
                  <HealthLogCard key={i} log={log} />
                ))
              )}
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-green-100 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">AI Health Summary</h2>
            <p className="leading-7">
              Patient has maintained medication adherence.
              Blood sugar levels have remained stable over the
              past week. Mild fatigue was reported yesterday.
              Continued monitoring is recommended.
            </p>
          </div>
        </div>

        {/* Charts & Medication */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Trend Chart Placeholder */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-6">Blood Sugar Trend</h2>

            <div className="h-48 flex justify-around items-end gap-4">
              <div className="bg-blue-500 w-12 h-24 rounded-t"></div>
              <div className="bg-blue-500 w-12 h-28 rounded-t"></div>
              <div className="bg-blue-500 w-12 h-32 rounded-t"></div>
              <div className="bg-blue-500 w-12 h-40 rounded-t"></div>
              <div className="bg-blue-500 w-12 h-36 rounded-t"></div>
            </div>

            <div className="flex justify-around mt-3 text-sm gap-4">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
            </div>
          </div>

          {/* Medication History */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Medication Adherence</h2>

            <div className="space-y-3">
              <p>Monday ✔</p>
              <p>Tuesday ✔</p>
              <p>Wednesday ✔</p>
              <p>Thursday ❌</p>
              <p>Friday ✔</p>
              <p>Saturday ✔</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Voice Log */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Latest Voice Entry</h2>

            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="italic">
                {latestLog?.raw_text ?? "No voice logs yet"}
              </p>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-red-100 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Active Alerts</h2>

            <div className="space-y-3">
              <p>🔴 Blood sugar increasing for 3 days</p>
              <p>🟠 Mild fatigue reported yesterday</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
