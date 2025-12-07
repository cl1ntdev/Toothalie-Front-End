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
  TableOfContents,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { Main } from "./Panes/DentistPane/Main";

import Appointments from "./Panes/DentistPane/Appointments";
import { SettingsPane } from "./Panes/DentistPane/SettingsPane";
import UpcomingAppointment from "./Panes/PatientPane/UpcomingAppointment";
import AppUser from "./Panes/Admin/AppUser";
import Appointment from "./Panes/Admin/Appointment";
import DentistService from "./Panes/Admin/DentistService";
import Reminder from "./Panes/Admin/Reminder";
import Schedule from "./Panes/Admin/Schedule";
import HistoryPane from "./Panes/All/History";
import { useNavigate } from "react-router-dom";
import { MyProfile } from "./Panes/All/MyProfile";
import { MyAdmin } from "./Panes/Admin/MyAdmin";
export default function UserDashboard() {
  
  const navigate = useNavigate()
  
  
  const DentistDashboard =  [
      { label: "Dashboard", icon: LayoutDashboard, key: "Dashboard" },
      { label: "Appointments", icon: Calendar, key: "Appointment" },
      { label: "History", icon: History, key: "History" },
      { label: "Settings", icon: Settings, key: "Settings" },
    ]
  const PatientDashboard = 
    [
      { label: "Appointments", icon: Calendar, key: "Appointments" },
      { label: "History", icon: History, key: "History" },
    ] 
  
  const AdminDashboard = [
    { label: "AdminDashboard", icon: LayoutDashboard, key: "AdminDashboard" },
    { label: "Users", icon: User, key: "Users" },
    { label: "Appointments", icon: Calendar, key: "Appointments" },
    { label: "Dentist Services", icon: User, key: "DentistServices" },
    { label: "Reminders", icon: Bell, key: "Reminders" },
    { label: "Schedules", icon: Clock, key: "Schedules" },
    { label: "Logs", icon: TableOfContents, key: "Logs" },
  ]
  
  const [userInfo, setUserInfo] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentPane, setCurrentPane] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [openProfile,setOpenProfile] = useState(false)
  
  const handleOpenProfile = () => {
    setOpenProfile(!openProfile)
  }
  
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const data = await GetUserInfo();
        console.log(data)
        setUserInfo(data.user);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("userInfo");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchUserInfo();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    if(localStorage.getItem('loginedDentist')){
      localStorage.removeItem('loginedDentist')
    }
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
  let roles = userInfo.roles;
  
  // Check if roles[0] is a JSON string
  if (roles.length === 1 && typeof roles[0] === "string" && roles[0].startsWith("[")) {
    roles = JSON.parse(roles[0]); // now roles = ["ROLE_ADMIN","ROLE_USER"]
  }
  
  // Now you can safely check
  const isAdmin = roles.includes("ROLE_ADMIN");
  const isUser = roles.includes("ROLE_USER");
  const isDentist = roles.includes("ROLE_DENTIST");
  const isPatient = roles.includes("ROLE_PATIENT");
  
  console.log(roles, { isAdmin, isUser, isDentist, isPatient });
  const DashBoardComponents = isDentist ? DentistDashboard : isPatient ? PatientDashboard : isAdmin ? AdminDashboard : <>Nothing in UserDashboard</> //use for loading panes
  const displayName = `${userInfo.firstName} ${userInfo.lastName}`;

  const renderPane = () => {
    if (isDentist) {
      switch (currentPane) {
        case "Dashboard":
          return <Main />
        case "Appointment":
          return <Appointments />;
        case "Settings":
          return <SettingsPane />;
        case "History":
            return <HistoryPane />;
        default:
          return <Main />;
      }
    } else if(isPatient) {
      switch (currentPane) {
        case "Home":
          return <UpcomingAppointment />;
        case "History":
          return <HistoryPane />;
        // case "Reminder":
        //   return <ReminderPanePatient />;
        default:
          return <UpcomingAppointment />;
      }
    }else if (isAdmin){
      switch (currentPane) {
        case "AdminDashboard":
          return <MyAdmin />
          // return <>Admin</>
        case "Users":
          return <AppUser />
        case "Appointments":
          return <Appointment />
        case "DentistServices":
          return <DentistService />
        case "Reminders":
          return <Reminder />
        case "Schedules":
          return <Schedule />
        default:
          return <>NO CONTENT</>;
      }
    }
  };
  return (
      <div className="flex h-screen bg-gray-50 overflow-hidden relative">
        
        {/* LOGIC: If openProfile is true, this component renders ON TOP of everything.
          We pass setOpenProfile(false) to the onClose prop.
        */}
        {openProfile && <MyProfile onClose={() => setOpenProfile(false)} />}
  
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
            isSidebarExpanded ? "w-64" : "w-20"
          }`}
        >
          {/* Sidebar Header / Profile Trigger */}
          <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
            {isSidebarExpanded && (
              <div 
                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 -ml-2 rounded-lg transition-colors"
                onClick={() => setOpenProfile(true)} // Opens the profile
              >
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3 overflow-hidden">
                  <h3 className="font-medium text-gray-900 truncate text-sm">{displayName}</h3>
                  <p className="text-xs text-gray-500 truncate">{userInfo.username}</p>
                </div>
              </div>
            )}
  
            {/* Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors shadow-sm z-10"
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
            {DashBoardComponents.map((item) => {
              const isActive = currentPane === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setCurrentPane(item.key)}
                  className={`
                    flex items-center ${isSidebarExpanded ? "justify-start px-3" : "justify-center px-0"} 
                    w-full py-3 rounded-lg transition-colors
                    ${isActive ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                  `}
                >
                  <item.icon size={20} />
                  {isSidebarExpanded && <span className="ml-3 text-sm">{item.label}</span>}
                </button>
              );
            })}
          </nav>
  
          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button 
              className={`flex items-center w-full py-3 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors ${!isSidebarExpanded && "justify-center"}`}
              onClick={() => handleLogout()}
            >
              <LogOut size={20} />
              {isSidebarExpanded && <span className="ml-3 font-medium text-sm">Logout</span>}
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
                <p className="text-sm text-gray-500 mt-1">
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
