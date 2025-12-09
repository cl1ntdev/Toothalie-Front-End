import React, { useEffect, useState, useMemo } from "react";
import { fetchAppointmentDentist } from "@/API/Authenticated/appointment/FetchAppointment";
import {
  Users,
  Calendar,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  FileText,
  Briefcase
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

// --- Sub-Components ---
const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, subtitle }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 font-ceramon">{value}</h3>
      </div>
      <div className={`p-3 rounded-2xl ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
    {subtitle && (
      <div className="mt-4 pt-4 border-t border-slate-50">
        <p className="text-xs font-medium text-slate-500">{subtitle}</p>
      </div>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 backdrop-blur-md">
        <p className="font-bold mb-1 border-b border-slate-700 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
            <span className="text-slate-300 capitalize">{entry.name}:</span> 
            <span className="font-bold text-white">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Main Component ---
export function Main() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchAppointmentDentist();
        
        if (data?.status === "ok" && Array.isArray(data.appointments)) {
          const rawAppointments = data.appointments;
          
          // Map API data to clean UI structure
          const formatted = rawAppointments.map((item) => {
            const appt = item.appointment;
            const patient = item.patient || {};
            // const dentist = item.dentist || {}; // If available

            return {
              id: appt.appointment_id,
              date: appt.user_set_date, // The scheduled date
              createdDate: appt.appointment_date, // When it was requested
              patientName: `${patient.first_name || ""} ${patient.last_name || ""}`.trim() || "Unknown Patient",
              patientId: patient.id,
              service: appt.service_name || "General Checkup",
              type: appt.appointment_type_id === 2 ? "Family" : "Individual",
              status: appt.status || "Pending",
              emergency: appt.emergency === 1,
              message: appt.message
            };
          });

          setAppointments(formatted);
        }
      } catch (err) {
        console.error("Dashboard Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Derived Metrics (Real Data Only) ---
  const stats = useMemo(() => {
    const total = appointments.length;
    
    // Unique Patients
    const uniquePatients = new Set(appointments.map(a => a.patientId)).size;
    
    // Emergency Ratio
    const emergencies = appointments.filter(a => a.emergency).length;
    
    // Today's Count
    const todayStr = new Date().toISOString().split("T")[0];
    const todayCount = appointments.filter(a => a.date && a.date.startsWith(todayStr)).length;

    return { total, uniquePatients, emergencies, todayCount };
  }, [appointments]);

  // --- Chart Data Calculation ---
  const charts = useMemo(() => {
    // 1. Status Distribution (Donut)
    const statusCounts = {};
    appointments.forEach(a => {
        const s = a.status || "Unknown";
        statusCounts[s] = (statusCounts[s] || 0) + 1;
    });
    
    const pieData = Object.keys(statusCounts).map(key => {
        let color = "#94a3b8"; // Gray default
        if(key.toLowerCase().includes("approve")) color = "#10b981"; // Emerald
        if(key.toLowerCase().includes("pend")) color = "#f59e0b"; // Amber
        if(key.toLowerCase().includes("reject")) color = "#ef4444"; // Rose
        if(key.toLowerCase().includes("complete")) color = "#3b82f6"; // Blue
        
        return { name: key, value: statusCounts[key], color };
    });

    // 2. Timeline Volume (Area) - Group by Scheduled Date
    const timelineMap = {};
    appointments.forEach(a => {
        if(!a.date) return;
        const d = new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        timelineMap[d] = (timelineMap[d] || 0) + 1;
    });
    
    // Sort chronologically (simple version)
    const areaData = Object.entries(timelineMap)
        .map(([name, value]) => ({ name, value }))
        .slice(-7); // Last 7 active dates found

    // 3. Services Breakdown (Bar)
    const serviceMap = {};
    appointments.forEach(a => {
        const s = a.service;
        serviceMap[s] = (serviceMap[s] || 0) + 1;
    });
    const barData = Object.entries(serviceMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a,b) => b.value - a.value)
        .slice(0, 5); // Top 5 services

    return { pieData, areaData, barData };
  }, [appointments]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-ceramon">
        <Activity className="h-12 w-12 text-indigo-600 animate-pulse stroke-1" />
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Synchronizing Records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-ceramon text-slate-900">
      <div className="max-w-10xl mx-auto space-y-8">
        

        {/* 1. Real Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Appointments" 
            value={stats.total} 
            icon={Calendar} 
            bgClass="bg-indigo-50" 
            colorClass="text-indigo-600"
            subtitle="All time records"
          />
          <StatCard 
            title="Unique Patients" 
            value={stats.uniquePatients} 
            icon={Users} 
            bgClass="bg-blue-50" 
            colorClass="text-blue-600"
            subtitle="Distinct individuals served"
          />
          <StatCard 
            title="Scheduled Today" 
            value={stats.todayCount} 
            icon={Clock} 
            bgClass="bg-emerald-50" 
            colorClass="text-emerald-600"
            subtitle="Visits for today's date"
          />
          <StatCard 
            title="Emergencies" 
            value={stats.emergencies} 
            icon={AlertCircle} 
            bgClass="bg-rose-50" 
            colorClass="text-rose-600"
            subtitle="High priority cases"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Visualizations */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Timeline Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Appointment Volume</h3>
                    <p className="text-slate-400 text-sm">Traffic based on scheduled dates (Active Days)</p>
                </div>
                <div className="h-64 w-full">
                    {charts.areaData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={charts.areaData}>
                                <defs>
                                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                            Not enough data to display trend.
                        </div>
                    )}
                </div>
            </div>

            {/* Read-Only List: Latest Requests */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900">Incoming Requests Log</h3>
                    <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded">Last 5 Entries</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 text-slate-400 font-semibold uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Requested Service</th>
                                <th className="px-6 py-4">Scheduled For</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {appointments.slice(0, 5).map((appt) => (
                                <tr key={appt.id}>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-slate-900">{appt.patientName}</p>
                                            {appt.emergency && (
                                                <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wide flex items-center gap-1 mt-0.5">
                                                    <AlertCircle size={10} /> Emergency
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Briefcase size={14} className="text-slate-400"/>
                                            <span className="text-slate-600">{appt.service}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                                        {appt.date ? new Date(appt.date).toLocaleDateString() : 'TBD'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                                                appt.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                appt.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                                {appt.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-400 italic">
                                        No appointment records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

          </div>

          {/* Right Column: Breakdown & Distribution */}
          <div className="space-y-8">
            
            {/* Status Donut */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                <h3 className="text-lg font-bold text-slate-900 mb-6 self-start w-full border-b border-slate-100 pb-4">Status Overview</h3>
                <div className="relative w-full h-48">
                    {charts.pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={charts.pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {charts.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400 text-sm">No Data</div>
                    )}
                    
                    {/* Center Total */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-slate-800">{stats.total}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Total</span>
                    </div>
                </div>
                {/* Legend */}
                <div className="w-full mt-6 space-y-3">
                    {charts.pieData.map((item) => (
                        <div key={item.name} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                                <span className="text-slate-600 font-medium capitalize">{item.name}</span>
                            </div>
                            <span className="font-bold text-slate-900">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Services (Bar Chart) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Top Services</h3>
                <div className="h-48 w-full">
                    {charts.barData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.barData} layout="vertical" barSize={12}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 11, fill: '#64748b'}} interval={0} />
                                <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400 text-sm">No Services Data</div>
                    )}
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}