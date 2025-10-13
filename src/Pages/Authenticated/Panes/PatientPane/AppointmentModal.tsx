"use client";

import React, { useEffect, useState } from "react";
import getAllDentist from "@/API/Authenticated/GetDentist";
import SubmitAppointment from "@/API/Authenticated/appointment/SubmitAppointment";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type AppointmentProps = {
  onClose: () => void;
  // onSuccess: () => void;
  appointmentSuccess: () => void
}

export default function AppointmentModal({ onClose, appointmentSuccess }: AppointmentProps) {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickDentist, setPickDentist] = useState("");
  const [pickDay, setPickDay] = useState("");
  const [pickTime, setPickTime] = useState("");
  const [error, setError] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isFamilyBooking, setIsFamilyBooking] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [isDatePicked, setIsDatePicked] = useState<boolean>(false);
  const [message,setMessage] = useState<string>("")
  
  
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

  const getDayIndex = (day: string) => {
    const map: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    return map[day] ?? -1;
  };

  const disableDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDayIndex = getDayIndex(pickDay);
    const dayMatches =
      selectedDayIndex === -1 || date.getDay() === selectedDayIndex;

    return !dayMatches || date < today;
  };

  const handleSubmit = async () => {
    const userID = localStorage.getItem("userID");

    if (!userID || !pickDentist || !pickDay || !pickTime || !date) {
      setError("Please complete all fields before booking.");
      return;
    }

    const formattedDate = date ? date.toLocaleDateString("en-CA") : null;

    const response = await SubmitAppointment(
      userID,
      pickDentist,
      pickDay,
      pickTime,
      isEmergency,
      isFamilyBooking,
      formattedDate,
      message
    );

    if (response.ok === true) {
      onClose();
      appointmentSuccess()
    } else {
      setError("Failed to submit appointment. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header section */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Book Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Booking types */}
        <div className="p-4 space-y-3 border-b">
          <div className="flex items-center gap-2">
            <Checkbox
              id="emergency"
              checked={isEmergency}
              onCheckedChange={(checked) => setIsEmergency(checked === true)}
            />
            <label htmlFor="emergency" className="text-sm cursor-pointer">
              Emergency Appointment
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="family-booking"
              checked={isFamilyBooking}
              onCheckedChange={(checked) => setIsFamilyBooking(checked === true)}
            />
            <label htmlFor="family-booking" className="text-sm cursor-pointer">
              Family Booking
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-2 rounded text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : dentists.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No dentists available.
            </div>
          ) : (
            // Map all the dentist and give there schedule as choices
            <div className="space-y-4">
              {dentists.map((dentist) => (
                <div
                  key={dentist.dentistID}
                  className="border rounded-lg p-4 space-y-3"
                >
                  {/* Dentist Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      DR
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{dentist.name}</h3>
                      <p className="text-sm text-gray-600">{dentist.specialty}</p>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Available Schedule:</h4>
                    {/* check fi there are schedules */}
                    {dentist.schedule && Object.keys(dentist.schedule).length > 0 ? (
                      <div className="space-y-2">
                        {/* map the keys and there ability time */}
                        {Object.keys(dentist.schedule).map((day) => (
                          <div key={day}>
                            <button
                              onClick={() => {
                                setPickDentist(dentist.dentistID);
                                setPickDay(day);
                                setPickTime("");
                                setError(null);
                              }}
                              className={`text-sm ${
                                pickDentist === dentist.dentistID && pickDay === day
                                  ? "text-blue-600 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {day}
                            </button>
                            <div className="flex flex-wrap gap-1 mt-1 ml-3">
                              {dentist.schedule[day]?.map((time) => (
                                <button
                                  key={time}
                                  onClick={() => {
                                    setDate(undefined);
                                    setPickDentist(dentist.dentistID);
                                    setPickDay(day);
                                    setPickTime(time);
                                    setIsDatePicked(true);
                                    setError(null);
                                  }}
                                  className={`px-2 py-1 rounded text-xs border ${
                                    pickDentist === dentist.dentistID &&
                                    pickDay === day &&
                                    pickTime === time
                                      ? "bg-blue-600 text-white border-blue-600"
                                      : "bg-white border-gray-300"
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Calendar Picker and Message of the user */}
                        {isDatePicked && pickDentist === dentist.dentistID && (
                          <div className="space-y-2 mt-3">
                            
                            <Label className="text-sm">Select Date</Label>
                            <Popover
                              open={activePopover === dentist.dentistID}
                              onOpenChange={(isOpen) =>
                                setActivePopover(isOpen ? dentist.dentistID : null)
                              }
                            >
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                  {date ? date.toLocaleDateString() : "Select date"}
                                  <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={(date) => {
                                    setDate(date);
                                    setActivePopover(null);
                                  }}
                                  disabled={disableDates}
                                />
                              </PopoverContent>
                            </Popover>
                            <div className="space-y-1">
                              <label className="text-xs text-gray-600 block">Message</label>
                              <input 
                                placeholder="What's the issue?"
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <p className="text-xs text-gray-400">This message will be sent to the dentist</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No available schedule.</p>
                    )}
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={
                      pickDentist !== dentist.dentistID ||
                      !pickDay ||
                      !pickTime ||
                      !date
                    }
                    className={`w-full py-2 rounded text-sm font-medium ${
                      pickDentist === dentist.dentistID &&
                      pickDay &&
                      pickTime &&
                      date
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isEmergency ? "Book Emergency" : "Book Appointment"}
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