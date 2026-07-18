import PlantTile from './PlantTile'

export default function Garden({ habits, onToggleToday }) {
  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-800/30">
        <span className="text-4xl">🌱</span>
        <p className="mt-3 font-medium text-slate-600 dark:text-slate-300">
          Your garden is empty
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Add a habit below and plant your first seed.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-gradient-to-b from-emerald-100/60 to-lime-100/40 p-4 dark:from-slate-800/60 dark:to-slate-800/30">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {habits.map((habit) => (
          <PlantTile key={habit.id} habit={habit} onToggleToday={onToggleToday} />
        ))}
      </div>
    </div>
  )
}
