'use client';
import { useState, useEffect } from 'react';
import { OvertimeEntry, calculateMinutes, formatDuration } from '@/types/overtime';

interface Props {
  entry?: OvertimeEntry | null;
  defaultDate?: string;
  onSave: (data: Omit<OvertimeEntry, 'id'>) => void;
  onCancel: () => void;
}

// min-w-0 + overflow-hidden でグリッド内でも入力欄が列幅を超えないようにする
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 overflow-hidden">
      <label className="block text-xs font-mono text-gray-500 mb-1.5 tracking-widest">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'block w-full max-w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2.5 text-white font-mono text-sm outline-none transition-all focus:border-[#00f5ff] box-border';

// iOS Safari の date/time ネイティブレンダリングを正規化するスタイル
const iosNormalize: React.CSSProperties = {
  WebkitAppearance: 'none',
  appearance: 'none',
  color: 'white',
  background: '#111',
};

export default function OvertimeForm({ entry, defaultDate, onSave, onCancel }: Props) {
  const today = new Date().toLocaleDateString('sv-SE');
  const [date, setDate] = useState(defaultDate ?? today);
  const [startTime, setStartTime] = useState('17:15');
  const [endTime, setEndTime] = useState('19:00');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setStartTime(entry.startTime);
      setEndTime(entry.endTime);
      setDescription(entry.description);
    }
  }, [entry]);

  const mins = startTime && endTime ? calculateMinutes(startTime, endTime) : 0;
  const durationStr = mins > 0 ? formatDuration(mins) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ date, startTime, endTime, description });
  };

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl p-6"
        style={{
          background: '#080808',
          border: '1px solid #00f5ff',
          boxShadow: '0 0 40px rgba(0,245,255,0.2), inset 0 0 40px rgba(0,245,255,0.03)',
        }}
      >
        {/* タイトル */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-[#00f5ff]">{'>'}_</span>
          <h2
            className="font-mono text-base font-bold tracking-widest"
            style={{ color: '#00f5ff', textShadow: '0 0 10px #00f5ff' }}
          >
            {entry ? '超勤記録_編集' : '超勤記録_新規登録'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 日付 */}
          <Field label="DATE // 日付">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={inputClass}
              style={iosNormalize}
            />
          </Field>

          {/* 開始時刻 */}
          <Field label="START // 開始時刻">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className={inputClass}
              style={iosNormalize}
            />
          </Field>

          {/* 終了時刻 */}
          <Field label="END // 終了時刻">
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className={inputClass}
              style={iosNormalize}
            />
          </Field>

          {/* 合計プレビュー */}
          {durationStr && (
            <div
              className="text-center py-1 font-mono text-sm tracking-widest"
              style={{ color: '#39ff14', textShadow: '0 0 8px #39ff14' }}
            >
              ⏱ TOTAL &nbsp;{durationStr}
            </div>
          )}

          {/* 作業内容 */}
          <Field label="TASK // 作業内容">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例: バグ修正、月次レポート作成..."
              rows={3}
              className="block w-full max-w-full bg-[#111] border border-gray-700 rounded-lg px-3 py-2.5 text-white font-mono text-sm outline-none transition-all resize-none placeholder-gray-700 focus:border-[#00f5ff] box-border"
            />
          </Field>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-500 font-mono text-sm tracking-widest hover:border-gray-500 hover:text-gray-300 transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg border font-mono text-sm tracking-widest transition-all hover:bg-[#00f5ff]/20"
              style={{
                borderColor: '#00f5ff',
                color: '#00f5ff',
                boxShadow: '0 0 12px rgba(0,245,255,0.3)',
              }}
            >
              {entry ? 'UPDATE' : 'REGISTER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
