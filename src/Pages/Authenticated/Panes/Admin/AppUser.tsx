import React, { useEffect, useState } from 'react';
import { getUsers } from '@/API/Authenticated/admin/AppUser';
// Optional: Using Lucide-react for icons. 
// If you don't have this, you can replace <Icon /> with text like "Edit"
import { Eye, Pencil, Trash2, Search, Filter } from 'lucide-react'; 

export default function AppUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers();
        // Check if response has the 'users' array based on your sample
        console.log(response)
        if (response && response.users) {
          setUsers(response.users);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handler functions
  const handleView = (id) => console.log(`View user ${id}`);
  const handleEdit = (id) => console.log(`Edit user ${id}`);
  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this user?")) {
      console.log(`Delete user ${id}`);
      // Add API delete call here
    }
  };

  // Helper to parse the roles string '["ROLE_USER"]' safely
  const formatRoles = (roleString) => {
    try {
      const parsed = JSON.parse(roleString);
      return Array.isArray(parsed) ? parsed.map(r => r.replace('ROLE_', '')).join(', ') : roleString;
    } catch (e) {
      return roleString; 
    }
  };

  // Filter Logic
  const filteredUsers = users.filter((user) => {
    // 1. Search Filter (checks First, Last, Email, Username)
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Dropdown Role Filter
    const matchesRole = roleFilter === 'ALL' || user.roles.includes(roleFilter);

    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        
        {/* Header & Controls */}
        <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">User Management</h2>
          
          <div className="flex gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <select 
                className="pl-10 pr-8 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="ROLE_USER">User</option>
                <option value="ROLE_DENTIST">Dentist</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">User</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Role</th>
                <th className="p-4 border-b">Created At</th>
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 border-b last:border-b-0 transition-colors">
                    <td className="p-4">{user.id}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                      <div className="text-xs text-gray-500">@{user.username}</div>
                    </td>
                    <td className="p-4 text-blue-600">{user.email}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {formatRoles(user.roles)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{user.created_at}</td>
                    
                    {/* Action Buttons */}
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleView(user.id)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEdit(user.id)}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer / Count */}
        <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}