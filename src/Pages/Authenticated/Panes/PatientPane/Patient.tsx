import React,{useState} from "react";
import {
  CalendarDays,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react";

type PatientPanelProps = {
  userLoginedInfo?: {
    name?: string;
    email?: string;
  };
};

export default function PatientPanel({ userLoginedInfo }: PatientPanelProps) {
  const user = userLoginedInfo ?? { name: "Guest", email: "guest@email.com" };
  const [pressedDashboardButton,setPressedDashboardButton] = useState<string>("")
  const [isDashboardButPressed,setIsDashboardButPressed] = useState<boolean>(false)
  
  const pressedActivate = () =>{
    console.log("test")
    setIsDashboardButPressed(true)
    setPressedDashboardButton("Book")
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="flex items-center justify-center py-6 border-b">
          <UserCircle className="h-10 w-10 text-blue-600" />
          <div className="ml-3">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-4">
          <a className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 cursor-pointer">
            <CalendarDays size={18} />
            <span>Appointments</span>
          </a>
          <a className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 cursor-pointer">
            <ClipboardList size={18} />
            <span>History</span>
          </a>
          <a className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 cursor-pointer">
            <Bell size={18} />
            <span>Notifications</span>
          </a>
          
        </nav>

        <div className="p-4 border-t">
          <button className="flex items-center space-x-2 text-red-600 hover:text-red-800 w-full">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {isDashboardButPressed ?? (
          <h1>HEllo</h1>
        )}
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
            <UserCircle className="h-8 w-8 text-gray-600 cursor-pointer" />
          </div>
        </header>

        {/* Welcome Banner */}
        <section className="bg-blue-600 text-white rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold">
            Welcome back, {user.name} 👋
          </h2>
          <p className="text-sm text-blue-100">
            Manage your appointments, records, and stay updated.
          </p>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <button onClick={()=>pressedActivate()}  className="bg-blue-500 text-white p-4 rounded-xl shadow hover:bg-blue-600">
            Book Appointment
          </button>
          <button className="bg-purple-500 text-white p-4 rounded-xl shadow hover:bg-purple-600">
            Calendar
          </button>
          <button className="bg-purple-500 text-white p-4 rounded-xl shadow hover:bg-purple-600">
            Support
          </button>
        </section>

        {/* Upcoming Appointments */}
        <section className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="font-medium">Dental Cleaning with Dr. Smith</p>
              <p className="text-sm text-gray-600">Oct 5, 2025 - 10:00 AM</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="font-medium">Checkup with Dr. Lee</p>
              <p className="text-sm text-gray-600">Oct 12, 2025 - 1:30 PM</p>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-3">
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg">
              Reminder: Your cleaning appointment is tomorrow at 10:00 AM.
            </div>
            <div className="bg-green-100 text-green-800 p-3 rounded-lg">
              Your last checkup results are available.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
