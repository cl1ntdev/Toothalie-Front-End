import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDentistData } from "@/API/Authenticated/GetDentist";
import { Plus, Save, Trash2, RefreshCw, Calendar, Clock } from "lucide-react";

export function SettingsPane() {
  const [dentistInfo, setDentistInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);
  const { id } = useParams();

  const fetchDentist = async (forceRefresh = false) => {
    try {
      setLoading(true);
      if (forceRefresh) setRefreshing(true);

      const result = await getDentistData(id);
      if (result?.status === "ok") {
        setDentistInfo(result.dentist);
        setSchedules(result.schedule);
        localStorage.setItem("loginedDentist", JSON.stringify(result));
      }
    } catch (err) {
      console.error("Error fetching dentist:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem("loginedDentist");
    if (cached) {
      const parsed = JSON.parse(cached);
      setDentistInfo(parsed.dentist);
      setSchedules(parsed.schedule);
      setLoading(false);
    } else {
      fetchDentist();
    }
  }, [id]);

  const handleEditSchedule = (index: number, field: string, value: string) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const handleAddSchedule = () => {
    const newSchedule = {
      scheduleID: Date.now(),
      dentistID: dentistInfo?.dentistID,
      day_of_week: "Saturday",
      time_slot: "09:00 - 10:00 AM",
    };
    setSchedules([...schedules, newSchedule]);
  };

  const handleDeleteSchedule = (index: number) => {
    const updated = schedules.filter((_, i) => i !== index);
    setSchedules(updated);
  };

  const handleSaveChanges = async () => {
    // TODO: Add backend API call here
    console.log("Saving schedules:", schedules);
    alert("Schedules updated (not yet saved to backend)");
  };

  const handleRefresh = async () => {
    localStorage.removeItem("loginedDentist");
    await fetchDentist(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-3"></div>
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-medium text-gray-900 mb-2">Settings</h1>
        <div className="w-12 h-0.5 bg-gray-200"></div>
      </div>

      {/* dentist informtiaon  */}
      {dentistInfo && (
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-3">{dentistInfo.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
            <p className="break-all">Email: {dentistInfo.email}</p>
            <p>Specialty: {dentistInfo.specialty}</p>
            <p className="sm:col-span-2">Experience: {dentistInfo.experience}</p>
          </div>
        </div>
      )}

      {/* Dentist schedule */}
      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-lg font-medium text-gray-900">Schedules</h2>
          <div className="flex gap-2 self-end sm:self-auto">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Refresh schedules"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleAddSchedule}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="sm:block hidden">Add Schedule</span>
              <span className="sm:hidden block">Add</span>
            </button>
          </div>
        </div>

        {schedules.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">No schedules found</p>
        )}

        {/* Add schedule */}
        <div className="space-y-3">
          {schedules.map((sched, index) => (
            <div
              key={sched.scheduleID}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select
                  value={sched.day_of_week}
                  onChange={(e) =>
                    handleEditSchedule(index, "day_of_week", e.target.value)
                  }
                  className="w-full border-none bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded py-1"
                >
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={sched.time_slot}
                  onChange={(e) =>
                    handleEditSchedule(index, "time_slot", e.target.value)
                  }
                  className="w-full border-none bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1"
                  placeholder="09:00 - 10:00 AM"
                />
              </div>

              <div className="flex justify-end sm:justify-center sm:w-10">
                <button
                  onClick={() => handleDeleteSchedule(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete schedule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {schedules.length > 0 && (
          <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleSaveChanges}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors w-full sm:w-auto justify-center"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="h-4 sm:h-0"></div>
    </div>
  );
}