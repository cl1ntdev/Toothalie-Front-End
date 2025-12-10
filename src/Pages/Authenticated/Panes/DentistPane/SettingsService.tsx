'use client';

import React, { useEffect, useState } from 'react';
import { getServices, getDentistServices, updateDentistServices } from '@/API/Authenticated/Dentist/SettingsApi';
import { Save, AlertCircle, Sparkles, CheckCircle2, Loader2, BriefcaseMedical } from 'lucide-react';
import Alert from '@/components/_myComp/Alerts';

interface Service {
  service_id: number;
  service_name: string;
  serviceTypeName: string;
}
interface DentistService {
  service_id: number;
}

export default function SettingsService() {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [originalIds, setOriginalIds] = useState<number[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const [alert, setAlert] = useState({ 
       show: false, 
       type: "info", 
       title: "", 
       message: "" 
     });
 

  const userId = JSON.parse(localStorage.getItem('userInfo') || '{}')?.user?.id;

  const hasChanges = (() => {
    const cur = Array.from(selected).sort((a, b) => a - b);
    const orig = originalIds.sort((a, b) => a - b);
    return JSON.stringify(cur) !== JSON.stringify(orig);
  })();

  const toggle = (id: number, checked: boolean) => {
    const next = new Set(selected);
    checked ? next.add(id) : next.delete(id);
    setSelected(next);
    setMsg(null);
  };

  const save = async () => {
    if (!hasChanges) return;
    setSaving(true);
    setMsg(null);
    try {
      const payload = Array.from(selected).map(id => ({ user_id: userId, service_id: id }));
      
     
     

      await updateDentistServices(payload);
      setAlert({
               show: true,
               type: "success", // success, error, warning, info
               title: "Saved Successfully",
               message: "Services Save Successfully."
             });
     
      setOriginalIds(Array.from(selected));
    } catch {
      setMsg({ type: 'error', text: 'Failed to save changes. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [svcRes, dentRes] = await Promise.all([getServices(), getDentistServices(userId)]);
        setAllServices(svcRes.data ?? []);

        const ids = dentRes.dentistServices?.map((d: DentistService) => d.service_id) ?? [];
        setOriginalIds(ids);
        setSelected(new Set(ids));
      } catch {
        setMsg({ type: 'error', text: 'Failed to load services.' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = allServices.reduce<Record<string, Service[]>>((acc, s) => {
    (acc[s.serviceTypeName] ??= []).push(s);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-slate-50/50 rounded-2xl">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-indigo-600 mb-3"></div>
        <span className="text-slate-500 text-sm font-medium animate-pulse">Loading service catalog...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 font-sans text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-ceramon text-slate-900">Clinical Services</h1>
            <p className="text-slate-500 text-sm">Select the procedures you are qualified to perform.</p>
          </div>
        </div>
      </div>

      {/* Inline Alert */}
      {msg && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{msg.text}</span>
        </div>
      )}

      {/* Service Groups */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([type, list]) => {
          const checkedCount = list.filter(s => selected.has(s.service_id)).length;
          const isComplete = checkedCount === list.length && list.length > 0;
          const categoryName = type.replace(/([A-Z])/g, ' $1').trim();

          return (
            <div key={type} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-indigo-100 transition-colors">
              
              {/* Card Header */}
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BriefcaseMedical size={16} className="text-slate-400" />
                  <h3 className="font-bold text-slate-700 text-base">{categoryName}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  isComplete 
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                    : checkedCount > 0 
                      ? "bg-indigo-50 text-indigo-700 border-indigo-100" 
                      : "bg-slate-100 text-slate-500 border-slate-200"
                }`}>
                  {checkedCount} / {list.length} Selected
                </div>
              </div>

              {/* Checkboxes Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map(s => {
                  const isChecked = selected.has(s.service_id);
                  return (
                    <label
                      key={s.service_id}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none
                        ${isChecked 
                          ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200 shadow-sm' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => toggle(s.service_id, e.target.checked)}
                        className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                      />
                      <span className={`text-sm font-medium ${isChecked ? 'text-indigo-900' : 'text-slate-600'}`}>
                        {s.service_name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* STATIC BOTTOM ACTION BAR (Non-sticky) */}
      <div className="flex justify-end pt-6 mt-8 border-t border-slate-200">
        <div className="flex items-center gap-4">
            {hasChanges && <span className="text-sm text-slate-500 animate-pulse">Unsaved changes</span>}
            <button
                onClick={save}
                disabled={!hasChanges || saving}
                className={`
                flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold shadow-lg transition-all
                ${hasChanges 
                    ? 'bg-slate-900 text-white hover:bg-black hover:scale-105 active:scale-95' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                }
                `}
            >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Services'}
            </button>
        </div>
      </div>

      
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