"use client";

import React, { useState, useEffect } from 'react';
import { FetchAppointment } from '@/API/Authenticated/appointment/FetchAppointment';
import AppointmentModal from './AppointmentModal';
import DeleteAppointmentModal from './DeleteAppointmentModal';
import EditModal from './EditModal';
import ViewAppointmentModal from './ViewAppointmentModal';
import {
  Pencil,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Stethoscope,
  Eye,
  Activity, // Loader
  MapPin,
  MoreHorizontal
} from 'lucide-react';
import Alert from '@/components/_myComp/Alerts';


export default function UpcomingAppointment() {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [viewAppointmentModal, setViewAppointmentModal] = useState(false);

  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  
  const [alert, setAlert] = useState({ 
       show: false, 
       type: "info", 
       title: "", 
       message: "" 
     });
 
 

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

  const handleDelete = (id) => {
    setSelectedAppointmentId(id);
    setDeleteModalOpen(true);
  };

  const handleEdit = (id) => {
    setSelectedAppointmentId(id);
    setEditModalOpen(true);
  };
  
  const handleEditSuccess = () => {
    setAlert({
             show: true,
             type: "success", // success, error, warning, info
             title: "Updated Successfully",
             message: "Updated appointment from the system."
           });
    setIsUpdate((prev) => !prev)
  }

  const handleCloseModal = () => setShowAppointmentModal(false);
  const handleAppointmentSuccess = () => {
    setAlert({
             show: true,
             type: "success", // success, error, warning, info
             title: "Created Successfully",
             message: "Created appointment to the system."
           });
    setShowAppointmentModal(false);
    setIsUpdate(true);
  };

  const triggerDelete = () => {
    setAlert({
             show: true,
             type: "success", // success, error, warning, info
             title: "Delete Successfully",
             message: "Deleted appointment from the system."
           });

    setIsUpdate(true);
    setAppointmentsData((prev) =>
      prev.filter((appt) => appt.appointment.appointment_id !== selectedAppointmentId)
    );
    setDeleteModalOpen(false);
    setSelectedAppointmentId(null);
  };

  // --- UI HELPERS ---
  const getStatusConfig = (status) => {
    const config = {
      Pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
      Approved: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
      Rejected: { icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    };
    return config[status] || config.Pending;
  };

  const getAppointmentTypeBadge = (typeId) => {
    if (typeId === 2) { // Family
        return <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Family Visit</span>
    }
    return <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Standard</span>
  };

  const getDateComponents = (dateString) => {
      const date = new Date(dateString);
      return {
          day: date.getDate(),
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
          full: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      };
  };

  // --- RENDER STATES ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-ceramon">
        <div className="relative">
          <Activity className="h-12 w-12 text-indigo-600 animate-pulse stroke-1" />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
            <div className="bg-rose-50 p-4 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Oops! Something went wrong.</h3>
            <p className="text-slate-500 mt-2">{error}</p>
            <button 
                onClick={() => setIsUpdate(!isUpdate)} 
                className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
                Try Again
            </button>
        </div>
    );
  }

  return (
    <div className="space-y-8 font-ceramon text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        
        <button
          onClick={() => setShowAppointmentModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-medium active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Appointments Grid */}
      {appointmentsData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="bg-slate-50 p-6 rounded-full mb-4">
             <Calendar className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-lg font-medium text-slate-900">No upcoming appointments</p>
          <p className="text-slate-400 text-sm mt-1 mb-6">You are all caught up! Need to see a doctor?</p>
          <button 
            onClick={() => setShowAppointmentModal(true)}
            className="text-indigo-600 font-medium hover:underline hover:text-indigo-700"
          >
            Schedule a visit now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {appointmentsData.map((appointmentData) => {
            const { appointment, dentist, schedules } = appointmentData;
            const schedule = schedules.find((s) => s.scheduleID === appointment.schedule_id);
            const dateInfo = getDateComponents(appointment.user_set_date);
            const statusCfg = getStatusConfig(appointment.status);
            const StatusIcon = statusCfg.icon;
            const isEmergency = appointment.emergency === 1;

            const canEdit = appointment.status === 'Pending';
            const canDelete = appointment.status === 'Pending' || appointment.status === 'Rejected';
            
            // View is available for everyone to see details, but Edit is restricted
            const canView = true; 

            return (
              <div
                key={appointment.appointment_id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Emergency Strip */}
                {isEmergency && <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>}

                <div className="flex items-start gap-5">
                  {/* Date Box */}
                  <div className="flex flex-col items-center justify-center w-16 h-20 bg-slate-50 rounded-2xl border border-slate-100 shrink-0 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                    <span className="text-xs font-bold text-slate-400 uppercase group-hover:text-indigo-400">{dateInfo.month}</span>
                    <span className="text-2xl font-bold text-slate-900 font-ceramon group-hover:text-indigo-600">{dateInfo.day}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-wrap gap-2 mb-1">
                            {getAppointmentTypeBadge(appointment.appointment_type_id)}
                            {isEmergency && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 flex items-center gap-1">
                                    <AlertTriangle size={10} /> Emergency
                                </span>
                            )}
                        </div>
                        
                        {/* Status Badge */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color}`}>
                            <StatusIcon size={12} />
                            {appointment.status}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 truncate">
                        Dr. {dentist?.first_name} {dentist?.last_name || 'Unassigned'}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                        <Stethoscope size={14} className="text-slate-400"/>
                        {dentist?.specialty || 'General Dentistry'}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-indigo-500" />
                            <span className="font-medium">{schedule?.time_slot || 'Time TBD'}</span>
                        </div>
                        <div className="w-px h-4 bg-slate-200"></div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <span className="truncate">{dateInfo.weekday}</span>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-slate-50">
                    {canView && (
                        <button
                        onClick={() => {
                            setSelectedAppointmentData(appointmentData);
                            setViewAppointmentModal(true);
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Details"
                        >
                        <Eye size={18} />
                        </button>
                    )}
                    {canEdit && (
                        <button
                        onClick={() => handleEdit(appointment.appointment_id)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Appointment"
                        >
                        <Pencil size={18} />
                        </button>
                    )}
                    {canDelete && (
                        <button
                        onClick={() => handleDelete(appointment.appointment_id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Cancel Appointment"
                        >
                        <Trash2 size={18} />
                        </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODALS --- */}
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
          onSuccessEdit={handleEditSuccess}
        />
      )}
      
      {viewAppointmentModal && selectedAppointmentData && (
        <ViewAppointmentModal
          appointmentData={selectedAppointmentData}
          onClose={() => setViewAppointmentModal(false)}
        />
      )}
      
      <Alert 
                      isOpen={alert.show} 
                      type={alert.type}
                      title={alert.title}
                      message={alert.message}
                      onClose={() => setAlert({ ...alert, show: false })} 
                    />
    </div>
  );
}