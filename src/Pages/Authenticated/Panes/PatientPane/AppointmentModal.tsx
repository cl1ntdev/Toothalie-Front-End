import React from "react";

type Props = {
  onClose: () => void;
};

export default function AppointmentModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        {/* Modal Content */}
        <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Select Dentist</label>
            <select className="w-full mt-1 p-2 border rounded-lg">
              <option>Dr. Smith</option>
              <option>Dr. Lee</option>
              <option>Dr. Garcia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Time</label>
            <input
              type="time"
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            Confirm Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
