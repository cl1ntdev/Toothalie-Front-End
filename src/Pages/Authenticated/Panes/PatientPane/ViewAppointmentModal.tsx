"use client";

import React from "react";
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
  FileText,
  MapPin,
  Mail
} from "lucide-react";

interface ViewAppointmentModalProps {
  appointmentData: any;
  onClose: () => void;
}

export default function ViewAppointmentModal({ appointmentData, onClose }: ViewAppointmentModalProps) {
  if (!appointmentData) return null;

  const { appointment, dentist, schedules } = appointmentData;
  const schedule = schedules.find((s: any) => s.scheduleID === appointment.schedule_id);

  // Date Formatting
  const dateObj = new Date(appointment.user_set_date);
  const dateString = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" });
  const yearString = dateObj.getFullYear();

  // Config Helpers
  const getStatusConfig = (status: string) => {
    const config = {
      Pending: { icon: Clock, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
      Approved: { icon: CheckCircle, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
      Rejected: { icon: XCircle, color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
    };
    return config[status as keyof typeof config] || config.Pending;
  };

  const getAppointmentTypeConfig = (typeId: number) => {
    const config = {
      1: { name: "Normal Visit", icon: User, color: "text-blue-700", bg: "bg-blue-50" },
      2: { name: "Family Visit", icon: Users, color: "text-purple-700", bg: "bg-purple-50" },
    };
    return config[typeId as keyof typeof config] || config[1];
  };

  const statusCfg = getStatusConfig(appointment.status);
  const typeCfg = getAppointmentTypeConfig(appointment.appointment_type_id);
  const TypeIcon = typeCfg.icon;
  const StatusIcon = statusCfg.icon;
  const isEmergency = appointment.emergency === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="relative">
            {/* Emergency Banner */}
            {isEmergency && (
                <div className="bg-red-500 text-white text-xs font-bold px-4 py-1.5 flex items-center justify-center gap-2 tracking-wide uppercase">
                    <AlertTriangle className="w-3 h-3" />
                    Emergency Appointment
                </div>
            )}
            
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border border-blue-200">
                        <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dentist</p>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                        Dr. {dentist?.first_name} {dentist?.last_name || "Unknown"}
                        </h3>
                        <p className="text-sm text-gray-500">{dentist?.specialty || "General Dentistry"}</p>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
            
            {/* Status & Type Badges */}
            <div className="flex flex-wrap gap-2">
                 <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md ${statusCfg.bg} ${statusCfg.color} border ${statusCfg.border} text-xs font-medium`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {appointment.status}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md ${typeCfg.bg} ${typeCfg.color} border border-transparent text-xs font-medium`}>
                    <TypeIcon className="w-3.5 h-3.5" />
                    {typeCfg.name}
                </span>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-gray-500">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Date</p>
                        <p className="text-sm font-semibold text-gray-900">{dateString}</p>
                        <p className="text-xs text-gray-500">{yearString}</p>
                    </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-gray-500">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Time</p>
                        <p className="text-sm font-semibold text-gray-900">{schedule?.time_slot || "TBA"}</p>
                        <p className="text-xs text-gray-500">{schedule?.day_of_week || "Day TBA"}</p>
                    </div>
                </div>
            </div>

            {/* Patient Message / Note */}
            {appointment.message && (
                <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Reason for Visit
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-gray-100">
                        "{appointment.message}"
                    </div>
                </div>
            )}

            {/* Contact Info (Optional derived from Dentist) */}
            <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span>{dentist?.email || "No email provided"}</span>
                </div>
            </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
            <button 
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
            >
                Close Details
            </button>
        </div>
      </div>
    </div>
  );
}