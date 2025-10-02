import React, { useState, useEffect } from "react";
import { FetchEditAppointmentDetailsAPI, UpdateAppointment } from "@/API/Authenticated/appointment/EditAppointmentAPI";

type EditModalProps = {
  appointmentID: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditModal({
  onClose,
  onSuccess,
  appointmentID,
}: EditModalProps) {
  const [loading, setLoading] = useState(true);
  const [appointmentInfo, setAppointmentInfo] = useState<any>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!appointmentID) return;

        const data = await FetchEditAppointmentDetailsAPI(appointmentID);
        setAppointmentInfo(data);

        // set default schedule
        setSelectedSchedule(
          data.scheduleDetails?.scheduleID?.toString() || ""
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appointmentID]);

  const handleSave = () => {
    console.log("Saving with:", {
      schedule: selectedSchedule,
    });
    UpdateAppointment(appointmentID,selectedSchedule)

    onSuccess();
    onClose();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-md w-96 text-center">
          <p className="text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (!appointmentInfo) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-[450px]">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Edit Appointment
        </h2>

        {/* Dentist info (read-only) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-1">Dentist</label>
          <input
            type="text"
            value={`${appointmentInfo.dentist.name} (${appointmentInfo.dentist.specialty})`}
            disabled
            className="w-full p-2 border rounded-lg bg-gray-100 text-gray-700"
          />
        </div>

        {/* Schedule Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-1">Schedule</label>
          <select
            value={selectedSchedule}
            onChange={(e) => setSelectedSchedule(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            {Object.entries(appointmentInfo.schedules).map(
              ([day, slots]: any) => (
                <optgroup key={day} label={day}>
                  {slots.map((slot: any) => (
                    <option key={slot.scheduleID} value={slot.scheduleID}>
                      {slot.time_slot}
                    </option>
                  ))}
                </optgroup>
              )
            )}
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
