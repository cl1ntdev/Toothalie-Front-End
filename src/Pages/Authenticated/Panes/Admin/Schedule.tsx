import React, { useEffect, useState, useCallback } from 'react';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '@/API/Authenticated/admin/Schedule';
import { getUsers } from '@/API/Authenticated/admin/AppUser';
import { 
  Pencil, 
  Trash2, 
  Search, 
  Plus, 
  AlertTriangle, 
  Activity, // Loader
  Calendar,
  Clock,
  Filter,
  X,
  CheckCircle2
} from 'lucide-react';
import Alert from '@/components/_myComp/Alerts';
export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState('ALL');
  const [users, setUsers] = useState([]);
  const [timeSlot, setTimeSlot] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [IDtoDelete, setIDtoDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [alert, setAlert] = useState({ 
       show: false, 
       type: "info", 
       title: "", 
       message: "" 
     });
 

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const [response, usersResponse] = await Promise.all([
        getSchedules(),
        getUsers()
      ]);
      if (response && response.schedules) setSchedules(response.schedules);
      if (usersResponse && usersResponse.users) setUsers(usersResponse.users);
    } catch (error) {
      console.error("Failed to fetch schedules", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // --- HANDLERS ---
  const handleCreateClick = () => {
    setCurrentSchedule(null);
    setTimeSlot('');
    setIsModalOpen(true);
  };

  const handleEditClick = (schedule) => {
    setCurrentSchedule(schedule);
    setTimeSlot(schedule.time_slot || '');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentSchedule(null);
    setTimeSlot('');
  };

  const handleFormSubmit = async (formData) => {
    try {
      const timeSlotValue = timeSlot || formData.time_slot || '';
      const trimmedTimeSlot = timeSlotValue.trim();
      
      if (!trimmedTimeSlot) {
        alert('Time slot is required');
        return;
      }
      
      if (!/^\d{1,2}:\d{2}(AM|PM)\s*-\s*\d{1,2}:\d{2}(AM|PM)$/i.test(trimmedTimeSlot)) {
        alert('Time slot must be in format: "10:00AM - 11:00AM"');
        return;
      }
      
      const normalizedTimeSlot = trimmedTimeSlot
        .replace(/\s+/g, ' ')
        .replace(/(am|pm)/gi, (match) => match.toUpperCase());
      
      const data = {
        dentistID: parseInt(formData.dentistID),
        day_of_week: formData.day_of_week,
        time_slot: normalizedTimeSlot
      };
      
      if (currentSchedule) {
        await updateSchedule({ scheduleID: currentSchedule.scheduleID, ...data });
        
        
         setAlert({
                  show: true,
                  type: "success", // success, error, warning, info
                  title: "Updated Successfully",
                  message: "Schedule updated from the system."
                });

      } else {
        await createSchedule(data);
        
        
         setAlert({
                  show: true,
                  type: "success", // success, error, warning, info
                  title: "Created Successfully",
                  message: "Schedule added to the system."
                });

      }
      fetchSchedules();
      handleModalClose();
    } catch (error) {
      console.error("Error saving schedule", error);
      alert("Failed to save schedule");
    }
  };

  const handleDeleteClick = (id) => {
    setIDtoDelete(id);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!IDtoDelete) return;
    setIsDeleting(true);
    try {
      await deleteSchedule(IDtoDelete);
      setSchedules(prev => prev.filter(s => s.scheduleID !== IDtoDelete));
      setOpenDeleteModal(false);
      setIDtoDelete(null);
      
      
       setAlert({
                show: true,
                type: "success", // success, error, warning, info
                title: "Deleted Successfully",
                message: "Schedule deleted from the system."
              });

    } catch (error) {
      console.error("Error deleting schedule", error);
      alert("Failed to delete schedule");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- HELPERS ---
  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.dentist_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.dentist_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.day_of_week?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.time_slot?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDay =
      filterDay === 'ALL' || schedule.day_of_week?.toLowerCase() === filterDay.toLowerCase();

    return matchesSearch && matchesDay;
  });

  const getDayBadgeStyle = (day) => {
    const styles = {
      Monday: 'bg-blue-50 text-blue-700 border-blue-100',
      Tuesday: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      Wednesday: 'bg-violet-50 text-violet-700 border-violet-100',
      Thursday: 'bg-purple-50 text-purple-700 border-purple-100',
      Friday: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
      Saturday: 'bg-rose-50 text-rose-700 border-rose-100',
      Sunday: 'bg-orange-50 text-orange-700 border-orange-100',
    };
    return styles[day] || 'bg-gray-50 text-gray-700 border-gray-100';
  };

  if (loading) {
    return(
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-ceramon">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <Activity className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Schedules...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 lg:p-10 font-ceramon text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">

        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
             {/* Search */}
             <div className="relative flex-grow md:flex-grow-0 md:min-w-[240px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search dentist, time..."
                className="pl-10 pr-4 py-2.5 w-full bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-sans shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="relative flex-1 md:flex-none">
                 <select
                  className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
                  value={filterDay}
                  onChange={(e) => setFilterDay(e.target.value)}
                >
                  <option value="ALL">All Days</option>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

             {/* Create Button */}
             <button
              onClick={handleCreateClick}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-200 font-medium text-sm w-full md:w-auto active:scale-95"
            >
              <Plus size={18} />
              <span>Add Slot</span>
            </button>
          </div>
        </div>

        {/* --- VIEW 1: DESKTOP TABLE --- */}
        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-8 py-5">Dentist</th>
                <th className="px-6 py-5">Day Availability</th>
                <th className="px-6 py-5">Time Slot</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.scheduleID} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-sm flex items-center justify-center text-indigo-600 font-bold text-sm">
                           {getInitials(schedule.dentist_first_name, schedule.dentist_last_name)}
                        </div>
                        <div>
                           <p className="font-bold text-slate-900 text-sm">{schedule.dentist_first_name} {schedule.dentist_last_name}</p>
                           <p className="text-xs text-slate-400 font-sans">ID: {schedule.dentistID}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getDayBadgeStyle(schedule.day_of_week)}`}>
                        {schedule.day_of_week}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                        <Clock size={16} className="text-slate-400" />
                        {schedule.time_slot}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditClick(schedule)} className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 rounded-lg transition-all shadow-sm">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(schedule.scheduleID)} className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 rounded-lg transition-all shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSchedules.length === 0 && (
                <tr>
                    <td colSpan="4" className="p-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                            <Calendar className="h-10 w-10 mb-2 text-slate-300" />
                            <p>No schedules found</p>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- VIEW 2: MOBILE CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {filteredSchedules.map((schedule) => (
                <div key={schedule.scheduleID} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-sm flex items-center justify-center text-indigo-600 font-bold text-sm">
                                {getInitials(schedule.dentist_first_name, schedule.dentist_last_name)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">{schedule.dentist_first_name} {schedule.dentist_last_name}</h3>
                                <p className="text-xs text-slate-400 font-sans">#{schedule.scheduleID}</p>
                            </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getDayBadgeStyle(schedule.day_of_week)}`}>
                            {schedule.day_of_week.slice(0, 3)}
                        </span>
                    </div>

                    <div className="pl-1 mb-5">
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                             <Clock size={16} className="text-indigo-500" />
                             <span className="font-medium text-slate-700 text-sm">{schedule.time_slot}</span>
                         </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-50">
                        <button 
                            onClick={() => handleEditClick(schedule)}
                            className="flex-1 py-2 flex items-center justify-center gap-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Pencil size={16} /> Edit
                        </button>
                        <button 
                            onClick={() => handleDeleteClick(schedule.scheduleID)}
                            className="flex-1 py-2 flex items-center justify-center gap-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                </div>
            ))}
             {filteredSchedules.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-200 text-slate-400 col-span-1 md:col-span-2">
                    No schedules found
                </div>
            )}
        </div>

      </div>

      {/* --- CREATE / EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={handleModalClose}></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
             {/* Header */}
             <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-slate-900 font-ceramon">
                {currentSchedule ? 'Edit Schedule' : 'New Schedule'}
              </h3>
              <button onClick={handleModalClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <form id="scheduleForm" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                data.time_slot = timeSlot; // Ensure state value is used
                handleFormSubmit(data);
              }}>
                <div className="space-y-6">
                  {/* Dentist Select */}
                  <div>
                    <label htmlFor="dentistID" className="block text-sm font-medium text-slate-700 mb-1.5">Select Dentist</label>
                    <select 
                      id="dentistID" 
                      name="dentistID" 
                      defaultValue={currentSchedule?.dentistID || ''} 
                      className="w-full rounded-xl border-slate-200 border text-sm py-3 px-4 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none" 
                      required
                    >
                      <option value="" disabled>Choose a dentist...</option>
                      {users
                        .filter(u => {
                          try {
                            const roles = typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles;
                            return Array.isArray(roles) && roles.some(r => r.includes('DENTIST'));
                          } catch { return false; }
                        })
                        .map((dentist) => (
                          <option key={dentist.id} value={dentist.id}>
                            {dentist.first_name} {dentist.last_name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Day Select */}
                  <div>
                    <label htmlFor="day_of_week" className="block text-sm font-medium text-slate-700 mb-1.5">Day of Week</label>
                    <select 
                      id="day_of_week" 
                      name="day_of_week" 
                      defaultValue={currentSchedule?.day_of_week || ''} 
                      className="w-full rounded-xl border-slate-200 border text-sm py-3 px-4 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none" 
                      required
                    >
                      <option value="" disabled>Select day...</option>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  {/* Time Slot Input */}
                  <div>
                    <label htmlFor="time_slot" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Time Slot
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                        type="text"
                        id="time_slot"
                        name="time_slot"
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        onBlur={(e) => {
                            const value = e.target.value.trim();
                            if (value && !/^\d{1,2}:\d{2}(AM|PM)\s*-\s*\d{1,2}:\d{2}(AM|PM)$/i.test(value)) {
                            const fixed = value
                                .replace(/\s+/g, ' ')
                                .replace(/(\d{1,2}:\d{2})\s*(am|pm)\s*-\s*(\d{1,2}:\d{2})\s*(am|pm)/i, '$1$2 - $3$4')
                                .toUpperCase();
                            if (/^\d{1,2}:\d{2}(AM|PM)\s*-\s*\d{1,2}:\d{2}(AM|PM)$/i.test(fixed)) {
                                setTimeSlot(fixed);
                            }
                            }
                        }}
                        placeholder="e.g. 09:00AM - 12:00PM"
                        className="w-full rounded-xl border-slate-200 border text-sm py-3 pl-10 pr-4 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                        required
                        />
                    </div>
                    <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Format required: HH:MM(AM/PM) - HH:MM(AM/PM)
                    </p>
                  </div>
                </div>
              </form>
            </div>

             {/* Footer */}
             <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
               <button type="button" onClick={handleModalClose} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm">
                  Cancel
               </button>
               <button type="submit" form="scheduleForm" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                  {currentSchedule ? 'Update Schedule' : 'Create Schedule'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {openDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setOpenDeleteModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
               <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 border border-rose-100">
                 <AlertTriangle className="h-8 w-8 text-rose-500" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">Remove Schedule?</h3>
               <p className="text-sm text-slate-500 mb-8">
                  Are you sure you want to delete this availability slot?
               </p>
               <div className="flex gap-3 justify-center">
                  <button onClick={() => setOpenDeleteModal(false)} disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                     Cancel
                  </button>
                  <button onClick={handleConfirmDelete} disabled={isDeleting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 font-medium transition-all shadow-lg shadow-rose-200">
                     {isDeleting ? <Activity size={18} className="animate-pulse" /> : "Delete"}
                  </button>
               </div>
            </div>
          </div>
        </div>
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