import { useGameProgress, TOTAL_GOAL } from '../context/GameProgressContext'
import './TreasureChest.css'

function TreasureChest() {
  const { totalCoins } = useGameProgress()
  const fillPercent = Math.min(100, (totalCoins / TOTAL_GOAL) * 100)

  return (
    <div className="chest" aria-label={`${totalCoins} av ${TOTAL_GOAL} mynter`}>
      <div className="chest__lid">
        <div className="chest__lid-band" />
        <span id="treasure-chest-target" className="chest__lock">🔒</span>
      </div>
      <div className="chest__body">
        <div className="chest__fill" style={{ height: `${fillPercent}%` }} />
        <div className="chest__band" />
        <span className="chest__coins">
          {Array.from({ length: Math.round(fillPercent / 14) }, (_, i) => (
            <span key={i} className="chest__coin" style={{ left: `${18 + (i % 5) * 15}%`, bottom: `${8 + Math.floor(i / 5) * 22}%` }}>
              🪙
            </span>
          ))}
        </span>
      </div>
      <p className="chest__label">🪙 {totalCoins}</p>
    </div>
  )
}

export default TreasureChest
