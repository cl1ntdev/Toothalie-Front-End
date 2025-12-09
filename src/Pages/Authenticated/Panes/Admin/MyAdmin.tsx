import React, { useEffect, useState, useMemo } from "react";
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
  Stethoscope,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  Briefcase,
  ArrowUpRight,
  Filter,
  FileText
} from "lucide-react";

// --- Types ---
type Appointment = {
  appointment_id: number;
  status: string;
  patient_name: string;
  dentist_name: string;
  service_name: string | null;
  appointment_date: string; // Created Date
  emergency: number;
  user_set_date: string; // Scheduled Date
  message?: string;
  schedule_id: number;
  time_slot: string;
};

type User = {
  id: number;
  roles: string;
  username: string;
  first_name: string;
  last_name: string;
  created_at: string | null;
  disable: number;
};

// --- Sub-Components ---

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  colorClass,
  bgClass
}: {
  title: string;
  value: number | string;
  icon: any;
  trend?: string;
  colorClass: string;
  bgClass: string;
}) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(6,81,237,0.05)] hover:shadow-lg transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">{title}</span>
        <h3 className="text-4xl font-ceramon font-bold text-slate-800 tracking-tight">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl ${bgClass} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-xs font-bold bg-emerald-50 text-emerald-700 w-fit px-2.5 py-1 rounded-lg">
        <TrendingUp className="w-3 h-3 mr-1.5" />
        <span>{trend}</span>
      </div>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 backdrop-blur-md">
        <p className="font-ceramon text-sm font-semibold mb-1 border-b border-slate-700 pb-1">{label}</p>
        <p className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <span className="text-slate-300">Total:</span> 
          <span className="font-bold text-white">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Helper to get initials
