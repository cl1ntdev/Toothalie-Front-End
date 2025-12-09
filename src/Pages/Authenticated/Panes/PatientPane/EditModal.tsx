import React, { useState, useEffect } from "react";
import {
  FetchEditAppointmentDetailsAPI,
  UpdateAppointment,
} from "@/API/Authenticated/appointment/EditAppointmentAPI";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  X,
  Stethoscope,
  Clock,
  AlertTriangle,
  Users,
  CheckCircle2,
  Loader2 // Using Loader2 for consistency with standard UI, can swap for Activity
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type EditModalProps = {
  appointmentID: string | null;
  onClose: () => void;
  onSuccessEdit: () => void;
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
  onSuccessEdit,
  appointmentID,
}: EditModalProps) {
  const [loading, setLoading] = useState(true);
  const [appointmentInfo, setAppointmentInfo] = useState<any>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [isFamilyBooking, setIsFamilyBooking] = useState(false);
  const [date, setDate] = useState<Date>();
  const [day, setDay] = useState("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!appointmentID) return;

        const data = await FetchEditAppointmentDetailsAPI(appointmentID);
        setDate(new Date(data.appointment.user_set_date));
        setDay(data.appointment.day_of_week);
        
        if (data.appointment) {
          setIsEmergency(data.appointment.emergency === 1);
          setIsFamilyBooking(data.appointment.appointment_type_id === 2);
          setMessage(data.appointment.message || "");
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
    setDate(undefined); // Reset date when slot changes to force re-selection
  };

  const handleSave = async () => {
    try {
      const res = await UpdateAppointment(
        appointmentID,
        selectedSchedule,
        date,
        isEmergency,
        isFamilyBooking,
        message
      );
      if (res.status == 'ok') {
        onSuccessEdit();
        onClose();
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!appointmentInfo) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-ceramon leading-tight">
              Reschedule Appointment
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Update time, date, or details</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Dentist Info Card */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dentist</p>
              <p className="text-slate-900 font-bold text-lg leading-tight">
                {appointmentInfo.dentist.name}
              </p>
              <p className="text-sm text-slate-500 font-medium">
                {appointmentInfo.dentist.specialty}
              </p>
            </div>
          </div>

          {/* Appointment Type */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Appointment Type
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <label 
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${isEmergency ? 'bg-rose-50 border-rose-200 ring-1 ring-rose-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
              >
                <Checkbox
                  id="emergency"
                  checked={isEmergency}
                  onCheckedChange={(checked) => setIsEmergency(checked === true)}
                  className={`data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600`}
                />
                <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className={isEmergency ? "text-rose-600" : "text-slate-400"} />
                    <span className={`text-sm font-medium ${isEmergency ? 'text-rose-700' : 'text-slate-700'}`}>Emergency</span>
                </div>
              </label>

              <label 
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${isFamilyBooking ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
              >
                <Checkbox
                  id="family-booking"
                  checked={isFamilyBooking}
                  onCheckedChange={(checked) => setIsFamilyBooking(checked === true)}
                  className={`data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600`}
                />
                <div className="flex items-center gap-2">
                    <Users size={16} className={isFamilyBooking ? "text-purple-600" : "text-slate-400"} />
                    <span className={`text-sm font-medium ${isFamilyBooking ? 'text-purple-700' : 'text-slate-700'}`}>Family</span>
                </div>
              </label>
            </div>
          </div>

          {/* Time Slots */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Available Slots
            </Label>
            <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-4 max-h-48 overflow-y-auto custom-scrollbar">
              {Object.keys(appointmentInfo.schedules).map((dayOfWeek, index) => (
                <div key={index}>
                  <h3 className="font-bold text-slate-700 text-xs mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    {dayOfWeek}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {appointmentInfo.schedules[dayOfWeek].map(
                      (schedule: any, slotIndex: number) => {
                        const isSelected = selectedSchedule === schedule.scheduleID.toString();
                        return (
                          <button
                            key={slotIndex}
                            onClick={() => handleTimeSlotSelect(schedule.scheduleID.toString(), dayOfWeek)}
                            className={`
                              relative px-3 py-2 rounded-lg text-xs font-medium transition-all border
                              ${isSelected 
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200" 
                                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                              }
                            `}
                          >
                            {isSelected && <CheckCircle2 size={12} className="absolute -top-1 -right-1 text-white bg-indigo-600 rounded-full" />}
                            <span className="flex items-center gap-1.5">
                                <Clock size={12} className={isSelected ? "text-indigo-200" : "text-slate-400"} />
                                {schedule.time_slot}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Message */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!selectedSchedule}
                    className={`w-full justify-start text-left font-normal h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 ${
                      !selectedSchedule && "opacity-50 cursor-not-allowed bg-slate-50"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    {date ? (
                        <span className="text-slate-900 font-medium">{date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
                    ) : (
                        <span className="text-slate-400">Pick a date...</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-slate-100" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={disableDates}
                    initialFocus
                    className="p-3 bg-white rounded-xl"
                  />
                </PopoverContent>
              </Popover>
              {selectedSchedule && !date && (
                 <p className="text-[10px] text-amber-600 font-medium ml-1">Please select a valid {day} date.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Message</Label>
              <textarea
                value={message}
                placeholder="Any specific requests or symptoms?"
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 h-11 rounded-xl border-slate-200 hover:bg-white hover:text-slate-900 font-medium text-slate-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedSchedule || !date}
            className={`flex-1 h-11 rounded-xl font-bold text-white shadow-lg transition-all ${
              !selectedSchedule || !date
                ? "bg-slate-300 shadow-none cursor-not-allowed text-slate-500"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 active:scale-[0.98]"
            }`}
          >
            Confirm Changes
          </Button>
        </div>
      </div>
    </div>
  );
}