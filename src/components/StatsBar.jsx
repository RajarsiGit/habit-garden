const STATS = [
  { key: 'habitCount', label: 'Habits', icon: '🌿' },
  { key: 'doneToday', label: 'Watered today', icon: '💧' },
  { key: 'bloomingCount', label: 'Blooming', icon: '🌸' },
  { key: 'totalStreakDays', label: 'Total streak days', icon: '🔥' },
]

export default function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATS.map(({ key, label, icon }) => (
        <div
          key={key}
          className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-center dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="text-xl">{icon}</div>
          <div className="mt-1 text-lg font-semibold text-slate-700 dark:text-slate-200">
            {stats[key]}
          </div>
          <div className="text-xs text-slate-400">{label}</div>
        </div>
      ))}
    </div>
  )
}
