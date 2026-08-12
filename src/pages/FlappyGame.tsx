import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameProgress } from '../context/GameProgressContext'
import TreasureChest from '../components/TreasureChest'
import CoinBurst from '../components/CoinBurst'
import torImage from '../images/flappyBirdGame/Tor-flappy.png'
import victoriaImage from '../images/flappyBirdGame/Victoria-flappy.png'
import './FlappyGame.css'

const GAME_ID = 3
const AREA_WIDTH = 340
const AREA_HEIGHT = 640
const BIRD_SIZE = 48
const BIRD_X = 60
const GRAVITY = 0.18
const JUMP_VELOCITY = -5.5
const PIPE_SPEED = 1.8
const PIPE_WIDTH = 50
const GAP_SIZE = 240
const SPAWN_SPACING = 220
const TOTAL_OBSTACLES = 10
const HEART_COUNT = 6

interface Obstacle {
  id: number
  x: number
  gapCenter: number
  passed: boolean
}

interface GameState {
  birdY: number
  velocity: number
  obstacles: Obstacle[]
  obstaclesPassed: number
  totalSpawned: number
  nextId: number
  distanceSinceLastSpawn: number
}

function createInitialState(): GameState {
  return {
    birdY: AREA_HEIGHT / 2 - BIRD_SIZE / 2,
    velocity: 0,
    obstacles: [],
    obstaclesPassed: 0,
    totalSpawned: 0,
    nextId: 0,
    distanceSinceLastSpawn: SPAWN_SPACING,
  }
}

type Phase = 'ready' | 'playing' | 'lost'

function FlappyGame() {
  const navigate = useNavigate()
  const { completeGame } = useGameProgress()
  const areaRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<GameState>(createInitialState())
  const rafRef = useRef<number | null>(null)
  const [phase, setPhase] = useState<Phase>('ready')
  const [solved, setSolved] = useState(false)
  const [readyForCoins, setReadyForCoins] = useState(false)
  const [coinsCollected, setCoinsCollected] = useState(false)
  const [, setRenderTick] = useState(0)

  const step = useCallback(() => {
    const s = stateRef.current

    s.velocity += GRAVITY
    s.birdY += s.velocity

    s.obstacles.forEach((o) => {
      o.x -= PIPE_SPEED
    })
    s.obstacles = s.obstacles.filter((o) => o.x + PIPE_WIDTH > 0)

    s.distanceSinceLastSpawn += PIPE_SPEED
    if (s.totalSpawned < TOTAL_OBSTACLES && s.distanceSinceLastSpawn >= SPAWN_SPACING) {
      s.distanceSinceLastSpawn = 0
      const margin = 60
      const gapCenter = margin + Math.random() * (AREA_HEIGHT - margin * 2)
      s.obstacles.push({ id: s.nextId, x: AREA_WIDTH, gapCenter, passed: false })
      s.nextId += 1
      s.totalSpawned += 1
    }

    const birdTop = s.birdY
    const birdBottom = s.birdY + BIRD_SIZE
    const birdLeft = BIRD_X
    const birdRight = BIRD_X + BIRD_SIZE

    let collided = birdTop <= 0 || birdBottom >= AREA_HEIGHT

    s.obstacles.forEach((o) => {
      const gapTop = o.gapCenter - GAP_SIZE / 2
      const gapBottom = o.gapCenter + GAP_SIZE / 2
      const pipeLeft = o.x
      const pipeRight = o.x + PIPE_WIDTH
      const overlappingX = birdRight > pipeLeft && birdLeft < pipeRight

      if (overlappingX && (birdTop < gapTop || birdBottom > gapBottom)) {
        collided = true
      }

      if (!o.passed && pipeRight < birdLeft) {
        o.passed = true
        s.obstaclesPassed += 1
      }
    })

    if (collided) {
      setPhase('lost')
      return
    }

    if (s.obstaclesPassed >= TOTAL_OBSTACLES) {
      setSolved(true)
      return
    }

    setRenderTick((t) => t + 1)
    rafRef.current = requestAnimationFrame(step)
  }, [])

  const startGame = useCallback(() => {
    stateRef.current = createInitialState()
    setSolved(false)
    setReadyForCoins(false)
    setCoinsCollected(false)
    setPhase('playing')
    rafRef.current = requestAnimationFrame(step)
  }, [step])

  const handleJump = useCallback(() => {
    if (phase === 'ready') {
      startGame()
      return
    }
    if (phase === 'lost' || solved) return
    stateRef.current.velocity = JUMP_VELOCITY
  }, [phase, solved, startGame])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        handleJump()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleJump])

  useEffect(() => {
    if (!solved) return
    const timeout = setTimeout(() => setReadyForCoins(true), 1300)
    return () => clearTimeout(timeout)
  }, [solved])

  const handleBurstDone = useCallback(() => {
    completeGame(GAME_ID)
    setCoinsCollected(true)
  }, [completeGame])

  const { obstacles, birdY } = stateRef.current

  return (
    <div className="flappy-page">
      <TreasureChest />
      <h1 className="flappy-page__title">Øvelse 3: Flyv til Victoria</h1>
      <p className="flappy-page__subtitle">
        Trykk på skjermen eller pil opp for å fly gjennom {TOTAL_OBSTACLES} hindre!
      </p>

      <div className="flappy-area" ref={areaRef} onClick={handleJump}>
        {!solved &&
          obstacles.map((o) => (
            <div key={o.id} className="flappy-pipe-pair" style={{ left: o.x }}>
              <div className="flappy-pipe flappy-pipe--top" style={{ height: o.gapCenter - GAP_SIZE / 2 }} />
              <div
                className="flappy-pipe flappy-pipe--bottom"
                style={{ height: AREA_HEIGHT - (o.gapCenter + GAP_SIZE / 2) }}
              />
            </div>
          ))}

        <div
          className={`flappy-bird${solved ? ' flappy-bird--meeting' : ''}`}
          style={solved ? undefined : { top: birdY, left: BIRD_X }}
        >
          <img src={torImage} alt="Tor-Øyvind" />
        </div>

        {solved && (
          <div className="flappy-victoria">
            <img src={victoriaImage} alt="Victoria" />
          </div>
        )}

        {solved && (
          <div className="flappy-hearts">
            {Array.from({ length: HEART_COUNT }, (_, i) => (
              <span key={i} className="flappy-heart" style={{ animationDelay: `${i * 150}ms`, left: `${20 + i * 10}%` }}>
                ❤️
              </span>
            ))}
          </div>
        )}

        {phase === 'ready' && !solved && (
          <div className="flappy-overlay">
            <p className="flappy-overlay__text">Trykk for å starte!</p>
          </div>
        )}

        {phase === 'lost' && (
          <div className="flappy-overlay">
            <p className="flappy-overlay__text">Å nei! Prøv igjen 🙈</p>
            <button className="flappy-overlay__button" onClick={startGame}>
              Prøv igjen
            </button>
          </div>
        )}

        {solved && coinsCollected && (
          <div className="flappy-overlay flappy-overlay--win">
            <p className="flappy-overlay__text">Dere fant hverandre! 🎉</p>
            <button className="flappy-overlay__button" onClick={() => navigate('/fremgang')}>
              Se fremgang
            </button>
          </div>
        )}
      </div>

      <CoinBurst active={readyForCoins && !coinsCollected} originRef={areaRef} onDone={handleBurstDone} />
    </div>
  )
}

export default FlappyGame
