export default function UndoToast({ pendingDelete, onUndo }) {
  if (!pendingDelete) return null

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="flex items-center gap-3 rounded-full bg-slate-800 px-4 py-2.5 text-sm text-white shadow-lg dark:bg-slate-700">
        <span>"{pendingDelete.habit.name}" deleted</span>
        <button
          type="button"
          onClick={onUndo}
          className="font-semibold text-emerald-300 underline-offset-2 hover:underline"
        >
          Undo
        </button>
      </div>
    </div>
  )
}
