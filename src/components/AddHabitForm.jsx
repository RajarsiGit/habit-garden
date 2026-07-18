import { useState } from 'react'

export default function AddHabitForm({ onAdd }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name)
    setName('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Plant a new habit… e.g. Read 10 pages"
        aria-label="New habit name"
        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        maxLength={60}
      />
      <button
        type="submit"
        className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-40"
        disabled={!name.trim()}
      >
        Plant seed
      </button>
    </form>
  )
}
