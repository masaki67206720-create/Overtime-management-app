'use client';
import { useState } from 'react';
import { OvertimeEntry } from '@/types/overtime';
import { useOvertimeData } from '@/hooks/useOvertimeData';
import OvertimeForm from '@/components/OvertimeForm';
import MonthView from '@/components/MonthView';
import YearView from '@/components/YearView';

type Tab = 'month' | 'year';

export default function Home() {
  const now = new Date();
  const [tab, setTab] = useState<Tab>('month');
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState<OvertimeEntry | null>(null);
  const [formDefaultDate, setFormDefaultDate] = useState<string | undefined>();

  const { entries, isLoaded, addEntry, updateEntry, deleteEntry } = useOvertimeData();

  const monthEntries = entries.filter((e) => {
    const prefix = `${viewYear}-${String(viewMonth).padStart(2, '0')}`;
    return e.date.startsWith(prefix);
  });

  const yearEntries = entries.filter((e) => e.date.startsWith(String(viewYear)));

  function prevMonth() {
    if (viewMonth === 1) { setViewYear((y) => y - 1); setViewMonth(12); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 12) { setViewYear((y) => y + 1); setViewMonth(1); }
    else setViewMonth((m) => m + 1);
  }

  function openAdd(date?: string) {
    setEditEntry(null);
    setFormDefaultDate(date);
    setShowForm(true);
  }

  function openEdit(entry: OvertimeEntry) {
    setEditEntry(entry);
    setFormDefaultDate(undefined);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (window.confirm('この記録を削除しますか？')) deleteEntry(id);
  }

  function handleSave(data: Omit<OvertimeEntry, 'id'>) {
    if (editEntry) {
      updateEntry(editEntry.id, data);
    } else {
      addEntry(data);
      const [y, m] = data.date.split('-').map(Number);
      setViewYear(y);
      setViewMonth(m);
      setTab('month');
    }
    setShowForm(false);
    setEditEntry(null);
  }

  function handleClickMonth(year: number, month: number) {
    setViewYear(year);
    setViewMonth(month);
    setTab('month');
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* ヘッダー */}
      <header
        className="sticky top-0 z-10 border-b border-gray-900 px-4 py-3.5 backdrop-blur-md"
        style={{ background: 'rgba(5,5,5,0.95)' }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1
              className="font-mono text-lg font-bold tracking-widest leading-none"
              style={{ color: '#00f5ff', textShadow: '0 0 15px #00f5ff' }}
            >
              超勤管理<span className="text-gray-700">_SYS</span>
            </h1>
            <div className="font-mono text-[10px] text-gray-700 tracking-widest mt-0.5">
              OVERTIME TRACKING SYSTEM v1.0
            </div>
          </div>
          <button
            onClick={() => openAdd()}
            className="font-mono text-xs tracking-widest px-4 py-2 rounded-lg border transition-all hover:bg-[#00f5ff]/10"
            style={{ borderColor: '#00f5ff', color: '#00f5ff', boxShadow: '0 0 10px rgba(0,245,255,0.2)' }}
          >
            ＋ 追加
          </button>
        </div>
      </header>

      {/* タブ */}
      <div className="border-b border-gray-900">
        <div className="max-w-lg mx-auto flex">
          {(['month', 'year'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-3 font-mono text-sm tracking-widest transition-all border-b-2"
              style={{
                borderColor: tab === t ? '#00f5ff' : 'transparent',
                color: tab === t ? '#00f5ff' : '#555',
                textShadow: tab === t ? '0 0 8px #00f5ff' : 'none',
              }}
            >
              {t === 'month' ? '月次ビュー' : '年次ビュー'}
            </button>
          ))}
        </div>
      </div>

      {/* コンテンツ */}
      <div className="max-w-lg mx-auto px-4 py-6 pb-20">
        {!isLoaded ? (
          <div className="flex items-center justify-center py-20">
            <div className="font-mono text-sm tracking-widest" style={{ color: '#00f5ff', textShadow: '0 0 8px #00f5ff' }}>
              LOADING...
            </div>
          </div>
        ) : tab === 'month' ? (
          <MonthView
            year={viewYear}
            month={viewMonth}
            entries={monthEntries}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ) : (
          <YearView
            year={viewYear}
            entries={yearEntries}
            onPrevYear={() => setViewYear((y) => y - 1)}
            onNextYear={() => setViewYear((y) => y + 1)}
            onClickMonth={handleClickMonth}
          />
        )}
      </div>

      {/* フォームモーダル */}
      {showForm && (
        <OvertimeForm
          entry={editEntry}
          defaultDate={formDefaultDate}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditEntry(null); }}
        />
      )}
    </main>
  );
}
