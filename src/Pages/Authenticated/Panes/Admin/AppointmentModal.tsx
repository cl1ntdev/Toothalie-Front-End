import React from "react";
import { X, Calendar } from "lucide-react";

export default function AppointmentModal({
  currentAppointment,
  users,
  allSchedules,
  allServices,
  selectedDentistId,
  setSelectedDentistId,
  selectedScheduleId,
  setSelectedScheduleId,
  selectedScheduleDay,
  setSelectedScheduleDay,
  availableSchedules,
  availableServices,
  handleDentistChange,
  handleFormSubmit,
  handleModalClose,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      dentist_id: selectedDentistId,
      schedule_id: selectedScheduleId,
      service_id: e.target.service_id.value,
      date: e.target.date.value,
      notes: e.target.notes.value,
    };
    handleFormSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={handleModalClose}></div>
      <form onSubmit={handleSubmit} className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{currentAppointment ? "Edit Appointment" : "New Appointment"}</h2>
          <button type="button" onClick={handleModalClose} className="text-gray-400 hover:text-gray-700"><X /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Dentist</label>
            <select value={selectedDentistId || ""} onChange={handleDentistChange} className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm">
              {users.filter(u => u.roles.includes("ROLE_DENTIST")).map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Schedule</label>
            <select value={selectedScheduleId || ""} onChange={e => setSelectedScheduleId(e.target.value)} className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm">
              {availableSchedules.map(s => (
                <option key={s.scheduleID} value={s.scheduleID}>
                  {s.day_of_week} • {s.start_time} - {s.end_time}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Service</label>
            <select name="service_id" className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm">
              {availableServices.map(s => (
                <option key={s.serviceID} value={s.serviceID}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" name="date" defaultValue={currentAppointment?.appointment_date || ""} className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea name="notes" defaultValue={currentAppointment?.message || ""} className="mt-1 block w-full border rounded-lg px-3 py-2 text-sm" rows={3} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={handleModalClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{currentAppointment ? "Update" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}
