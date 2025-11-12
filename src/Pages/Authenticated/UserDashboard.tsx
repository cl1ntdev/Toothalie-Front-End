import React, { useState, useEffect } from "react";
import { getDentistData } from "@/API/Authenticated/GetDentist";
import GetUserInfo from "@/API/Authenticated/GetUserInfoAPI";
import {
  Calendar,
  History,
  Bell,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Clock,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { Main } from "./Panes/DentistPane/Main";

import Appointments from "./Panes/DentistPane/Appointments";
import { SettingsPane } from "./Panes/DentistPane/SettingsPane";
import ReminderPaneDentist from "./Panes/DentistPane/Reminder";
import HistoryPaneDentist from "./Panes/DentistPane/History";
import UpcomingAppointment from "./Panes/PatientPane/UpcomingAppointment";
import HistoryPanePatient from "./Panes/PatientPane/History";
import ReminderPanePatient from "./Panes/PatientPane/Reminder";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  
  const navigate = useNavigate()
  
  
  const DentistDashboard =  [
      { label: "Dashboard", icon: LayoutDashboard, key: "Dashboard" },
      { label: "Appointments", icon: Calendar, key: "Appointment" },
      { label: "Availability", icon: Clock, key: "Availability" },
    ]
  const PatientDashboard = 
    [
      { label: "Appointments", icon: Calendar, key: "Appointments" },
      { label: "History", icon: History, key: "History" },
      { label: "Reminders", icon: Bell, key: "Reminder" },
    ] 
  
  const [userInfo, setUserInfo] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentPane, setCurrentPane] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    // console.log(stored)
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log(parsed)
      setUserInfo(parsed.user); // user object directly
      setIsLoading(false);
    } else {
      console.warn("No user info found in localStorage");
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    navigate('/login')
  }
  
  
  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

  if (isLoading || !userInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Loading Dashboard...</span>
      </div>
    );
  }

  // Determine user type from roles
  const isDentist = userInfo.roles.includes("DENTIST");
  const DashBoardComponents = isDentist ? DentistDashboard : PatientDashboard
  const displayName = `${userInfo.firstName} ${userInfo.lastName}`;

  const renderPane = () => {
    if (isDentist) {
      switch (currentPane) {
        case "Dashboard":
          return <Main />
        case "Appointment":
          return <Appointments />;
        case "Availability":
          return <SettingsPane />;
        default:
          return <Main />;
      }
    } else {
      switch (currentPane) {
        case "Home":
          return <UpcomingAppointment />;
        case "History":
          return <HistoryPanePatient />;
        case "Reminder":
          return <ReminderPanePatient />;
        default:
          return <UpcomingAppointment />;
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isSidebarExpanded ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
          {isSidebarExpanded && (
            <div className="flex items-center">
              <User className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <h3 className="font-medium text-gray-900 truncate">{displayName}</h3>
                <p className="text-xs text-gray-500 truncate">{userInfo.username}</p>
              </div>
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors shadow-md"
            title={isSidebarExpanded ? "Collapse" : "Expand"}
          >
            {isSidebarExpanded ? (
              <ChevronLeft size={16} className="text-gray-600" />
            ) : (
              <ChevronRight size={16} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 px-2 space-y-2 flex flex-col">
          {(DashBoardComponents).map((item) => {
            const isActive = currentPane === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setCurrentPane(item.key)}
                className={`
                  flex items-center justify-${isSidebarExpanded ? "start" : "center"} 
                  w-full p-3 rounded-lg transition-colors
                  ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                `}
              >
                <item.icon size={20} />
                {isSidebarExpanded && <span className="ml-3 font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center w-full p-3 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 transition-colors"
            onClick={()=>handleLogout()}
          >
            <LogOut size={20} />
            {isSidebarExpanded && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome Back, {displayName}
              </h1>
              <p className="text-sm text-gray-500">
                Here's what's happening today.
              </p>
            </div>
          </header>
          <section>{renderPane()}</section>
        </div>
      </main>
    </div>
  );
}
