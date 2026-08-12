import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export const TOTAL_GAMES = 6
// Increasing reward per game, summing to exactly TOTAL_GOAL (1000).
export const GAME_REWARDS: Record<number, number> = {
  1: 100,
  2: 125,
  3: 150,
  4: 175,
  5: 200,
  6: 250,
}
export const TOTAL_GOAL = Object.values(GAME_REWARDS).reduce((sum, v) => sum + v, 0)

const STORAGE_KEY = 'bryllupsgave-progress'

type CompletedGames = Record<number, boolean>

interface GameProgressContextValue {
  completedGames: CompletedGames
  totalCoins: number
  gamesCompleted: number
  completeGame: (gameId: number) => void
  isGameCompleted: (gameId: number) => boolean
}

const GameProgressContext = createContext<GameProgressContextValue | null>(null)

function loadCompletedGames(): CompletedGames {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CompletedGames) : {}
  } catch {
    return {}
  }
}

export function GameProgressProvider({ children }: { children: ReactNode }) {
  const [completedGames, setCompletedGames] = useState<CompletedGames>(loadCompletedGames)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedGames))
  }, [completedGames])

  const completeGame = (gameId: number) => {
    setCompletedGames((prev) => ({ ...prev, [gameId]: true }))
  }

  const isGameCompleted = (gameId: number) => Boolean(completedGames[gameId])

  const completedIds = Object.entries(completedGames)
    .filter(([, done]) => done)
    .map(([id]) => Number(id))
  const totalCoins = completedIds.reduce((sum, id) => sum + (GAME_REWARDS[id] ?? 0), 0)
  const gamesCompleted = completedIds.length

  return (
    <GameProgressContext.Provider
      value={{ completedGames, totalCoins, gamesCompleted, completeGame, isGameCompleted }}
    >
      {children}
    </GameProgressContext.Provider>
  )
}

export function useGameProgress() {
  const context = useContext(GameProgressContext)
  if (!context) {
    throw new Error('useGameProgress must be used within a GameProgressProvider')
  }
  return context
}
