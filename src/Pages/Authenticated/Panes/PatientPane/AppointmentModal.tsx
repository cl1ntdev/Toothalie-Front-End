"use client";

import React, { useEffect, useState } from "react";
import { getAllDentist } from "@/API/Authenticated/GetDentist";
import SubmitAppointment from "@/API/Authenticated/appointment/SubmitAppointment";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChevronDown, 
  Filter, 
  Search, 
  Stethoscope, 
  Clock, 
  Calendar as CalendarIcon, 
  AlertTriangle, 
  Users, 
  X,
  CheckCircle2,
  MapPin,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type AppointmentProps = {
  onClose: () => void;
  appointmentSuccess: () => void;
};

type ServiceType = "all" | "GeneralDentistry" | "SpecializedDentistry";

export default function AppointmentModal({
  onClose,
  appointmentSuccess,
}: AppointmentProps) {
  // --- STATE ---
  const [dentists, setDentists] = useState<any[]>([]);
  const [filteredDentists, setFilteredDentists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selection State
  const [pickDentist, setPickDentist] = useState<string | number>("");
  const [pickDay, setPickDay] = useState<string>("");
  const [pickTime, setPickTime] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectService, setSelectService] = useState<{
    serviceTypeName: string;
    serviceID: string | number | null;
    serviceName: string;
  }>({ serviceID: null, serviceName: "", serviceTypeName: "" });

  // Form Details
  const [isEmergency, setIsEmergency] = useState(false);
  const [isFamilyBooking, setIsFamilyBooking] = useState(false);
  const [message, setMessage] = useState<string>("");
  
  // Filters
  const [serviceTypeFilter, setServiceTypeFilter] = useState<ServiceType>("all");
  const [activePopover, setActivePopover] = useState<string | null>(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchDentists = async () => {
      try {
        setLoading(true);
        const res = await getAllDentist();
        if (res.status === "ok" && res.dentists) {
          setDentists(res.dentists);
          setFilteredDentists(res.dentists);
        } else {
          setError("No dentists found.");
        }
      } catch (err) {
        setError("Failed to load dentists.");
      } finally {
        setLoading(false);
      }
    };
    fetchDentists();
  }, []);

  // --- FILTER LOGIC ---
  useEffect(() => {
    if (serviceTypeFilter === "all") {
      setFilteredDentists(dentists);
    } else {
      const filtered = dentists.filter((dentist) =>
        dentist.services?.some(
          (service: any) => service.serviceTypeName === serviceTypeFilter
        )
      );
      setFilteredDentists(filtered);
    }
  }, [serviceTypeFilter, dentists]);

  // --- HELPERS ---
  const getDayIndex = (day: string) => {
    const map: Record<string, number> = {
      Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
    };
    return map[day] ?? -1;
  };

  const disableDates = (date: Date) => {
    if (!pickDay) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayIndex = getDayIndex(pickDay);
    return date < today || date.getDay() !== dayIndex;
  };

  const getServicesByType = (dentist: any) => {
    const services = dentist.services || [];
    const grouped: Record<string, any[]> = {};
    services.forEach((service: any) => {
      const typeName = service.serviceTypeName || "Other Services";
      if (!grouped[typeName]) grouped[typeName] = [];
      grouped[typeName].push(service);
    });
    return grouped;
  };

  const formatServiceTypeName = (typeName: string) =>
    typeName.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();

  const getInitials = (first: string, last: string) => 
    `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();

  const handleSubmit = async () => {
    if (!date || !pickDentist || !pickDay || !pickTime || !selectService.serviceID) {
      setError("Please complete all required fields.");
      return;
    }
    const formattedDate = date.toLocaleDateString("en-CA");
    const serviceID = selectService.serviceID!.toString();

    const res = await SubmitAppointment(
      pickDentist, pickDay, pickTime, isEmergency, isFamilyBooking, formattedDate, message, serviceID
    );

    if (res.ok === true) {
      onClose();
      appointmentSuccess();
    } else {
      setError(res.message || "Failed to submit appointment.");
    }
  };

  // --- RENDER ---
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-ceramon tracking-tight">Book Appointment</h2>
            <p className="text-sm text-slate-500 mt-0.5">Find a dentist and schedule your visit.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          {/* Left Sidebar: Filters */}
          <div className="w-full lg:w-64 bg-slate-50 border-r border-slate-100 p-6 overflow-y-auto shrink-0 space-y-6">
            
            {/* Options */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking Options</h3>
              <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isEmergency ? 'bg-rose-50 border-rose-200 ring-1 ring-rose-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                <Checkbox id="emergency" checked={isEmergency} onCheckedChange={(c) => setIsEmergency(c === true)} 
                  className="data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600" />
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                   <AlertTriangle size={16} className={isEmergency ? "text-rose-600" : "text-slate-400"} /> Emergency
                </div>
              </label>
              
              <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isFamilyBooking ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                <Checkbox id="family" checked={isFamilyBooking} onCheckedChange={(c) => setIsFamilyBooking(c === true)}
                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" />
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                   <Users size={16} className={isFamilyBooking ? "text-purple-600" : "text-slate-400"} /> Family
                </div>
              </label>
            </div>

            {/* Service Filters */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Filter size={12} /> Service Type
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'all', label: 'All Services' },
                  { id: 'GeneralDentistry', label: 'General Dentistry' },
                  { id: 'SpecializedDentistry', label: 'Specialized' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setServiceTypeFilter(type.id as ServiceType)}
                    className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      serviceTypeFilter === type.id 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'text-slate-600 hover:bg-slate-200/50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main: Dentists List */}
          <div className="flex-1 overflow-y-auto p-6 bg-white relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p>Loading dentists...</p>
              </div>
            ) : filteredDentists.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                <Search className="h-10 w-10 text-slate-200" />
                <p>No dentists found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredDentists.map((dentist) => {
                  const groupedServices = getServicesByType(dentist);
                  const serviceTypes = Object.keys(groupedServices);
                  const isSelected = pickDentist === dentist.id;

                  return (
                    <div 
                      key={dentist.id} 
                      className={`
                        rounded-2xl border transition-all duration-300 overflow-hidden
                        ${isSelected 
                          ? "border-indigo-500 shadow-lg shadow-indigo-100 ring-1 ring-indigo-500 bg-white" 
                          : "border-slate-200 hover:border-slate-300 hover:shadow-md bg-white"
                        }
                      `}
                    >
                      {/* Dentist Header Row */}
                      <div 
                        onClick={() => {
                          if (pickDentist !== dentist.id) {
                            setSelectService({ serviceID: null, serviceName: "", serviceTypeName: "" });
                            setPickDay(""); setPickTime(""); setDate(undefined); setError(null);
                          }
                          setPickDentist(dentist.id);
                        }}
                        className="p-5 cursor-pointer flex items-start gap-4"
                      >
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 shrink-0
                          ${isSelected ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 text-slate-500 border-white"}
                        `}>
                          {getInitials(dentist.first_name, dentist.last_name)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className={`font-bold text-lg ${isSelected ? "text-indigo-900" : "text-slate-900"}`}>
                                Dr. {dentist.first_name} {dentist.last_name}
                              </h3>
                              <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                                <Stethoscope size={14} /> {dentist.specialty || 'General Dentist'}
                              </p>
                            </div>
                            {isSelected && <CheckCircle2 className="text-indigo-600" size={20} />}
                          </div>
                          
                          {/* Collapsed view prompt */}
                          {!isSelected && (
                            <p className="text-xs text-indigo-600 font-medium mt-2">Click to view schedule & services</p>
                          )}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isSelected && (
                        <div className="px-5 pb-5 border-t border-slate-100 bg-slate-50/50">
                          
                          {/* 1. Select Service */}
                          <div className="mt-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">1. Select Service</h4>
                            <div className="space-y-4">
                              {serviceTypes.map((typeName) => (
                                <div key={typeName}>
                                  <h5 className="text-xs font-semibold text-slate-700 mb-2 pl-1">{formatServiceTypeName(typeName)}</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {groupedServices[typeName].slice(0, 6).map((service: any) => {
                                      const active = selectService.serviceID === service.serviceID;
                                      return (
                                        <button
                                          key={service.serviceID}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectService({
                                              serviceTypeName: typeName,
                                              serviceID: service.serviceID,
                                              serviceName: service.serviceName,
                                            });
                                          }}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                            active 
                                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                                              : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                          }`}
                                        >
                                          {service.serviceName}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 2. Select Time & Date */}
                          <div className="mt-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">2. Select Time</h4>
                            {dentist.schedule && Object.keys(dentist.schedule).length > 0 ? (
                              <div className="space-y-3">
                                {Object.keys(dentist.schedule).map((day) => (
                                  <div key={day} className="bg-white p-3 rounded-xl border border-slate-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <CalendarIcon size={14} className="text-indigo-500"/> {day}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {dentist.schedule[day].map((time: string) => {
                                        const activeTime = pickDay === day && pickTime === time;
                                        return (
                                          <button
                                            key={time}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setPickDay(day);
                                              setPickTime(time);
                                              setDate(undefined); // Reset date to force pick
                                              setError(null);
                                            }}
                                            className={`
                                              relative px-3 py-2 rounded-md text-xs font-medium border transition-all
                                              ${activeTime 
                                                ? "bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-200" 
                                                : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-white hover:border-slate-300"
                                              }
                                            `}
                                          >
                                            {time}
                                          </button>
                                        )
                                      })}
                                    </div>

                                    {/* Date Picker appears inside the card when a time is picked for this day */}
                                    {pickDay === day && pickTime && (
                                      <div className="mt-3 pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex gap-3">
                                          <div className="flex-1">
                                            <Popover open={activePopover === `${dentist.id}-${day}`} onOpenChange={(o) => setActivePopover(o ? `${dentist.id}-${day}` : null)}>
                                              <PopoverTrigger asChild>
                                                <Button variant="outline" className={`w-full justify-start text-left h-10 text-sm border-slate-200 ${!date && 'text-slate-400'}`}>
                                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                                  {date ? date.toLocaleDateString() : "Select Date"}
                                                </Button>
                                              </PopoverTrigger>
                                              <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={date} onSelect={setDate} disabled={disableDates} initialFocus />
                                              </PopoverContent>
                                            </Popover>
                                          </div>
                                          <div className="flex-1">
                                            <input 
                                              placeholder="Optional Message..."
                                              value={message}
                                              onChange={(e) => setMessage(e.target.value)}
                                              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-slate-400 italic">No slots available.</p>
                            )}
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-4 shrink-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="hidden sm:block text-xs text-slate-400">
            {error && <span className="text-rose-600 font-medium flex items-center gap-1"><AlertTriangle size={12}/> {error}</span>}
            {!error && "Please select a dentist, service, and time slot."}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!pickDentist || !pickDay || !pickTime || !date || !selectService.serviceID}
              className={`flex-1 sm:flex-none min-w-[140px] ${(!pickDentist || !pickDay || !pickTime || !date) ? 'opacity-50' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
            >
              {isEmergency ? "Book Emergency" : "Confirm Booking"}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}