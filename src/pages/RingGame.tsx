import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameProgress } from '../context/GameProgressContext'
import './RingGame.css'

const GAME_ID = 5
const AREA_WIDTH = 360
const AREA_HEIGHT = 560
const FINGER_WIDTH = Math.round(AREA_WIDTH * 0.15)
const FINGER_HEIGHT = Math.round(AREA_HEIGHT * 0.34)
const FINGER_TIP_Y = AREA_HEIGHT - FINGER_HEIGHT
const RING_SIZE = 40
const START_SPEED = 2.4
const SPEED_INCREMENT = 0.18
const RINGS_TO_WIN = 10

interface RingState {
  x: number
  y: number
  speed: number
}

interface GameData {
  fingerX: number
  ring: RingState
  caught: number
}

function spawnRing(speed: number): RingState {
  return {
    x: RING_SIZE + Math.random() * (AREA_WIDTH - RING_SIZE * 2),
    y: -RING_SIZE,
    speed,
  }
}

function createInitialData(): GameData {
  return {
    fingerX: AREA_WIDTH / 2 - FINGER_WIDTH / 2,
    ring: spawnRing(START_SPEED),
    caught: 0,
  }
}

type Phase = 'ready' | 'playing' | 'lost'

function RingGame() {
  const navigate = useNavigate()
  const { completeGame } = useGameProgress()
  const areaRef = useRef<HTMLDivElement>(null)
  const dataRef = useRef<GameData>(createInitialData())
  const rafRef = useRef<number | null>(null)
  const [phase, setPhase] = useState<Phase>('ready')
  const [solved, setSolved] = useState(false)
  const [, setRenderTick] = useState(0)

  const lastTimeRef = useRef<number | null>(null)
  const TARGET_MS = 1000 / 60

  const step = useCallback((now: number) => {
    const dt = lastTimeRef.current === null ? TARGET_MS : Math.min(now - lastTimeRef.current, 50)
    lastTimeRef.current = now
    const scale = dt / TARGET_MS

    const d = dataRef.current
    d.ring.y += d.ring.speed * scale

    const ringCenterX = d.ring.x
    const ringBottom = d.ring.y + RING_SIZE / 2
    const fingerLeft = d.fingerX
    const fingerRight = d.fingerX + FINGER_WIDTH

    if (ringBottom >= FINGER_TIP_Y) {
      const onFinger = ringCenterX >= fingerLeft && ringCenterX <= fingerRight
      if (onFinger) {
        d.caught += 1
        if (d.caught >= RINGS_TO_WIN) {
          setSolved(true)
          return
        }
        d.ring = spawnRing(START_SPEED + d.caught * SPEED_INCREMENT)
      } else if (d.ring.y > AREA_HEIGHT) {
        setPhase('lost')
        return
      }
    }

    setRenderTick((t) => t + 1)
    rafRef.current = requestAnimationFrame(step)
  }, [TARGET_MS])

  const startGame = useCallback(() => {
    lastTimeRef.current = null
    dataRef.current = createInitialData()
    setSolved(false)
    setPhase('playing')
    rafRef.current = requestAnimationFrame(step)
  }, [step])

  const moveFingerTo = useCallback((clientX: number) => {
    const area = areaRef.current
    if (!area) return
    const rect = area.getBoundingClientRect()
    const scale = AREA_WIDTH / rect.width
    const localX = (clientX - rect.left) * scale
    dataRef.current.fingerX = Math.max(0, Math.min(AREA_WIDTH - FINGER_WIDTH, localX - FINGER_WIDTH / 2))
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (phase !== 'playing') return
      const d = dataRef.current
      if (event.key === 'ArrowLeft') {
        d.fingerX = Math.max(0, d.fingerX - 32)
      } else if (event.key === 'ArrowRight') {
        d.fingerX = Math.min(AREA_WIDTH - FINGER_WIDTH, d.fingerX + 32)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase])

  useEffect(() => {
    if (solved) completeGame(GAME_ID)
  }, [solved, completeGame])

  const { fingerX, ring, caught } = dataRef.current

  return (
    <div className="ring-page">
      <h1 className="ring-page__title">Øvelse 5: Fang ringene</h1>
      <p className="ring-page__subtitle">
        Beveg ringfingeren og få {RINGS_TO_WIN} ringer på plass!
      </p>

      <div
        className="ring-area"
        ref={areaRef}
        onMouseMove={(e) => moveFingerTo(e.clientX)}
        onTouchMove={(e) => moveFingerTo(e.touches[0].clientX)}
        onClick={() => {
          if (phase === 'ready' || phase === 'lost') startGame()
        }}
      >
        {phase === 'playing' && !solved && (
          <div
            className="ring-drop"
            style={{ left: `${(ring.x / AREA_WIDTH) * 100}%`, top: `${(ring.y / AREA_HEIGHT) * 100}%` }}
          >
            <span className="ring-drop__band">
              <span className="ring-drop__gem" />
            </span>
          </div>
        )}

        <div
          className={`ring-finger${solved ? ' ring-finger--celebrate' : ''}`}
          style={{ left: `${(fingerX / AREA_WIDTH) * 100}%` }}
        >
          <div className="finger">
            <div className="finger__nail" />
            {Array.from({ length: caught }, (_, i) => (
              <div key={i} className="finger__ring" style={{ top: `${16 + i * 7}%` }}>
                {i === 0 && <span className="finger__gem" />}
              </div>
            ))}
          </div>
        </div>

        {phase === 'playing' && !solved && (
          <div className="ring-counter">
            {caught} / {RINGS_TO_WIN}
          </div>
        )}

        {phase === 'ready' && !solved && (
          <div className="ring-overlay">
            <p className="ring-overlay__text">Trykk for å starte!</p>
          </div>
        )}

        {phase === 'lost' && (
          <div className="ring-overlay">
            <p className="ring-overlay__text">Å nei! Prøv igjen 🙈</p>
            <button className="ring-overlay__button" onClick={startGame}>
              Prøv igjen
            </button>
          </div>
        )}

        {solved && (
          <div className="ring-overlay ring-overlay--win">
            <p className="ring-overlay__text">Alle ringene på plass! 🎉</p>
            <button className="ring-overlay__button" onClick={() => navigate('/fremgang?earned=200')}>
              Se fremgang
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RingGame
