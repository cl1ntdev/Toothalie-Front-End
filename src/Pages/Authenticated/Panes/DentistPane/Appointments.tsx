import React, { useState, useEffect } from "react";
import { fetchAppointmentDentist } from "@/API/Authenticated/appointment/FetchAppointment";
import { UpdateDentistAppointment } from "@/API/Authenticated/appointment/EditAppointmentAPI";
import { useParams } from "react-router-dom";
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
} from "lucide-react";

export default function Appointments() {
  const { id } = useParams();
  const dentistID: string = id || "";

  const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewAppointment, setViewAppointment] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAppointmentDentist(dentistID);
        console.log("Fetched data:", data);

        if (data && data.status === "ok") {
          let appointmentsArray = [];

          if (Array.isArray(data.appointments)) {
            appointmentsArray = data.appointments;
          } else if (data.appointments && typeof data.appointments === "object") {
            appointmentsArray = [data.appointments];
          }

          const formattedAppointments = appointmentsArray.map((item: any) => {
            const appointment = item.appointment || item;
            const patients = item.patients || {};
            const schedule = item.schedule;
            return {
              appointment_id: appointment.appointment_id,
              date: appointment.user_set_date,
              time: appointment.appointment_date?.split(" ")[1],
              time_slot: schedule.time_slot,
              status: appointment.status || "Pending",
              appointment_type_id: appointment.appointment_type_id,
              patient_name:
                patients.first_name && patients.last_name
                  ? `${patients.first_name} ${patients.last_name}`
                  : "Unknown Patient",
              contact_no: patients.contact_no,
              email: patients.email,
              message: appointment.message,
              emergency: appointment.emergency,
            };
          });

          setAppointmentsData(formattedAppointments);
        } else {
          setAppointmentsData([]);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dentistID]);

  const handleView = (appointment: any) => setViewAppointment(appointment);
  const closeViewModal = () => setViewAppointment(null);

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      const updateStatus = await UpdateDentistAppointment(appointmentId, newStatus);

      if (updateStatus.status === "ok") {
        setAppointmentsData((prev) =>
          prev.map((appt) =>
            appt.appointment_id === appointmentId ? { ...appt, status: newStatus } : appt
          )
        );
        setViewAppointment(null);
      } else {
        throw new Error(updateStatus.message || "Failed to update appointment");
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Failed to update appointment status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

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

  const getAppointmentTypeConfig = (typeId: number) => {
    const config = {
      1: {
        name: "Normal",
        icon: User,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      2: {
        name: "Family",
        icon: Users,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      },
      3: {
        name: "Emergency",
        icon: Users,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
    };
    return config[typeId as keyof typeof config] || config[1];
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
        <span className="text-gray-600 text-sm">Loading appointments...</span>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );

  if (!appointmentsData.length)
    return (
      <div className="text-center py-12 px-4">
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          There are no appointments scheduled for this dentist yet.
        </p>
      </div>
    );

  return (
    <>
      <div className="p-4 sm:p-6">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {appointmentsData.map((appointment, index) => {
            const statusConfig = getStatusConfig(appointment.status);
            const StatusIcon = statusConfig.icon;
            const appointmentTypeConfig = getAppointmentTypeConfig(appointment.appointment_type_id);
            const AppointmentTypeIcon = appointmentTypeConfig.icon;

            return (
              <div
                key={appointment.appointment_id || index}
                className={`border rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-200 ${
                  appointment.emergency == 1
                    ? "border-red-300 bg-red-50/50"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col gap-3 sm:gap-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`p-2 rounded-lg ${appointmentTypeConfig.bgColor} flex-shrink-0`}>
                        <AppointmentTypeIcon className={`h-5 w-5 ${appointmentTypeConfig.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-base truncate">
                          {appointment.patient_name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {appointment.email || "No email provided"}
                        </p>
                      </div>
                    </div>

                    {/* Status Tag */}
                    <div
                      className={`flex items-center justify-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.color} min-w-[80px] sm:min-w-[100px]`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor} mr-1.5 flex-shrink-0`}
                      ></div>
                      <span className="truncate">{appointment.status}</span>
                    </div>
                  </div>

                  {/* Emergency Badge */}
                  {appointment.emergency == 1 && (
                    <div className="flex items-center justify-center px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs font-semibold min-w-[100px] animate-pulse">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                        🚨 Emergency
                      </span>
                    </div>
                  )}

                  {/* Contact */}
                  {appointment.contact_no && (
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{appointment.contact_no}</span>
                    </div>
                  )}

                  {/* Date & Time */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex flex-col xs:flex-row xs:items-center gap-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-700 xs:flex-1">
                        <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="font-medium truncate flex-1 text-sm">
                          {appointment.date || "No date"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-700 xs:flex-1">
                        <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="font-medium truncate flex-1 text-sm">
                          {appointment.time_slot || "No time"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {appointment.message && (
                    <div className="text-sm text-gray-600">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="line-clamp-2">{appointment.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <div
                      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs ${appointmentTypeConfig.bgColor} ${appointmentTypeConfig.borderColor}`}
                    >
                      <AppointmentTypeIcon
                        className={`h-3.5 w-3.5 ${appointmentTypeConfig.color} flex-shrink-0`}
                      />
                      <span className={`font-medium ${appointmentTypeConfig.color}`}>
                        {appointmentTypeConfig.name}
                      </span>
                    </div>

                    <button
                      onClick={() => handleView(appointment)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {viewAppointment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[95vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isUpdating}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Patient Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span>Patient Information</span>
                  </h4>
                  <div className="space-y-3">
                    <p className="font-medium text-base">{viewAppointment.patient_name}</p>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-sm break-words">
                          {viewAppointment.email || "No email provided"}
                        </p>
                      </div>
                      {viewAppointment.contact_no && (
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium text-sm">{viewAppointment.contact_no}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Appointment Details</h4>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium text-sm sm:text-base">
                        {viewAppointment.date || "No date"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium text-sm sm:text-base">
                        {viewAppointment.time_slot || "No time"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      {viewAppointment.emergency == 1 ? (
                        <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-md px-2 py-1 font-medium text-sm sm:text-base">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                          🚨 Emergency
                        </div>
                      ) : (
                        <p className="font-medium text-sm sm:text-base">
                          {getAppointmentTypeConfig(viewAppointment.appointment_type_id).name}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${getStatusConfig(viewAppointment.status).dotColor}`}
                        ></div>
                        <span className="font-medium text-sm sm:text-base">
                          {viewAppointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span>Patient Message</span>
                  </h4>
                  {viewAppointment.message ? (
                    <p className="text-sm text-gray-700 bg-white p-3 rounded border break-words">
                      {viewAppointment.message}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 italic bg-white p-3 rounded border">
                      No message provided by the patient.
                    </p>
                  )}
                </div>
              </div>

              {/* Status Buttons */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
                <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() =>
                      handleStatusUpdate(viewAppointment.appointment_id, "Approved")
                    }
                    disabled={isUpdating}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isUpdating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(viewAppointment.appointment_id, "Rejected")
                    }
                    disabled={isUpdating}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isUpdating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
