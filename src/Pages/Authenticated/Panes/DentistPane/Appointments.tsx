"use client";

import React, { useState, useEffect } from "react";
import { fetchAppointmentDentist } from "@/API/Authenticated/appointment/FetchAppointment";
import { UpdateDentistAppointment } from "@/API/Authenticated/appointment/EditAppointmentAPI";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  ClockIcon,
  Users,
  Eye,
  ArrowLeft,
  MessageSquare,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  CalendarCheck,
  Bell,
  Plus,
  Trash2,
  Save,
  RefreshCw
} from "lucide-react";

// --- Types for the new Schedule Structure ---
interface ReminderSlot {
  id: string;
  startTime: string;
  endTime: string;
  message: string;
}

interface ReminderDay {
  id: string;
  date: string;
  slots: ReminderSlot[];
}

export default function Appointments() {
  const [dentistID, setDentistID] = useState<string>("");
  const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal States
  const [viewAppointment, setViewAppointment] = useState<any | null>(null);
  const [modalMode, setModalMode] = useState<'details' | 'reminder'>('details');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // --- New Reminder Schedule State ---
  const [reminderSchedule, setReminderSchedule] = useState<ReminderDay[]>([]);
  const [isSavingReminder, setIsSavingReminder] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAppointmentDentist();
        
        if (data?.status === "ok" && Array.isArray(data.appointments)) {
          const formatted = data.appointments.map((item: any) => {
            const appt = item.appointment;
            const patient = item.patient || {};
            const schedule = item.schedule || {};

            return {
              id: appt.appointment_id,
              date: appt.user_set_date,
              time: appt.appointment_date?.split(" ")[1],
              day_of_week: schedule.day_of_week,
              time_slot: schedule.time_slot,
              status: appt.status || "Pending",
              appointment_type_id: appt.appointment_type_id,
              patient_name:
                patient.first_name && patient.last_name
                  ? `${patient.first_name} ${patient.last_name}`
                  : "Unknown Patient",
              email: patient.email,
              phone: patient.phone || "Not provided",
              emergency: appt.emergency,
              message: appt.message,
              created_at: appt.created_at,
              appointment_date: appt.appointment_date,
            };
          });

          setAppointmentsData(formatted);
        } else {
          setAppointmentsData([]);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dentistID]);

  // --- Handlers ---

  const handleView = (appointment: any) => {
    setModalMode('details');
    // Initialize with one empty day when opening
    setReminderSchedule([
      { id: Date.now().toString(), date: "", slots: [{ id: "slot-1", startTime: "", endTime: "", message: "" }] }
    ]);
    setViewAppointment(appointment);
  };
  
  const closeViewModal = () => {
    setViewAppointment(null);
    setModalMode('details');
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      const update = await UpdateDentistAppointment(appointmentId, newStatus);

      if (update?.status === "ok") {
        setAppointmentsData((prev) =>
          prev.map((a) => (a.id === appointmentId ? { ...a, status: newStatus } : a))
        );
        setViewAppointment((prev: any) => ({ ...prev, status: newStatus }));
      } else {
        alert(update.message || "Failed to update appointment.");
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Error updating appointment. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Reminder Schedule Handlers ---

  const addDay = () => {
    setReminderSchedule([
      ...reminderSchedule,
      { 
        id: Date.now().toString(), 
        date: "", 
        slots: [{ id: Date.now().toString() + "-slot", startTime: "", endTime: "", message: "" }] 
      }
    ]);
  };

  const removeDay = (dayId: string) => {
    setReminderSchedule(reminderSchedule.filter(d => d.id !== dayId));
  };

  const updateDayDate = (dayId: string, newDate: string) => {
    setReminderSchedule(reminderSchedule.map(d => 
      d.id === dayId ? { ...d, date: newDate } : d
    ));
  };

  const addTimeSlot = (dayId: string) => {
    setReminderSchedule(reminderSchedule.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          slots: [...d.slots, { id: Date.now().toString(), startTime: "", endTime: "", message: "" }]
        };
      }
      return d;
    }));
  };

  const removeTimeSlot = (dayId: string, slotId: string) => {
    setReminderSchedule(reminderSchedule.map(d => {
      if (d.id === dayId) {
        return { ...d, slots: d.slots.filter(s => s.id !== slotId) };
      }
      return d;
    }));
  };

  const updateTimeSlot = (dayId: string, slotId: string, field: keyof ReminderSlot, value: string) => {
    setReminderSchedule(reminderSchedule.map(d => {
      if (d.id === dayId) {
        return {
          ...d,
          slots: d.slots.map(s => s.id === slotId ? { ...s, [field]: value } : s)
        };
      }
      return d;
    }));
  };

  const handleSaveReminder = async () => {
    // Basic Validation
    const isValid = reminderSchedule.every(day => 
      day.date && day.slots.every(slot => slot.startTime && slot.endTime && slot.message)
    );

    if(!isValid || reminderSchedule.length === 0) {
        return alert("Please fill in all dates, times, and messages.");
    }
    
    try {
        setIsSavingReminder(true);
        // TODO: Call your actual Reminder API here
        console.log("Saving schedule...", reminderSchedule);
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
        
        alert("Reminders scheduled successfully!");
        setModalMode('details'); 
    } catch (error) {
        console.error(error);
    } finally {
        setIsSavingReminder(false);
    }
  };

  // --- Configurations ---

  const getStatusConfig = (status: string) => {
    const config = {
      Pending: {
        icon: ClockIcon,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        badge: "bg-amber-100 text-amber-700",
      },
      Approved: {
        icon: CheckCircle,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-700",
      },
      Rejected: {
        icon: XCircle,
        color: "text-rose-600",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        badge: "bg-rose-100 text-rose-700",
      },
    };
    return config[status as keyof typeof config] || config.Pending;
  };

  const getAppointmentTypeConfig = (typeId: number) => {
    const config = {
      1: { name: "Normal", icon: User, color: "text-blue-600", bg: "bg-blue-100" },
      2: { name: "Family", icon: Users, color: "text-violet-600", bg: "bg-violet-100" },
      3: { name: "Emergency", icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
    };
    return config[typeId as keyof typeof config] || config[1];
  };

  // --- Render ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
        <span className="text-gray-600 font-medium">Loading schedule...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 max-w-md text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Something went wrong</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors shadow-sm"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!appointmentsData.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="bg-gray-50 rounded-full p-6 mb-4">
          <Calendar className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Yet</h3>
        <p className="text-gray-500 max-w-sm">
          Your schedule is currently clear. New appointments will appear here when patients book them.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-500 mt-1">Manage your patient schedule</p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100">
            Total: {appointmentsData.length}
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {appointmentsData.map((appointment, index) => {
            const statusCfg = getStatusConfig(appointment.status);
            const typeCfg = getAppointmentTypeConfig(appointment.appointment_type_id);
            const TypeIcon = typeCfg.icon;

            return (
              <div
                key={appointment.id || index}
                className={`group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col
                  ${appointment.emergency ? "ring-1 ring-red-200" : ""}
                `}
              >
                {/* Emergency Strip */}
                {!!appointment.emergency && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />
                )}

                <div className="p-5 flex flex-col h-full">
                  {/* Top Row: Type & Status */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${typeCfg.bg} ${typeCfg.color}`}>
                      <TypeIcon className="h-3.5 w-3.5" />
                      {typeCfg.name}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusCfg.borderColor} ${statusCfg.badge}`}>
                      {appointment.status}
                    </span>
                  </div>

                  {/* Patient Info */}
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-lg truncate mb-1">
                      {appointment.patient_name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 gap-2 truncate">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{appointment.email || "No email"}</span>
                    </div>
                  </div>

                  {/* Schedule Box */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 mb-4 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-900 font-medium mb-1">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{appointment.day_of_week}</span>
                      <div className="flex items-center gap-1">
                         <Clock className="h-3.5 w-3.5" />
                         {appointment.time_slot || "TBD"}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handleView(appointment)}
                    className="w-full mt-2 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 group-hover:border-blue-200 group-hover:text-blue-600"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Unified Modal --- */}
      {viewAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity" 
            onClick={closeViewModal}
          />
          
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col transition-all duration-300">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-clip-padding">
              <div className="flex items-center gap-3">
                 {modalMode === 'reminder' && (
                     <button 
                        onClick={() => setModalMode('details')}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                     >
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                     </button>
                 )}
                 <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {modalMode === 'details' ? 'Appointment Details' : 'Create Reminder'}
                    </h2>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">#{viewAppointment.id}</p>
                 </div>
              </div>
              <button
                onClick={closeViewModal}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content - Conditional Rendering based on Mode */}
            {modalMode === 'details' ? (
                // --- MODE: DETAILS ---
                <>
                    <div className="p-6 space-y-8">
                        {/* Patient Section */}
                        <section>
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-500" /> Patient Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                <div>
                                    <span className="block text-xs text-gray-500 mb-1">Full Name</span>
                                    <span className="font-medium text-gray-900 text-base">{viewAppointment.patient_name}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 mb-1">Phone Number</span>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                                        <span className="font-medium text-gray-900">{viewAppointment.phone}</span>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="block text-xs text-gray-500 mb-1">Email Address</span>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                                        <span className="font-medium text-gray-900">{viewAppointment.email || "Not provided"}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Appointment Section */}
                        <section>
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <CalendarCheck className="h-4 w-4 text-blue-500" /> Session Details
                            </h4>
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <div className="grid grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <span className="block text-xs text-gray-500 mb-1">Date</span>
                                        <span className="font-semibold text-gray-900">{viewAppointment.date}</span>
                                        <span className="text-xs text-gray-500 block">{viewAppointment.day_of_week}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500 mb-1">Time Slot</span>
                                        <span className="font-semibold text-gray-900">{viewAppointment.time_slot}</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-3">
                                    {/* Type Badge */}
                                    {(() => {
                                        const t = getAppointmentTypeConfig(viewAppointment.appointment_type_id);
                                        const TIcon = t.icon;
                                        return (
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${t.bg} ${t.color}`}>
                                                <TIcon className="h-3.5 w-3.5" />
                                                {t.name} Type
                                            </span>
                                        );
                                    })()}
                                    
                                    {/* Status Badge */}
                                    {(() => {
                                        const s = getStatusConfig(viewAppointment.status);
                                        return (
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${s.bgColor} ${s.borderColor} ${s.color}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                                                {viewAppointment.status}
                                            </span>
                                        );
                                    })()}

                                    {!!viewAppointment.emergency && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700">
                                            <AlertCircle className="h-3.5 w-3.5" />
                                            Emergency
                                        </span>
                                    )}
                                </div>
                            </div>
                        </section>

                        {viewAppointment.message && (
                            <section>
                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-blue-500" /> Message
                                </h4>
                                <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {viewAppointment.message}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Footer for Details */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <button
                                onClick={() => handleStatusUpdate(viewAppointment.id, "Approved")}
                                disabled={isUpdating || viewAppointment.status === "Approved"}
                                className={`flex justify-center items-center gap-2 py-2.5 rounded-lg font-medium transition-colors
                                ${viewAppointment.status === "Approved" 
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200"}
                                `}
                            >
                                {isUpdating && viewAppointment.status !== "Approved" ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckCircle className="h-4 w-4"/>}
                                {viewAppointment.status === "Approved" ? "Approved" : "Approve Appointment"}
                            </button>

                            <button
                                onClick={() => handleStatusUpdate(viewAppointment.id, "Rejected")}
                                disabled={isUpdating || viewAppointment.status === "Rejected"}
                                className={`flex justify-center items-center gap-2 py-2.5 rounded-lg font-medium transition-colors
                                ${viewAppointment.status === "Rejected" 
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                    : "bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"}
                                `}
                            >
                                {isUpdating && viewAppointment.status !== "Rejected" ? <Loader2 className="h-4 w-4 animate-spin"/> : <XCircle className="h-4 w-4"/>}
                                {viewAppointment.status === "Rejected" ? "Rejected" : "Reject Appointment"}
                            </button>
                        </div>

                        {viewAppointment.status === "Approved" && (
                            <button
                                onClick={() => setModalMode('reminder')}
                                className="w-full py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <Bell className="h-4 w-4" />
                                Set Reminder for Patient
                            </button>
                        )}
                    </div>
                </>
            ) : (
                // --- MODE: REMINDER FORM (Redesigned) ---
                <>
                    <div className="p-6 min-h-[400px]">
                        
                        {/* Header: Schedules + Add Day */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Schedules</h3>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <RefreshCw className="h-4 w-4" />
                                </button>
                                <button 
                                    onClick={addDay}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Day
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {reminderSchedule.map((day) => (
                                <div key={day.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                    {/* Day Header */}
                                    <div className="p-4 flex items-center justify-between bg-white border-b border-gray-100">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="date"
                                                    value={day.date}
                                                    onChange={(e) => updateDayDate(day.id, e.target.value)}
                                                    className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium text-gray-700"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => addTimeSlot(day.id)}
                                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-green-600 bg-white border border-green-200 rounded-md hover:bg-green-50 transition-colors"
                                            >
                                                <Plus className="h-3 w-3" />
                                                Add Time
                                            </button>
                                            <button 
                                                onClick={() => removeDay(day.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Time Slots */}
                                    <div className="p-3 space-y-2">
                                        {day.slots.map((slot) => (
                                            <div key={slot.id} className="bg-gray-50 rounded-lg p-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 border border-gray-100 group">
                                                
                                                {/* Time Inputs */}
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                    <input
                                                        type="time"
                                                        value={slot.startTime}
                                                        onChange={(e) => updateTimeSlot(day.id, slot.id, 'startTime', e.target.value)}
                                                        className="bg-white border border-gray-200 text-xs px-2 py-1 rounded w-24 focus:outline-none focus:border-blue-400"
                                                    />
                                                    <span className="text-gray-400 text-xs">-</span>
                                                    <input
                                                        type="time"
                                                        value={slot.endTime}
                                                        onChange={(e) => updateTimeSlot(day.id, slot.id, 'endTime', e.target.value)}
                                                        className="bg-white border border-gray-200 text-xs px-2 py-1 rounded w-24 focus:outline-none focus:border-blue-400"
                                                    />
                                                </div>

                                                {/* Divider for mobile */}
                                                <div className="h-px w-full bg-gray-200 sm:hidden"></div>
                                                <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>

                                                {/* Message Input (Flex Grow) */}
                                                <div className="flex-1 w-full sm:w-auto relative">
                                                    <MessageSquare className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                                    <input 
                                                        type="text"
                                                        value={slot.message}
                                                        onChange={(e) => updateTimeSlot(day.id, slot.id, 'message', e.target.value)}
                                                        placeholder="Enter reminder message..."
                                                        className="w-full bg-white border border-gray-200 text-xs pl-8 pr-3 py-1.5 rounded focus:outline-none focus:border-blue-400"
                                                    />
                                                </div>

                                                {/* Remove Slot */}
                                                <button 
                                                    onClick={() => removeTimeSlot(day.id, slot.id)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {day.slots.length === 0 && (
                                            <p className="text-xs text-center text-gray-400 py-2 italic">
                                                No time slots added.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {reminderSchedule.length === 0 && (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">No days added yet.</p>
                                    <button 
                                        onClick={addDay}
                                        className="mt-3 text-xs font-medium text-blue-600 hover:underline"
                                    >
                                        Add your first day
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer for Reminder */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex items-center justify-end gap-3">
                         <button 
                            onClick={() => setModalMode('details')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveReminder}
                            disabled={isSavingReminder}
                            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-colors shadow-sm"
                        >
                            {isSavingReminder ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}
                            Save Changes
                        </button>
                    </div>
                </>
            )}

          </div>
        </div>
      )}
    </>
  );
}