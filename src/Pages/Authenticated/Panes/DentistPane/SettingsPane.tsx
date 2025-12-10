import React, { useEffect, useState } from "react";
import { getDentistData } from "@/API/Authenticated/GetDentist";
import { Plus, Save, Trash2, RefreshCw, Calendar, Clock, X, User, Mail, Shield } from "lucide-react";
import { updateSettingsDentist } from "@/API/Authenticated/Dentist/SettingsApi";
import SettingsService from "./SettingsService";
import Alert from '@/components/_myComp/Alerts';

export function SettingsPane() {
  const [dentistInfo, setDentistInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [alert, setAlert] = useState({ 
       show: false, 
       type: "info", 
       title: "", 
       message: "" 
     });

  const transformScheduleData = (apiSchedules: any[]) => {
    const groupedByDay: { [key: string]: any } = {};

    apiSchedules.forEach((schedule) => {
      const day = schedule.day_of_week;
      if (!groupedByDay[day]) {
        groupedByDay[day] = {
          day_of_week: day,
          dentistID: schedule.dentistID,
          time_slots: [],
        };
      }

      groupedByDay[day].time_slots.push({
        id: schedule.scheduleID,
        scheduleID: schedule.scheduleID,
        time: schedule.time_slot,
      });
    });

    return Object.values(groupedByDay);
  };

  const convertToApiFormat = (groupedSchedules: any[]) => {
    const apiSchedules: any[] = [];

    groupedSchedules.forEach((daySchedule) => {
      daySchedule.time_slots.forEach((timeSlot: any) => {
        apiSchedules.push({
          scheduleID: timeSlot.scheduleID || null,
          day_of_week: daySchedule.day_of_week,
          time_slot: timeSlot.time,
          dentistID: dentistInfo?.id,
        });
      });
    });

    return apiSchedules;
  };

  const fetchDentist = async (forceRefresh = false) => {
    try {
      setLoading(true);
      if (forceRefresh) setRefreshing(true);

      const result = await getDentistData();
      console.log("Fetched dentist data:", result);

      if (result?.status === "ok") {
        setDentistInfo(result.dentist);

        const transformedSchedules = transformScheduleData(result.schedule || []);
        setSchedules(transformedSchedules);

        localStorage.setItem(
          "loginedDentist",
          JSON.stringify({
            dentist: result.dentist,
            // user: userInfoBase.user,
            schedule: result.schedule,
          }),
        );
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
      setUserInfo(parsed.user || null);

      const transformedSchedules = transformScheduleData(parsed.schedule || []);
      setSchedules(transformedSchedules);
      setLoading(false);
    } else {
      fetchDentist();
    }
  }, []);

  const handleRefresh = async () => {
    localStorage.removeItem("loginedDentist");
    await fetchDentist(true);
  };

  const handleEditDay = (index: number, day: string) => {
    const updated = [...schedules];
    updated[index].day_of_week = day;
    setSchedules(updated);
  };

  const handleAddTimeSlot = (dayIndex: number) => {
    const updated = [...schedules];
    if (!updated[dayIndex].time_slots) updated[dayIndex].time_slots = [];
    updated[dayIndex].time_slots.push({
      id: Date.now() + Math.random(),
      time: "09:00-10:00",
    });
    setSchedules(updated);
  };

  const handleEditTimeSlot = (dayIndex: number, timeIndex: number, value: string) => {
    const updated = [...schedules];
    updated[dayIndex].time_slots[timeIndex].time = value;
    setSchedules(updated);
  };

  const handleDeleteTimeSlot = (dayIndex: number, timeIndex: number) => {
    const updated = [...schedules];
    updated[dayIndex].time_slots.splice(timeIndex, 1);
    if (updated[dayIndex].time_slots.length === 0) updated.splice(dayIndex, 1);
    setSchedules(updated);
  };

  const handleAddSchedule = () => {
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const existingDays = schedules.map((s) => s.day_of_week);
    const availableDays = allDays.filter((day) => !existingDays.includes(day));

    if (availableDays.length === 0) return alert("All days already have schedules!");

    const newSchedule = {
      dentistID: dentistInfo?.id,
      day_of_week: availableDays[0],
      time_slots: [{ id: Date.now(), time: "09:00-10:00" }],
    };
    setSchedules([...schedules, newSchedule]);
  };

  const handleDeleteSchedule = (index: number) => {
    const updated = schedules.filter((_, i) => i !== index);
    setSchedules(updated);
  };

  const handleSaveChanges = async () => {
    try {
      if (!dentistInfo?.id) throw new Error("Dentist info missing");

      const apiFormat = convertToApiFormat(schedules);
      console.log("Saving schedules:", apiFormat);

      const res = await updateSettingsDentist(apiFormat);

      if (res.status === "ok") {
        localStorage.setItem(
          "loginedDentist",
          JSON.stringify({ dentist: dentistInfo, user: userInfo, schedule: apiFormat }),
        );
        
        
         setAlert({
                  show: true,
                  type: "success", // success, error, warning, info
                  title: "Saved Successfully",
                  message: "Schedule Save Successfully"
                });
        

      } else {
        console.error("Failed to save schedules:", res);
      }
    } catch (err) {
      console.error("Error saving schedules:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
        <span className="text-gray-500 text-sm font-medium">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8 font-ceramon text-slate-900">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold font-ceramon text-slate-900">Weekly Schedule</h1>
          <p className="text-slate-500 mt-1">Manage your profile details and availability.</p>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      

      {/* Schedule Management Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Weekly Schedule</h2>
              <p className="text-xs text-slate-500">Define your availability slots.</p>
            </div>
          </div>
          
          <button
            onClick={handleAddSchedule}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Availability
          </button>
        </div>

        <div className="p-6 bg-slate-50/30 min-h-[300px]">
          {schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <Calendar className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No schedules configured.</p>
              <p className="text-xs text-slate-400">Click "Add Availability" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {schedules.map((sched, dayIndex) => (
                <div key={dayIndex} className="bg-white rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-100 group">
                  
                  {/* Card Header: Day Selector */}
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <select
                        value={sched.day_of_week}
                        onChange={(e) => handleEditDay(dayIndex, e.target.value)}
                        className="bg-transparent font-bold text-slate-700 focus:outline-none focus:ring-0 cursor-pointer hover:text-indigo-600 transition-colors"
                      >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                          <option 
                            key={day} 
                            value={day}
                            disabled={schedules.some((s, i) => i !== dayIndex && s.day_of_week === day)}
                          >
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleAddTimeSlot(dayIndex)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Add Time Slot"
                      >
                        <Plus size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSchedule(dayIndex)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove Day"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {sched.time_slots?.map((timeSlot: any, timeIndex: number) => (
                      <div key={timeSlot.id} className="relative flex items-center">
                        <div className="absolute left-3 text-slate-400 pointer-events-none">
                          <Clock size={14} />
                        </div>
                        <input
                          type="text"
                          value={timeSlot.time}
                          onChange={(e) => handleEditTimeSlot(dayIndex, timeIndex, e.target.value)}
                          className="w-full pl-9 pr-8 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                          placeholder="09:00-10:00"
                        />
                        <button
                          onClick={() => handleDeleteTimeSlot(dayIndex, timeIndex)}
                          className="absolute right-2 p-1 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                        onClick={() => handleAddTimeSlot(dayIndex)}
                        className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-400 border border-dashed border-slate-300 rounded-lg hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all"
                    >
                        <Plus size={14} /> Add Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Footer */}
        {schedules.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveChanges}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        )}
      </div>

      {/* Additional Settings Component */}
      <SettingsService /> 
      
      
      <Alert 
                      isOpen={alert.show} 
                      type={alert.type}
                      title={alert.title}
                      message={alert.message}
                      onClose={() => setAlert({ ...alert, show: false })} 
                    />
        

    </div>
  );
}