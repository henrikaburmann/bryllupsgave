import { useGameProgress, TOTAL_GAMES, TOTAL_GOAL } from '../context/GameProgressContext'
import TreasureChest from '../components/TreasureChest'
import './ProgressPage.css'

function ProgressPage() {
  const { totalCoins, gamesCompleted } = useGameProgress()
  const percent = Math.round((totalCoins / TOTAL_GOAL) * 100)

  return (
    <div className="progress-page">
      <TreasureChest />
      <h1 className="progress-page__title">Fremgang</h1>
      <p className="progress-page__amount">
        {gamesCompleted} av {TOTAL_GAMES} øvelser fullført
      </p>

      <div className="progress-page__bar">
        <div className="progress-page__bar-fill" style={{ width: `${percent}%` }} />
      </div>

      <p className="progress-page__subtitle">Flere øvelser kommer snart! 🎁</p>
    </div>
  )
}

export default ProgressPage
