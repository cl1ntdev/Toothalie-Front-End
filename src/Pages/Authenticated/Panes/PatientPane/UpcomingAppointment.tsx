import React, { useState, useEffect } from 'react';
import { FetchAppointment, fetchAppointmentDentist } from '@/API/Authenticated/appointment/FetchAppointment';
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
  Users
} from 'lucide-react';
import DeleteAppointmentModal from './DeleteAppointmentModal';
import EditModal from './EditModal';

type appointmentProps = {
  fetchNewAppointment: boolean;
  onFetched: () => void;
};

export default function UpcomingAppointment({ fetchNewAppointment, onFetched }: appointmentProps) {
  const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

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
        onFetched();
      }
    };
    setIsUpdate(false);
    fetchData();
  }, [fetchNewAppointment, isUpdate]);

  const handleDelete = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setDeleteModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    setAppointmentsData((prev) =>
      prev.filter((appt) => appt.appointment.appointment_id !== selectedAppointmentId)
    );
    setDeleteModalOpen(false);
    setSelectedAppointmentId(null);
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
    setSelectedAppointmentId(null);
  };

  const handleEdit = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setEditModalOpen(true);
  };

  const triggerDelete = () => {
    setIsUpdate(true);
  };

  const getStatusConfig = (status: string) => {
    const config = {
      Pending: {
        icon: ClockIcon,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        function:"none"
      },
      Approved: {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        function:"disable"
      },
      Rejected: {
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        function:"none",
      }
    };
    return config[status as keyof typeof config] || config.Pending;
  };

  const getAppointmentTypeConfig = (typeId: number) => {
    const config = {
      1: {
        name: 'Normal Appointment',
        icon: User,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      2: {
        name: 'Family Appointment',
        icon: Users,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      }
    };
    return config[typeId as keyof typeof config] || config[1];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading appointments...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 py-8">{error}</div>;
  }

  if (!appointmentsData.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p>No upcoming appointments</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointmentsData.map((appointmentData, index) => {
        const { appointment, dentist, schedules } = appointmentData;
        const schedule = schedules.find((s) => s.scheduleID === appointment.schedule_id);
        const appointmentDate = new Date(appointment.user_set_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const statusConfig = getStatusConfig(appointment.status);
        const StatusIcon = statusConfig.icon;

        const appointmentTypeConfig = getAppointmentTypeConfig(appointment.appointment_type_id);
        const AppointmentTypeIcon = appointmentTypeConfig.icon;

        const isEmergency = appointment.emergency === 1;

        return (
          <div
            key={appointment.appointment_id || index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-colors shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                        {dentist?.name || 'Unknown Dentist'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {dentist?.specialty || 'General Dentistry'}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`inline-flex items-center justify-center self-start sm:self-auto space-x-1.5 px-3 py-1 rounded-full border text-xs sm:text-sm ${statusConfig.bgColor} ${statusConfig.borderColor}`}
                  >
                    <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
                    <span className={`font-medium ${statusConfig.color}`}>{appointment.status}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{appointmentDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{schedule?.time_slot || 'Time not set'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {isEmergency && (
                    <div className="inline-flex items-center space-x-1.5 px-2 py-1 rounded-full bg-red-50 border border-red-200 text-xs sm:text-sm">
                      <AlertTriangle className="h-3 w-3 text-red-600" />
                      <span className="font-medium text-red-600">Emergency</span>
                    </div>
                  )}

                  <div
                    className={`inline-flex items-center space-x-1.5 px-2 py-1 rounded-full border text-xs sm:text-sm ${appointmentTypeConfig.bgColor}`}
                  >
                    <AppointmentTypeIcon className={`h-3 w-3 ${appointmentTypeConfig.color}`} />
                    <span className={`font-medium ${appointmentTypeConfig.color}`}>
                      {appointmentTypeConfig.name}
                    </span>
                  </div>
                </div>
              </div>

             
                <div className={`flex items-center justify-end sm:justify-start space-x-1`} >
                {appointment.status == "Pending" && (
                  <button
                    onClick={() => handleEdit(appointment.appointment_id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    aria-label="Edit appointment"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
                {(appointment.status == "Pending" || appointment.status == "Rejected") && (
                  <button
                    onClick={() => handleDelete(appointment.appointment_id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    aria-label="Delete appointment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                
                 
                </div>
              
              
            </div>
          </div>
        );
      })}

      {deleteModalOpen && (
        <DeleteAppointmentModal
          appointmentID={selectedAppointmentId}
          onClose={handleCloseModal}
          onDeleteSuccess={handleDeleteSuccess}
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
          onSuccess={() => setIsUpdate((prev) => !prev)}
        />
      )}
      </div>
  );
}
