import { buildHeatmap, heatLevel } from '../utils/heatmap'

const LEVEL_CLASSES = [
  'bg-slate-100 dark:bg-slate-800',
  'bg-emerald-200 dark:bg-emerald-900',
  'bg-emerald-400 dark:bg-emerald-700',
  'bg-emerald-500 dark:bg-emerald-600',
  'bg-emerald-700 dark:bg-emerald-400',
]

export default function HeatmapGrid({ habits, weeks = 12 }) {
  const columns = buildHeatmap(habits, weeks)

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-4">
        <div className="flex gap-[3px] overflow-x-auto">
          {columns.map((column, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {column.map((cell, j) =>
                cell ? (
                  <div
                    key={cell.key}
                    title={`${cell.key}: ${cell.count} check-in${cell.count === 1 ? '' : 's'}`}
                    className={`h-3 w-3 rounded-sm ${LEVEL_CLASSES[heatLevel(cell.count)]}`}
                  />
                ) : (
                  <div key={j} className="h-3 w-3" />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1 text-[11px] text-slate-400">
        <span>Less</span>
        {LEVEL_CLASSES.map((cls, i) => (
          <span key={i} className={`h-3 w-3 rounded-sm ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
