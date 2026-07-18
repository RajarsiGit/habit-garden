import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import Garden from './components/Garden'
import AddHabitForm from './components/AddHabitForm'
import HabitList from './components/HabitList'
import StatsBar from './components/StatsBar'
import StatsView from './components/StatsView'
import UndoToast from './components/UndoToast'

const TABS = [
  { id: 'garden', label: '🌱 Garden' },
  { id: 'stats', label: '📊 Stats' },
]

export default function App() {
  const {
    habits,
    addHabit,
    renameHabit,
    deleteHabit,
    undoDelete,
    pendingDelete,
    reorderHabits,
    toggleToday,
    stats,
  } = useHabits()
  const [view, setView] = useState('garden')

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

        <div className="mb-6 flex justify-center gap-1 rounded-full bg-slate-100 p-1 dark:bg-slate-800" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={view === tab.id}
              onClick={() => setView(tab.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                view === tab.id
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {view === 'garden' ? (
          <>
            <section className="mb-8">
              <Garden habits={habits} onToggleToday={toggleToday} />
            </section>

            <section className="mb-4">
              <AddHabitForm onAdd={addHabit} />
            </section>

            <section>
              <HabitList
                habits={habits}
                onToggleToday={toggleToday}
                onDelete={deleteHabit}
                onRename={renameHabit}
                onReorder={reorderHabits}
              />
            </section>
          </>
        ) : (
          <StatsView habits={habits} />
        )}
      </div>

      <UndoToast pendingDelete={pendingDelete} onUndo={undoDelete} />
    </div>
  )
}
