import { useNavigate } from 'react-router-dom'
import { useGameProgress, TOTAL_GAMES } from '../context/GameProgressContext'
import TreasureChest from '../components/TreasureChest'
import './ProgressPage.css'

const NEXT_GAME: Record<number, string> = { 1: '/spill/2', 2: '/spill/3', 3: '/spill/4', 4: '/spill/5', 5: '/spill/6' }

function ProgressPage() {
  const navigate = useNavigate()
  const { gamesCompleted } = useGameProgress()
  const allDone = gamesCompleted >= TOTAL_GAMES
  const nextPath = NEXT_GAME[gamesCompleted]

  return (
    <div className="progress-page">
      <h1 className="progress-page__title">Fremgang</h1>
      <p className="progress-page__amount">
        {gamesCompleted} av {TOTAL_GAMES} øvelser fullført
      </p>
      <TreasureChest />
      {allDone ? (
        <button className="progress-page__button" onClick={() => navigate('/gave')}>
          🎁 Hent gaven!
        </button>
      ) : nextPath ? (
        <button className="progress-page__button" onClick={() => navigate(nextPath)}>
          Neste øvelse →
        </button>
      ) : null}
    </div>
  )
}

export default ProgressPage
