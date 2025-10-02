import React, { useEffect, useState } from "react";
import getAllDentist from "@/API/Authenticated/GetDentist";
import SubmitAppointment from "@/API/Authenticated/appointment/SubmitAppointment";

export default function AppointmentModal({ onClose, onSuccess }) {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickDentist, setPickDentist] = useState("");
  const [pickDay, setPickDay] = useState("");
  const [pickTime, setPickTime] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        setLoading(true);
        const res = await getAllDentist();
        if (res.status === "ok" && res.dentists) {
          setDentists(res.dentists);
        }
      } catch (error) {
        setError("Failed to load dentists.");
      } finally {
        setLoading(false);
      }
    };
    fetchDentists();
  }, []);

  const handleSubmit = async () => {
    const userID = localStorage.getItem("userID");
    console.log(userID, pickDentist, pickDay, pickTime)
    if (userID && pickDentist && pickDay && pickTime) {
      const response = await SubmitAppointment(userID, pickDentist, pickDay, pickTime);
      console.log(response)
      if (response.ok == true) {
        onClose();
        onSuccess()
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <h2 className="text-lg font-semibold">Book Appointment</h2>
          <button onClick={onClose} className="text-xl hover:text-gray-300" aria-label="Close">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : dentists.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No dentists available.</div>
          ) : (
            <div className="space-y-4">
              {dentists.map((dentist) => (
                <div
                  key={dentist.dentistID}
                  className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                >
                  {/* Dentist Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      DR
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{dentist.name}</h3>
                      <p className="text-sm text-gray-600">{dentist.specialty}</p>
                    </div>
                    {pickDentist === dentist.dentistID && pickDay && pickTime && (
                      <span className="ml-auto text-green-600 text-sm font-medium">Selected ✓</span>
                    )}
                  </div>

                  {/* Schedule */}
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Available Schedule:</h4>
                    {dentist.schedule && Object.keys(dentist.schedule).length > 0 ? (
                      <div className="space-y-2">
                        {Object.keys(dentist.schedule).map((day) => (
                          <div key={day} className="flex flex-col">
                            <button
                              onClick={() => {
                                setPickDentist(dentist.dentistID);
                                setPickDay(day);
                                setPickTime("");
                                setError(null);
                              }}
                              className={`text-left text-sm font-medium ${
                                pickDentist === dentist.dentistID && pickDay === day
                                  ? "text-blue-600"
                                  : "text-gray-700 hover:text-blue-500"
                              }`}
                            >
                              {day}
                            </button>
                            <div className="flex flex-wrap gap-2 ml-4">
                              {dentist.schedule[day]?.map((time) => (
                                <button
                                  key={time}
                                  onClick={() => {
                                    setPickDentist(dentist.dentistID);
                                    setPickDay(day);
                                    setPickTime(time);
                                    setError(null);
                                  }}
                                  className={`px-2 py-1 rounded text-xs border ${
                                    pickDentist === dentist.dentistID &&
                                    pickDay === day &&
                                    pickTime === time
                                      ? "bg-green-500 text-white border-green-500"
                                      : "bg-white border-gray-300 hover:bg-green-50"
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">No schedule available</div>
                    )}
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={pickDentist !== dentist.dentistID || !pickDay || !pickTime}
                    className={`w-full py-2 rounded-lg text-white font-medium ${
                      pickDentist === dentist.dentistID && pickDay && pickTime
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Book with Dr. {dentist.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}