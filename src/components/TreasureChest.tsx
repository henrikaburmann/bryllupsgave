import './TreasureChest.css'

interface TreasureChestProps {
  fillPercent: number
  coinTotal: number
}

function TreasureChest({ fillPercent, coinTotal }: TreasureChestProps) {
  const pct = Math.min(100, fillPercent)

  return (
    <div className="chest" aria-label={`${coinTotal} mynter`}>
      <div className="chest__lid">
        <div className="chest__lid-band" />
        <span id="treasure-chest-target" className="chest__lock">🔒</span>
      </div>
      <div className="chest__body">
        <div className="chest__fill" style={{ height: `${pct}%` }} />
        <div className="chest__band" />
        <span className="chest__coins">
          {Array.from({ length: Math.round(pct / 14) }, (_, i) => (
            <span key={i} className="chest__coin" style={{ left: `${18 + (i % 5) * 15}%`, bottom: `${8 + Math.floor(i / 5) * 22}%` }}>
              🪙
            </span>
          ))}
        </span>
      </div>
      <p className="chest__label">🪙 {coinTotal}</p>
    </div>
  )
}

export default TreasureChest
