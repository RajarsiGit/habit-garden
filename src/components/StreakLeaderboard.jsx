const MEDALS = ['🥇', '🥈', '🥉']

export default function StreakLeaderboard({ habits }) {
  const ranked = [...habits].sort((a, b) => b.streak - a.streak || b.longest - a.longest)

  if (ranked.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900">
        Plant a habit to start building streaks.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
      {ranked.map((habit, i) => (
        <li key={habit.id} className="flex items-center gap-3 px-4 py-3">
          <span className="w-6 shrink-0 text-center text-sm">{MEDALS[i] ?? i + 1}</span>
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: habit.palette.bloom }}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
              {habit.name}
            </p>
            <p className="text-xs text-slate-400">
              {habit.totalCompletions} total check-ins · best streak {habit.longest}
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-orange-500">
            🔥 {habit.streak}
          </span>
        </li>
      ))}
    </ul>
  )
}
