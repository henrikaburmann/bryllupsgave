import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameProgress } from '../context/GameProgressContext'
import puzzleImage from '../images/tihldeInstallering.JPG'
import './PuzzleGame.css'

const GRID_SIZE = 4
const PIECE_COUNT = GRID_SIZE * GRID_SIZE
const GAME_ID = 1

function shuffledOrder(): number[] {
  const order = Array.from({ length: PIECE_COUNT }, (_, i) => i)
  const isSolved = (arr: number[]) => arr.every((value, index) => value === index)

  do {
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
  } while (isSolved(order))

  return order
}

function PuzzleGame() {
  const navigate = useNavigate()
  const { completeGame } = useGameProgress()
  const [order, setOrder] = useState<number[]>(() => shuffledOrder())
  const [selected, setSelected] = useState<number | null>(null)
  const [solved, setSolved] = useState(false)

  const isSolved = useMemo(() => order.every((value, index) => value === index), [order])

  useEffect(() => {
    if (isSolved && !solved) {
      setSolved(true)
      completeGame(GAME_ID)
    }
  }, [isSolved, solved, completeGame])

  const handleTileClick = (position: number) => {
    if (solved) return

    if (selected === null) {
      setSelected(position)
      return
    }

    if (selected === position) {
      setSelected(null)
      return
    }

    setOrder((prev) => {
      const next = [...prev]
      ;[next[selected], next[position]] = [next[position], next[selected]]
      return next
    })
    setSelected(null)
  }

  return (
    <div className="puzzle-page">
      <h1 className="puzzle-page__title">Øvelse 1: Puslespill</h1>
      <p className="puzzle-page__subtitle">
        Trykk på to brikker for å bytte plass på dem. Få bildet riktig for å låse opp neste øvelse!
      </p>

      <div className="puzzle-board">
        {order.map((pieceIndex, position) => {
          const col = pieceIndex % GRID_SIZE
          const row = Math.floor(pieceIndex / GRID_SIZE)
          const backgroundPosition = `${(col / (GRID_SIZE - 1)) * 100}% ${(row / (GRID_SIZE - 1)) * 100}%`

          return (
            <button
              key={position}
              type="button"
              className={`puzzle-tile${selected === position ? ' puzzle-tile--selected' : ''}`}
              style={{
                backgroundImage: `url(${puzzleImage})`,
                backgroundPosition,
              }}
              onClick={() => handleTileClick(position)}
              aria-label={`Brikke ${position + 1}`}
            />
          )
        })}

        {solved && (
          <div className="puzzle-win-overlay">
            <p className="puzzle-win-overlay__text">Riktig! 🎉</p>
            <button className="puzzle-win-overlay__button" onClick={() => navigate('/fremgang/1')}>
              Se fremgang
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PuzzleGame
