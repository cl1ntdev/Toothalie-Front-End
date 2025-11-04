import React, { useState, useEffect } from "react";
import { fetchHistory } from "@/API/Authenticated/appointment/FetchHistory";

// --- Icon Helper ---
// You can replace these with a library like react-icons if you prefer
const ICONS = {
  create: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  ),
  update: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  ),
  cancel: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
      />
    </svg>
  ),
  default: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  ),
};

const getActionDetails = (action) => {
  switch (action) {
    case "create":
      return {
        icon: ICONS.create,
        color: "bg-blue-100 text-blue-700",
        borderColor: "border-blue-500",
      };
    case "update":
      return {
        icon: ICONS.update,
        color: "bg-yellow-100 text-yellow-700",
        borderColor: "border-yellow-500",
      };
    case "cancel":
      return {
        icon: ICONS.cancel,
        color: "bg-red-100 text-red-700",
        borderColor: "border-red-500",
      };
    default:
      return {
        icon: ICONS.default,
        color: "bg-gray-100 text-gray-700",
        borderColor: "border-gray-500",
      };
  }
};

/**
 * A single item in the history feed.
 */
function HistoryItem({ log, isLastItem }) {
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const snapshot = JSON.parse(log.snapshot || "{}");
  const { icon, color, borderColor } = getActionDetails(log.action);

  return (
    <div className="flex relative">
      {/* --- Timeline & Icon --- */}
      <div className="flex flex-col items-center mr-4">
        {/* Icon Circle */}
        <span
          className={`flex items-center justify-center w-10 h-10 rounded-full ${color} ring-4 ring-white z-10`}
        >
          {icon}
        </span>
        {/* Vertical Line */}
        {!isLastItem && (
          <div className="w-px h-full bg-gray-300 -mt-1"></div>
        )}
      </div>

      {/* --- Content Card --- */}
      <div className="flex-1 pb-8">
        <div
          className={`bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition -mt-2 ${borderColor} border-l-4`}
        >
          {/* Card Header */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500">
              {new Date(log.logged_at).toLocaleString()}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                log.actor_type === "patient"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              By: {log.actor_type}
            </span>
          </div>

          {/* Card Body */}
          <h2 className="text-lg font-medium text-gray-800 capitalize">
            {log.action} — Appt #{log.appointment_id}
          </h2>
          <p className="text-gray-600 text-sm mt-1">{log.message}</p>

          {/* Snapshot Toggle */}
          <button
            onClick={() => setIsSnapshotOpen(!isSnapshotOpen)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-3"
          >
            {isSnapshotOpen ? "Hide Details" : "Show Details"}
          </button>

          {/* Snapshot Details (Collapsible) */}
          {isSnapshotOpen && (
            <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border">
              <h4 className="font-semibold mb-2">Appointment Snapshot</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <p>
                  <strong>Status:</strong> {snapshot.status || "—"}
                </p>
                <p>
                  <strong>Date:</strong> {snapshot.user_set_date || "—"}
                </p>
                <p>
                  <strong>Dentist ID:</strong> {snapshot.dentist_id || "—"}
                </p>
                <p>
                  <strong>Emergency:</strong>{" "}
                  {snapshot.emergency ? "Yes 🚨" : "No"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * The main pane component that fetches and displays the history feed.
 */
export default function HistoryPane() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userID = localStorage.getItem("userID");

    const getHistory = async () => {
      try {
        const response = await fetchHistory(userID);
        if (response?.status === "ok") {
          // Assuming the API returns logs in descending order (newest first)
          setHistory(response.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    getHistory();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {loading ? (
        <div className="text-center text-gray-500">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="text-center text-gray-500 p-10 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-medium">No History Found</h3>
          <p>There are no appointment activity logs to show yet.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {history.map((log, index) => (
            <HistoryItem
              key={log.id}
              log={log}
              isLastItem={index === history.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}