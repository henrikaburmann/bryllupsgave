import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGameProgress, TOTAL_GAMES } from '../context/GameProgressContext'
import TreasureChest from '../components/TreasureChest'
import './ProgressPage.css'

const NEXT_GAME: Record<number, string> = { 1: '/spill/2', 2: '/spill/3', 3: '/spill/4', 4: '/spill/5', 5: '/spill/6' }
const COIN_COUNT = 8
const ANIM_MS = 1400

interface FloatingCoin {
  id: number
  x: number
  delay: number
}

function ProgressPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { gamesCompleted } = useGameProgress()
  const earned = Number(searchParams.get('earned') ?? 0)
  const allDone = gamesCompleted >= TOTAL_GAMES
  const nextPath = NEXT_GAME[gamesCompleted]

  const [counter, setCounter] = useState(0)
  const [showButton, setShowButton] = useState(!earned)
  const [coins] = useState<FloatingCoin[]>(() =>
    Array.from({ length: COIN_COUNT }, (_, i) => ({
      id: i,
      x: 10 + (i * 11) % 80,
      delay: i * (ANIM_MS / COIN_COUNT / 2),
    })),
  )
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!earned) return
    const start = Date.now()
    const tick = () => {
      const t = Math.min((Date.now() - start) / ANIM_MS, 1)
      // ease-out curve
      setCounter(Math.round((1 - (1 - t) ** 3) * earned))
      if (t < 1) { rafRef.current = requestAnimationFrame(tick) }
    }
    rafRef.current = requestAnimationFrame(tick)
    const timeout = setTimeout(() => setShowButton(true), ANIM_MS + 300)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearTimeout(timeout)
    }
  }, [earned])

  return (
    <div className="progress-page">
      <h1 className="progress-page__title">Øvelse fullført! 🎉</h1>
      <p className="progress-page__amount">
        {gamesCompleted} av {TOTAL_GAMES} øvelser fullført
      </p>

      <div className="progress-page__scene">
        {earned > 0 && (
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
        )}
        <TreasureChest />
      </div>

      {earned > 0 && (
        <p className="progress-page__earned">
          +{counter}
        </p>
      )}

      {showButton && (
        allDone ? (
          <button className="progress-page__button" onClick={() => navigate('/gave')}>
            🎁 Hent gaven!
          </button>
        ) : nextPath ? (
          <button className="progress-page__button" onClick={() => navigate(nextPath)}>
            Neste øvelse →
          </button>
        ) : null
      )}
    </div>
  )
}

export default ProgressPage
