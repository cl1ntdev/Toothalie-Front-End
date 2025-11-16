"use client";

import React, { useEffect, useState } from "react";
import { getAllDentist } from "@/API/Authenticated/GetDentist";
import SubmitAppointment from "@/API/Authenticated/appointment/SubmitAppointment";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDownIcon, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
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
  const [dentists, setDentists] = useState<any[]>([]);
  const [filteredDentists, setFilteredDentists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickDentist, setPickDentist] = useState<string | number>("");
  const [pickDay, setPickDay] = useState<string>("");
  const [pickTime, setPickTime] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isFamilyBooking, setIsFamilyBooking] = useState(false);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [serviceTypeFilter, setServiceTypeFilter] =
    useState<ServiceType>("all");
  const [showFilters, setShowFilters] = useState(false);

  // const [selectedGeneralService, setSelectedGeneralService] = useState<{
  //   serviceID: string | number | null;
  //   serviceName: string;
  // }>({ serviceID: null, serviceName: "" });
  
  
  const [selectService, setSelectService ] = useState<{
    serviceTypeName: string
    serviceID: string | number | null;
    serviceName: string;
  }>({ serviceID: null, serviceName: "", serviceTypeName:"" });

  useEffect(() => {
    console.log(selectService)
  }, [selectService]);

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

  useEffect(() => {
    if (serviceTypeFilter === "all") {
      setFilteredDentists(dentists);
    } else {
      const filtered = dentists.filter((dentist) =>
        dentist.services?.some(
          (service: any) => service.serviceTypeName === serviceTypeFilter,
        ),
      );
      setFilteredDentists(filtered);
    }
  }, [serviceTypeFilter, dentists]);

  const getDayIndex = (day: string) => {
    const map: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
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

  //group the services by service type
  const getServicesByType = (dentist: any) => {
    const services = dentist.services || [];
    const groupedServices: Record<string, any[]> = {};

    services.forEach((service: any) => {
      const typeName = service.serviceTypeName || "Other Services";
      if (!groupedServices[typeName]) {
        groupedServices[typeName] = [];
      }
      groupedServices[typeName].push(service);
    });
    console.log('group serviecs are: ' + groupedServices)
    return groupedServices;
  };

  const formatServiceTypeName = (typeName: string) => {
    return typeName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const handleSubmit = async () => {
    const userID = localStorage.getItem("userID");

    if (!userID || !pickDentist || !pickDay || !pickTime || !date) {
      setError("Please complete all fields before booking.");
      return;
    }

    const formattedDate = date.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
    // const response = await SubmitAppointment(
    //   userID,
    //   pickDentist,
    //   pickDay,
    //   pickTime,
    //   isEmergency,
    //   isFamilyBooking,
    //   formattedDate,
    //   message,
    // );

    if (response.ok === true) {
      onClose();
      appointmentSuccess();
    } else {
      setError(
        response.message || "Failed to submit appointment. Please try again.",
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Book Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto">
          {/* Booking types */}
          <div className="p-4 space-y-3 border-b">
            <div className="flex items-center gap-2">
              <Checkbox
                id="emergency"
                checked={isEmergency}
                onCheckedChange={(checked) => setIsEmergency(checked === true)}
              />
              <label htmlFor="emergency" className="text-sm cursor-pointer">
                Emergency Appointment
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="family-booking"
                checked={isFamilyBooking}
                onCheckedChange={(checked) =>
                  setIsFamilyBooking(checked === true)
                }
              />
              <label
                htmlFor="family-booking"
                className="text-sm cursor-pointer"
              >
                Family Booking
              </label>
            </div>
          </div>

          {/* Service Type Filter */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Filter by Service Type</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <FilterIcon className="h-4 w-4" />
                Filter
              </Button>
            </div>

            {showFilters && (
              <div className="space-y-2 animate-in fade-in-50">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={
                      serviceTypeFilter === "all" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setServiceTypeFilter("all")}
                  >
                    All Dentists
                  </Button>
                  <Button
                    variant={
                      serviceTypeFilter === "GeneralDentistry"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setServiceTypeFilter("GeneralDentistry")}
                  >
                    General Dentistry
                  </Button>
                  <Button
                    variant={
                      serviceTypeFilter === "SpecializedDentistry"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setServiceTypeFilter("SpecializedDentistry")}
                  >
                    Specialized Dentistry
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  {filteredDentists.length} dentist
                  {filteredDentists.length !== 1 ? "s" : ""} available
                </p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-2 rounded text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            ) : filteredDentists.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No dentists available for{" "}
                {serviceTypeFilter === "all" ? "any" : serviceTypeFilter}{" "}
                services.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDentists.map((dentist) => {
                  const groupedServices = getServicesByType(dentist);
                  const serviceTypes = Object.keys(groupedServices);

                  return (
                    <div
                      key={dentist.id}
                      className={`rounded-lg p-4 space-y-3 transition-all ${
                        pickDentist === dentist.id
                          ? "border-2 border-blue-600 shadow-lg"
                          : "border"
                      }`}
                      onClick={() => {
                             // Reset service selection when picking another dentist
                             if (pickDentist !== dentist.id) {
                               setSelectService({ serviceID: null, serviceName: "", serviceTypeName: "" });
                               setPickDay("");
                               setPickTime("");
                               setDate(undefined);
                               setError(null);
                             }
                             setPickDentist(dentist.id);
                           }}
                    >
                      {/* Dentist info */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium flex-shrink-0">
                          DR
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">
                            {dentist.first_name + " " + dentist.last_name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {dentist.email}
                          </p>

                          {/* Service Type Badges */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {serviceTypes.map((typeName) => (
                              <span
                                key={typeName}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {formatServiceTypeName(typeName)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Services by Type */}
                      <div className="space-y-3">
                        {serviceTypes.map((typeName) => (
                          <div key={typeName} className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">
                              {formatServiceTypeName(typeName)}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {groupedServices[typeName]
                                .slice(0, 5)
                                .map((service: any) => (
                                  <button
                                    key={service.serviceName} 
                                    onClick={() => {
                                      setPickDentist(dentist.id);

                                      setPickDay("");
                                      setPickTime("");
                                      
                                      setDate(undefined);

                                      if (typeName === "GeneralDentistry") {
                                        setSelectService({
                                          serviceTypeName: 'GeneralDentistry',
                                          serviceID: service.serviceID,
                                          serviceName: service.serviceName,
                                        });
                                      } else if (
                                        typeName === "SpecializedDentistry"
                                      ) {
                                        setSelectService({
                                          serviceTypeName: 'SpecializedDentistry',
                                          serviceID: service.serviceID,
                                          serviceName: service.serviceName,
                                        });
                                      }
                                    }}
                                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all border focus:outline-none focus:ring-2 focus:ring-offset-1
                                      ${
                                        selectService.serviceID === service.serviceID &&
                                        selectService.serviceTypeName === typeName &&
                                        pickDentist === dentist.id
                                          ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white border-transparent shadow-lg scale-105 ring-2 ring-offset-2 ring-blue-400"
                                          : typeName === "GeneralDentistry"
                                            ? "bg-white text-gray-700 border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                            : typeName === "SpecializedDentistry"
                                              ? "bg-white text-gray-700 border-green-300 hover:bg-green-50 hover:text-green-700"
                                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-800"
                                      }
                                    `}

                                  >
                                    {service.serviceName}
                                  </button>
                                ))}
                              {groupedServices[typeName].length > 5 && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                                  +{groupedServices[typeName].length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Schedule */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          Available Schedule:
                        </h4>
                        {dentist.schedule &&
                        Object.keys(dentist.schedule).length > 0 ? (
                          <div className="space-y-2">
                            {Object.keys(dentist.schedule).map((day) => (
                              <div key={day}>
                                <button
                                  onClick={() => {
                                    setPickDentist(dentist.id);
                                    setPickDay(day);
                                    setPickTime("");
                                    setDate(undefined);
                                    setError(null);
                                  }}
                                  className={`text-sm font-medium ${
                                    pickDentist === dentist.id &&
                                    pickDay === day
                                      ? "text-blue-600"
                                      : "text-gray-700 hover:text-blue-600"
                                  }`}
                                >
                                  {day}
                                </button>
                                <div className="flex flex-wrap gap-1 mt-1 ml-3">
                                  {dentist.schedule[day]?.map(
                                    (time: string) => (
                                      <button
                                        key={time}
                                        onClick={() => {
                                          setPickDentist(dentist.id);
                                          setPickDay(day);
                                          setPickTime(time);
                                          setDate(undefined);
                                          setError(null);
                                        }}
                                        className={`px-2 py-1 rounded text-xs border transition-colors ${
                                          pickDentist === dentist.id &&
                                          pickDay === day &&
                                          pickTime === time
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white border-gray-300 hover:border-blue-600 hover:text-blue-600"
                                        }`}
                                      >
                                        {time}
                                      </button>
                                    ),
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* Calendar picker */}
                            {pickDentist === dentist.id &&
                              pickDay &&
                              pickTime && (
                                <div className="space-y-2 mt-3 p-3 bg-gray-50 rounded-lg">
                                  <Label className="text-sm font-medium">
                                    Select Date
                                  </Label>
                                  <Popover
                                    open={
                                      activePopover === `${dentist.id}-calendar`
                                    }
                                    onOpenChange={(isOpen) =>
                                      setActivePopover(
                                        isOpen
                                          ? `${dentist.id}-calendar`
                                          : null,
                                      )
                                    }
                                  >
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="w-full justify-between"
                                      >
                                        {date
                                          ? date.toLocaleDateString()
                                          : "Select date"}
                                        <ChevronDownIcon className="h-4 w-4" />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => setDate(d)}
                                        disabled={disableDates}
                                      />
                                    </PopoverContent>
                                  </Popover>

                                  <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700 block">
                                      Message to Dentist
                                    </label>
                                    <textarea
                                      placeholder="What's the issue? Describe your symptoms or concerns..."
                                      value={message}
                                      onChange={(e) =>
                                        setMessage(e.target.value)
                                      }
                                      rows={3}
                                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    />
                                    <p className="text-xs text-gray-400">
                                      This message will help the dentist prepare
                                      for your appointment
                                    </p>
                                  </div>
                                </div>
                              )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No available schedule.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t sticky bottom-0 bg-white z-10">
          <Button
            onClick={handleSubmit}
            disabled={!pickDentist || !pickDay || !pickTime || !date || selectService.serviceID == null}
            className={`w-full py-2 text-sm font-medium transition-colors ${
              pickDentist && pickDay && pickTime && date
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isEmergency ? "Book Emergency Appointment" : "Book Appointment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
