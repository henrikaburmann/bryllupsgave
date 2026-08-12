import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameProgress } from '../context/GameProgressContext'
import TreasureChest from '../components/TreasureChest'
import CoinBurst from '../components/CoinBurst'
import img1 from '../images/memoryGame/15B41CF2-47A3-4361-8AF8-6882FB6773A3.JPG'
import img2 from '../images/memoryGame/293CF86C-E11A-4254-8C26-7B432F94B875.JPG'
import img3 from '../images/memoryGame/78D5B43F-63A5-48CA-81D5-5C033FFE8ED5.JPG'
import img4 from '../images/memoryGame/A64146B9-140B-483E-A8D1-CB05D5BF3335.JPG'
import img5 from '../images/memoryGame/ADDA15CF-904E-4144-A55B-74907BCF6FE5.JPG'
import img6 from '../images/memoryGame/F50835CE-21F7-4D68-84BE-5A7B3663ADB1.JPG'
import './MemoryGame.css'

const IMAGES = [img1, img2, img3, img4, img5, img6]
const GAME_ID = 2
const FLIP_BACK_DELAY_MS = 900

interface MemoryCard {
  id: number
  imageIndex: number
}

function shuffledCards(): MemoryCard[] {
  const cards = IMAGES.flatMap((_, imageIndex) => [
    { id: imageIndex * 2, imageIndex },
    { id: imageIndex * 2 + 1, imageIndex },
  ])

  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }

  return cards
}

function MemoryGame() {
  const navigate = useNavigate()
  const { completeGame } = useGameProgress()
  const boardRef = useRef<HTMLDivElement>(null)
  const [cards] = useState<MemoryCard[]>(() => shuffledCards())
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [locked, setLocked] = useState(false)
  const [solved, setSolved] = useState(false)
  const [coinsCollected, setCoinsCollected] = useState(false)

  const handleBurstDone = useCallback(() => {
    completeGame(GAME_ID)
    setCoinsCollected(true)
  }, [completeGame])

  useEffect(() => {
    if (flipped.length !== 2) return

    const [firstPos, secondPos] = flipped
    const isMatch = cards[firstPos].imageIndex === cards[secondPos].imageIndex

    setLocked(true)
    const timeout = setTimeout(() => {
      if (isMatch) {
        setMatched((prev) => new Set(prev).add(cards[firstPos].imageIndex))
      }
      setFlipped([])
      setLocked(false)
    }, isMatch ? 400 : FLIP_BACK_DELAY_MS)

    return () => clearTimeout(timeout)
  }, [flipped, cards])

  useEffect(() => {
    if (matched.size === IMAGES.length && !solved) {
      setSolved(true)
    }
  }, [matched, solved])

  const handleCardClick = (position: number) => {
    if (locked || solved) return
    if (flipped.includes(position)) return
    if (matched.has(cards[position].imageIndex)) return
    if (flipped.length === 2) return

    setFlipped((prev) => [...prev, position])
  }

  return (
    <div className="memory-page">
      <TreasureChest />
      <h1 className="memory-page__title">Øvelse 2: Memory</h1>
      <p className="memory-page__subtitle">Snu to kort om gangen og finn alle parene!</p>

      <div className="memory-board" ref={boardRef}>
        {cards.map((card, position) => {
          const isFaceUp = flipped.includes(position) || matched.has(card.imageIndex)

          return (
            <button
              key={card.id}
              type="button"
              className={`memory-card${isFaceUp ? ' memory-card--flipped' : ''}`}
              onClick={() => handleCardClick(position)}
              aria-label={`Kort ${position + 1}`}
            >
              <div className="memory-card__inner">
                <div className="memory-card__face memory-card__face--back">💌</div>
                <div
                  className="memory-card__face memory-card__face--front"
                  style={{ backgroundImage: `url(${IMAGES[card.imageIndex]})` }}
                />
              </div>
            </button>
          )
        })}

        {solved && !coinsCollected && <div className="memory-win-banner">Riktig! 🎉</div>}

        {solved && coinsCollected && (
          <div className="memory-win-overlay">
            <p className="memory-win-overlay__text">Riktig! 🎉</p>
            <button className="memory-win-overlay__button" onClick={() => navigate('/fremgang')}>
              Se fremgang
            </button>
          </div>
        )}
      </div>

      <CoinBurst active={solved && !coinsCollected} originRef={boardRef} onDone={handleBurstDone} />
    </div>
  )
}

export default MemoryGame
