import { useGameProgress, TOTAL_GOAL } from '../context/GameProgressContext'
import './ProgressPage.css'

function ProgressPage() {
  const { totalCoins } = useGameProgress()
  const percent = Math.round((totalCoins / TOTAL_GOAL) * 100)

  return (
    <div className="progress-page">
      <h1 className="progress-page__title">Fremgang</h1>
      <p className="progress-page__amount">
        {totalCoins} av {TOTAL_GOAL} kroner samlet
      </p>

      <div className="progress-page__bar">
        <div className="progress-page__bar-fill" style={{ width: `${percent}%` }} />
      </div>

      <p className="progress-page__subtitle">Flere øvelser kommer snart! 🎁</p>
    </div>
  )
}

export default ProgressPage
