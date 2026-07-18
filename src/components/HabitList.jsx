const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function WeekDots({ week }) {
  return (
    <div className="flex shrink-0 gap-1" aria-hidden="true">
      {week.map(({ key, done }) => (
        <span
          key={key}
          title={key}
          className={`h-2.5 w-2.5 rounded-full ${
            done ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
          }`}
        />
      ))}
    </div>
  )
}

export default function HabitList({ habits, onToggleToday, onDelete }) {
  if (habits.length === 0) return null

  function handleDelete(habit) {
    if (window.confirm(`Delete "${habit.name}"? This removes its whole history.`)) {
      onDelete(habit.id)
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-end gap-1 pr-14 text-[10px] uppercase tracking-wide text-slate-300 dark:text-slate-600">
        {DAY_LETTERS.map((letter, i) => (
          <span key={i} className="w-2.5 text-center">
            {letter}
          </span>
        ))}
      </div>

      <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
        {habits.map((habit) => (
          <li key={habit.id} className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => onToggleToday(habit.id)}
              aria-label={habit.doneToday ? `Mark ${habit.name} not done today` : `Mark ${habit.name} done today`}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
                habit.doneToday
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-slate-300 text-transparent hover:border-emerald-400 dark:border-slate-600'
              }`}
            >
              ✓
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                {habit.name}
              </p>
              <p className="text-xs text-slate-400">
                {habit.stage.label} · {habit.streak} day streak · best {habit.longest}
              </p>
            </div>

            <WeekDots week={habit.week} />

            {habit.streak > 0 && (
              <span className="shrink-0 text-xs font-semibold text-orange-500">
                🔥 {habit.streak}
              </span>
            )}

            <button
              type="button"
              onClick={() => handleDelete(habit)}
              aria-label={`Delete ${habit.name}`}
              className="shrink-0 rounded-lg px-2 py-1 text-slate-300 transition hover:bg-red-50 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 dark:hover:bg-red-950"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
