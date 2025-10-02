  import React, { useState, useEffect } from 'react';
  import FetchAppointment from '@/API/Authenticated/appointment/FetchAppointment';
  import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
  import DeleteAppointmentModal from './DeleteAppointmentModal';
  import EditModal from './EditModal';
  
  type appointmentProps ={
    fetchNewAppointment: boolean
    onFetched: () => void;  
  }
  
  export default function UpcomingAppointment({ fetchNewAppointment,onFetched }:appointmentProps) {
    const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
    const [isUpdate,setIsUpdate] = useState<boolean>(false)
    const [editModalOpen,setEditModalOpen] = useState<boolean>(false)
    
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
          onFetched();  // reset parent flag
        }
      };
      setIsUpdate(false)
      fetchData();
    }, [fetchNewAppointment,isUpdate]);
  
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
      console.log(appointmentId)
      setSelectedAppointmentId(appointmentId);
      setEditModalOpen(true)
    };
  
    const triggerDelete = () => {
      console.log("trigger delete")
      setIsUpdate(true)
    }
    
    if (loading) {
      return (
        <div className="text-center text-gray-500 py-4">
          <svg
            className="animate-spin h-5 w-5 mx-auto text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          Loading appointments...
        </div>
      );
    }
  
    if (error || !appointmentsData.length) {
      return (
        <div className="text-center text-red-500 py-4">
          {error || 'No upcoming appointments found.'}
        </div>
      );
    }
  
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Appointments</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointmentsData.map((appointmentData, index) => {
            const { appointment, dentist, schedules } = appointmentData;
            const schedule = schedules.find((s) => s.scheduleID === appointment.schedule_id);
  
            return (
              <div
                key={appointment.appointment_id || index}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {dentist?.name || 'Unknown Dentist'}
                      </h2>
                      <p className="text-sm text-gray-500">{dentist?.specialty || 'No specialty'}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(appointment.appointment_id)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Edit appointment"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.appointment_id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete appointment"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600">
                      <span className="font-medium">Date:</span>{' '}
                      {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Time:</span> {schedule?.time_slot || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {deleteModalOpen && (
          <DeleteAppointmentModal
            appointmentID={selectedAppointmentId}
            onClose={handleCloseModal}
            onDeleteSuccess={handleDeleteSuccess} 
            deleteSuccess={triggerDelete}    
          />
        )}
        { editModalOpen && (
          <EditModal 
          appointmentID={selectedAppointmentId}
          onClose={() => {
               setEditModalOpen(false);
               setSelectedAppointmentId(null);
             }}
          onSuccess={()=>setIsUpdate(prev=>!prev)}
          />
        )}
        { }
      </div>
    );
  }
