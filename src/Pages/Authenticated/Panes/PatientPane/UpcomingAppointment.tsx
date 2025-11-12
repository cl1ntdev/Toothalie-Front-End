import React, { useState, useEffect } from 'react';
import { FetchAppointment } from '@/API/Authenticated/appointment/FetchAppointment';
import AppointmentModal from './AppointmentModal';
import DeleteAppointmentModal from './DeleteAppointmentModal';
import EditModal from './EditModal';
import {
  Pencil,
  Trash2,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  ClockIcon,
  AlertTriangle,
  Users,
  Plus,
  Stethoscope,
} from 'lucide-react';

export default function UpcomingAppointment() {
  const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await FetchAppointment();
        if (data && data.status === 'ok' && Array.isArray(data.appointments)) {
          setAppointmentsData(data.appointments);
        } else {
          setAppointmentsData([]);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setIsUpdate(false);
  }, [isUpdate]);

  const handleDelete = (id: string) => {
    setSelectedAppointmentId(id);
    setDeleteModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedAppointmentId(id);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => setShowAppointmentModal(false);
  const handleAppointmentSuccess = () => {
    setShowAppointmentModal(false);
    setIsUpdate(true);
  };

  const triggerDelete = () => {
    setIsUpdate(true);
    setAppointmentsData((prev) =>
      prev.filter((appt) => appt.appointment.appointment_id !== selectedAppointmentId)
    );
    setDeleteModalOpen(false);
    setSelectedAppointmentId(null);
  };

  const getStatusConfig = (status: string) => {
    const config = {
      Pending: { icon: ClockIcon, color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
      Approved: { icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
      Rejected: { icon: XCircle, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
    };
    return config[status as keyof typeof config] || config.Pending;
  };

  const getAppointmentTypeConfig = (typeId: number) => {
    const config = {
      1: { name: 'Normal', icon: User, color: 'text-blue-700', bg: 'bg-blue-50' },
      2: { name: 'Family', icon: Users, color: 'text-purple-700', bg: 'bg-purple-50' },
    };
    return config[typeId as keyof typeof config] || config[1];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        <span className="ml-3 text-gray-600">Loading your appointments...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-16">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header + New Appointment Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Appointments</h2>
          <p className="text-gray-600 mt-1">
            {appointmentsData.length} upcoming appointment{appointmentsData.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowAppointmentModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Appointment
        </button>
      </div>

      {/* Appointments List */}
      {appointmentsData.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No upcoming appointments</p>
          <p className="text-gray-400 text-sm mt-2">Schedule your first visit now!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointmentsData.map((appointmentData) => {
            const { appointment, dentist, schedules } = appointmentData;
            const schedule = schedules.find((s: any) => s.scheduleID === appointment.schedule_id);
            const appointmentDate = new Date(appointment.user_set_date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            });

            const statusCfg = getStatusConfig(appointment.status);
            const StatusIcon = statusCfg.icon;
            const typeCfg = getAppointmentTypeConfig(appointment.appointment_type_id);
            const TypeIcon = typeCfg.icon;
            const isEmergency = appointment.emergency === 1;

            const canEdit = appointment.status === 'Pending';
            const canDelete = appointment.status === 'Pending' || appointment.status === 'Rejected';

            return (
              <div
                key={appointment.appointment_id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Left: Dentist Info + Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Dr. {dentist?.first_name} {dentist?.last_name || 'Unknown'}
                        </h3>
                        <p className="text-sm text-gray-600">{dentist?.specialty || 'General Dentistry'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{appointmentDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{schedule?.time_slot || 'Time not set'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {isEmergency && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Emergency
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${typeCfg.bg} border text-xs font-medium`}>
                        <TypeIcon className={`w-3.5 h-3.5 ${typeCfg.color}`} />
                        {typeCfg.name}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusCfg.bg} ${statusCfg.border} text-xs font-medium`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${statusCfg.color}`} />
                        {appointment.status}
                      </span>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <button
                        onClick={() => handleEdit(appointment.appointment_id)}
                        className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4.5 h-4.5" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(appointment.appointment_id)}
                        className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showAppointmentModal && (
        <AppointmentModal onClose={handleCloseModal} appointmentSuccess={handleAppointmentSuccess} />
      )}
      {deleteModalOpen && (
        <DeleteAppointmentModal
          appointmentID={selectedAppointmentId}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedAppointmentId(null);
          }}
          deleteSuccess={triggerDelete}
        />
      )}
      {editModalOpen && (
        <EditModal
          appointmentID={selectedAppointmentId}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedAppointmentId(null);
          }}
          onSuccessEdit={() => setIsUpdate((prev) => !prev)}
        />
      )}
    </div>
  );
}