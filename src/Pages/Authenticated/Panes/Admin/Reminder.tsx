"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} from "@/API/Authenticated/admin/Reminder";
import Alert from "@/components/_myComp/Alerts";
import {
  Pencil,
  Trash2,
  Activity,
  Search,
  Plus,
  Loader2,
  Calendar,
  Clock,
  X,
  Save,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

/* --- Types --- */
type Slot = {
  startTime: string;
  endTime: string;
  message: string;
};

type InformationItem = {
  id: string;
  date: string;
  slots: Slot[];
};

type ReminderItem = {
  id: number;
  appointment_id: number | null;
  information: InformationItem[];
  viewed: number; // Normalized to 0 or 1
};

/* --- Helper: Robust JSON Parser --- */
const safeParseInformation = (input: any): InformationItem[] => {
  if (!input) return [];
  
  let parsed = input;
  
  // Recursively parse if it's a string (Handle double/triple encoding)
  // Limit to 3 iterations to prevent infinite loops on malformed data
  let attempts = 0;
  while (typeof parsed === 'string' && attempts < 3) {
    try {
      const temp = JSON.parse(parsed);
      parsed = temp;
    } catch (e) {
      // If parse fails, stop and use what we have
      break;
    }
    attempts++;
  }

  // Final check: is it an array?
  if (Array.isArray(parsed)) {
    return parsed;
  }
  
  // Is it a single object? wrap in array
  if (typeof parsed === 'object' && parsed !== null) {
    return [parsed];
  }

  return [];
};

/* --- Helper: ID Generator --- */
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function Reminder() {
  // Data State
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterViewed, setFilterViewed] = useState<"ALL" | "VIEWED" | "UNVIEWED">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<ReminderItem | null>(null);
  const [infoItems, setInfoItems] = useState<InformationItem[]>([]);
  
  // Delete State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Alert State
  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "info" | "success" | "warning" | "error",
    title: "",
    message: "",
  });

  /* --- Fetching --- */
  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await getReminders();
      
      if (resp && Array.isArray(resp.reminders)) {
        const parsedData = resp.reminders.map((r: any) => ({
          id: r.id,
          appointment_id: r.appointment_id ?? null,
          // Use our robust parser here
          information: safeParseInformation(r.information), 
          // Normalize null to 0
          viewed: (r.viewed === 1 || r.viewed === "1") ? 1 : 0, 
        }));
        setReminders(parsedData);
      } else {
        setReminders([]);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "Failed to load reminders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  /* --- Editor Logic (Modal) --- */
  useEffect(() => {
    if (isModalOpen) {
      if (currentReminder) {
        // Deep copy data for editing
        const deepCopy = JSON.parse(JSON.stringify(currentReminder.information));
        setInfoItems(deepCopy.length > 0 ? deepCopy : [createEmptyInfo()]);
      } else {
        // Create mode
        setInfoItems([createEmptyInfo()]);
      }
    } else {
      setInfoItems([]);
    }
  }, [isModalOpen, currentReminder]);

  const createEmptyInfo = () => ({
    id: generateId(),
    date: "",
    slots: [{ startTime: "", endTime: "", message: "" }],
  });

  // Add/Remove Date blocks
  const handleAddInfo = () => setInfoItems([...infoItems, createEmptyInfo()]);
  const handleRemoveInfo = (idx: number) => setInfoItems(prev => prev.filter((_, i) => i !== idx));

  // Add/Remove Slots
  const handleSlotAction = (infoIdx: number, action: 'add' | 'remove', slotIdx?: number) => {
    setInfoItems(prev => prev.map((item, i) => {
      if (i !== infoIdx) return item;
      const newSlots = [...item.slots];
      if (action === 'add') newSlots.push({ startTime: "", endTime: "", message: "" });
      else if (action === 'remove' && typeof slotIdx === 'number') newSlots.splice(slotIdx, 1);
      return { ...item, slots: newSlots };
    }));
  };

  // Update Fields
  const handleUpdate = (infoIdx: number, field: 'date' | 'slot', value: any, slotIdx?: number, slotField?: keyof Slot) => {
    setInfoItems(prev => prev.map((item, i) => {
      if (i !== infoIdx) return item;
      if (field === 'date') return { ...item, date: value };
      if (field === 'slot' && typeof slotIdx === 'number' && slotField) {
        const newSlots = [...item.slots];
        newSlots[slotIdx] = { ...newSlots[slotIdx], [slotField]: value };
        return { ...item, slots: newSlots };
      }
      return item;
    }));
  };

  /* --- API Actions --- */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (infoItems.some(i => !i.date)) return showAlert("warning", "Missing Data", "All items must have a date.");
    if (infoItems.some(i => i.slots.some(s => !s.startTime || !s.endTime))) {
      return showAlert("warning", "Missing Data", "All slots must have start and end times.");
    }

    try {
      const form = new FormData(e.target as HTMLFormElement);
      const apptId = form.get("appointment_id");
      const isViewed = form.get("viewed") ? 1 : 0;
      
      const payload = {
        appointment_id: apptId ? Number(apptId) : null,
        viewed: isViewed,
        // We ensure we only stringify ONCE here
        information: JSON.stringify(infoItems),
      };

      if (currentReminder) {
        await updateReminder({ reminderID: currentReminder.id, ...payload });
        showAlert("success", "Updated", "Reminder updated successfully.");
      } else {
        await createReminder(payload);
        showAlert("success", "Created", "Reminder created successfully.");
      }

      setIsModalOpen(false);
      fetchReminders();
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "Failed to save reminder.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteReminder(deleteId);
      // Optimistic update
      setReminders(prev => prev.filter(r => r.id !== deleteId));
      showAlert("success", "Deleted", "Reminder removed.");
      setDeleteId(null);
    } catch (err) {
      showAlert("error", "Error", "Could not delete reminder.");
    } finally {
      setIsDeleting(false);
    }
  };

  const showAlert = (type: any, title: string, message: string) => {
    setAlert({ show: true, type, title, message });
  };

  /* --- Render --- */
  const filteredReminders = reminders.filter((r) => {
    const searchLower = searchTerm.toLowerCase();
    const infoString = JSON.stringify(r.information).toLowerCase();
    const matchesSearch =
      String(r.appointment_id || "").includes(searchLower) ||
      infoString.includes(searchLower);

    const matchesViewed =
      filterViewed === "ALL" ||
      (filterViewed === "VIEWED" && r.viewed === 1) ||
      (filterViewed === "UNVIEWED" && r.viewed === 0);

    return matchesSearch && matchesViewed;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-ceramon">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <Activity className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Reminder...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen font-ceramon">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
             <div className="relative flex-grow md:flex-grow-0">
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
               <input
                 type="text"
                 placeholder="Search..."
                 className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             
             <select
               className="px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
               value={filterViewed}
               onChange={(e: any) => setFilterViewed(e.target.value)}
             >
               <option value="ALL">All Status</option>
               <option value="VIEWED">Viewed</option>
               <option value="UNVIEWED">Unviewed</option>
             </select>

             <button
               onClick={() => { setCurrentReminder(null); setIsModalOpen(true); }}
               className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all"
             >
               <Plus size={18} /> New
             </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 w-20">ID</th>
                <th className="p-4 w-28">Appt ID</th>
                <th className="p-4">Schedule Summary</th>
                <th className="p-4 w-32">Status</th>
                <th className="p-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReminders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No reminders found.
                  </td>
                </tr>
              ) : (
                filteredReminders.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 text-slate-500">#{r.id}</td>
                    <td className="p-4 font-medium text-slate-700">
                      {r.appointment_id || <span className="text-slate-400 italic">-</span>}
                    </td>
                    <td className="p-4">
                      {/* Compact Summary View */}
                      {r.information.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {r.information.slice(0, 2).map((info, idx) => (
                             <div key={idx} className="flex items-center gap-2 text-slate-600">
                               <Calendar size={14} className="text-slate-400"/>
                               <span className="font-medium">{info.date}</span>
                               <span className="text-slate-300">|</span>
                               <span className="text-xs text-slate-500">
                                 {info.slots.length} slot{info.slots.length !== 1 ? 's' : ''}
                               </span>
                             </div>
                          ))}
                          {r.information.length > 2 && (
                            <span className="text-xs text-blue-600 pl-6">
                              +{r.information.length - 2} more dates
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No schedule data</span>
                      )}
                    </td>
                    <td className="p-4">
                      {r.viewed === 1 ? (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                           <CheckCircle2 size={12} /> Viewed
                         </span>
                      ) : (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                           <HelpCircle size={12} /> Pending
                         </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setCurrentReminder(r); setIsModalOpen(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => setDeleteId(r.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {currentReminder ? `Edit Reminder #${currentReminder.id}` : "Create New Reminder"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">Configure appointment notifications</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <form id="reminderForm" onSubmit={handleSave}>
                
                {/* Meta Data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Appointment ID</label>
                    <input
                      name="appointment_id"
                      type="number"
                      defaultValue={currentReminder?.appointment_id ?? ""}
                      placeholder="Optional"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                     <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg w-full transition-colors border border-transparent hover:border-slate-200">
                        <input 
                          type="checkbox" 
                          name="viewed" 
                          defaultChecked={currentReminder?.viewed === 1}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700">Mark as Viewed</span>
                          <span className="text-xs text-slate-400">Has the patient seen this?</span>
                        </div>
                     </label>
                  </div>
                </div>

                <div className="border-t border-slate-100 my-2"></div>

                {/* Structured Data Editor */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Calendar size={18} className="text-blue-600"/> Schedule Details
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddInfo}
                      className="text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                    >
                      + Add Date Block
                    </button>
                  </div>

                  {infoItems.map((info, i) => (
                    <div key={info.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Date Row */}
                      <div className="bg-slate-50/80 p-3 flex items-center justify-between border-b border-slate-200">
                        <div className="flex items-center gap-3">
                           <span className="bg-white text-slate-400 font-mono text-xs px-2 py-1 rounded border border-slate-200">
                             Item {i + 1}
                           </span>
                           <input
                             type="date"
                             value={info.date}
                             onChange={(e) => handleUpdate(i, 'date', e.target.value)}
                             className="bg-transparent font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 rounded px-2 py-1 transition-all"
                           />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveInfo(i)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded transition-colors"
                          title="Remove Date Block"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Slots */}
                      <div className="p-4 bg-white space-y-3">
                         {info.slots.map((slot, sIdx) => (
                           <div key={sIdx} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center group">
                              <div className="flex items-center gap-2 bg-slate-50 px-2 py-1.5 rounded border border-slate-100 min-w-fit">
                                <Clock size={14} className="text-slate-400"/>
                                <input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) => handleUpdate(i, 'slot', e.target.value, sIdx, 'startTime')}
                                  className="bg-transparent w-20 text-sm outline-none text-slate-700"
                                />
                                <span className="text-slate-300">→</span>
                                <input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) => handleUpdate(i, 'slot', e.target.value, sIdx, 'endTime')}
                                  className="bg-transparent w-20 text-sm outline-none text-slate-700"
                                />
                              </div>
                              
                              <div className="flex-grow w-full relative">
                                <input
                                  type="text"
                                  placeholder="Message..."
                                  value={slot.message}
                                  onChange={(e) => handleUpdate(i, 'slot', e.target.value, sIdx, 'message')}
                                  className="w-full pl-3 pr-8 py-1.5 text-sm border border-slate-100 rounded focus:border-blue-300 outline-none transition-colors"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleSlotAction(i, 'remove', sIdx)}
                                className="text-slate-300 hover:text-rose-500 p-1.5 opacity-0 group-hover:opacity-100 transition-all"
                                title="Remove Time Slot"
                              >
                                <X size={16} />
                              </button>
                           </div>
                         ))}
                         
                         <button
                           type="button"
                           onClick={() => handleSlotAction(i, 'add')}
                           className="mt-2 text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-blue-50 w-fit"
                         >
                           <Plus size={12} /> Add Slot
                         </button>
                      </div>
                    </div>
                  ))}
                  
                  {infoItems.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-medium">No dates scheduled yet.</p>
                      <button type="button" onClick={handleAddInfo} className="text-blue-600 font-bold text-sm mt-2 hover:underline">
                        Add First Date Block
                      </button>
                    </div>
                  )}
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="reminderForm"
                className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-black shadow-lg shadow-slate-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Save size={18} />
                {currentReminder ? "Save Changes" : "Create Reminder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Dialog --- */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
           <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Delete Reminder?</h3>
              <p className="text-sm text-slate-500 mt-2 mb-6">
                Are you sure you want to remove reminder <span className="font-mono bg-slate-100 px-1 rounded">#{deleteId}</span>? 
                This cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                 <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                 <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-md font-medium">
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- Global Alerts --- */}
      <Alert
        isOpen={alert.show}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />
    </div>
  );
}