const getInitials = (name: string) => {
  return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "??";
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

  // --- Calculations ---
  const dashboardData = useMemo(() => {
    const totalUsers = users.length;
    const patients = users.filter((u) => u.roles.includes("PATIENT")).length;
    const dentists = users.filter((u) => u.roles.includes("DENTIST")).length;
    
    const totalApps = appointments.length;
    const emergencyApps = appointments.filter((a) => a.emergency === 1).length;
    
    const pending = appointments.filter((a) => a.status?.toLowerCase() === "pending").length;
    const approved = appointments.filter((a) => a.status?.toLowerCase() === "approved").length;
    const rejected = appointments.filter((a) => a.status?.toLowerCase() === "rejected").length;

    // 1. Service Popularity (Bar Chart)
    const serviceCounts: Record<string, number> = {};
    appointments.forEach((app) => {
      const name = app.service_name || "General Consultation";
      serviceCounts[name] = (serviceCounts[name] || 0) + 1;
    });
    const barData = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); 

    // 2. Appointment Volume Trend (Area Chart)
    // Group appointments by Month
    const trendMap: Record<string, number> = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize current year months to 0 so chart isn't empty
    const currentMonthIndex = new Date().getMonth();
    for(let i=0; i<=currentMonthIndex; i++) {
        trendMap[months[i]] = 0;
    }

    appointments.forEach(app => {
        const date = new Date(app.appointment_date); // Using created date
        if(date.getFullYear() === new Date().getFullYear()) {
            const monthName = months[date.getMonth()];
            trendMap[monthName] = (trendMap[monthName] || 0) + 1;
        }
    });

    const areaData = Object.entries(trendMap).map(([name, value]) => ({ name, value }));

    // 3. Status (Pie Chart)
    const pieData = [
      { name: "Approved", value: approved, color: "#10b981" }, 
      { name: "Pending", value: pending, color: "#f59e0b" },   
      { name: "Rejected", value: rejected, color: "#ef4444" }, 
    ].filter((d) => d.value > 0);

    return { totalUsers, patients, dentists, totalApps, emergencyApps, barData, pieData, areaData };
  }, [users, appointments]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-ceramon">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <Activity className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-ceramon text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        

        {/* 1. Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Patients"
            value={dashboardData.patients}
            icon={Users}
            bgClass="bg-blue-50"
            colorClass="text-blue-600"
            trend="+12% growth"
          />
          <StatCard
            title="Active Dentists"
            value={dashboardData.dentists}
            icon={Stethoscope}
            bgClass="bg-indigo-50"
            colorClass="text-indigo-600"
          />
          <StatCard
            title="Appointments"
            value={dashboardData.totalApps}
            icon={Calendar}
            bgClass="bg-emerald-50"
            colorClass="text-emerald-600"
          />
          <StatCard
            title="Emergencies"
            value={dashboardData.emergencyApps}
            icon={AlertCircle}
            bgClass="bg-rose-50"
            colorClass="text-rose-600"
            trend={dashboardData.emergencyApps > 0 ? "Needs Review" : "Stable"}
          />
        </div>

        {/* 2. Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* New: Area Chart (Volume Trends) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Patient Volume Trend</h3>
                <p className="text-sm text-slate-400 mt-1">Appointment requests over current year</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart (Status) */}
          <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Request Distribution</h3>
             <p className="text-sm text-slate-400 mb-6">Current status of appointments</p>
            <div className="flex-1 flex items-center justify-center relative">
               <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={dashboardData.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={6}
                    dataKey="value"
                    cornerRadius={6}
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
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Total</span>
              </div>
            </div>
            
            <div className="mt-2 space-y-3">
              {dashboardData.pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm group cursor-default">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Recent Activity Table (Modified) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Recent Appointments</h3>
              <p className="text-slate-400 text-sm mt-1">Latest schedule updates and patient requests.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-8 py-5">Patient</th>
                  <th className="px-6 py-5">Dentist / Service</th>
                  <th className="px-6 py-5">Patient Note</th> {/* NEW COLUMN */}
                  <th className="px-6 py-5">Schedule</th>
                  <th className="px-6 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.slice(0, 6).map((app) => (
                  <tr key={app.appointment_id} className="hover:bg-slate-50/50 transition-colors group">
                    
                    {/* Patient Column */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-white border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                          {getInitials(app.patient_name)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{app.patient_name}</p>
                          {app.emergency === 1 && (
                            <span className="flex items-center gap-1 text-[10px] text-rose-600 font-bold uppercase tracking-wide mt-0.5">
                               <AlertCircle size={10} /> Emergency
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Dentist/Service Combined */}
                    <td className="px-6 py-5">
                        <div className="flex flex-col">
                            <span className="font-medium text-slate-700">Dr. {app.dentist_name}</span>
                            <span className="text-xs text-slate-400 mt-0.5 bg-slate-100 w-fit px-2 py-0.5 rounded-full">{app.service_name || "General"}</span>
                        </div>
                    </td>

                    {/* Notes Column (Replaces Actions) */}
                    <td className="px-6 py-5 max-w-[200px]">
                        {app.message ? (
                            <div className="flex items-start gap-2 text-slate-600">
                                <FileText size={14} className="mt-0.5 shrink-0 text-indigo-400" />
                                <span className="truncate italic">"{app.message}"</span>
                            </div>
                        ) : (
                            <span className="text-slate-400 text-xs italic">No additional notes</span>
                        )}
                    </td>

                    {/* Schedule */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-bold">
                           {app.user_set_date ? new Date(app.user_set_date).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : "TBD"}
                        </span>
                        <span className="text-slate-400 text-xs font-medium mt-0.5">{app.time_slot}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end">
                        {app.status?.toLowerCase() === "approved" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100/50 text-emerald-700">
                            <CheckCircle2 size={14} /> Approved
                            </span>
                        )}
                        {app.status?.toLowerCase() === "pending" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100/50 text-amber-700">
                            <Clock size={14} /> Pending
                            </span>
                        )}
                        {app.status?.toLowerCase() === "rejected" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-100/50 text-rose-700">
                            <XCircle size={14} /> Rejected
                            </span>
                        )}
                      </div>
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