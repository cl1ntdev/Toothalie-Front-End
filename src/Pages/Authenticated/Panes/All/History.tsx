import React, { useState, useEffect } from "react";
import { fetchHistory } from "@/API/Authenticated/appointment/FetchHistory";
import { Clock, Plus, Edit3, XCircle, Info, User, Calendar, AlertCircle } from "lucide-react";
import GetUserInfo from "@/API/Authenticated/GetUserInfoAPI";

const getActionConfig = (action: string) => {
  switch (action) {
    case "create":
      return {
        icon: Plus,
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-l-blue-500",
        label: "Created",
      };
    case "update":
      return {
        icon: Edit3,
        color: "text-yellow-700",
        bg: "bg-yellow-50",
        border: "border-l-yellow-500",
        label: "Updated",
      };
    case "cancel":
      return {
        icon: XCircle,
        color: "text-red-700",
        bg: "bg-red-50",
        border: "border-l-red-500",
        label: "Cancelled",
      };
    default:
      return {
        icon: Info,
        color: "text-gray-700",
        bg: "bg-gray-50",
        border: "border-l-gray-500",
        label: "Activity",
      };
  }
};

function HistoryItem({ log, isLast }: { log: any; isLast: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const config = getActionConfig(log.action);
  const Icon = config.icon;
  const snapshot = log.snapshot ? JSON.parse(log.snapshot) : {};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex relative">
      {/* Timeline Line */}
      {!isLast && (
        <div
          className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"
          aria-hidden="true"
        />
      )}

      {/* Icon Node */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-md border-2 border-white flex items-center justify-center z-10">
        <div className={`p-2 rounded-full ${config.bg}`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
      </div>

      {/* Content Card */}
      <div className="flex-1 ml-6 pb-8">
        <div
          className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 ${config.border} border-l-4`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-900 capitalize">
                {config.label} Appointment
              </span>
              <span className="text-xs text-gray-500">ID: {log.appointment_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  log.actor_type === "PATIENT"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {log.actor_type === "PATIENT" ? <User className="w-3 h-3 inline mr-1" /> : null}
                {log.actor_type}
              </span>
              {/* Actor Name */}
                <span className="font-ceramon text-sm text-gray-700">
                  {log.actor_type === 'PATIENT' ? log.patient_first_name + " " + log.patient_last_name : log.dentist_first_name + " " + log.dentist_last_name  }
                </span>
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-700 text-base mb-4">{log.message}</p>

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4" />
            <span>{formatDate(log.logged_at)}</span>
          </div>

          {/* Toggle Snapshot */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            {isOpen ? "Hide" : "Show"} Details
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Snapshot Details */}
          {isOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-ceramon text-gray-800 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Appointment Snapshot
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {snapshot.status || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {snapshot.user_set_date
                      ? new Date(snapshot.user_set_date).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Dentist ID:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {snapshot.dentist_id || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Emergency:</span>
                  {snapshot.emergency ? (
                    <span className="inline-flex items-center gap-1 text-red-700 font-medium">
                      <AlertCircle className="w-4 h-4" />
                      Yes
                    </span>
                  ) : (
                    <span className="text-gray-900 font-medium">No</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HistoryPane() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
       try {
         const user = await GetUserInfo();
         console.log(user);
   
         if (user?.user?.id && user.user.roles) {
           const response = await fetchHistory(user.user.id, user.user.roles);
           if (response?.status === "ok") {
             setHistory(response.data || []);
           }
         }
       } catch (err) {
         console.error("Failed to fetch history:", err);
       } finally {
         setLoading(false);
       }
     };
   
     fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-cermaon text-gray-900">Appointment History</h1>
          <p className="text-gray-600 mt-2">
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading history...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && history.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No History Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Once you create, update, or cancel appointments, all activities will appear here.
            </p>
          </div>
        )}

        {/* History Feed */}
        {!loading && history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="space-y-8">
                {history.map((log, index) => (
                  <HistoryItem
                    key={log.id || index}
                    log={log}
                    isLast={index === history.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}