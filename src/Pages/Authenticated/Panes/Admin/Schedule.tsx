import React, { useEffect, useState, useCallback } from 'react';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '@/API/Authenticated/admin/Schedule';
import { getUsers } from '@/API/Authenticated/admin/AppUser';
import { Eye, Pencil, Trash2, Search, Plus, AlertTriangle, Loader2 } from 'lucide-react';

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState('ALL');
  const [users, setUsers] = useState([]);
  const [timeSlot, setTimeSlot] = useState('');

  // State for Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null); // Null for create, object for edit

  // State for Delete Modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [IDtoDelete, setIDtoDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const [response, usersResponse] = await Promise.all([
        getSchedules(),
        getUsers()
      ]);
      if (response && response.schedules) {
        setSchedules(response.schedules);
      }
      if (usersResponse && usersResponse.users) {
        setUsers(usersResponse.users);
      }
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
    setCurrentSchedule(null); // Clear any existing data
    setTimeSlot(''); // Clear time slot
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
      // Validate time slot format
      const timeSlotValue = timeSlot || formData.time_slot || '';
      const trimmedTimeSlot = timeSlotValue.trim();
      
      if (!trimmedTimeSlot) {
        alert('Time slot is required');
        return;
      }
      
      if (!/^\d{1,2}:\d{2}(AM|PM)\s*-\s*\d{1,2}:\d{2}(AM|PM)$/i.test(trimmedTimeSlot)) {
        alert('Time slot must be in format: "10:00AM - 11:00AM"\nExample: 9:00AM - 10:00AM or 2:30PM - 3:30PM');
        return;
      }
      
      // Normalize format (uppercase AM/PM, single space around dash)
      const normalizedTimeSlot = trimmedTimeSlot
        .replace(/\s+/g, ' ')
        .replace(/(am|pm)/gi, (match) => match.toUpperCase());
      
      const data = {
        dentistID: parseInt(formData.dentistID),
        day_of_week: formData.day_of_week,
        time_slot: normalizedTimeSlot
      };
      
      if (currentSchedule) {
        // Update existing schedule
        await updateSchedule({ scheduleID: currentSchedule.scheduleID, ...data });
      } else {
        // Create new schedule
        await createSchedule(data);
      }
      fetchSchedules(); // Refresh data
      handleModalClose(); // Close modal
      setTimeSlot(''); // Reset time slot
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
    } catch (error) {
      console.error("Error deleting schedule", error);
      alert("Failed to delete schedule");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- HELPERS ---
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

  if (loading) return <div className="p-4">Loading schedules...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">

        {/* Header & Controls */}
        <div className="p-5 border-b border-gray-200 flex flex-col xl:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Schedule Management</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto justify-end">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search schedules..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Day Filter */}
            <select
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
            >
              <option value="ALL">All Days</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>

            {/* Create Button */}
            <button
              onClick={handleCreateClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm font-medium"
            >
              <Plus size={18} />
              Create Schedule
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Dentist</th>
                <th className="p-4 border-b">Day</th>
                <th className="p-4 border-b">Time Slot</th>
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.scheduleID} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-4">{schedule.scheduleID}</td>
                  <td className="p-4">{schedule.dentist_first_name} {schedule.dentist_last_name} (ID: {schedule.dentistID})</td>
                  <td className="p-4">{schedule.day_of_week}</td>
                  <td className="p-4">{schedule.time_slot}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEditClick(schedule)} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(schedule.scheduleID)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSchedules.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No schedules found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}
      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {currentSchedule ? 'Edit Schedule' : 'Create New Schedule'}
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const data = {
                  ...Object.fromEntries(formData.entries()),
                  time_slot: timeSlot || formData.get('time_slot') || ''
                };
                handleFormSubmit(data);
              }}>
                <div className="mb-4">
                  <label htmlFor="dentistID" className="block text-sm font-medium text-gray-700 mb-1">Dentist</label>
                  <select
                    id="dentistID"
                    name="dentistID"
                    defaultValue={currentSchedule?.dentistID || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select Dentist</option>
                    {users
                      .filter(u => {
                        try {
                          const roles = typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles;
                          return Array.isArray(roles) && roles.some(r => r.includes('DENTIST'));
                        } catch {
                          return false;
                        }
                      })
                      .map((dentist) => (
                        <option key={dentist.id} value={dentist.id}>
                          {dentist.first_name} {dentist.last_name} ({dentist.username})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                  <select
                    id="day_of_week"
                    name="day_of_week"
                    defaultValue={currentSchedule?.day_of_week || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="time_slot" className="block text-sm font-medium text-gray-700 mb-1">
                    Time Slot
                    <span className="text-xs text-gray-500 ml-1">(Format: 10:00AM - 11:00AM)</span>
                  </label>
                  <input
                    type="text"
                    id="time_slot"
                    name="time_slot"
                    value={timeSlot !== '' ? timeSlot : (currentSchedule?.time_slot || '')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTimeSlot(value);
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      // Auto-format if close to correct format
                      if (value && !/^\d{1,2}:\d{2}(AM|PM)\s*-\s*\d{1,2}:\d{2}(AM|PM)$/i.test(value)) {
                        // Try to fix common mistakes
                        const fixed = value
                          .replace(/\s+/g, ' ')
                          .replace(/(\d{1,2}:\d{2})\s*(am|pm)\s*-\s*(\d{1,2}:\d{2})\s*(am|pm)/i, (match, time1, ampm1, time2, ampm2) => {
                            return `${time1}${ampm1.toUpperCase()} - ${time2}${ampm2.toUpperCase()}`;
                          });
                        if (fixed !== value && /^\d{1,2}:\d{2}(AM|PM)\s*-\s*\d{1,2}:\d{2}(AM|PM)$/i.test(fixed)) {
                          setTimeSlot(fixed);
                        }
                      }
                    }}
                    placeholder="10:00AM - 11:00AM"
                    pattern="^\d{1,2}:\d{2}(AM|PM)\s*-\s*\d{1,2}:\d{2}(AM|PM)$"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Example: 9:00AM - 10:00AM, 2:30PM - 3:30PM
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                  >
                    {currentSchedule ? 'Update Schedule' : 'Create Schedule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {openDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Schedule?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete schedule <strong>#{IDtoDelete}</strong>? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setOpenDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Delete Schedule'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}