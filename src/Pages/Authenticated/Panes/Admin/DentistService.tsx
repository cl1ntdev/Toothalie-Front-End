import React, { useEffect, useState, useCallback } from 'react';
import { getDentistServices, createDentistService, updateDentistService, deleteDentistService } from '@/API/Authenticated/admin/DentistService';
import { Eye, Pencil, Trash2, Search, Plus, AlertTriangle, Loader2, Filter } from 'lucide-react';

export default function DentistService() {
  const [dentistServices, setDentistServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // NEW: State for Filter
  const [selectedFilter, setSelectedFilter] = useState('All');

  // State for Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDentistService, setCurrentDentistService] = useState(null);

  // State for Delete Modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [IDtoDelete, setIDtoDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDentistServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDentistServices();
      if (response && response.dentist_services) {
        setDentistServices(response.dentist_services);
      }
    } catch (error) {
      console.error("Failed to fetch dentist services", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDentistServices();
  }, [fetchDentistServices]);

  // --- HANDLERS ---
  const handleCreateClick = () => {
    setCurrentDentistService(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (dentistService) => {
    setCurrentDentistService(dentistService);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentDentistService(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentDentistService) {
        await updateDentistService({ dentistServiceID: currentDentistService.id, ...formData });
      } else {
        await createDentistService(formData);
      }
      fetchDentistServices();
      handleModalClose();
    } catch (error) {
      console.error("Error saving dentist service", error);
      alert("Failed to save dentist service");
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
      await deleteDentistService(IDtoDelete);
      setDentistServices(prev => prev.filter(ds => ds.id !== IDtoDelete));
      setOpenDeleteModal(false);
      setIDtoDelete(null);
    } catch (error) {
      console.error("Error deleting dentist service", error);
      alert("Failed to delete dentist service");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- HELPERS & FILTER LOGIC ---
  
  // 1. Extract unique service types dynamically from the data
  const uniqueServiceTypes = ['All', ...new Set(dentistServices.map(ds => ds.service_type_name).filter(Boolean))];

  // 2. Updated filtering logic
  const filteredDentistServices = dentistServices.filter((ds) => {
    // Search Filter
    const matchesSearch =
      ds.dentist_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.dentist_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.service_type_name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Category Filter
    const matchesCategory = selectedFilter === 'All' || ds.service_type_name === selectedFilter;

    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="p-4 flex items-center gap-2"><Loader2 className="animate-spin"/> Loading dentist services...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">

        {/* Header & Controls */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Dentist Service Management</h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto justify-end">
              {/* Search Input */}
              <div className="relative flex-grow sm:flex-grow-0 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreateClick}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm font-medium"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Create New</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* NEW: Filter Buttons Row */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500 flex items-center gap-1 mr-2">
              <Filter size={14} /> Filter by:
            </span>
            {uniqueServiceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedFilter(type)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 border ${
                  selectedFilter === type
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {type}
                {/* Optional: Add count badge */}
                {type !== 'All' && (
                  <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${selectedFilter === type ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                     {dentistServices.filter(d => d.service_type_name === type).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Dentist</th>
                <th className="p-4 border-b">Service</th>
                <th className="p-4 border-b">Service Type</th>
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredDentistServices.map((ds) => (
                <tr key={ds.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                  <td className="p-4">{ds.id}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{ds.dentist_first_name} {ds.dentist_last_name}</div>
                    <div className="text-xs text-gray-500">ID: {ds.user_id}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{ds.service_name}</span>
                    <span className="text-xs text-gray-500 ml-1">(ID: {ds.service_id})</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ds.service_type_name === 'GeneralDentistry' ? 'bg-green-100 text-green-800' : 
                      ds.service_type_name === 'SpecializedDentistry' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ds.service_type_name}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEditClick(ds)} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(ds.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDentistServices.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search size={32} className="text-gray-300"/>
                      <p>No results found for "{searchTerm}" with filter "{selectedFilter}"</p>
                      <button onClick={() => {setSearchTerm(''); setSelectedFilter('All')}} className="text-blue-600 hover:underline text-sm">
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS (Unchanged logic, just keeping placeholder for brevity) --- */}
      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
             {/* ... Form Logic Same as before ... */}
              <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {currentDentistService ? 'Edit Dentist Service' : 'Create New Dentist Service'}
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                handleFormSubmit(data);
              }}>
                <div className="mb-4">
                  <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">Dentist User ID</label>
                  <input type="number" id="user_id" name="user_id" defaultValue={currentDentistService?.user_id || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">Service ID</label>
                  <input type="number" id="service_id" name="service_id" defaultValue={currentDentistService?.service_id || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">{currentDentistService ? 'Update' : 'Create'}</button>
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Dentist Service?</h3>
              <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete dentist service <strong>#{IDtoDelete}</strong>?</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setOpenDeleteModal(false)} disabled={isDeleting} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50">Cancel</button>
                <button onClick={handleConfirmDelete} disabled={isDeleting} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium disabled:opacity-50">
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}