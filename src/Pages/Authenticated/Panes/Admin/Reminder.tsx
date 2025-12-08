import React, { useEffect, useState, useCallback } from 'react';
import { getReminders, createReminder, updateReminder, deleteReminder } from '@/API/Authenticated/admin/Reminder';
import { Eye, Pencil, Trash2, Search, Check, X, Plus, AlertTriangle, Loader2 } from 'lucide-react';

export default function Reminder() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterViewed, setFilterViewed] = useState('ALL');

  // State for Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null); // Null for create, object for edit

  // State for Delete Modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [IDtoDelete, setIDtoDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getReminders();
      if (response && response.reminders) {
        setReminders(response.reminders.map(r => ({
            ...r,
            information: typeof r.information === 'string' ? JSON.parse(r.information) : r.information
        })));
      }
    } catch (error) {
      console.error("Failed to fetch reminders", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // --- HANDLERS ---
  const handleCreateClick = () => {
    setCurrentReminder(null); // Clear any existing data
    setIsModalOpen(true);
  };

  const handleEditClick = (reminder) => {
    setCurrentReminder(reminder);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentReminder(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      // Ensure information is correctly parsed/stringified
      const payload = {
        ...formData,
        information: JSON.parse(formData.information),
        viewed: formData.viewed === '1' || formData.viewed === true ? 1 : 0,
      };

      if (currentReminder) {
        // Update existing reminder
        await updateReminder({ reminderID: currentReminder.id, ...payload });
      } else {
        // Create new reminder
        await createReminder(payload);
      }
      fetchReminders(); // Refresh data
      handleModalClose(); // Close modal
    } catch (error) {
      console.error("Error saving reminder", error);
      alert("Failed to save reminder. Check JSON format for 'information'.");
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
      await deleteReminder(IDtoDelete);
      setReminders(prev => prev.filter(r => r.id !== IDtoDelete));
      setOpenDeleteModal(false);
      setIDtoDelete(null);
    } catch (error) {
      console.error("Error deleting reminder", error);
      alert("Failed to delete reminder");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- HELPERS ---
  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch =
      reminder.appointment_id?.toString().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(reminder.information)?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesViewed =
      filterViewed === 'ALL' ||
      (filterViewed === 'VIEWED' && reminder.viewed === 1) ||
      (filterViewed === 'UNVIEWED' && (reminder.viewed === 0 || reminder.viewed === null));

    return matchesSearch && matchesViewed;
  });

  if (loading) return <div className="p-4">Loading reminders...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">

        {/* Header & Controls */}
        <div className="p-5 border-b border-gray-200 flex flex-col xl:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Reminder Management</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto justify-end">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reminders..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Viewed Filter */}
            <select
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={filterViewed}
              onChange={(e) => setFilterViewed(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="VIEWED">Viewed</option>
              <option value="UNVIEWED">Unviewed</option>
            </select>

            {/* Create Button */}
            <button
              onClick={handleCreateClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm font-medium"
            >
              <Plus size={18} />
              Create Reminder
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Appointment ID</th>
                <th className="p-4 border-b">Information</th>
                <th className="p-4 border-b">Viewed</th>
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredReminders.map((reminder) => (
                <tr key={reminder.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-4">{reminder.id}</td>
                  <td className="p-4">{reminder.appointment_id}</td>
                  <td className="p-4">
                    <pre className="whitespace-pre-wrap text-sm max-h-20 overflow-auto bg-gray-50 p-2 rounded">
                        {JSON.stringify(reminder.information, null, 2)}
                    </pre>
                  </td>
                  <td className="p-4">
                    {reminder.viewed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700">
                        <Check size={12} /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-700">
                        <X size={12} /> No
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEditClick(reminder)} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(reminder.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReminders.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No reminders found matching your search.
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
                {currentReminder ? 'Edit Reminder' : 'Create New Reminder'}
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const data = Object.fromEntries(formData.entries());
                handleFormSubmit(data);
              }}>
                <div className="mb-4">
                  <label htmlFor="appointment_id" className="block text-sm font-medium text-gray-700">Appointment ID</label>
                  <input
                    type="number"
                    id="appointment_id"
                    name="appointment_id"
                    defaultValue={currentReminder?.appointment_id || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="information" className="block text-sm font-medium text-gray-700">Information (JSON)</label>
                  <textarea
                    id="information"
                    name="information"
                    defaultValue={currentReminder?.information ? JSON.stringify(currentReminder.information, null, 2) : '{}'}
                    rows={8}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-mono text-sm"
                    required
                  ></textarea>
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="viewed"
                    name="viewed"
                    value="1"
                    defaultChecked={currentReminder?.viewed === 1}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="viewed" className="text-sm font-medium text-gray-700">Viewed</label>
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
                    {currentReminder ? 'Update Reminder' : 'Create Reminder'}
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Reminder?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete reminder <strong>#{IDtoDelete}</strong>? This action cannot be undone.
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
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  {isDeleting ? 'Deleting...' : 'Delete Reminder'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}