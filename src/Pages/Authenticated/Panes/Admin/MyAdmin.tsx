import React, { useEffect, useState, useMemo } from "react";
// Keep your existing imports
import { getAppointments } from "@/API/Authenticated/admin/Appointment";
import { getUsers } from "@/API/Authenticated/admin/AppUser";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  UserCheck,
  Stethoscope,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  TrendingUp,
  Activity,
  Briefcase,
} from "lucide-react";

// --- Types based on your JSON ---
type Appointment = {
  appointment_id: number;
  status: string;
  patient_name: string;
  dentist_name: string;
  service_name: string | null;
  appointment_date: string; // Created At
  emergency: number;
  user_set_date: string; // Scheduled Date
  message?: string;
  schedule_id: number;
  time_slot: string;
};

type User = {
  id: number;
  roles: string; // JSON string "[\"ROLE_PATIENT\"]"
  username: string;
  first_name: string;
  last_name: string;
  created_at: string | null;
  disable: number;
};

// --- Components ---

// 1. Stat Card Component
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  colorClass,
}: {
  title: string;
  value: number | string;
  icon: any;
  trend?: string;
  colorClass: string;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass.replace("bg-", "text-")}`} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
        <TrendingUp className="w-3 h-3 mr-1" />
        <span>{trend}</span>
      </div>
    )}
  </div>
);

// 2. Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-700">
        <p className="font-semibold mb-1">{label}</p>
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
          Count: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function MyAdmin() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const appRes = await getAppointments();
        const userRes = await getUsers();
        
        // Handle potential nested data structures or flat arrays
        const appData = appRes.appointments ? appRes.appointments : (Array.isArray(appRes) ? appRes : []);
        const userData = userRes.users ? userRes.users : (Array.isArray(userRes) ? userRes : []);

        setAppointments(appData);
        setUsers(userData);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Calculations (Memoized) ---
  const dashboardData = useMemo(() => {
    // 1. User Stats
    // Parse the role string because JSON comes as "[\"ROLE_PATIENT\"]"
    const totalUsers = users.length;
    const patients = users.filter((u) => u.roles.includes("PATIENT")).length;
    const dentists = users.filter((u) => u.roles.includes("DENTIST")).length;
    
    // 2. Appointment Stats
    const totalApps = appointments.length;
    const emergencyApps = appointments.filter((a) => a.emergency === 1).length;
    
    const pending = appointments.filter((a) => a.status?.toLowerCase() === "pending").length;
    const approved = appointments.filter((a) => a.status?.toLowerCase() === "approved").length;
    const rejected = appointments.filter((a) => a.status?.toLowerCase() === "rejected").length;

    // 3. Service Chart Data (Bar)
    const serviceCounts: Record<string, number> = {};
    appointments.forEach((app) => {
      // Handle null service names
      const name = app.service_name || "General Consultation";
      serviceCounts[name] = (serviceCounts[name] || 0) + 1;
    });
    
    const barData = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 services

    // 4. Status Chart Data (Donut)
    const pieData = [
      { name: "Approved", value: approved, color: "#10b981" }, // Emerald 500
      { name: "Pending", value: pending, color: "#f59e0b" },   // Amber 500
      { name: "Rejected", value: rejected, color: "#ef4444" }, // Red 500
    ].filter((d) => d.value > 0);

    return {
      totalUsers,
      patients,
      dentists,
      totalApps,
      emergencyApps,
      barData,
      pieData,
    };
  }, [users, appointments]);

  // --- Render ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Activity className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium">Synchronizing Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans text-slate-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">Overview of clinic performance and patient activity.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* 1. Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Patients"
            value={dashboardData.patients}
            icon={Users}
            colorClass="bg-blue-500 text-blue-600"
            trend="+12% from last month"
          />
          <StatCard
            title="Active Dentists"
            value={dashboardData.dentists}
            icon={Stethoscope}
            colorClass="bg-indigo-500 text-indigo-600"
          />
          <StatCard
            title="Total Appointments"
            value={dashboardData.totalApps}
            icon={Calendar}
            colorClass="bg-emerald-500 text-emerald-600"
          />
          <StatCard
            title="Emergencies"
            value={dashboardData.emergencyApps}
            icon={AlertCircle}
            colorClass="bg-rose-500 text-rose-600"
            trend={dashboardData.emergencyApps > 0 ? "Action required" : "All clear"}
          />
        </div>

        {/* 2. Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bar Chart: Top Services */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Popular Services</h3>
              <div className="p-2 bg-slate-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar 
                    dataKey="count" 
                    fill="#6366f1" 
                    radius={[6, 6, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart: Appointment Status */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Appointment Status</h3>
            <div className="flex-1 flex items-center justify-center relative">
               <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dashboardData.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dashboardData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-800">{dashboardData.totalApps}</span>
                <span className="text-xs text-slate-400 uppercase font-semibold">Total</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-4 space-y-3">
              {dashboardData.pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Recent Activity Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Recent Appointments</h3>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Dentist</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Scheduled For</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.slice(0, 6).map((app) => (
                  <tr key={app.appointment_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                          <UserCheck size={14} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{app.patient_name}</p>
                          {app.emergency === 1 && (
                            <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                              Emergency
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{app.dentist_name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {app.service_name || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-medium">
                           {app.user_set_date ? new Date(app.user_set_date).toLocaleDateString() : "TBD"}
                        </span>
                        <span className="text-slate-400 text-xs">{app.time_slot}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {app.status?.toLowerCase() === "approved" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 size={12} /> Approved
                        </span>
                      )}
                      {app.status?.toLowerCase() === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                      {app.status?.toLowerCase() === "rejected" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}