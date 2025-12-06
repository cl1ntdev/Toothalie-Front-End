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
  CalendarClock
} from "lucide-react";

interface ViewModalProps {
  appointmentData: any;
  onClose: () => void;
}

export default function ViewAppointmentModal({ appointmentData, onClose }: ViewModalProps) {
  // State to toggle between 'details' and 'reminders' view
  const [view, setView] = useState<'details' | 'reminders'>('details');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 transition-all">
        
        {/* ================= VIEW: DETAILS ================= */}
        {view === 'details' && (
          <>
            {/* Header Section */}
            <div className="relative">
              {isEmergency && (
                <div className="bg-rose-50 border-b border-rose-100 text-rose-600 text-[11px] font-bold px-4 py-2 flex items-center justify-center gap-2 tracking-wider uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Emergency Appointment
                </div>
              )}
              
              <div className="px-6 pt-6 pb-2 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center text-blue-600 border border-blue-200 shadow-sm">
                    <Stethoscope className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Dentist</p>
                    <h3 className="font-bold text-gray-900 text-xl leading-tight">
                      Dr. {dentist?.first_name} {dentist?.last_name || "Unknown"}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">{dentist?.specialty || "General Dentistry"}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="h-px bg-gray-100 mx-6 my-2"></div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-6 py-4 space-y-6 flex-1">
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusCfg.bg} ${statusCfg.color} border ${statusCfg.border} text-xs font-semibold shadow-sm`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {appointment.status}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${typeCfg.bg} ${typeCfg.color} border border-blue-100 text-xs font-semibold shadow-sm`}>
                  <TypeIcon className="w-3.5 h-3.5" />
                  {typeCfg.name}
                </span>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 flex flex-col justify-center">
                   <div className="flex items-center gap-2 mb-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Date</span>
                   </div>
                   <p className="text-sm font-bold text-gray-900">{dateString}</p>
                   <p className="text-xs text-gray-500">{yearString}</p>
                </div>

                <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 flex flex-col justify-center">
                   <div className="flex items-center gap-2 mb-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Time</span>
                   </div>
                   <p className="text-sm font-bold text-gray-900">{schedule?.time_slot ? schedule.time_slot : "TBA"}</p>
                   <p className="text-xs text-gray-500">{schedule?.day_of_week || "Day TBA"}</p>
                </div>
              </div>

              {/* Patient Message */}
              {appointment.message && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Reason for Visit</h4>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-gray-100 italic">
                    "{appointment.message}"
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
              <button
                  onClick={() => setView('reminders')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-xl transition-all shadow-sm active:scale-95"
              >
                  <Bell className="w-4 h-4" />
                  View Reminders
              </button>
              
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
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
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setView('details')}
                  className="p-1.5 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-none">Reminders</h3>
                    <p className="text-xs text-gray-500 mt-1">Scheduled notifications</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 bg-gray-50/50 flex-1">
              {reminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-3 shadow-sm">
                        <CalendarClock className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No reminders set</p>
                    <p className="text-xs text-gray-500 mt-1">No specific reminders have been configured.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reminders.map((reminder: any, rIdx: number) => {
                     const reminderDate = new Date(reminder.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', weekday: 'short' });
                     return (
                      <div key={rIdx} className="relative pl-4">
                        {/* Timeline Line */}
                        {rIdx !== reminders.length - 1 && (
                            <div className="absolute left-[27px] top-8 bottom-[-24px] w-px bg-gray-200 z-0"></div>
                        )}

                        {/* Day Group */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden z-10 relative">
                            {/* Day Header */}
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                                 <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                 <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{reminderDate}</span>
                            </div>
                            
                            {/* Slots */}
                            <div className="divide-y divide-gray-50">
                                {reminder.slots.map((slot: any, sIdx: number) => (
                                    <div key={sIdx} className="p-4 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold shadow-sm border border-blue-100">
                                                <Clock className="w-3 h-3" />
                                                {formatTime(slot.startTime)}
                                            </div>
                                            <ArrowRight className="w-3 h-3 text-gray-300" />
                                            <div className="text-xs font-medium text-gray-500">
                                                {formatTime(slot.endTime)}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed pl-1">
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
            <div className="p-4 border-t border-gray-100 bg-white flex justify-between gap-3">
              <button
                onClick={() => setView('details')}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Details
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm active:scale-95"
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