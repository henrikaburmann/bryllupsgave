import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameProgress } from '../context/GameProgressContext'
import TreasureChest from '../components/TreasureChest'
import CoinBurst from '../components/CoinBurst'
import torImage from '../images/flappyBirdGame/Tor-flappy.png'
import victoriaImage from '../images/flappyBirdGame/Victoria-flappy.png'
import './MazeGame.css'

const GAME_ID = 6
const SIZE = 15 // odd number
const START = { x: 1, y: 1 }
const GOAL = { x: (SIZE - 1) / 2, y: (SIZE - 1) / 2 }
const BRAID_CHANCE = 0.45 // fraction of dead ends opened up for more branching

type Cell = 0 | 1 // 0 = path, 1 = wall

function generateMaze(): Cell[][] {
  const maze: Cell[][] = Array.from({ length: SIZE }, () => Array<Cell>(SIZE).fill(1))

  const carve = (x: number, y: number) => {
    maze[y][x] = 0
    const dirs = [
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0],
    ].sort(() => Math.random() - 0.5)

    for (const [dx, dy] of dirs) {
      const nx = x + dx
      const ny = y + dy
      if (nx > 0 && nx < SIZE - 1 && ny > 0 && ny < SIZE - 1 && maze[ny][nx] === 1) {
        maze[y + dy / 2][x + dx / 2] = 0
        carve(nx, ny)
      }
    }
  }

  carve(START.x, START.y)
  maze[GOAL.y][GOAL.x] = 0

  // Braid: open some dead ends so there are more junctions and route choices.
  const nbrs = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ]
  for (let y = 1; y < SIZE - 1; y += 1) {
    for (let x = 1; x < SIZE - 1; x += 1) {
      if (maze[y][x] !== 0) continue
      const open = nbrs.filter(([dx, dy]) => maze[y + dy][x + dx] === 0)
      if (open.length === 1 && Math.random() < BRAID_CHANCE) {
        const walls = nbrs.filter(
          ([dx, dy]) =>
            maze[y + dy][x + dx] === 1 &&
            x + dx > 0 &&
            x + dx < SIZE - 1 &&
            y + dy > 0 &&
            y + dy < SIZE - 1,
        )
        if (walls.length) {
          const [dx, dy] = walls[Math.floor(Math.random() * walls.length)]
          maze[y + dy][x + dx] = 0
        }
      }
    }
  }

  return maze
}

type Direction = 'up' | 'down' | 'left' | 'right'

const MOVES: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}

function MazeGame() {
  const navigate = useNavigate()
  const { completeGame } = useGameProgress()
  const areaRef = useRef<HTMLDivElement>(null)
  const [maze, setMaze] = useState<Cell[][]>(() => generateMaze())
  const [pos, setPos] = useState(START)
  const [solved, setSolved] = useState(false)
  const [coinsCollected, setCoinsCollected] = useState(false)

  const move = useCallback(
    (dir: Direction) => {
      if (solved) return
      setPos((prev) => {
        const { dx, dy } = MOVES[dir]
        const nx = prev.x + dx
        const ny = prev.y + dy
        if (nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE) return prev
        if (maze[ny][nx] === 1) return prev
        if (nx === GOAL.x && ny === GOAL.y) setSolved(true)
        return { x: nx, y: ny }
      })
    },
    [maze, solved],
  )

  const reset = useCallback(() => {
    setPos(START)
  }, [])

  const newMaze = useCallback(() => {
    setMaze(generateMaze())
    setPos(START)
    setSolved(false)
    setCoinsCollected(false)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      }
      const dir = map[event.key]
      if (dir) {
        event.preventDefault()
        move(dir)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [move])

  const handleBurstDone = useCallback(() => {
    completeGame(GAME_ID)
    setCoinsCollected(true)
  }, [completeGame])

  const cellPercent = 100 / SIZE

  return (
    <div className="maze-page">
      <TreasureChest />
      <h1 className="maze-page__title">Øvelse 6: Finn Victoria</h1>
      <p className="maze-page__subtitle">Hjelp Tor-Øyvind gjennom labyrinten til Victoria!</p>

      <div className="maze-area" ref={areaRef}>
        <div
          className="maze-grid"
          style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gridTemplateRows: `repeat(${SIZE}, 1fr)` }}
        >
          {maze.flatMap((row, y) =>
            row.map((cell, x) => (
              <div key={`${x}-${y}`} className={`maze-cell${cell === 1 ? ' maze-cell--wall' : ''}`} />
            )),
          )}
        </div>

        <div
          className={`maze-goal${solved ? ' maze-goal--reached' : ''}`}
          style={{
            left: `${GOAL.x * cellPercent}%`,
            top: `${GOAL.y * cellPercent}%`,
            width: `${cellPercent}%`,
            height: `${cellPercent}%`,
          }}
        >
          <div className="castle">
            <div className="castle__victoria">
              <img src={victoriaImage} alt="Victoria" />
            </div>
            <div className="castle__flag" />
            <div className="castle__battlement" />
            <div className="castle__body">
              <div className="castle__window castle__window--left" />
              <div className="castle__window castle__window--right" />
              <div className="castle__gate" />
            </div>
          </div>

          {solved && (
            <div className="castle-hearts" aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="castle-heart" style={{ animationDelay: `${i * 140}ms`, left: `${i * 18 - 5}%` }}>
                  ❤️
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className="maze-player"
          style={{
            left: `${pos.x * cellPercent}%`,
            top: `${pos.y * cellPercent}%`,
            width: `${cellPercent}%`,
            height: `${cellPercent}%`,
          }}
        >
          <img src={torImage} alt="Tor-Øyvind" />
        </div>

        {solved && coinsCollected && (
          <div className="maze-overlay">
            <p className="maze-overlay__text">Dere fant hverandre! 🎉</p>
            <button className="maze-overlay__button" onClick={() => navigate('/fremgang')}>
              Se fremgang
            </button>
          </div>
        )}
      </div>

      <div className="maze-controls">
        <div className="maze-dpad">
          <button className="maze-arrow maze-arrow--up" onClick={() => move('up')} aria-label="Opp">
            ▲
          </button>
          <button className="maze-arrow maze-arrow--left" onClick={() => move('left')} aria-label="Venstre">
            ◀
          </button>
          <button className="maze-arrow maze-arrow--right" onClick={() => move('right')} aria-label="Høyre">
            ▶
          </button>
          <button className="maze-arrow maze-arrow--down" onClick={() => move('down')} aria-label="Ned">
            ▼
          </button>
        </div>

        <div className="maze-buttons">
          <button className="maze-reset" onClick={reset}>
            Til start
          </button>
          <button className="maze-reset maze-reset--secondary" onClick={newMaze}>
            Ny labyrint
          </button>
        </div>
      </div>

      <CoinBurst active={solved && !coinsCollected} originRef={areaRef} onDone={handleBurstDone} />
    </div>
  )
}

export default MazeGame
