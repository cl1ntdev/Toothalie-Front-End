import React, { useState } from 'react';
import { X, Plus, Loader2, Eye, EyeOff } from 'lucide-react';
import { createUser } from '@/API/Authenticated/admin/AppUser';
export default function AppUserCreate({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    role: 'ROLE_USER',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare payload matching your backend structure
    const payload = {
      ...formData,
      // Backend expects roles as a stringified array based on previous context
      roles: JSON.stringify([formData.role]), 
      // New users usually start active (disable: null)
      disable: null 
    };

    console.log("Creating User Payload:", payload);

    try {
      const res = await createUser(payload); // Actual API call
      console.log(res)
     
      if (onSuccess) onSuccess(); // Refresh table in parent
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-full">
                <Plus className="text-blue-600 w-5 h-5" />
            </div>
            Create New User
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form id="create-user-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* First Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="e.g. John"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="e.g. Doe"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Username <span className="text-red-500">*</span></label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. johndoe"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="ROLE_USER">User</option>
                <option value="ROLE_DENTIST">Dentist</option>
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_PATIENT">Patient</option>
              </select>
            </div>

            {/* Email */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter a secure password"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/*<p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters long.
              </p>*/}
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="create-user-form"
            className="flex items-center gap-2 px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating...
              </>
            ) : (
              <>
                Create User
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}