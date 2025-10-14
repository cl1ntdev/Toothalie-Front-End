import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDentistData } from "@/API/Authenticated/GetDentist";
import { Plus, Save, Trash2, RefreshCw, Calendar, Clock, X } from "lucide-react";
import { updateSettingsDentist } from "@/API/Authenticated/Dentist/SettingsApi";
import Alert from "@/components/_myComp/Alerts";
export function SettingsPane() {
  const [dentistInfo, setDentistInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);
  const { id } = useParams();

  // map response multiple days ex. 2 mondays 5 timeslot -> 1 monday 5 timeslot
 //  {
	// "schedule": [
	// 	{
	// 		"scheduleID": 1,
	// 		"day_of_week": "Monday",
	// 		"time_slot": "09:00 - 10:00 AM",
	// 		"dentistID": 1
	// 	},
	// 	{
	// 		"scheduleID": 2,
	// 		"day_of_week": "Monday",
	// 		"time_slot": "10:00 - 11:00 AM",
	// 		"dentistID": 1
	// 	}
	// ]
 //  }
 
 // CONVERTED TO
 
 // 0: Object { scheduleID: "day-Monday", day_of_week: "Monday", dentistID: 1, … }
 // day_of_week: "Monday"
 // time_slots: Array [ {…}, {…} ] ​​​
 // 0: Object { id: 1, scheduleID: 1, time: "09:00 - 10:00 AM" }
 // 1: Object { id: 2, scheduleID: 2, time: "10:00 - 11:00 AM" }
 // length: 2
 
  const transformScheduleData = (apiSchedules: any[]) => {
    const groupedByDay: { [key: string]: any } = {};
    
    apiSchedules.forEach((schedule) => {
      const day = schedule.day_of_week;
      if (!groupedByDay[day]) {
        groupedByDay[day] = {
          day_of_week: day,
          dentistID: schedule.dentistID,
          time_slots: []
        };
      }
      
      groupedByDay[day].time_slots.push({
        id: schedule.scheduleID,
        scheduleID: schedule.scheduleID,
        time: schedule.time_slot,
        // originalData: schedule
      });
    });
    
    return Object.values(groupedByDay);
  };

  // convert modified scheulde to the api format ex. 1 monday 5 timeslot -> 2(original) monday 5 timeslot
  const convertToApiFormat = (groupedSchedules: any[]) => {
    const apiSchedules: any[] = [];
    
    groupedSchedules.forEach((daySchedule) => {
      daySchedule.time_slots.forEach((timeSlot: any) => {
        apiSchedules.push({
          scheduleID: timeSlot.scheduleID || timeSlot.id,
          day_of_week: daySchedule.day_of_week,
          time_slot: timeSlot.time,
          dentistID: daySchedule.dentistID
        });
      });
    });
    
    return apiSchedules;
  };

  const fetchDentist = async (forceRefresh = false) => {
    try {
      setLoading(true);
      if (forceRefresh) setRefreshing(true);

      const result = await getDentistData(`${id}?t=${Date.now()}`);
      if (result?.status === "ok") {
        console.log("API Response:", result);
        setDentistInfo(result.dentist);
        
        // transform the schedule data to group by day
        const transformedSchedules = transformScheduleData(result.schedule || []);
        console.log("Transformed Schedules:", transformedSchedules);
        
        setSchedules(transformedSchedules);
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
      
      // transform cached data as well base on system
      const transformedSchedules = transformScheduleData(parsed.schedule || []);
      setSchedules(transformedSchedules);
      setLoading(false);
    } else {
      fetchDentist();
    }
  }, [id]);

  const handleEditDay = (index: number, day: string) => {
    const updated = [...schedules];
    updated[index].day_of_week = day;
    setSchedules(updated);
  };

  const handleAddTimeSlot = (dayIndex: number) => {
    const updated = [...schedules];
    if (!updated[dayIndex].time_slots) {
      updated[dayIndex].time_slots = [];
    }
    updated[dayIndex].time_slots.push({
      id: Date.now() + Math.random(),
      time: "09:00 - 10:00 AM"
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
    
    // If no time slots left, remove the entire day
    if (updated[dayIndex].time_slots.length === 0) {
      updated.splice(dayIndex, 1);
    }
    
    setSchedules(updated);
  };

  const handleAddSchedule = () => {
    // search for available days to add
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const existingDays = schedules.map(s => s.day_of_week);
    const availableDays = allDays.filter(day => !existingDays.includes(day));
    
    if (availableDays.length === 0) {
      alert("All days of the week already have schedules!");
      return;
    }

    // default schedule to be added
    const newSchedule = {
      scheduleID: `new-day-${Date.now()}`,
      dentistID: dentistInfo?.dentistID,
      day_of_week: availableDays[0],
      time_slots: [
        {
          id: Date.now(),
          time: "09:00 - 10:00 AM"
        }
      ]
    };
    setSchedules([...schedules, newSchedule]);
  };

  const handleDeleteSchedule = (index: number) => {
    const updated = schedules.filter((_, i) => i !== index);
    setSchedules(updated);
  };

  const handleSaveChanges = async () => {
    try {
      // Convert back to API format
      const apiFormat = convertToApiFormat(schedules);
      console.log("Saving schedules in API format:", apiFormat);
       const res = await updateSettingsDentist(schedules); 
       if(res.status == 'ok'){
         console.log('saved changes')
         alert("saved changes")
       }
       console.log(res) 
    } catch (error) {
      console.error("Error saving schedules:", error);
    }
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

      {/* dentist information */}
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

      {/* dentist schedule adding section */}
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
              <span className="sm:block hidden">Add Day</span>
              <span className="sm:hidden block">Add Day</span>
            </button>
          </div>
        </div>

        {schedules.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">No schedules found. Click "Add Day" to create a schedule.</p>
        )}

        {/* add schedule days */}
        <div className="space-y-4">
          {schedules.map((sched, dayIndex) => (
            <div
              key={sched.scheduleID}
              className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-2 flex-1">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <select
                    value={sched.day_of_week}
                    onChange={(e) => handleEditDay(dayIndex, e.target.value)}
                    className="border-none bg-transparent text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 rounded py-1"
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

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddTimeSlot(dayIndex)}
                    className="flex items-center gap-2 px-3 py-1 text-xs text-green-600 hover:bg-green-50 rounded-lg border border-green-200 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Time
                  </button>
                  
                  <button
                    onClick={() => handleDeleteSchedule(dayIndex)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete day"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* add time slot while mapping previous existing schedule */}
              <div className="p-4 space-y-3">
                {sched.time_slots?.map((timeSlot: any, timeIndex: number) => (
                  <div
                    key={timeSlot.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={timeSlot.time}
                        onChange={(e) => handleEditTimeSlot(dayIndex, timeIndex, e.target.value)}
                        className="w-full border-none bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 border border-gray-200"
                        placeholder="09:00 - 10:00 AM"
                      />
                    </div>

                    <div className="flex justify-end sm:justify-center">
                      <button
                        onClick={() => handleDeleteTimeSlot(dayIndex, timeIndex)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete time slot"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {(!sched.time_slots || sched.time_slots.length === 0) && (
                  <p className="text-gray-400 text-sm text-center py-2">
                    No time slots added. Click "Add Time" to add availability.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {schedules.length > 0 && (
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
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