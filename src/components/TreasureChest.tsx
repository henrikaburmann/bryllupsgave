import { useGameProgress } from '../context/GameProgressContext'
import './TreasureChest.css'

function TreasureChest() {
  const { totalCoins } = useGameProgress()

  return (
    <div className="coin-badge" aria-label={`${totalCoins} mynter samlet`}>
      <span id="treasure-chest-target" className="coin-badge__coin">
        🪙
      </span>
      <span className="coin-badge__count">{totalCoins}</span>
    </div>
  )
}

export default TreasureChest
