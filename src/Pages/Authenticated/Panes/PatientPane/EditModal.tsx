import React, { useState, useEffect } from "react";
import {
  FetchEditAppointmentDetailsAPI,
  UpdateAppointment,
} from "@/API/Authenticated/appointment/EditAppointmentAPI";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Clock, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type EditModalProps = {
  appointmentID: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

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

export default function EditModal({
  onClose,
  onSuccess,
  appointmentID,
}: EditModalProps) {
  const [loading, setLoading] = useState(true);
  const [appointmentInfo, setAppointmentInfo] = useState<any>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [isFamilyBooking, setIsFamilyBooking] = useState(false);
  const [date, setDate] = useState<Date>();
  const [day, setDay] = useState("");
  const [message,setMessage] = useState<string>("")

  useEffect(()=>{
    console.log(appointmentInfo)
    console.log(isEmergency)
    console.log(isFamilyBooking)
  },[appointmentInfo,isEmergency,isFamilyBooking]) // for debugging 
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!appointmentID) return;

        const data = await FetchEditAppointmentDetailsAPI(appointmentID);
        setDate(
          new Date(data.appointment.user_set_date)
        )
       
        setDay(data.appointment.day_of_week)
        if(data.appointment){
          console.log(data.appointment.emergency)
          console.log(data.appointment.appointment_type_id)
          const emergencyCheck = data.appointment.emergency === 1 
          const bookingTypeCheck = data.appointment.appointment_type_id === 2 
          setIsEmergency(emergencyCheck)
          setIsFamilyBooking(bookingTypeCheck)  
          setMessage(data.appointment.message != null ? data.appointment.message : "No message" )
        }
        
        setAppointmentInfo(data);
        if (data.scheduleDetails?.scheduleID) {
          setSelectedSchedule(data.scheduleDetails.scheduleID.toString());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appointmentID]);

  const disableDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date <= today) return true;

    if (!day) return true;

    const dayIndex = getDayIndex(day);
    return date.getDay() !== dayIndex;
  };

  const handleTimeSlotSelect = (scheduleID: string, dayOfWeek: string) => {
    setSelectedSchedule(scheduleID);
    setDay(dayOfWeek);
    setDate(undefined); 
  };

  const handleSave = async () => {
    console.log(appointmentID, selectedSchedule,date,isEmergency,isFamilyBooking,message)
  
    // if (!appointmentID || !selectedSchedule || !date || !isEmergency || !isFamilyBooking || !message) return;

    try {
      await UpdateAppointment(appointmentID, selectedSchedule,date,isEmergency,isFamilyBooking,message);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-80 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!appointmentInfo) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            Reschedule Appointment
          </h2>
        </div>

        <div className="p-4 space-y-4">
          {/* Dentist Info */}
          <div>
            <Label className="text-sm text-gray-700 mb-1 block">Dentist</Label>
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-gray-900 font-medium text-sm">
                {appointmentInfo.dentist.name}
              </p>
              <p className="text-xs text-gray-600">
                {appointmentInfo.dentist.specialty}
              </p>
            </div>
          </div>

          {/* Appointment Type */}
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <Checkbox
                  id="emergency"
                  checked={isEmergency}
                  onCheckedChange={(checked) =>
                    setIsEmergency(checked === true)
                  }
                />
                <label
                  htmlFor="emergency"
                  className="text-xs text-gray-700 cursor-pointer"
                >
                  Emergency
                </label>
              </div>
              <div className="flex items-center gap-1.5">
                <Checkbox
                  id="family-booking"
                  checked={isFamilyBooking}
                  onCheckedChange={(checked) =>
                    setIsFamilyBooking(checked === true)
                  }
                />
                <label
                  htmlFor="family-booking"
                  className="text-xs text-gray-700 cursor-pointer"
                >
                  Family
                </label>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">
              Available Times
            </Label>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {Object.keys(appointmentInfo.schedules).map(
                (dayOfWeek, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900 text-xs mb-1">
                      {dayOfWeek}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {appointmentInfo.schedules[dayOfWeek].map(
                        (schedule: any, slotIndex: number) => (
                          <button
                            key={slotIndex}
                            onClick={() =>
                              handleTimeSlotSelect(
                                schedule.scheduleID.toString(),
                                dayOfWeek
                              )
                            }
                            className={`px-2.5 py-1.5 rounded text-xs border transition-colors ${
                              selectedSchedule ===
                              schedule.scheduleID.toString()
                                ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {schedule.time_slot}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <Label className="text-sm text-gray-700 mb-1 block">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!selectedSchedule}
                  className={`w-full justify-start text-sm h-9 ${
                    !selectedSchedule ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {date ? date.toLocaleDateString() : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={disableDates}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-600 block">Message</label>
            <input 
              value={message}
              placeholder="What's the issue?"
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400">This message will be sent to the dentist</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 border-t">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 text-sm h-9"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedSchedule || !date}
            className={`flex-1 text-sm h-9 text-white ${
              !selectedSchedule || !date
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
