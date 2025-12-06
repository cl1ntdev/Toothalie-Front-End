import React, { useEffect, useState, useCallback } from 'react';
import { getUsers,deleteUser } from '@/API/Authenticated/admin/AppUser'; 
import { Eye, Pencil, Trash2, Search, Check, X, Plus, AlertTriangle, Loader2 } from 'lucide-react'; 
import AppUserEditModal from './AppUserEditModal';
import AppUserCreate from './AppUserCreate'; // Ensure this is imported
export default function AppUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); 
  
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false); // State for Create Modal
  const [IDtoEdit, setIDtoEdit] = useState("");

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [IDtoDelete, setIDtoDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleCreate = () => {
    setOpenCreateModal(true); // Opens the modal
  };

  const handleCreateSuccess = () => {
    setOpenCreateModal(false); // Close modal
    fetchUsers(); // Refresh table data immediately
  };

  const handleCloseEdit = () => {
    setIDtoEdit("");
    setOpenEditModal(false);
    fetchUsers(); //Refresh data after edit to show changes
  };

  const handleEdit = (id) => {    
    setIDtoEdit(id);
    setOpenEditModal(true);
  };

  // 3. Delete Handlers
  const handleDeleteClick = (id) => {
    setIDtoDelete(id);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!IDtoDelete) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteUser(IDtoDelete); 
      console.log(`Deleting user ${IDtoDelete}...`);
      

      setUsers(prevUsers => prevUsers.filter(u => u.id !== IDtoDelete));
      
      setOpenDeleteModal(false);
      setIDtoDelete(null);
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
      return Array.isArray(parsed) ? parsed.map(r => r.replace('ROLE_', '')).join(', ') : roleString;
    } catch (e) {
      return roleString; 
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || user.roles.includes(roleFilter);

    const matchesStatus = 
      statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && user.disable === null) ||
      (statusFilter === 'DISABLED' && user.disable !== null);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        
        {/* Header & Controls */}
        <div className="p-5 border-b border-gray-200 flex flex-col xl:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">User Management</h2>
          
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

            {/* Filters */}
            <select 
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="ROLE_USER">User</option>
              <option value="ROLE_DENTIST">Dentist</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>

            <select 
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="DISABLED">Disabled</option>
            </select>

            {/* Create Button */}
            <button 
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm font-medium"
            >
              <Plus size={18} />
              Create User
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">User Info</th>
                <th className="p-4 border-b">Disabled</th>
                <th className="p-4 border-b">Role</th>
                <th className="p-4 border-b">Created At</th>
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredUsers.map((user) => {
                const isDisabled = user.disable == 1; 
                
                return (
                  <tr 
                    key={user.id} 
                    className={`border-b last:border-b-0 transition-colors ${
                      isDisabled ? 'bg-red-50/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="p-4">{user.id}</td>
                    
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                      <div className="text-xs text-gray-500">@{user.username}</div>
                      <div className="text-xs text-blue-600">{user.email}</div>
                    </td>

                    <td className="p-4">
                      {isDisabled ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                          <X size={12} strokeWidth={3} /> YES
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                           NO
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {formatRoles(user.roles)}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-gray-500">{user.created_at}</td>
                    
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(user.id)} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition" title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDeleteClick(user.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* EDIT MODAL */}
      {openEditModal && (
        <AppUserEditModal 
            userID={IDtoEdit} 
            onClose={handleCloseEdit} 
        /> 
      )}

      {/* CREATE MODAL (FIXED) */}
      {openCreateModal && (
        <AppUserCreate 
            onClose={() => setOpenCreateModal(false)} 
            onSuccess={handleCreateSuccess} 
        /> 
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {openDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete user <strong>#{IDtoDelete}</strong>? This action cannot be undone.
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
                  {isDeleting ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}