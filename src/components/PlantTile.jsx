import Plant from './Plant'
import Confetti from './Confetti'
import { useGrowthPulse } from '../hooks/useGrowthPulse'

export default function PlantTile({ habit, onToggleToday }) {
  const { name, streak, doneToday, wilted, stage, stageIndex, palette, atRisk } = habit
  const justGrew = useGrowthPulse(stageIndex, 800)

  return (
    <button
      type="button"
      onClick={() => onToggleToday(habit.id)}
      className="group relative flex flex-col items-center justify-end rounded-2xl bg-gradient-to-b from-sky-50 to-emerald-50 p-3 pt-6 transition hover:from-sky-100 hover:to-emerald-100 dark:from-slate-800 dark:to-slate-800/60"
    >
      {streak > 0 && (
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-orange-600 shadow-sm dark:bg-slate-900/80">
          🔥 {streak}
        </span>
      )}

      <Confetti active={justGrew} colors={[palette.bloom, palette.center, palette.leaf]} />

      <Plant stageIndex={stageIndex} wilted={wilted} palette={palette} size={72} />

      <div className="mt-1 w-full">
        <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-400">
          {wilted ? 'Needs water' : stage.label}
          {atRisk && !wilted ? ' · water today' : ''}
        </p>
      </div>

      <span
        className={`mt-2 flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm transition ${
          doneToday
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 text-transparent group-hover:border-emerald-400 dark:border-slate-600'
        }`}
      >
        ✓
      </span>
    </button>
  )
}
