import React, { useEffect, useState, useCallback } from 'react';
import { getDentistServices, createDentistService, updateDentistService, deleteDentistService } from '@/API/Authenticated/admin/DentistService';
import { getUsers } from '@/API/Authenticated/admin/AppUser';
import { getServices } from '@/API/Authenticated/admin/Services';
import { 
  Pencil, 
  Trash2, 
  Search, 
  Plus, 
  AlertTriangle, 
  Activity, // Loader
  Filter, 
  Stethoscope,
  BriefcaseMedical,
  CheckCircle2,
  XCircle,
  X,
  Sparkles
} from 'lucide-react';
import Alert from '@/components/_myComp/Alerts';
export default function DentistService() {
  const [dentistServices, setDentistServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  
  // Filter State
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDentistService, setCurrentDentistService] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [IDtoDelete, setIDtoDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [alert, setAlert] = useState({ 
       show: false, 
       type: "info", 
       title: "", 
       message: "" 
     });
 

  const fetchDentistServices = useCallback(async () => {
    try {
      setLoading(true);
      const [response, usersResponse, servicesResponse] = await Promise.all([
        getDentistServices(),
        getUsers(),
        getServices()
      ]);
      
      if (response && response.dentist_services) setDentistServices(response.dentist_services);
      if (usersResponse && usersResponse.users) setUsers(usersResponse.users);
      if (servicesResponse && servicesResponse.data) setServices(servicesResponse.data);
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
        setAlert({
                 show: true,
                 type: "success", // success, error, warning, info
                 title: "Updated Successfully",
                 message: "Dentist Service updated in the system."
               });

      } else {
        await createDentistService(formData);
        setAlert({
                 show: true,
                 type: "success", // success, error, warning, info
                 title: "Created Successfully",
                 message: "Dentist Service added to the system."
               });

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
      setAlert({
               show: true,
               type: "success", // success, error, warning, info
               title: "Delted Successfully",
               message: "User deleted from the system."
             });

    } catch (error) {
      console.error("Error deleting dentist service", error);
      alert("Failed to delete dentist service");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- HELPERS ---
  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
  };

  const uniqueServiceTypes = ['All', ...new Set(dentistServices.map(ds => ds.service_type_name).filter(Boolean))];

  const filteredDentistServices = dentistServices.filter((ds) => {
    const matchesSearch =
      ds.dentist_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.dentist_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.service_type_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedFilter === 'All' || ds.service_type_name === selectedFilter;

    return matchesSearch && matchesCategory;
  });

  const getServiceBadge = (type) => {
    if (type === 'SpecializedDentistry') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
          <Sparkles size={10} /> Specialized
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
        <BriefcaseMedical size={10} /> General
      </span>
    );
  };

  if (loading) {
    return(
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-ceramon">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <Activity className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Services...</p>
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
                placeholder="Search dentist or service..."
                className="pl-10 pr-4 py-2.5 w-full bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-sans shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative flex-1 md:flex-none">
                 <select
                  className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  {uniqueServiceTypes.map((type) => (
                    <option key={type} value={type}>
                        {type === 'All' ? 'All Service Types' : type}
                    </option>
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
              <span>Assign Service</span>
            </button>
          </div>
        </div>

        {/* --- VIEW 1: DESKTOP TABLE (Hidden on Mobile) --- */}
        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-8 py-5">Dentist Profile</th>
                <th className="px-6 py-5">Service Offered</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDentistServices.map((ds) => (
                <tr key={ds.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold text-sm">
                           {getInitials(ds.dentist_first_name, ds.dentist_last_name)}
                        </div>
                        <div>
                           <p className="font-bold text-slate-900 text-sm">{ds.dentist_first_name} {ds.dentist_last_name}</p>
                           <p className="text-xs text-slate-400 font-sans">ID: {ds.user_id}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{ds.service_name}</span>
                        <span className="text-xs text-slate-400 font-sans">Service ID: {ds.service_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     {getServiceBadge(ds.service_type_name)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditClick(ds)} className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 rounded-lg transition-all shadow-sm">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteClick(ds.id)} className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 rounded-lg transition-all shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDentistServices.length === 0 && (
                <tr>
                    <td colSpan="4" className="p-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                            <Stethoscope className="h-10 w-10 mb-2 text-slate-300" />
                            <p>No services found</p>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- VIEW 2: MOBILE CARDS (Visible on < lg) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {filteredDentistServices.map((ds) => (
                <div key={ds.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold text-sm">
                                {getInitials(ds.dentist_first_name, ds.dentist_last_name)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">{ds.dentist_first_name} {ds.dentist_last_name}</h3>
                                <p className="text-xs text-slate-400 font-sans">Record #{ds.id}</p>
                            </div>
                        </div>
                        {getServiceBadge(ds.service_type_name)}
                    </div>

                    <div className="pl-1 mb-5 space-y-2">
                        <div className="flex justify-between text-sm">
                             <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Service Name</span>
                             <span className="font-medium text-slate-700">{ds.service_name}</span>
                         </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-50">
                        <button 
                            onClick={() => handleEditClick(ds)}
                            className="flex-1 py-2 flex items-center justify-center gap-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Pencil size={16} /> Edit
                        </button>
                        <button 
                            onClick={() => handleDeleteClick(ds.id)}
                            className="flex-1 py-2 flex items-center justify-center gap-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors text-sm font-medium"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                </div>
            ))}
             {filteredDentistServices.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-200 text-slate-400 col-span-1 md:col-span-2">
                    No services found
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
                {currentDentistService ? 'Edit Assignment' : 'Assign Service'}
              </h3>
              <button onClick={handleModalClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <form id="dentistServiceForm" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {
                  user_id: parseInt(formData.get('user_id')),
                  service_id: parseInt(formData.get('service_id'))
                };
                handleFormSubmit(data);
              }}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="user_id" className="block text-sm font-medium text-slate-700 mb-1.5">Select Dentist</label>
                    <div className="relative">
                        <select 
                        id="user_id" 
                        name="user_id" 
                        defaultValue={currentDentistService?.user_id || ''} 
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
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Stethoscope size={16} className="text-slate-400" />
                        </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service_id" className="block text-sm font-medium text-slate-700 mb-1.5">Select Service</label>
                     <div className="relative">
                        <select 
                        id="service_id" 
                        name="service_id" 
                        defaultValue={currentDentistService?.service_id || ''} 
                        className="w-full rounded-xl border-slate-200 border text-sm py-3 px-4 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none" 
                        required
                        >
                        <option value="" disabled>Choose a service...</option>
                        {services.map((service) => (
                            <option key={service.service_id} value={service.service_id}>
                            {service.service_name} — {service.serviceTypeName}
                            </option>
                        ))}
                        </select>
                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <BriefcaseMedical size={16} className="text-slate-400" />
                        </div>
                     </div>
                  </div>
                </div>
              </form>
            </div>

             {/* Footer */}
             <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
               <button type="button" onClick={handleModalClose} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm">
                  Cancel
               </button>
               <button type="submit" form="dentistServiceForm" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                  {currentDentistService ? 'Update Assignment' : 'Assign Service'}
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
               <h3 className="text-xl font-bold text-slate-900 mb-2">Remove Assignment?</h3>
               <p className="text-sm text-slate-500 mb-8">
                  Are you sure you want to remove this service assignment?
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