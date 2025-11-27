'use client';

import React, { useEffect, useState } from 'react';
import { getServices, getDentistServices, updateDentistServices } from '@/API/Authenticated/Dentist/SettingsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import {Save, AlertCircle, ClipboardPlus } from 'lucide-react';

interface Service {
  service_id: number;
  service_name: string;
  serviceTypeName: string;
}
interface DentistService {
  service_id: number;
}

export default function SettingsService() {
  // ----- data -------------------------------------------------
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [originalIds, setOriginalIds] = useState<number[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

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
      console.log(payload)
      await updateDentistServices(payload);
      setOriginalIds(Array.from(selected));
      setMsg({ type: 'success', text: 'Services updated!' });
    } catch {
      setMsg({ type: 'error', text: 'Failed to save. Try again.' });
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

  // ----- group services ---------------------------------------
  const grouped = allServices.reduce<Record<string, Service[]>>((acc, s) => {
    (acc[s.serviceTypeName] ??= []).push(s);
    return acc;
  }, {});

  // ----- render some loading stuff-----------------------------------------------
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ClipboardPlus className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
            <p className="text-sm text-gray-500">Select the services you offer</p>
          </div>
        </div>

       
      </div>

      {/* Alerts */}
      {/*{msg && (
        <Alert variant={msg.type === 'error' ? 'destructive' : 'default'} className={msg.type === 'success' ? 'border-green-200 bg-green-50' : ''}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{msg.text}</AlertDescription>
        </Alert>
      )}*/}

      {/* Service cards */}
      {Object.entries(grouped).map(([type, list]) => {
        const checkedCount = list.filter(s => selected.has(s.service_id)).length;
        return (
          <Card key={type} className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                <Badge variant="secondary">{checkedCount} / {list.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {list.map(s => (
                  <label
                    key={s.service_id}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <Checkbox
                      checked={selected.has(s.service_id)}
                      onCheckedChange={c => toggle(s.service_id, c as boolean)}
                    />
                    <span className={selected.has(s.service_id) ? 'font-medium text-gray-900' : 'text-gray-500'}>
                      {s.service_name}
                    </span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
      <Button
        onClick={save}
        disabled={!hasChanges || saving}
        className="bg-black hover:bg-gray-800 text-white flex items-center gap-2"
      >
        {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
      </Button>
    </div>
  );
}