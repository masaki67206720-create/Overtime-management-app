'use client';
import { OvertimeEntry, calculateMinutes, formatDuration } from '@/types/overtime';

const MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

interface Props {
  year: number;
  entries: OvertimeEntry[];
  onPrevYear: () => void;
  onNextYear: () => void;
  onClickMonth: (year: number, month: number) => void;
}

export default function YearView({ year, entries, onPrevYear, onNextYear, onClickMonth }: Props) {
  const now = new Date();

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const prefix = `${year}-${String(m).padStart(2, '0')}`;
    const monthEntries = entries.filter((e) => e.date.startsWith(prefix));
    const totalMins = monthEntries.reduce((s, e) => s + calculateMinutes(e.startTime, e.endTime), 0);
    return { month: m, totalMins, count: monthEntries.length };
  });

  const maxMins = Math.max(...monthlyData.map((d) => d.totalMins), 1);
  const yearTotal = monthlyData.reduce((s, d) => s + d.totalMins, 0);
  const yearCount = monthlyData.reduce((s, d) => s + d.count, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onPrevYear} className="neon-nav-btn">◀</button>
        <div className="text-center">
          <div
            className="font-mono text-2xl font-bold tracking-widest"
            style={{ color: '#00f5ff', textShadow: '0 0 15px #00f5ff' }}
          >
            {year}年
          </div>
          <div className="font-mono text-xs text-gray-600 tracking-widest mt-0.5">YEARLY OVERVIEW</div>
        </div>
        <button onClick={onNextYear} className="neon-nav-btn">▶</button>
      </div>

      <div
        className="rounded-xl p-5 text-center"
        style={{
          background: '#0a0a0a',
          border: '1px solid #ff00ff',
          boxShadow: '0 0 20px rgba(255,0,255,0.12), inset 0 0 30px rgba(255,0,255,0.03)',
        }}
      >
        <div className="font-mono text-xs text-gray-600 tracking-widest mb-1">TOTAL OVERTIME THIS YEAR</div>
        <div className="font-mono text-4xl font-bold" style={{ color: '#ff00ff', textShadow: '0 0 20px #ff00ff' }}>
          {formatDuration(yearTotal)}
        </div>
        <div className="font-mono text-xs text-gray-700 mt-1">{yearCount} 件の記録</div>
      </div>

      <div className="space-y-2">
        {monthlyData.map(({ month, totalMins, count }) => {
          const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
          const isFuture = new Date(year, month - 1) > now;
          const barPct = totalMins > 0 ? (totalMins / maxMins) * 100 : 0;

          return (
            <button key={month} onClick={() => onClickMonth(year, month)} className="w-full text-left group">
              <div
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: '#0a0a0a',
                  border: isCurrentMonth ? '1px solid rgba(0,245,255,0.5)' : '1px solid #151515',
                  boxShadow: isCurrentMonth ? '0 0 10px rgba(0,245,255,0.08)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0d0d0d';
                  e.currentTarget.style.borderColor = isCurrentMonth ? 'rgba(0,245,255,0.8)' : '#2a2a2a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#0a0a0a';
                  e.currentTarget.style.borderColor = isCurrentMonth ? 'rgba(0,245,255,0.5)' : '#151515';
                }}
              >
                <div className="w-10 font-mono text-sm font-bold shrink-0" style={{ color: isCurrentMonth ? '#00f5ff' : '#888' }}>
                  {MONTH_NAMES[month - 1]}
                </div>
                <div className="flex-1 relative h-5 rounded overflow-hidden" style={{ background: '#111' }}>
                  {totalMins > 0 && (
                    <div
                      className="absolute inset-y-0 left-0 rounded transition-all duration-700"
                      style={{
                        width: `${barPct}%`,
                        background: isCurrentMonth
                          ? 'linear-gradient(90deg, rgba(0,245,255,0.7), rgba(0,245,255,0.3))'
                          : 'linear-gradient(90deg, rgba(57,255,20,0.6), rgba(57,255,20,0.2))',
                        boxShadow: isCurrentMonth ? '0 0 8px rgba(0,245,255,0.5)' : '0 0 6px rgba(57,255,20,0.4)',
                      }}
                    />
                  )}
                  {totalMins === 0 && !isFuture && (
                    <div className="absolute inset-0 flex items-center pl-2">
                      <span className="text-xs font-mono text-gray-800 tracking-widest">NO DATA</span>
                    </div>
                  )}
                </div>
                <div className="w-20 text-right font-mono text-xs shrink-0">
                  {totalMins > 0 ? (
                    <span style={{ color: isCurrentMonth ? '#00f5ff' : '#39ff14' }}>{formatDuration(totalMins)}</span>
                  ) : (
                    <span className="text-gray-800">—</span>
                  )}
                </div>
                <div className="w-8 text-right font-mono text-xs shrink-0 text-gray-700">
                  {count > 0 ? `${count}件` : ''}
                </div>
                <div className="font-mono text-gray-700 group-hover:text-gray-400 transition-colors text-sm shrink-0">›</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
