import React, { useState, useEffect } from 'react';
import FetchAppointment from '@/API/Authenticated/appointment/FetchAppointment';
import { Pencil, Trash2, Calendar, Clock, User } from 'lucide-react';
import DeleteAppointmentModal from './DeleteAppointmentModal';
import EditModal from './EditModal';

type appointmentProps = {
  fetchNewAppointment: boolean
  onFetched: () => void;  
}

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
        console.log('Fetched appointment data:', data);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        {error}
      </div>
    );
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
        const appointmentDate = new Date(appointment.appointment_date);

        return (
          <div
            key={appointment.appointment_id || index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {dentist?.name || 'Unknown Dentist'}
                    </h3>
                    <p className="text-sm text-gray-500">{dentist?.specialty || 'General Dentistry'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {appointmentDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{schedule?.time_slot || 'Time not set'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 ml-4">
                <button
                  onClick={() => handleEdit(appointment.appointment_id)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  aria-label="Edit appointment"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(appointment.appointment_id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  aria-label="Delete appointment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
          onSuccess={() => setIsUpdate(prev => !prev)}
        />
      )}
    </div>
  );
}