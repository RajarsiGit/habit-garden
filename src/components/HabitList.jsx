import { useState } from 'react'

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

export default function HabitList({ habits, onToggleToday, onDelete, onRename, onReorder }) {
  const [editingId, setEditingId] = useState(null)
  const [draftName, setDraftName] = useState('')
  const [draggedId, setDraggedId] = useState(null)

  if (habits.length === 0) return null

  function startEditing(habit) {
    setEditingId(habit.id)
    setDraftName(habit.name)
  }

  function commitEdit() {
    if (editingId) onRename(editingId, draftName)
    setEditingId(null)
  }

  function handleEditKeyDown(e) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditingId(null)
  }

  function moveWithNeighbor(habit, index, delta) {
    const neighbor = habits[index + delta]
    if (neighbor) onReorder(habit.id, neighbor.id)
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
        {habits.map((habit, index) => (
          <li
            key={habit.id}
            className={`flex items-center gap-2 px-4 py-3 transition ${
              draggedId === habit.id ? 'opacity-40' : ''
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const fromId = e.dataTransfer.getData('text/plain')
              if (fromId) onReorder(fromId, habit.id)
              setDraggedId(null)
            }}
          >
            <span
              role="button"
              tabIndex={0}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', habit.id)
                e.dataTransfer.effectAllowed = 'move'
                setDraggedId(habit.id)
              }}
              onDragEnd={() => setDraggedId(null)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  moveWithNeighbor(habit, index, -1)
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  moveWithNeighbor(habit, index, 1)
                }
              }}
              aria-label={`Reorder ${habit.name}. Use arrow keys to move up or down, or drag.`}
              title="Drag to reorder"
              className="shrink-0 cursor-grab select-none px-1 text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 active:cursor-grabbing dark:text-slate-600"
            >
              ⠿
            </span>

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
              {editingId === habit.id ? (
                <input
                  autoFocus
                  type="text"
                  value={draftName}
                  maxLength={60}
                  onChange={(e) => setDraftName(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={handleEditKeyDown}
                  aria-label={`Rename ${habit.name}`}
                  className="w-full rounded-md border border-emerald-300 bg-white px-1.5 py-0.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:bg-slate-800 dark:text-slate-200"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEditing(habit)}
                  aria-label={`Rename ${habit.name}`}
                  className="truncate rounded text-left text-sm font-medium text-slate-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:text-slate-200"
                >
                  {habit.name}
                </button>
              )}
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
              onClick={() => onDelete(habit.id)}
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
