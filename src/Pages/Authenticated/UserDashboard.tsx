import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  History,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Clock,
  TableOfContents,
  Settings,
  LayoutDashboard,
  AlertCircle,
  Users,
  NotebookPen,
} from "lucide-react";
import DisableAccount from "../ErrorRoute/DisableAccount";
// API Imports
import { getDentistData } from "@/API/Authenticated/GetDentist";
import GetUserInfo from "@/API/Authenticated/GetUserInfoAPI";
import { LogoutUser } from "@/API/Authenticated/Logout";

// Component Imports
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
import { MyProfile } from "./Panes/All/MyProfile";
import { MyAdmin } from "./Panes/Admin/MyAdmin";
import Logs from "./Panes/Admin/Logs";

// ==========================================
// PART 1: The UI Layout Component (Pure UI)
// ==========================================
const DashboardLayout = ({ 
  userInfo, 
  navItems, 
  currentPane, 
  setCurrentPane, 
  onLogout, 
  children, 
  openProfile,
  setOpenProfile
}) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  
  // NEW STATE: Controls the logout confirmation modal
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // Safe display name derivation
  const displayName = userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "User";
  const userRoleDisplay = userInfo?.roles ? userInfo.roles[0].replace('ROLE_', '') : 'User';

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirmation(false);
    onLogout(); // Triggers the actual parent logout function
  };

  return (
    <div className="flex font-ceramon h-screen bg-gray-50 overflow-hidden font-sans text-slate-800 relative">
      
      {/* 1. LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirmation && (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 border border-gray-100 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              {/* Red Icon Background for visual warning */}
              <div className="bg-red-50 p-3 rounded-full mb-4">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to end your session? You will be returned to the login screen.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowLogoutConfirmation(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors shadow-red-200 shadow-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Profile Overlay Modal */}
      {openProfile && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="relative">
             <MyProfile onClose={() => setOpenProfile(false)} />
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm z-20 ${
          isSidebarExpanded ? "w-72" : "w-20"
        }`}
      >
        {/* Sidebar Header / User Card */}
        <div className="p-4 border-b border-gray-100">
          <div 
            className={`flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer hover:bg-blue-50 group ${!isSidebarExpanded && 'justify-center'}`}
            onClick={() => setOpenProfile(true)}
          >
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                <User size={20} />
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            
            {isSidebarExpanded && (
              <div className="overflow-hidden transition-all duration-300">
                <h3 className="font-bold text-sm text-gray-800 truncate group-hover:text-blue-700">{displayName}</h3>
                <p className="text-xs text-gray-500 font-medium truncate capitalize">{userRoleDisplay.toLowerCase()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPane === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setCurrentPane(item.key)}
                className={`
                  flex items-center w-full p-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }
                  ${!isSidebarExpanded ? "justify-center" : ""}
                `}
              >
                <item.icon 
                  size={20} 
                  className={`transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`} 
                />
                
                {isSidebarExpanded && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {!isSidebarExpanded && (
                  <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className={`flex items-center w-full p-2 mb-2 rounded-lg text-gray-500 hover:bg-white hover:shadow-sm transition-all ${!isSidebarExpanded && "justify-center"}`}
          >
             {isSidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
             {isSidebarExpanded && <span className="ml-3 text-xs font-semibold uppercase tracking-wider">Collapse</span>}
          </button>

          <button 
            className={`flex items-center w-full p-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors ${!isSidebarExpanded && "justify-center"}`}
            onClick={handleLogoutClick} // Changed from onLogout to handleLogoutClick
          >
            <LogOut size={20} />
            {isSidebarExpanded && <span className="ml-3 text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative h-full">
        <div className="max-w-13xl mx-auto p-6 lg:p-10">
          
          {/* Content Header */}
          <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-ceramon font-bold text-gray-900 tracking-tight">
                {navItems.find(i => i.key === currentPane)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-500 mt-1 font-ceramon">
                Welcome back, {userInfo?.firstName}.
              </p>
            </div>
            <div className="hidden sm:block text-sm text-gray-400 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
               {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </header>

          {/* Dynamic Pane Content */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
};

// ==========================================
// PART 2: The Logic Container (Data & State)
// ==========================================
export default function UserDashboard() {
  const navigate = useNavigate();
  
  const DentistDashboard = [
    { label: "Dashboard", icon: LayoutDashboard, key: "Dashboard" },
    { label: "Appointments", icon: Calendar, key: "Appointment" },
    { label: "History", icon: History, key: "History" },
    { label: "Settings", icon: Settings, key: "Settings" },
  ];
  
  const PatientDashboard = [
    { label: "Appointments", icon: Calendar, key: "Appointments" },
    { label: "History", icon: History, key: "History" },
  ];
  
  const AdminDashboard = [
    { label: "Overview", icon: LayoutDashboard, key: "AdminDashboard" },
    { label: "Users", icon: Users, key: "Users" },
    { label: "Appointments", icon: Calendar, key: "Appointments" },
    { label: "Reminders", icon: NotebookPen, key: "Reminders" },
    { label: "Services", icon: User, key: "DentistServices" },
    { label: "Schedules", icon: Clock, key: "Schedules" },
    { label: "System Logs", icon: TableOfContents, key: "Logs" },
  ];

  const [userInfo, setUserInfo] = useState(null);
  const [currentPane, setCurrentPane] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [openProfile, setOpenProfile] = useState(false);
  const [isDisable,setIsDisable] = useState(false)
  
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const data = await GetUserInfo();
        console.log("Fetched User:", data);
        setUserInfo(data.user);
        if(data.user.disable){
          console.log("disabled")
          setIsDisable(true)
        }
        if (data.user?.roles) {
           let roles = data.user.roles;
           if (roles.length === 1 && typeof roles[0] === "string" && roles[0].startsWith("[")) {
             roles = JSON.parse(roles[0]);
           }
           if (roles.includes("ROLE_ADMIN")) setCurrentPane("AdminDashboard");
           else if (roles.includes("ROLE_DENTIST")) setCurrentPane("Dashboard");
           else if (roles.includes("ROLE_PATIENT")) setCurrentPane("Home");
        }

      } catch (err) {
        console.error(err);
        localStorage.removeItem("userInfo");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserInfo();
  }, [navigate]);

  const handleLogout = async () => {
    const r = await LogoutUser();
    if (r.ok) {
      navigate('/login');
    }
  };

  if (isLoading || !userInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-600"></div>
          <span className="text-gray-500 font-medium animate-pulse">Loading Workspace...</span>
        </div>
      </div>
    );
  }
  
  if(isDisable){
    return(
      <DisableAccount />
    )
  }

  let roles = userInfo.roles;
  if (roles.length === 1 && typeof roles[0] === "string" && roles[0].startsWith("[")) {
    roles = JSON.parse(roles[0]);
  }

  const isAdmin = roles.includes("ROLE_ADMIN");
  const isDentist = roles.includes("ROLE_DENTIST");
  const isPatient = roles.includes("ROLE_PATIENT");

  const navItems = isDentist ? DentistDashboard : isPatient ? PatientDashboard : isAdmin ? AdminDashboard : [];

  const renderPane = () => {
    if (isDentist) {
      switch (currentPane) {
        case "Dashboard": return <Main />;
        case "Appointment": return <Appointments />;
        case "Settings": return <SettingsPane />;
        case "History": return <HistoryPane />;
        default: return <Main />;
      }
    } else if (isPatient) {
      switch (currentPane) {
        case "Home": 
        case "Appointments": return <UpcomingAppointment />;
        case "History": return <HistoryPane />;
        default: return <UpcomingAppointment />;
      }
    } else if (isAdmin) {
      switch (currentPane) {
        case "AdminDashboard": return <MyAdmin />;
        case "Users": return <AppUser />;
        case "Appointments": return <Appointment />;
        case "DentistServices": return <DentistService />;
        case "Reminders": return <Reminder />;
        case "Schedules": return <Schedule />;
        case "Logs": return <Logs />;
        default: return <MyAdmin />;
      }
    }
    return <div className="p-10 text-center text-gray-500">Access Denied or Unknown Role</div>;
  };

  return (
    <DashboardLayout
      userInfo={userInfo}
      navItems={navItems}
      currentPane={currentPane}
      setCurrentPane={setCurrentPane}
      onLogout={handleLogout}
      openProfile={openProfile}
      setOpenProfile={setOpenProfile}
    >
      {renderPane()}
    </DashboardLayout>
  );
}