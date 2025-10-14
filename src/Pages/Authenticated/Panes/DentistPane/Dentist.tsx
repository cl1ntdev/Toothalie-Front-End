import React, { useState } from "react";
import Appointments from "./Appointments";
import { SettingsPane } from "./SettingsPane";
import {
  Calendar,
  History,
  Bell,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";

export default function DentistPanel() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [pane,setPane] = useState<string>("Appointment")
  
  const PaneSelect = (SelectedPane:string) => {
    console.log("Pane Select: ",SelectedPane)
    switch(SelectedPane){
      case "Appointment":
        return <Appointments />
      case "Settings":
        return <SettingsPane />
        
    }
  }
  
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isSidebarExpanded ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
          {isSidebarExpanded && (
            <div className="flex items-center">
              <User className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <h3 className="font-medium text-gray-900">John</h3>
                <p className="text-xs text-gray-500 truncate">Doe</p>
              </div>
            </div>
          )}

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

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${
              isSidebarExpanded ? "justify-start space-x-3" : "justify-center"
            } text-gray-400 `}
            onClick={()=>setPane("Appointment")}
            
          >
            <Calendar size={20} />
            {isSidebarExpanded && <span>Appointments</span>}
          </button>

          <button
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${
              isSidebarExpanded ? "justify-start space-x-3" : "justify-center"
            } text-gray-400 hover:text-gray-600 hover:bg-gray-50`}
            onClick={()=>setPane("History")}
          >
            <History size={20} />
            {isSidebarExpanded && <span>History</span>}
          </button>

          <button
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${
              isSidebarExpanded ? "justify-start space-x-3" : "justify-center"
            } text-gray-400 hover:text-gray-600 hover:bg-gray-50`}
            onClick={()=>setPane("")}
          >
            <Bell size={20} />
            {isSidebarExpanded && <span>Notifications</span>}
          </button>
          <button
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${
              isSidebarExpanded ? "justify-start space-x-3" : "justify-center"
            } text-gray-400 hover:text-gray-600 hover:bg-gray-50`}
            onClick={()=>setPane("Settings")}
          >
            <Settings size={20} />
            {isSidebarExpanded && <span>Notifications</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            className={`flex items-center w-full p-2 rounded-lg text-gray-400 hover:text-red-600 transition-colors ${
              isSidebarExpanded ? "justify-start space-x-3" : "justify-center"
            }`}
          >
            <LogOut size={20} />
            {isSidebarExpanded && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Welcome Back Dr. Nuller </h1>
              <p className="text-sm text-gray-500">Manage your dental appointments below.</p>
            </div>
          </div>

          {/* Appointments Section */}
          <div className="">
            {PaneSelect(pane)}
          </div>
        </div>
      </main>
    </div>
  );
}
