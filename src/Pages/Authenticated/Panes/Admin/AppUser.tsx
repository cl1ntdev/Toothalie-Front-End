import React, { useEffect, useState, useCallback } from 'react';
import { getUsers, deleteUser } from '@/API/Authenticated/admin/AppUser'; 
import { 
  Pencil, 
  Trash2, 
  Search, 
  Plus, 
  AlertTriangle, 
  Loader2, 
  Shield, 
  Mail, 
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Activity,
  MoreHorizontal
} from 'lucide-react'; 
import AppUserEditModal from './AppUserEditModal';
import AppUserCreate from './AppUserCreate';
import Alert from '@/components/_myComp/Alerts';
export default function AppUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); 
  
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false); 
  const [IDtoEdit, setIDtoEdit] = useState("");

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [IDtoDelete, setIDtoDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alert, setAlert] = useState({ 
      show: false, 
      type: "info", 
      title: "", 
      message: "" 
    });
  const fetchUsers = useCallback(async () => {
    try {
      const response = await getUsers();
      if (response && response.users) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- HANDLERS ---
  const handleCreate = () => setOpenCreateModal(true);

  const handleCreateSuccess = () => {
    console.log('success')
    setAlert({
          show: true,
          type: "success", // success, error, warning, info
          title: "Created Successfully",
          message: "User added to the system."
        });
    setOpenCreateModal(false);
    fetchUsers();
  };
  const handleEditSuccess = () => {
    console.log('success')
    setAlert({
          show: true,
          type: "success", // success, error, warning, info
          title: "Update Successfully",
          message: "Sucessfull updated a user"
        });
    setOpenCreateModal(false);
    fetchUsers();
  };
  const handleDeleteSuccess = () => {
    console.log('success')
    setAlert({
          show: true,
          type: "success", // success, error, warning, info
          title: "Deleted Successfully",
          message: "Sucessfull deleted a user"
        });
    setOpenCreateModal(false);
    fetchUsers();
  };

  const handleCloseEdit = () => {
    setIDtoEdit("");
    setOpenEditModal(false);
    fetchUsers();
  };

  const handleEdit = (id) => {    
    setIDtoEdit(id);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (id) => {
    setIDtoDelete(id);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!IDtoDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(IDtoDelete); 
      setUsers(prevUsers => prevUsers.filter(u => u.id !== IDtoDelete));
      setOpenDeleteModal(false);
      setIDtoDelete(null);
      handleDeleteSuccess()
    } catch (error) {
      console.error("Error deleting user", error);
      alert("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- HELPERS ---
  const formatRoles = (roleString) => {
    try {
      const parsed = JSON.parse(roleString);
      const roles = Array.isArray(parsed) ? parsed.map(r => r.replace('ROLE_', '')) : [roleString];
      return roles.join(', ');
    } catch (e) {
      return roleString; 
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || user.roles.includes(roleFilter);
    console.log(user)
    const matchesStatus = 
      statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && user.disable === 0) ||
      (statusFilter === 'DISABLED' && user.disable === 1 );

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-ceramon">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <Activity className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 lg:p-10 font-ceramon text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow md:flex-grow-0 md:min-w-[280px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2.5 w-full bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-sans shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters Row - Stacks on mobile */}
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <select 
                      className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="ALL">All Roles</option>
                      {/*<option value="ROLE_USER">User</option>*/}
                      <option value="ROLE_DENTIST">Dentist</option>
                      <option value="ROLE_ADMIN">Admin</option>
                    </select>
                    <Filter className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

                <div className="relative flex-1 md:flex-none">
                    <select 
                      className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-sans text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="DISABLED">Disabled</option>
                    </select>
                    <Filter className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Create Button */}
            <button 
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl transition-all shadow-lg shadow-indigo-200 font-medium text-sm w-full md:w-auto"
            >
              <Plus size={18} />
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* --- VIEW 1: DESKTOP TABLE (Hidden on Mobile/Tablet) --- */}
        <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-8 py-5">User Profile</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Joined</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isDisabled = user.disable == 1; 
                const roleName = formatRoles(user.roles);
                return (
                  <tr key={user.id} className={`group transition-colors ${isDisabled ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm border border-white
                          ${isDisabled ? 'bg-slate-200 text-slate-500' : 'bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-600'}`}>
                          {getInitials(user.first_name, user.last_name)}
                        </div>
                        <div className="flex flex-col">
                           <span className={`font-bold text-sm ${isDisabled ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>
                              {user.first_name} {user.last_name}
                           </span>
                           <span className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-sans">
                              <Mail size={10} /> {user.email}
                           </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border
                          ${roleName.includes('ADMIN') ? 'bg-purple-50 text-purple-700 border-purple-100' 
                          : roleName.includes('DENTIST') ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          <Shield size={10} /> {roleName}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                      {isDisabled ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                          <XCircle size={12} /> Disabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-sans">
                          <Calendar size={14} className="text-slate-400"/>
                          {user.created_at || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(user.id)} className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 rounded-lg transition-all shadow-sm">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDeleteClick(user.id)} className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 rounded-lg transition-all shadow-sm">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- VIEW 2: MOBILE/TABLET CARDS (Visible on < lg screens) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
          {filteredUsers.map((user) => {
            const isDisabled = user.disable == 1; 
            const roleName = formatRoles(user.roles);
            return (
              <div key={user.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                {/* Decorative status strip */}
                <div className={`absolute top-0 left-0 w-1 h-full ${isDisabled ? 'bg-rose-400' : 'bg-indigo-500'}`}></div>

                <div>
                  <div className="flex justify-between items-start mb-4 pl-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shadow-sm border border-slate-50
                        ${isDisabled ? 'bg-slate-200 text-slate-500' : 'bg-indigo-50 text-indigo-600'}`}>
                        {getInitials(user.first_name, user.last_name)}
                      </div>
                      <div>
                        <h3 className={`font-bold text-slate-900 ${isDisabled && 'line-through text-slate-500'}`}>
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className="text-xs text-slate-400 font-sans">@{user.username}</p>
                      </div>
                    </div>
                    {/* Mobile Menu / Status Icon */}
                    {isDisabled ? <XCircle size={18} className="text-rose-400" /> : <CheckCircle2 size={18} className="text-emerald-500" />}
                  </div>

                  <div className="pl-3 space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Role</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold
                          ${roleName.includes('ADMIN') ? 'bg-purple-50 text-purple-700' 
                          : roleName.includes('DENTIST') ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-600'}`}>
                          {roleName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Email</span>
                      <span className="text-slate-600 font-sans truncate max-w-[150px]">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Joined</span>
                      <span className="text-slate-600 font-sans">{user.created_at || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="pl-3 flex gap-3 mt-auto pt-4 border-t border-slate-50">
                  <button 
                    onClick={() => handleEdit(user.id)}
                    className="flex-1 py-2 flex items-center justify-center gap-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(user.id)}
                    className="flex-1 py-2 flex items-center justify-center gap-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 border-dashed">
            <div className="flex flex-col items-center justify-center text-slate-400">
                <div className="bg-slate-50 p-4 rounded-full mb-3">
                    <Search size={24} />
                </div>
                <p className="text-slate-600 font-medium">No users found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      
      {openEditModal && (
        <AppUserEditModal 
            userID={IDtoEdit} 
            onClose={handleCloseEdit} 
            onEditSuccess={handleEditSuccess} 
        /> 
      )}

      {openCreateModal && (
        <AppUserCreate 
            onClose={() => setOpenCreateModal(false)} 
            onSuccess={handleCreateSuccess} 
        /> 
      )}

      {/* Delete Modal */}
      {openDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className="p-6 md:p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 border border-rose-100">
                <AlertTriangle className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete User?</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                You are about to delete user <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">#{IDtoDelete}</span>. 
                <br/>This action implies removing access immediately and cannot be undone.
              </p>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setOpenDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-medium disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 font-medium disabled:opacity-50 shadow-lg shadow-rose-200 transition-all"
                >
                  {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  <span>Delete</span>
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