import React, { useEffect, useState, useCallback } from "react";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "@/API/Authenticated/admin/Appointment";
import { getUsers } from "@/API/Authenticated/admin/AppUser";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Check,
  X,
  Plus,
  AlertTriangle,
  Loader2,
  Calendar,
  User,
  Clock,
  Stethoscope,
  FileText,
  Activity,
} from "lucide-react";

export default function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // State for Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // State for Delete Modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [IDtoDelete, setIDtoDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dentist-filtered schedules and services
  const [selectedDentistId, setSelectedDentistId] = useState(null);

  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  const [allSchedules, setAllSchedules] = useState({}); // { dentistId: [schedules] }
  const [allServices, setAllServices] = useState({}); // { dentistId: [services] }

  const [users, setUsers] = useState([]);
  // ============= ss
  useEffect(() => {
    if (currentAppointment) {
      const dID = currentAppointment.dentist_id;
      setSelectedDentistId(dID);
      setAvailableSchedules(allSchedules[dID] || []);
      setAvailableServices(allServices[dID] || []);
    } else {
      setSelectedDentistId(null);
      setAvailableSchedules([]);
      setAvailableServices([]);
    }
  }, [currentAppointment, allSchedules, allServices]);

  // Add this useEffect to auto-select first dentist in create mode
  useEffect(() => {
    if (!currentAppointment && users.length > 0 && !selectedDentistId) {
      // Find the first dentist in the users list
      const firstDentist = users.find(u => u.roles.includes("ROLE_DENTIST"));
      if (firstDentist) {
        setSelectedDentistId(firstDentist.id);
        setAvailableSchedules(allSchedules[firstDentist.id] || []);
        setAvailableServices(allServices[firstDentist.id] || []);
      }
    }
  }, [currentAppointment, users, allSchedules, allServices, selectedDentistId]);
  
  const handleDentistChange = (e) => {
    const dID = e.target.value; // This is a String (e.g., "25")
        
        // Convert to number for state if your IDs are numbers, 
        // but keep as is for object lookup if keys are strings.
        // Ideally, cast to the format your ID is stored in.
        setSelectedDentistId(dID);
    
        if (dID) {
          // Access using the ID directly. 
          // Note: allSchedules[25] and allSchedules["25"] usually both work in JS,
          // but explicitly converting to the key format is safer.
          setAvailableSchedules(allSchedules[dID] || []);
          setAvailableServices(allServices[dID] || []);
        } else {
          setAvailableSchedules([]);
          setAvailableServices([]);
        }
  };
  
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAppointments();
      const responseUsers = await getUsers();
      console.log(response);
      console.log(responseUsers);

      if (response && response.appointments)
        console.log(response.appointments)
        setAppointments(response.appointments);
      if (responseUsers && responseUsers.users) setUsers(responseUsers.users);

      if (response && response.schedules) setAllSchedules(response.schedules);
      if (response && response.services) setAllServices(response.services);

      if (response && response.appointments) {
        setAppointments(response.appointments);
      }
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // --- HANDLERS ---
  const handleCreateClick = () => {
    setCurrentAppointment(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (appointment) => {
    setCurrentAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentAppointment(null);
  };

  const handleFormSubmit = async (formData) => {
    console.log(formData)
    try {
      if (currentAppointment) {
        const res = await updateAppointment({
          appointmentID: currentAppointment.appointment_id,
          ...formData,
        });
        console.log(res)
      } else {
        await createAppointment(formData);
      }
      fetchAppointments();
      handleModalClose();
    } catch (error) {
      console.error("Error saving appointment", error);
      alert("Failed to save appointment");
    }
  };

  const handleDeleteClick = (id) => {
    setIDtoDelete(id);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!IDtoDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteAppointment(IDtoDelete);
      console.log(res)
      setAppointments((prev) =>
        prev.filter((app) => app.appointment_id !== IDtoDelete),
      );
      setOpenDeleteModal(false);
      setIDtoDelete(null);
    } catch (error) {
      console.error("Error deleting appointment", error);
      alert("Failed to delete appointment");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- HELPERS ---
  const filteredAppointments = appointments.filter((appointment) => {
    // console.log(appointment.patient_name)
    const matchesSearch =
      appointment.patient_name?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.dentist_name?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.status?.toLowerCase().toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.message?.toLowerCase().toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "ALL" ||
      appointment.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending:
        "bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-600/20",
      confirmed:
        "bg-green-50 text-green-700 border-green-200 ring-green-600/20",
      cancelled: "bg-red-50 text-red-700 border-red-200 ring-red-600/20",
      completed: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20",
    };
    const activeStyle =
      styles[status?.toLowerCase()] ||
      "bg-gray-50 text-gray-700 border-gray-200";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ring-1 ring-inset ${activeStyle}`}
      >
        <span
          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status === "pending" ? "bg-yellow-500" : status === "confirmed" ? "bg-green-500" : status === "cancelled" ? "bg-red-500" : "bg-blue-500"}`}
        ></span>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
      </span>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  // Safely show values even if null
  const safe = (v, fallback = "—") =>
    v !== null && v !== undefined && v !== "" ? v : fallback;

  // Format full date/time
  const formatDateTime = (date, time) => {
    if (!date) return "—";
    let formatted = new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return time ? `${formatted} • ${time}` : formatted;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Appointments
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage patient schedules and status
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search name, note..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              onClick={handleCreateClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:ring-4 focus:ring-blue-100"
            >
              <Plus size={16} />
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        {/* Card Container for Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase text-gray-500 font-medium">
                  <th className="p-4 w-16 text-center">ID</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Dentist</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((a) => (
                    <tr
                      key={a.appointment_id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* ID */}
                      <td className="p-4 text-center font-mono text-xs text-gray-400">
                        #{a.appointment_id}
                      </td>

                      {/* PATIENT */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <User size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800">
                              {safe(a.patient_name, `Patient #${a.patient_id}`)}
                            </span>
                            <span className="text-xs text-gray-500">
                              ID: {a.patient_id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* DENTIST */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Stethoscope size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-800">
                              {safe(a.dentist_name, `Dentist #${a.dentist_id}`)}
                            </span>
                            <span className="text-xs text-gray-500">
                              ID: {a.dentist_id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* DATE & TIME */}
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {formatDateTime(
                              a.appointment_date,
                              a.schedule_time,
                            )}
                          </span>
                          <span className="text-xs text-gray-500">
                            Slot: {safe(a.schedule_label, a.schedule_id)}
                          </span>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="p-4">{getStatusBadge(a.status)}</td>

                      {/* SERVICES / TYPE */}
                      <td className="p-4 text-sm text-gray-700">
                        <span className="font-medium">
                          {safe(
                            a.service_name,
                            `Type #${a.appointment_type_id}`,
                          )}
                        </span>

                        {a.emergency === 1 && (
                          <span className="ml-2 inline-flex items-center text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                            <Activity size={10} className="mr-1" /> Emergency
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(a)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(a.appointment_id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Calendar className="h-12 w-12 mb-3 text-gray-300" />
                        <p className="text-lg font-medium text-gray-900">
                          No appointments found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- CREATE / EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={handleModalClose}
          ></div>

          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">
                {currentAppointment ? "Edit Appointment" : "New Appointment"}
              </h3>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              <form
                id="appointmentForm"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  const data = Object.fromEntries(fd.entries());
                  data.emergency = fd.get("emergency") === "on" ? 1 : 0;
                  handleFormSubmit(data);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Entities */}
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">
                      Entities
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Patient Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Patient
                        </label>
                        <select
                          name="patient_id"
                          defaultValue={currentAppointment?.patient_id || ""}
                          required
                          className="block w-full rounded-lg border-gray-300 border text-sm py-2 bg-white"
                        >
                          <option value="" disabled>
                            Select patient
                          </option>
                          {users
                            ?.filter((u) => u.roles.includes("ROLE_PATIENT"))
                            .map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.first_name} {d.last_name} ({d.username})
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Dentist Dropdown */}
                      {/* Dentist Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dentist
                        </label>
                        <select
                          name="dentist_id"
                          // CHANGE 1: Use value linked to state
                          value={selectedDentistId || ""} 
                          required
                          className="block w-full rounded-lg border-gray-300 border text-sm py-2 bg-white"
                          onChange={handleDentistChange} 
                        >
                          <option value="" disabled>
                            Select dentist
                          </option>
                          {users
                            ?.filter((u) => u.roles.includes("ROLE_DENTIST"))
                            .map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.first_name} {d.last_name} ({d.username})
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="col-span-1 md:col-span-2 border-t border-gray-100 pt-4">
                    <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">
                      Schedule & Details
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          User Set Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            type="date"
                            name="user_set_date"
                            defaultValue={
                              currentAppointment?.user_set_date
                                ? new Date(currentAppointment.user_set_date)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            className="pl-9 block w-full rounded-lg border-gray-300 border text-sm py-2"
                          />
                        </div>
                      </div>

                      {/* Schedule Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Schedule Slot
                        </label>
                        <select
                          name="schedule_id"
                          defaultValue={currentAppointment?.schedule_id || ""}
                          required
                          className="block w-full rounded-lg border-gray-300 border text-sm py-2 bg-white"
                        >
                          <option value="" disabled>
                            Select schedule
                          </option>
                          {availableSchedules.map((sch) => (
                            <option key={sch.scheduleID} value={sch.scheduleID}>
                              {sch.day_of_week} — {sch.time_slot}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          name="status"
                          defaultValue={currentAppointment?.status || "pending"}
                          className="block w-full rounded-lg border-gray-300 border text-sm py-2 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      {/* Emergency */}
                      <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 select-none">
                          <input
                            type="checkbox"
                            name="emergency"
                            defaultChecked={currentAppointment?.emergency === 1}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300"
                          />
                          Mark as Emergency
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="col-span-1 md:col-span-2 border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Service Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service
                        </label>
                        <select
                          name="service_id"
                          defaultValue={currentAppointment?.service_id || ""}
                          className="block w-full rounded-lg border-gray-300 border text-sm py-2 bg-white"
                        >
                          <option value="" disabled>
                            Select service
                          </option>
                          {availableServices.map((srv) => (
                            <option key={srv.service_id} value={srv.service_id}>
                              {srv.service_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message / Notes
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      defaultValue={currentAppointment?.message}
                      className="block w-full rounded-lg border-gray-300 border text-sm py-2 resize-none"
                      placeholder="Add optional notes..."
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="appointmentForm"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
              >
                {currentAppointment ? "Update Changes" : "Create Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {openDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setOpenDeleteModal(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 ring-8 ring-red-50">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Appointment?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to remove appointment{" "}
                <span className="font-mono bg-gray-100 px-1 rounded text-gray-700">
                  #{IDtoDelete}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setOpenDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition flex-1 disabled:opacity-70"
                >
                  {isDeleting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
