'use client';
import { useState, useEffect, useCallback } from 'react';
import { OvertimeEntry } from '@/types/overtime';

const STORAGE_KEY = 'kyokin-overtime-v1';

export function useOvertimeData() {
  const [entries, setEntries] = useState<OvertimeEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEntries(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  const persist = useCallback((newEntries: OvertimeEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  }, []);

  const addEntry = useCallback(
    (data: Omit<OvertimeEntry, 'id'>) => {
      const entry: OvertimeEntry = { ...data, id: crypto.randomUUID() };
      persist([...entries, entry]);
      return entry;
    },
    [entries, persist]
  );

  const updateEntry = useCallback(
    (id: string, data: Omit<OvertimeEntry, 'id'>) => {
      persist(entries.map((e) => (e.id === id ? { ...data, id } : e)));
    },
    [entries, persist]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      persist(entries.filter((e) => e.id !== id));
    },
    [entries, persist]
  );

  return { entries, isLoaded, addEntry, updateEntry, deleteEntry };
}
