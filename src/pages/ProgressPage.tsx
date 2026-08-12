import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TreasureChest from '../components/TreasureChest'
import './ProgressPage.css'

// All values are static — no context or localStorage needed.
const STEPS: Record<number, { earned: number; total: number; fillPercent: number; nextPath: string }> = {
  1: { earned: 100, total: 100,  fillPercent: 10,   nextPath: '/spill/2' },
  2: { earned: 125, total: 225,  fillPercent: 22.5, nextPath: '/spill/3' },
  3: { earned: 150, total: 375,  fillPercent: 37.5, nextPath: '/spill/4' },
  4: { earned: 175, total: 550,  fillPercent: 55,   nextPath: '/spill/5' },
  5: { earned: 200, total: 750,  fillPercent: 75,   nextPath: '/spill/6' },
  6: { earned: 250, total: 1000, fillPercent: 100,  nextPath: '/premie'  },
}

const COIN_COUNT = 8
const ANIM_MS = 1400

interface FloatingCoin { id: number; x: number; delay: number }

function ProgressPage() {
  const navigate = useNavigate()
  const { step } = useParams<{ step: string }>()
  const data = STEPS[Number(step)] ?? STEPS[1]
  const isLast = Number(step) === 6

  const [counter, setCounter] = useState(0)
  const [showButton, setShowButton] = useState(false)
  const rafRef = useRef<number | null>(null)

  const [coins] = useState<FloatingCoin[]>(() =>
    Array.from({ length: COIN_COUNT }, (_, i) => ({
      id: i,
      x: 10 + (i * 11) % 80,
      delay: i * (ANIM_MS / COIN_COUNT / 2),
    })),
  )

  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const t = Math.min((Date.now() - start) / ANIM_MS, 1)
      setCounter(Math.round((1 - (1 - t) ** 3) * data.earned))
      if (t < 1) { rafRef.current = requestAnimationFrame(tick) }
    }
    rafRef.current = requestAnimationFrame(tick)
    const timeout = setTimeout(() => setShowButton(true), ANIM_MS + 300)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearTimeout(timeout)
    }
  }, [data.earned])

  return (
    <div className="progress-page">
      <h1 className="progress-page__title">Øvelse fullført! 🎉</h1>
      <p className="progress-page__amount">
        Øvelse {step} av {Object.keys(STEPS).length} fullført
      </p>

      <div className="progress-page__scene">
        <div className="progress-page__coins" aria-hidden="true">
          {coins.map((c) => (
            <span
              key={c.id}
              className="floating-coin"
              style={{ left: `${c.x}%`, animationDelay: `${c.delay}ms`, animationDuration: `${ANIM_MS * 0.7}ms` }}
            >
              🪙
            </span>
          ))}
        </div>
        <TreasureChest fillPercent={data.fillPercent} coinTotal={data.total} />
      </div>

      <p className="progress-page__earned">+{counter}</p>

      {showButton && (
        <button className="progress-page__button" onClick={() => navigate(data.nextPath)}>
          {isLast ? 'Motta gave 🎁' : 'Neste øvelse →'}
        </button>
      )}
    </div>
  )
}

export default ProgressPage
