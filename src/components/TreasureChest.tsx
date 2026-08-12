import { useGameProgress, TOTAL_GOAL } from '../context/GameProgressContext'
import './TreasureChest.css'

function TreasureChest() {
  const { totalCoins } = useGameProgress()
  const fillPercent = (totalCoins / TOTAL_GOAL) * 100

  return (
    <div className="treasure-chest" aria-label={`${totalCoins} mynter samlet`}>
      <div className="treasure-chest__box">
        <div className="treasure-chest__fill" style={{ height: `${fillPercent}%` }} />
        <span id="treasure-chest-target" className="treasure-chest__icon">
          🧰
        </span>
      </div>
      <span className="treasure-chest__count">🪙 {totalCoins}</span>
    </div>
  )
}

export default TreasureChest
