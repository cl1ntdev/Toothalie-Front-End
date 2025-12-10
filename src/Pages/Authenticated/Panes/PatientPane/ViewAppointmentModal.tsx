"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Stethoscope,
  User,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  Bell,
  ArrowRight,
  ChevronLeft,
  CalendarClock,
  MapPin, 
  FileText 
} from "lucide-react";

interface ViewModalProps {
  appointmentData: any;
  onClose: () => void;
}

export default function ViewAppointmentModal({ appointmentData, onClose }: ViewModalProps) {
  const [view, setView] = useState<'details' | 'reminders'>('details');
  console.log(appointmentData)
  if (!appointmentData) return null;

  const { appointment, dentist, schedules } = appointmentData;
  const schedule = schedules.find((s: any) => s.scheduleID === appointment.schedule_id);

  // --- Helper: Format Time to AM/PM ---
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Parse reminders JSON safely
  let reminders: any[] = [];
  try {
    if (appointment?.reminder_info) {
      const parsed = JSON.parse(appointment.reminder_info);
      reminders = Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.error("Failed to parse reminders JSON", e);
  }

  // Date formatting
  const dateObj = new Date(appointment.user_set_date);
  const dateString = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" });
  const yearString = dateObj.getFullYear();

  // Configurations
  const getStatusConfig = (status: string) => ({
    Pending: { icon: Clock, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    Approved: { icon: CheckCircle, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    Rejected: { icon: XCircle, color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" }
  }[status] || { icon: Clock, color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200" });

  const getAppointmentTypeConfig = (typeId: number) => ({
    1: { name: "Normal Visit", icon: User, color: "text-blue-700", bg: "bg-blue-50" },
    2: { name: "Family Visit", icon: Users, color: "text-purple-700", bg: "bg-purple-50" }
  }[typeId] || { name: "Normal Visit", icon: User, color: "text-blue-700", bg: "bg-blue-50" });

  const statusCfg = getStatusConfig(appointment.status);
  const typeCfg = getAppointmentTypeConfig(appointment.appointment_type_id);
  const StatusIcon = statusCfg.icon;
  const TypeIcon = typeCfg.icon;
  const isEmergency = appointment.emergency === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 transition-all border border-slate-100">
        
        {/* ================= VIEW: DETAILS ================= */}
        {view === 'details' && (
          <>
            {/* Header Section */}
            <div className="relative bg-white pb-4 pt-6 px-6">
              {isEmergency && (
                <div className="absolute top-0 left-0 w-full bg-rose-500 text-white text-[10px] font-bold px-4 py-1 flex items-center justify-center gap-2 tracking-wider uppercase shadow-sm">
                  <AlertTriangle className="w-3 h-3" />
                  Emergency Appointment
                </div>
              )}
              
              <div className="flex items-start justify-between mt-4"> {/* Added margin top to clear emergency banner */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                    <Stethoscope className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dentist</p>
                    <h3 className="font-bold text-slate-900 text-xl leading-tight font-ceramon">
                      Dr. {dentist?.first_name} {dentist?.last_name || "Unknown"}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">{dentist?.specialty || "General Dentistry"}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-100 mx-6"></div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-6 py-6 space-y-6 flex-1 bg-slate-50/30">
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusCfg.bg} ${statusCfg.color} border ${statusCfg.border} text-xs font-bold shadow-sm`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {appointment.status}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${typeCfg.bg} ${typeCfg.color} border border-blue-100 text-xs font-bold shadow-sm`}>
                  <TypeIcon className="w-3.5 h-3.5" />
                  {typeCfg.name}
                </span>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center hover:border-indigo-100 transition-colors group">
                   <div className="flex items-center gap-2 mb-2 text-slate-400 group-hover:text-indigo-400 transition-colors">
                      <Calendar className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Date</span>
                   </div>
                   <p className="text-lg font-bold text-slate-900 font-ceramon">{dateString}</p>
                   <p className="text-xs text-slate-500 font-medium">{yearString}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center hover:border-indigo-100 transition-colors group">
                   <div className="flex items-center gap-2 mb-2 text-slate-400 group-hover:text-indigo-400 transition-colors">
                      <Clock className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Time</span>
                   </div>
                   <p className="text-lg font-bold text-slate-900 font-ceramon">{schedule?.time_slot ? schedule.time_slot : "TBA"}</p>
                   <p className="text-xs text-slate-500 font-medium">{schedule?.day_of_week || "Day TBA"}</p>
                </div>
              </div>

              {/* Patient Message */}
              {appointment.message && (
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-slate-400">
                    <FileText className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Reason for Visit</h4>
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{appointment.message}"
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
              <button
                  onClick={() => setView('reminders')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
              >
                  <Bell className="w-4 h-4" />
                  View Reminders
              </button>
              
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors active:scale-[0.98]"
              >
                Close
              </button>
            </div>
          </>
        )}

        {/* ================= VIEW: REMINDERS ================= */}
        {view === 'reminders' && (
          <>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setView('details')}
                  className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-none font-ceramon">Reminders</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Scheduled notifications</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 bg-slate-50/50 flex-1">
              {reminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                    <div className="w-16 h-16 bg-white border border-slate-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <CalendarClock className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-base font-bold text-slate-900">No reminders set</p>
                    <p className="text-sm text-slate-500 mt-1 max-w-[200px]">No specific reminders have been configured for this appointment.</p>
                </div>
              ) : (
                <div className="space-y-8 relative">
                   {/* Continuous Timeline Line */}
                   <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 z-0"></div>

                  {reminders.map((reminder: any, rIdx: number) => {
                      const reminderDate = new Date(reminder.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', weekday: 'short' });
                      return (
                      <div key={rIdx} className="relative z-10 pl-10"> 
                        {/* Timeline Dot */}
                        <div className="absolute left-3 top-0 w-4 h-4 bg-indigo-100 border-2 border-indigo-500 rounded-full z-20"></div>

                        {/* Day Group */}
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                            {/* Day Header */}
                            <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                                 <Calendar className="w-4 h-4 text-indigo-500" />
                                 <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">{reminderDate}</span>
                            </div>
                            
                            {/* Slots */}
                            <div className="divide-y divide-slate-50">
                                {reminder.slots.map((slot: any, sIdx: number) => (
                                    <div key={sIdx} className="p-4 hover:bg-slate-50/30 transition-colors">
                                        <div className="flex items-center flex-wrap gap-2 mb-2">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                                                <Clock className="w-3 h-3" />
                                                {formatTime(slot.startTime)}
                                            </div>
                                            <ArrowRight className="w-3 h-3 text-slate-300" />
                                            <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                                                {formatTime(slot.endTime)}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {slot.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                      </div>
                  )})}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 bg-white flex justify-between gap-3">
              <button
                onClick={() => setView('details')}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-[0.98]"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}