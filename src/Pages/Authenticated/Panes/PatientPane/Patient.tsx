import React, { useState,useEffect } from "react";
import AppointmentModal from "./AppointmentModal";
import UpcomingAppointment from "./UpcomingAppointment";
import GetUserInfo from "@/API/Authenticated/GetUserInfoAPI";
import {
  Calendar,
  History,
  Bell,
  LogOut,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type PatientPanelProps = {
  userLoginedInfo?: {
    name?: string;
    email?: string;
  };
};

export default function PatientPanel({ userLoginedInfo }: PatientPanelProps) {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [fetchNewAppointment, setFetchNewAppointment] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLoading,setIsLoading] = useState(true)
  const [user,setUser] = useState(null)
  const id = localStorage.getItem("userID")
  console.log(id)
  
  useEffect(()=>{
    const getUserInfo = async() => {
      const userBase = await GetUserInfo(id)
      setUser(userBase)
      console.log(user)
      setIsLoading(false)
    }    
    getUserInfo()
  },[id])
  
  
  useEffect(()=>{
    console.log(user)
  },[user])
 
  
  const handleCloseModal = () => {
    setShowAppointmentModal(false);
  };
  
  const handleUpdateAppointments = () => {
    setFetchNewAppointment(true);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    isLoading ? (
      <h1>Page Loading</h1>
    ):(
      <div className="flex h-screen bg-gray-50">
        {/* Toggleable Sidebar */}
        <div className="relative">
          <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
            isSidebarExpanded ? "w-64" : "w-20"
          } h-full`}>
            {/* Header with Toggle Button */}
            <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
              {/* User Info - Only shows when expanded */}
              {isSidebarExpanded && (
                <div className="flex items-center">
                  <User className="h-8 w-8 text-gray-600" />
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{user.user.first_name}</h3>
                    <p className="text-xs text-gray-500 truncate">{user.user.last_name}</p>
                  </div>
                </div>
              )}
              
              {/* Toggle Button - Inside sidebar */}
              <button
                onClick={toggleSidebar}
                className="bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors shadow-md"
              >
                {isSidebarExpanded ? (
                  <ChevronLeft size={16} className="text-gray-600" />
                ) : (
                  <ChevronRight size={16} className="text-gray-600" />
                )}
              </button>
            </div>
  
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <button className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                isSidebarExpanded ? "justify-start space-x-3" : "justify-center"
              } bg-blue-50 text-blue-600`}>
                <Calendar size={20} />
                {isSidebarExpanded && <span>Appointments</span>}
              </button>
              
              <button className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                isSidebarExpanded ? "justify-start space-x-3" : "justify-center"
              } text-gray-400 hover:text-gray-600 hover:bg-gray-50`}>
                <History size={20} />
                {isSidebarExpanded && <span>History</span>}
              </button>
              
              <button className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                isSidebarExpanded ? "justify-start space-x-3" : "justify-center"
              } text-gray-400 hover:text-gray-600 hover:bg-gray-50`}>
                <Bell size={20} />
                {isSidebarExpanded && <span>Notifications</span>}
              </button>
            </nav>
  
            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
              <button className={`flex items-center w-full p-2 rounded-lg text-gray-400 hover:text-red-600 transition-colors ${
                isSidebarExpanded ? "justify-start space-x-3" : "justify-center"
              }`}>
                <LogOut size={20} />
                {isSidebarExpanded && <span>Logout</span>}
              </button>
            </div>
          </aside>
        </div>
  
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-light text-gray-900">Welcome back</h1>
                <p className="text-gray-500">Good to see you, {user.user.username}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
            </header>
  
            {/* Quick Action */}
            <section className="mb-8">
              <button 
                onClick={() => setShowAppointmentModal(true)}
                className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-gray-700"
              >
                <Plus size={18} />
                <span>New Appointment</span>
              </button>
            </section>
  
            {/* Appointments Section */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Appointments</h2>
              <UpcomingAppointment
                fetchNewAppointment={fetchNewAppointment}
                onFetched={() => setFetchNewAppointment(false)} 
              />
            </section>
          </div>
        </main>
  
        {/* Modal */}
        {showAppointmentModal && (
          <AppointmentModal 
            onClose={handleCloseModal} 
            onSuccess={handleUpdateAppointments} 
          />
        )}
      </div>
    )
   
  );
}