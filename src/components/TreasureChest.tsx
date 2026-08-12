import { useGameProgress, TOTAL_GAMES, COINS_PER_GAME } from '../context/GameProgressContext'
import './TreasureChest.css'

function TreasureChest() {
  const { totalCoins } = useGameProgress()
  const gamesCompleted = totalCoins / COINS_PER_GAME
  const fillPercent = (gamesCompleted / TOTAL_GAMES) * 100

  return (
    <div className="treasure-chest" aria-label={`${gamesCompleted} av ${TOTAL_GAMES} øvelser fullført`}>
      <div className="treasure-chest__box">
        <div className="treasure-chest__fill" style={{ height: `${fillPercent}%` }} />
        <span id="treasure-chest-target" className="treasure-chest__icon">
          🧰
        </span>
      </div>
      <span className="treasure-chest__count">
        {gamesCompleted}/{TOTAL_GAMES}
      </span>
    </div>
  )
}

export default TreasureChest
