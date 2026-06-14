import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-cyan-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
          <div className="bg-[#fcb735] p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold">👤 Patient</h2>
            <p className="font-medium mt-2">Sam Grason</p>
            <p className="font-medium">Diabetic</p>
          </div>

          <div className="bg-[#fcb735] p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold">🩸 Sugar Level</h2>
            <p className="text-3xl font-bold mt-2">130</p>
            <p>mg/dL</p>
          </div>

          <div className="bg-[#fcb735] p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold">💊 Medication</h2>
            <p className="mt-2 text-green-700 font-semibold">
              Taken Today ✔
            </p>
          </div>

          <div className="bg-[#fcb735] p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold">🚨 Alerts</h2>
            <p className="mt-2 text-red-600 font-semibold">
              1 Active Alert
            </p>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Recent Logs */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Recent Health Logs
            </h2>

            <div className="border-b pb-3 mb-3">
              <p className="font-semibold">Today - 8:00 AM</p>
              <p>Blood Sugar: 130 mg/dL</p>
              <p>Medicine Taken ✔</p>
              <p>Walked 20 Minutes</p>
            </div>

            <div>
              <p className="font-semibold">Yesterday - 8:15 AM</p>
              <p>Blood Sugar: 145 mg/dL</p>
              <p>Feeling Tired</p>
              <p>Walked 10 Minutes</p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-green-100 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              AI Health Summary
            </h2>

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
            <h2 className="text-xl font-bold mb-6">
              Blood Sugar Trend
            </h2>

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
            <h2 className="text-xl font-bold mb-4">
              Medication Adherence
            </h2>

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
            <h2 className="text-xl font-bold mb-4">
              Latest Voice Entry
            </h2>

            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="italic">
                "I took my diabetes tablet today.
                Sugar was 130 and I walked for
                20 minutes."
              </p>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-red-100 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Active Alerts
            </h2>

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