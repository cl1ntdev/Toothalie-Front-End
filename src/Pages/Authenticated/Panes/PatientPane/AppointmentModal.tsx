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

export default function AppointmentModal({ onClose, onSuccess }) {
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

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        setLoading(true);
        const res = await getAllDentist();
        if (res.status === "ok" && res.dentists) {
          setDentists(res.dentists);
        }
      } catch (error) {
        setError("Failed to load dentists.", error);
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

    // console.log({
    //   userID,
    //   pickDentist,
    //   pickDay,
    //   pickTime,
    //   isEmergency,
    //   isFamilyBooking,
    //   date: date.toISOString(),
    // });
    const formattedDate = date ? date.toLocaleDateString("en-CA"): null;

    const response = await SubmitAppointment(
      userID,
      pickDentist,
      pickDay,
      pickTime,
      isEmergency,
      isFamilyBooking,
      formattedDate
    );

    if (response.ok === true) {
      onClose();
      onSuccess();
    } else {
      console.log("Failed to submit appointment. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center rounded-t-2xl">
          <h2 className="text-lg font-semibold">Book Appointment</h2>
          <button
            onClick={onClose}
            className="text-xl hover:text-gray-300 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Booking type */}
        <div className="p-5 flex flex-col gap-4 bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-200">
          <div className="flex items-center gap-3">
            <Checkbox
              id="emergency"
              checked={isEmergency}
              onCheckedChange={(checked) => setIsEmergency(checked === true)}
              className="h-6 w-6 border-2 border-red-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <label
              htmlFor="emergency"
              className="cursor-pointer select-none font-medium text-gray-800 text-sm"
            >
              <span className="text-red-600 font-semibold text-base">
                Emergency Appointment
              </span>
              <p className="text-gray-600 text-xs">
                Check this if the case requires urgent attention
              </p>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="family-booking"
              checked={isFamilyBooking}
              onCheckedChange={(checked) => setIsFamilyBooking(checked === true)}
              className="h-6 w-6 border-2 border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <label
              htmlFor="family-booking"
              className="cursor-pointer select-none font-medium text-gray-800 text-sm"
            >
              <span className="text-blue-600 font-semibold text-base">
                Family Booking Appointment
              </span>
              <p className="text-gray-600 text-xs">
                Check this if booking for multiple family members
              </p>
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 p-2 rounded text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : dentists.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No dentists available.
            </div>
          ) : (
            <div className="space-y-6">
              {dentists.map((dentist) => (
                <div
                  key={dentist.dentistID}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all bg-white"
                >
                  {/* Dentist Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      DR
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {dentist.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {dentist.specialty}
                      </p>
                    </div>
                    {pickDentist === dentist.dentistID &&
                      pickDay &&
                      pickTime && (
                        <span className="ml-auto text-green-600 text-sm font-medium">
                          Selected ✓
                        </span>
                      )}
                  </div>

                  {/* Schedule */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Available Schedule:
                    </h4>
                    {dentist.schedule &&
                    Object.keys(dentist.schedule).length > 0 ? (
                      <div className="space-y-2">
                        {Object.keys(dentist.schedule).map((day) => (
                          <div key={day}>
                            <button
                              onClick={() => {
                                setPickDentist(dentist.dentistID);
                                setPickDay(day);
                                setPickTime("");
                                setError(null);
                              }}
                              className={`text-sm font-medium ${
                                pickDentist === dentist.dentistID &&
                                pickDay === day
                                  ? "text-blue-600 underline"
                                  : "text-gray-700 hover:text-blue-500"
                              }`}
                            >
                              {day}
                            </button>
                            <div className="flex flex-wrap gap-2 mt-1 ml-4">
                              {dentist.schedule[day]?.map((time) => (
                                <button
                                  key={time}
                                  onClick={() => {
                                    setDate(undefined)
                                    setPickDentist(dentist.dentistID);
                                    setPickDay(day);
                                    setPickTime(time);
                                    setError(null);
                                  }}
                                  className={`px-3 py-1 rounded-md text-xs border font-medium transition-all ${
                                    pickDentist === dentist.dentistID &&
                                    pickDay === day &&
                                    pickTime === time
                                      ? "bg-green-500 text-white border-green-500"
                                      : "bg-gray-50 border-gray-300 hover:bg-green-50"
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* CALENDAR PICKER */}
                        {(pickTime !== "" || date == undefined) && (
                          <div className="flex flex-col gap-3 mt-4">
                            <Label htmlFor="date" className="px-1">
                              Select Available Date
                            </Label>
                            <Popover
                              open={activePopover === dentist.dentistID}
                              onOpenChange={(isOpen) =>
                                setActivePopover(
                                  isOpen ? dentist.dentistID : null,
                                )
                              }
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date"
                                  className="w-48 justify-between font-normal"
                                >
                                  {date
                                    ? date.toLocaleDateString()
                                    : "Select date"}
                                  <ChevronDownIcon />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  captionLayout="dropdown"
                                  onSelect={(date) => {
                                    setDate(date);
                                    setActivePopover(null);
                                  }}
                                  disabled={disableDates}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No available schedule.
                      </p>
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
                    className={`w-full mt-4 py-2 rounded-lg text-white font-medium transition ${
                      pickDentist === dentist.dentistID &&
                      pickDay &&
                      pickTime &&
                      date
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {isEmergency
                      ? `Book Emergency with Dr. ${dentist.name}`
                      : `Book with Dr. ${dentist.name}`}
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
