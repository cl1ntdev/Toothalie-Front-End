"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Stethoscope,
  Calendar,
  FlaskConical,
  Plus,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { fetchAppointmentDentist } from "@/API/Authenticated/appointment/FetchAppointment";

// Mock data for stats (replace with real API later)
const mockStats = {
  // totalPatients: 12600,
  totalPatientsChange: 23,
  activeDoctors: 324,
  activeDoctorsChange: 10,
  todayAppointments: 219,
  todayAppointmentsChange: 13,
  pendingLabResults: 45,
  pendingLabResultsChange: 64,
};

export function Main() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dentistID, setDentistID] = useState<string>("");
  const [totalPatients,setTotalPatient] = useState<number>(0)
  const [userRoles,setUserRoles] = useState<string[]>([])
  const [todaysAppointment,setTodaysAppointment] = useState<number>(0)
  // Load dentist ID
  // 
  
  const handleUpdateStats = (data) => {
    console.log(data)
    // setTodaysAppointment()
    
    const today = new Date().toISOString().split("T")[0];
    const todaysAppointmentCount = data.filter(appointment => 
      appointment.appointment_date.startsWith(today)
    ).length;
    
    setTodaysAppointment(todaysAppointmentCount)
    setAppointments(data); // Show only first 6
    setTotalPatient(data.length)
  }
  
  useEffect(() => {
    const localData = localStorage.getItem("userInfo");
    if (localData) {
      try {
        const userInfo = JSON.parse(localData);
        // setUserInfo(userInfo)
        setUserRoles((userInfo?.user?.roles) ? userInfo.user.roles : [] )
        if (userInfo?.user?.id) setDentistID(userInfo.user.id.toString());
      } catch (err) {
        console.error("Failed to parse userInfo:", err);
      }
    }
  }, []);

  // Fetch appointments
  useEffect(() => {
    if (!dentistID) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAppointmentDentist(dentistID);
        console.log(data)
        if (data?.status === "ok" && Array.isArray(data.appointments)) {
          const formatted = data.appointments.map((item: any) => {
            const appt = item.appointment;
            const patient = item.patient || {};
            
            const finalData = {
              id: appt.appointment_id,
              appointment_date: appt.appointment_date,
              patientName: `${patient.first_name || ""} ${patient.last_name || ""}`.trim() || "Unknown",
              doctor: `Dr. ${patient.doctor_name || "Unknown"}`,
              time: appt.appointment_date?.split(" ")[1]?.slice(0, 5) || "N/A",
              type: appt.appointment_type_id === 3 ? "Lab review" : appt.appointment_type_id === 2 ? "Follow-up" : "Consultation",
              status: appt.status || "Pending",
              statusColor:
                appt.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : appt.status === "Active"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700",
            };
            return finalData;
          });
          
          
          console.log(formatted.slice(0, 6))
          handleUpdateStats(formatted.slice(0, 6))
         
          
        
        
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dentistID]);

  const stats = [
    {
      icon: Users,
      label: "Total Patients",
      value: totalPatients,
      change: mockStats.totalPatientsChange,
      color: "text-blue-600",
      bg: "bg-blue-50",
      role: "DENTIST"
    },
    {
      icon: Stethoscope,
      label: "Active Doctors",
      value: "324",
      change: mockStats.activeDoctorsChange,
      color: "text-green-600",
      bg: "bg-green-50",
      role: "ADMIN"
    },
    {
      icon: Calendar,
      label: "Today Appointments",
      value: todaysAppointment,
      change: mockStats.todayAppointmentsChange,
      color: "text-purple-600",
      bg: "bg-purple-50",
      role: "DENTIST"
    },
    {
      icon: FlaskConical,
      label: "Pending lab results",
      value: "45",
      change: mockStats.pendingLabResultsChange,
      color: "text-orange-600",
      bg: "bg-orange-50",
      changeIcon: "text-orange-600",
      role: "DENTIST"
    },
  ];
  
  const visibleStat = stats.filter(stats=>userRoles.includes(stats.role))
  // console.log(visibleStat)
  // console.log(userRoles)
  
  const quickActions = [
    { icon: Plus, label: "Add New Patient", btn: "Add" },
    { icon: Calendar, label: "Schedule Appointment", btn: "Add" },
    { icon: FileText, label: "View Lab Results", btn: "View" },
    { icon: BarChart3, label: "General Reports", btn: "View" },
  ];
  

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {visibleStat.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span
                  className={`text-sm font-semibold flex items-center gap-1 ${
                    stat.change > 0 ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {stat.change > 0 ? "↑" : "↓"} {Math.abs(stat.change)}%
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stat.label.includes("Patients")
                  ? "Active registered users"
                  : stat.label.includes("Doctors")
                  ? "Available medical staff"
                  : stat.label.includes("Appointments")
                  ? "Scheduled consultations"
                  : "Awaiting review"}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Appointment</h2>
                <button className="text-sm text-gray-500 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                  Today
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                </div>
              ) : appointments.length === 0 ? (
                <p className="text-center text-gray-500 py-12">No appointments today</p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{appt.patientName}</p>
                          <p className="text-sm text-gray-600">{appt.doctor} • {appt.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{appt.type}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${appt.statusColor}`}
                        >
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {quickActions.map((action, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <action.icon className="w-5 h-5 text-gray-700" />
                      </div>
                      <span className="text-gray-700">{action.label}</span>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      {action.btn}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Analytics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Patient Analytics</h2>
                <div className="flex gap-2">
                  {["7 Days", "30 Days", "90 Days"].map((period) => (
                    <button
                      key={period}
                      className={`px-3 py-1 text-xs rounded-lg ${
                        period === "7 Days"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">Chart component will be integrated here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}