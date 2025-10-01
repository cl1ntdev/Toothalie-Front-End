import React, { useEffect, useState } from "react";
import DentistClass from "@/Classes/Authenticated/DentistClass";
import getAllDentist from "@/API/Authenticated/GetDentist";

type Props = {
  onClose: () => void;
};

export default function AppointmentModal({ onClose }: Props) {
  const [dentists, setDentists] = useState<DentistClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState<Record<number, string>>({});
  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const res = await getAllDentist();
        console.log(res)
        
        if (res.status === "ok" && res.dentists) {
          setDentists(res.dentists);
        }
      } catch (error) {
        console.error("Error fetching dentists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDentists();
  }, []);
  
  useEffect(()=>{
    console.log(dentists)
  },[dentists])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
    
        {/* MAIN MODAL CONTENT */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Book an Appointment
        </h2>
    
        {loading ? (
          <p className="text-gray-500">Loading dentists...</p>
        ) : dentists.length === 0 ? (
          <p className="text-red-500">No dentists available.</p>
        ) : (
          <div className="space-y-4">
            {dentists.map((den, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                {/* Dentist Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {/* Placeholder Image */}
                    <span className="text-sm">Photo</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-blue-600">
                      {den.name}
                    </h3>
                    <p className="text-sm text-gray-600">{den.specialty}</p>
                    <p className="text-sm text-gray-600">
                      {den.experience} experience
                    </p>
                    <p className="text-sm text-gray-600">{den.email}</p>
                  </div>
                </div>
    
                {/* Schedule */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Available Times:
                  </h4>
                  {den.schedule ? (
                    <div className="space-y-2">
                      {Object.entries(den.schedule).map(([day, times]) => (
                        <div key={day}>
                          <span className="font-semibold">{day}:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Array.isArray(times) && times.length > 0 ? (
                              times.map((time, i) => (
                                <button
                                  key={i}
                                  className={`px-3 py-1 text-sm border rounded-md transition
                                    ${
                                      selectedTimes[index] === time
                                        ? "border-blue-500 bg-blue-100 text-blue-700" // selected style
                                        : "hover:bg-blue-100 hover:border-blue-400 border-gray-300 text-gray-700" // default style
                                    }`}
                                  onClick={() => {
                                    setSelectedTimes((prev) => ({ ...prev, [index]: time }));
                                    console.log(`Selected ${time} with ${den.name}`);
                                  }}
                                >
                                  {time}
                                </button>

                              ))
                            ) : (
                              <span className="text-gray-500 ml-2">No times</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No schedule available.
                    </p>
                  )}
                </div>
    
                {/* Book Button */}
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm w-full">
                  Book with {den.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
}
