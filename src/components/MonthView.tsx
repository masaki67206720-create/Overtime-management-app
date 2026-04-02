'use client';
import { OvertimeEntry, calculateMinutes, formatDuration } from '@/types/overtime';

const MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const DAY_NAMES = ['日','月','火','水','木','金','土'];

interface Props {
  year: number;
  month: number;
  entries: OvertimeEntry[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAdd: (date?: string) => void;
  onEdit: (entry: OvertimeEntry) => void;
  onDelete: (id: string) => void;
}

function groupByDate(entries: OvertimeEntry[]): Record<string, OvertimeEntry[]> {
  return entries.reduce<Record<string, OvertimeEntry[]>>((acc, e) => {
    (acc[e.date] ??= []).push(e);
    return acc;
  }, {});
}

export default function MonthView({
  year, month, entries,
  onPrevMonth, onNextMonth, onAdd, onEdit, onDelete,
}: Props) {
  const totalMins = entries.reduce((s, e) => s + calculateMinutes(e.startTime, e.endTime), 0);
  const grouped = groupByDate(entries);
  const sortedDates = Object.keys(grouped).sort().reverse();
  const todayStr = new Date().toLocaleDateString('sv-SE');

  return (
    <div className="space-y-5">
      {/* Month Header */}
      <div className="flex items-center justify-between">
        <button onClick={onPrevMonth} className="neon-nav-btn">◀</button>
        <div className="text-center">
          <div
            className="font-mono text-2xl font-bold tracking-widest"
            style={{ color: '#00f5ff', textShadow: '0 0 15px #00f5ff' }}
          >
            {year}年 {MONTH_NAMES[month - 1]}
          </div>
          <div className="font-mono text-xs text-gray-600 tracking-widest mt-0.5">
            MONTHLY OVERTIME
          </div>
        </div>
        <button onClick={onNextMonth} className="neon-nav-btn">▶</button>
      </div>

      {/* 月合計 */}
      <div
        className="rounded-xl p-5 text-center"
        style={{
          background: '#0a0a0a',
          border: '1px solid #39ff14',
          boxShadow: '0 0 20px rgba(57,255,20,0.12), inset 0 0 30px rgba(57,255,20,0.03)',
        }}
      >
        <div className="font-mono text-xs text-gray-600 tracking-widest mb-1">
          TOTAL OVERTIME THIS MONTH
        </div>
        <div
          className="font-mono text-4xl font-bold"
          style={{ color: '#39ff14', textShadow: '0 0 20px #39ff14' }}
        >
          {formatDuration(totalMins)}
        </div>
        <div className="font-mono text-xs text-gray-700 mt-1">{entries.length} 件の記録</div>
      </div>

      {/* 追加ボタン */}
      <button
        onClick={() => onAdd()}
        className="w-full py-3 rounded-xl border border-dashed font-mono text-sm tracking-widest transition-all hover:bg-[#00f5ff]/5 hover:border-opacity-100"
        style={{ borderColor: 'rgba(0,245,255,0.4)', color: 'rgba(0,245,255,0.6)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#00f5ff';
          e.currentTarget.style.borderColor = '#00f5ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(0,245,255,0.6)';
          e.currentTarget.style.borderColor = 'rgba(0,245,255,0.4)';
        }}
      >
        ＋ 超勤を追加
      </button>

      {/* エントリー一覧 */}
      {sortedDates.length === 0 ? (
        <div className="text-center py-16 font-mono text-gray-700">
          <div className="text-3xl mb-3 opacity-30">▓░▓</div>
          <div className="text-sm tracking-widest">この月の記録はありません</div>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedDates.map((date) => {
            const dayEntries = grouped[date];
            const d = new Date(date + 'T00:00:00');
            const dow = d.getDay();
            const dayMins = dayEntries.reduce((s, e) => s + calculateMinutes(e.startTime, e.endTime), 0);
            const isToday = date === todayStr;
            const isWeekend = dow === 0 || dow === 6;

            return (
              <div
                key={date}
                className="rounded-xl overflow-hidden"
                style={{
                  background: '#0a0a0a',
                  border: isToday
                    ? '1px solid #ff00ff'
                    : '1px solid #1a1a1a',
                  boxShadow: isToday ? '0 0 12px rgba(255,0,255,0.15)' : 'none',
                }}
              >
                {/* 日付ヘッダー */}
                <div
                  className="flex items-center justify-between px-4 py-2.5 border-b"
                  style={{ borderColor: '#1a1a1a' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-gray-200">
                      {d.getMonth() + 1}/{d.getDate()}
                    </span>
                    <span
                      className="font-mono text-xs px-1.5 py-0.5 rounded"
                      style={{
                        color: dow === 0 ? '#ff6b6b' : dow === 6 ? '#74b9ff' : '#666',
                        background: dow === 0 ? 'rgba(255,107,107,0.1)' : dow === 6 ? 'rgba(116,185,255,0.1)' : 'rgba(100,100,100,0.1)',
                      }}
                    >
                      {DAY_NAMES[dow]}
                    </span>
                    {isToday && (
                      <span
                        className="font-mono text-xs px-1.5 py-0.5 rounded tracking-widest"
                        style={{ color: '#ff00ff', background: 'rgba(255,0,255,0.1)' }}
                      >
                        TODAY
                      </span>
                    )}
                    {isWeekend && !isToday && (
                      <span className="font-mono text-xs text-gray-700 tracking-widest">休日</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono text-xs"
                      style={{ color: '#39ff14', textShadow: '0 0 6px #39ff14' }}
                    >
                      {formatDuration(dayMins)}
                    </span>
                    <button
                      onClick={() => onAdd(date)}
                      className="font-mono text-xs text-gray-700 hover:text-[#00f5ff] transition-colors"
                      title="この日に追加"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                {/* エントリー */}
                <div>
                  {dayEntries.map((entry) => {
                    const mins = calculateMinutes(entry.startTime, entry.endTime);
                    return (
                      <div
                        key={entry.id}
                        className="flex items-start gap-3 px-4 py-3 group transition-colors hover:bg-white/[0.02]"
                        style={{ borderTop: '1px solid #111' }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="font-mono text-xs font-bold"
                              style={{ color: '#00f5ff' }}
                            >
                              {entry.startTime}
                            </span>
                            <span className="text-gray-700 text-xs">→</span>
                            <span
                              className="font-mono text-xs font-bold"
                              style={{ color: '#00f5ff' }}
                            >
                              {entry.endTime}
                            </span>
                            <span className="font-mono text-xs text-gray-600">
                              ({formatDuration(mins)})
                            </span>
                          </div>
                          {entry.description && (
                            <div className="text-sm text-gray-400 mt-1 leading-snug">
                              {entry.description}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => onEdit(entry)}
                            className="px-2 py-1 font-mono text-xs text-gray-600 hover:text-[#00f5ff] transition-colors rounded"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => onDelete(entry.id)}
                            className="px-2 py-1 font-mono text-xs text-gray-600 hover:text-red-400 transition-colors rounded"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
