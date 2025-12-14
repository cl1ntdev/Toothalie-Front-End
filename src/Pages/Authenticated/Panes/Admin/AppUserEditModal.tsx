import React, { useEffect, useState } from 'react';
import { getUser,updateUser } from '@/API/Authenticated/admin/AppUser';
import { X, Save, Loader2, Eye, EyeOff } from 'lucide-react'; // Added Eye/EyeOff

export default function AppUserEditModal({ userID, onClose, onEditSuccess }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  
  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '', // Add password to state
    role: '', 
    is_disabled: false 
  });

  // Fetch User Data
  useEffect(() => {
    if (!userID) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getUser(userID);
        
        const userData = response.user ? response.user : response;

        let roleValue = '';
        if (userData.roles) {
          try {
            const parsed = typeof userData.roles === 'string' ? JSON.parse(userData.roles) : userData.roles;
            roleValue = Array.isArray(parsed) ? parsed[0] : parsed;
          } catch (e) {
            roleValue = userData.roles; 
          }
        }

        const isUserDisabled = userData.disable == 1;

        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          username: userData.username || '',
          password: '', 
          role: roleValue,
          is_disabled: isUserDisabled
        });

      } catch (error) {
        console.error("Failed to fetch user details", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userID]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle Save
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Prepare data for API
    const payload = {
        userID: userID,
        ...formData,
        roles: JSON.stringify([formData.role]),
    };

   
    console.log("Saving payload:", payload);

    try {
        const result = await updateUser(payload); 
        console.log(result)
        onClose(); 
      onEditSuccess();
    } catch (error) {
        alert("Failed to update user");
    } finally {
        setSaving(false);
    }
  };

  if (!userID) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Edit User</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <Loader2 className="animate-spin mb-2" size={32} />
              <p>Loading user details...</p>
            </div>
          ) : (
            <form id="edit-user-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* First Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
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
                  {/*<option value="ROLE_USER">User</option>*/}
                  <option value="ROLE_DENTIST">Dentist</option>
                  <option value="ROLE_ADMIN">Admin</option>
                  <option value="ROLE_PATIENT">Patient</option>
                </select>
              </div>

              {/* Email */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Password Reset Section */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Only fill this if you want to override the user's password.
                </p>
              </div>

              {/* Status Toggle */}
              <div className="space-y-1 md:col-span-2 pt-2 border-t mt-2">
                <label className="text-sm font-medium text-gray-700 block mb-2">Account Status</label>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_disabled"
                    checked={formData.is_disabled} 
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-green-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  <span className={`ms-3 text-sm font-medium ${formData.is_disabled ? 'text-red-600' : 'text-green-600'}`}>
                    {formData.is_disabled ? 'Account Disabled' : 'Account Active'}
                  </span>
                </label>
              </div>

            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="edit-user-form"
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
            disabled={saving || loading}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}