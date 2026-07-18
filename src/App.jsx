import { useHabits } from './hooks/useHabits'
import Garden from './components/Garden'
import AddHabitForm from './components/AddHabitForm'
import HabitList from './components/HabitList'
import StatsBar from './components/StatsBar'

export default function App() {
  const { habits, addHabit, deleteHabit, toggleToday, stats } = useHabits()

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
            🌻 Habit Garden
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Check in daily and watch your habits grow.
          </p>
        </header>

        <div className="mb-6">
          <StatsBar stats={stats} />
        </div>

        <section className="mb-8">
          <Garden habits={habits} onToggleToday={toggleToday} />
        </section>

        <section className="mb-4">
          <AddHabitForm onAdd={addHabit} />
        </section>

        <section>
          <HabitList habits={habits} onToggleToday={toggleToday} onDelete={deleteHabit} />
        </section>
      </div>
    </div>
  )
}
