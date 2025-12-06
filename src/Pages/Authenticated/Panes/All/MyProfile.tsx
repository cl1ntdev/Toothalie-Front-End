import React, { useState, useEffect } from 'react'
import { ArrowLeft, User, Mail, Shield, Lock, Save, X, Camera } from 'lucide-react'
import GetUserInfo from '@/API/Authenticated/GetUserInfoAPI'

type AdminProps = {
  onClose: () => void
}

export function MyProfile({ onClose }: AdminProps) {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Password Change States
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const r = await GetUserInfo()
        setUserInfo(r);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchUser()
  }, [])

  // Helper to format roles
  const getRoleDisplay = (roles: any[]) => {
    if (!roles || roles.length === 0) return "User";
    const roleString = Array.isArray(roles) ? roles[0] : roles;
    if (typeof roleString === 'string' && roleString.includes("ADMIN")) return "Administrator";
    return "Standard User";
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    // Simulate API call
    console.log("Updating password...", passwordData);
    setPasswordSuccess("Password updated successfully!");
    
    setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordSuccess('');
    }, 1500);
  };

  return (
    // Main Container (Fixed Overlay)
    <div className="fixed inset-0 z-50 bg-gray-100/95 backdrop-blur-sm overflow-y-auto">
      
      {/* --- Sticky Header with Back Button --- */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm text-gray-700 font-medium"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </button>
          <span className="h-6 w-px bg-gray-300 hidden sm:block"></span>
          <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
            Profile Settings
          </h1>
        </div>
        
        {/* Optional: Close X button on the far right as well */}
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 sm:hidden">
            <X size={24} />
        </button>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-4xl mx-auto py-8 px-4 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
             Loading profile...
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. Header Card with Gradient & Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Gradient Blue Cover Photo */}
              <div className="h-40 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 relative">
                 {/* Optional: Add a subtle pattern or overlay here if desired */}
                 <div className="absolute inset-0 bg-black/5"></div>
              </div>
              
              <div className="px-8 pb-8 relative">
                {/* Profile Placeholder */}
                <div className="relative -mt-16 mb-4 flex justify-between items-end">
                  <div className="relative group">
                    <div className="w-32 h-32 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                       <User className="w-16 h-16 text-gray-300" />
                    </div>
                    {/* Camera Icon Overlay (Decorative) */}
                    <div className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow border border-gray-200 text-gray-500 cursor-not-allowed" title="Change photo feature coming soon">
                        <Camera size={16} />
                    </div>
                  </div>
                </div>
                
                {/* Name & Role */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        {userInfo?.user?.firstName} {userInfo?.user?.lastName}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold uppercase rounded border border-blue-100">
                            {getRoleDisplay(userInfo?.user?.roles)}
                        </span>
                        <span className="text-gray-400 text-sm">#{userInfo?.user?.username}</span>
                    </div>
                </div>
              </div>
            </div>

            {/* 2. Grid Layout for Details & Password */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Personal Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b border-gray-100 pb-3">
                            <User size={18} className="mr-2 text-blue-500" /> 
                            Personal Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">First Name</p>
                                <p className="text-gray-800 font-medium">{userInfo?.user?.firstName}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Last Name</p>
                                <p className="text-gray-800 font-medium">{userInfo?.user?.lastName}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 md:col-span-2">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Email Address</p>
                                <div className="flex items-center text-gray-800 font-medium">
                                    <Mail size={16} className="mr-2 text-gray-400" />
                                    {userInfo?.user?.email || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Security */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b border-gray-100 pb-3">
                            <Lock size={18} className="mr-2 text-blue-500" /> 
                            Security
                        </h3>

                        {!isChangingPassword ? (
                            <div className="flex flex-col items-center justify-center py-4 text-center">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                    <Lock size={24} className="text-blue-500" />
                                </div>
                                <h4 className="font-medium text-gray-900">Password</h4>
                                <p className="text-gray-500 text-sm mb-4 px-2">
                                    Update your password regularly to keep your account secure.
                                </p>
                                <button 
                                    onClick={() => setIsChangingPassword(true)}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Change Password
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handlePasswordChange} className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        value={passwordData.currentPassword}
                                        onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        value={passwordData.newPassword}
                                        onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm</label>
                                    <input 
                                        type="password" 
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        value={passwordData.confirmPassword}
                                        onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                    />
                                </div>

                                {passwordError && (
                                    <p className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded">{passwordError}</p>
                                )}
                                {passwordSuccess && (
                                    <p className="text-green-600 text-xs font-medium bg-green-50 p-2 rounded">{passwordSuccess}</p>
                                )}

                                <div className="flex gap-2 pt-2">
                                    <button 
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-1"
                                    >
                                        <Save size={14} /> Save
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setIsChangingPassword(false);
                                            setPasswordError('');
                                        }}
                                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

            </div>

          </div>
        )}
      </div>
    </div>
  )
}