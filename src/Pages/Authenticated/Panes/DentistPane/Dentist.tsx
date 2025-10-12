import React, { useEffect, useState } from 'react'
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

export default function DentistPanel(){
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isLoading,setIsLoading] = useState(true)
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };
  return(
  <>
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="relative">
        <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isSidebarExpanded ? "w-64" : "w-20"
        } h-full`}>
          <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
            {isSidebarExpanded && (
              <div className="flex items-center">
                <User className="h-8 w-8 text-gray-600" />
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">{"John"}</h3>
                  <p className="text-xs text-gray-500 truncate">{"Doe"}</p>
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
  
          {/* nav */}
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
    </div>
  </>
  )
}