import HeatmapGrid from './HeatmapGrid'
import StreakLeaderboard from './StreakLeaderboard'

export default function StatsView({ habits }) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Last 12 weeks
        </h2>
        <HeatmapGrid habits={habits} />
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Streak leaderboard
        </h2>
        <StreakLeaderboard habits={habits} />
      </section>
    </div>
  )
}
