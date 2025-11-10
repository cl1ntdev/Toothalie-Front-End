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
  Phone,
  MessageSquare,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function Appointments() {
  const [dentistID, setDentistID] = useState<string>("");
  const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewAppointment, setViewAppointment] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ Load dentistID from localStorage
  useEffect(() => {
    const localData = localStorage.getItem("userInfo");
    if (!localData) return;

    try {
      const userInfo = JSON.parse(localData);
      if (userInfo?.user?.id) {
        setDentistID(userInfo.user.id.toString());
      }
    } catch (err) {
      console.error("Failed to parse userInfo:", err);
    }
  }, []);

  // ✅ Fetch appointments when dentistID is ready
  useEffect(() => {
    if (!dentistID) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAppointmentDentist(dentistID);

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

  // Handlers
  const handleView = (appointment: any) => setViewAppointment(appointment);
  const closeViewModal = () => setViewAppointment(null);

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      const update = await UpdateDentistAppointment(appointmentId, newStatus);

      if (update?.status === "ok") {
        setAppointmentsData((prev) =>
          prev.map((a) => (a.id === appointmentId ? { ...a, status: newStatus } : a))
        );
        setViewAppointment(null);
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

  // Status Config
  const getStatusConfig = (status: string) => {
    const config = {
      Pending: {
        icon: ClockIcon,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        dotColor: "bg-yellow-400",
      },
      Approved: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        dotColor: "bg-green-400",
      },
      Rejected: {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        dotColor: "bg-red-400",
      },
    };
    return config[status as keyof typeof config] || config.Pending;
  };

  // Appointment Type Config
  const getAppointmentTypeConfig = (typeId: number) => {
    const config = {
      1: { name: "Normal", icon: User, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
      2: { name: "Family", icon: Users, color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
      3: { name: "Emergency", icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
    };
    return config[typeId as keyof typeof config] || config[1];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // --- Render ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-3"></div>
        <span className="text-gray-600 text-sm">Loading appointments...</span>
        <p className="text-gray-400 text-xs mt-2">This may take a few moments</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-sm text-red-600 hover:text-red-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!appointmentsData.length) {
    return (
      <div className="text-center py-16 px-4">
        <Calendar className="h-20 w-20 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          There are no appointments scheduled for this dentist yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">{appointmentsData.length} appointment(s) scheduled</p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {appointmentsData.map((appointment, index) => {
            const statusCfg = getStatusConfig(appointment.status);
            const StatusIcon = statusCfg.icon;
            const typeCfg = getAppointmentTypeConfig(appointment.appointment_type_id);
            const TypeIcon = typeCfg.icon;

            return (
              <div
                key={appointment.id || index}
                className={`border rounded-xl p-5 hover:shadow-md transition-all duration-200 ${
                  appointment.emergency ? "border-red-300 bg-red-50/50" : "bg-white border-gray-200"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${typeCfg.bgColor}`}>
                      <TypeIcon className={`h-5 w-5 ${typeCfg.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-base truncate flex items-center gap-2">
                        {appointment.patient_name}
                        {appointment.emergency && (
                          <span className="inline-flex items-center text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Emergency
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {appointment.email || "No email provided"}
                      </p>
                    </div>
                  </div>
                
                  <div
                    className={`flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusCfg.bgColor} ${statusCfg.borderColor} ${statusCfg.color}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor} mr-1.5`} />
                    <span>{appointment.status}</span>
                  </div>
                </div>


                {/* Schedule */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{appointment.day_of_week}</span>
                    <span className="text-gray-400">•</span>
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{appointment.time_slot || "Time not specified"}</span>
                  </div>
                </div>

                {/* Message Preview */}
                {appointment.message && (
                  <div className="text-sm text-gray-600 mb-4">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="line-clamp-2">{appointment.message}</p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${typeCfg.bgColor} ${typeCfg.borderColor}`}
                  >
                    <TypeIcon className={`h-3.5 w-3.5 ${typeCfg.color}`} />
                    <span className={`font-medium ${typeCfg.color}`}>{typeCfg.name}</span>
                  </div>
                  <button
                    onClick={() => handleView(appointment)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced View Modal */}
      {viewAppointment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Appointment Details</h3>
                  <p className="text-gray-500 text-sm mt-1">ID: {viewAppointment.id}</p>
                </div>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
                  disabled={isUpdating}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Patient Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" /> Patient Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium">{viewAppointment.patient_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{viewAppointment.email || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{viewAppointment.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Appointment Type</p>
                      <div className="flex items-center gap-2 mt-1">
                        {(() => {
                          const typeCfg = getAppointmentTypeConfig(viewAppointment.appointment_type_id);
                          const TypeIcon = typeCfg.icon;
                          return (
                            <>
                              <TypeIcon className={`h-4 w-4 ${typeCfg.color}`} />
                              <span className={`font-medium ${typeCfg.color}`}>{typeCfg.name}</span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Appointment Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">{viewAppointment.date}</p>
                        <p className="text-sm text-gray-500">{viewAppointment.day_of_week}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Time Slot</p>
                        <p className="font-medium">{viewAppointment.time_slot}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          {(() => {
                            const statusCfg = getStatusConfig(viewAppointment.status);
                            const StatusIcon = statusCfg.icon;
                            return (
                              <>
                                <StatusIcon className={`h-4 w-4 ${statusCfg.color}`} />
                                <span className={`font-medium ${statusCfg.color}`}>{viewAppointment.status}</span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Emergency</p>
                        <p className="font-medium">{viewAppointment.emergency ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Message */}
                {viewAppointment.message && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> Patient Message
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{viewAppointment.message}</p>
                  </div>
                )}

                {/* Status Update */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-4">Update Status</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleStatusUpdate(viewAppointment.id, "Approved")}
                      disabled={isUpdating || viewAppointment.status === "Approved"}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      {viewAppointment.status === "Approved" ? "Already Approved" : "Approve"}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(viewAppointment.id, "Rejected")}
                      disabled={isUpdating || viewAppointment.status === "Rejected"}
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      {viewAppointment.status === "Rejected" ? "Already Rejected" : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}