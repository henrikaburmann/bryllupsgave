import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export const TOTAL_GAMES = 5
export const COINS_PER_GAME = 200
export const TOTAL_GOAL = TOTAL_GAMES * COINS_PER_GAME

const STORAGE_KEY = 'bryllupsgave-progress'

type CompletedGames = Record<number, boolean>

interface GameProgressContextValue {
  completedGames: CompletedGames
  totalCoins: number
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

  const totalCoins = Object.values(completedGames).filter(Boolean).length * COINS_PER_GAME

  return (
    <GameProgressContext.Provider value={{ completedGames, totalCoins, completeGame, isGameCompleted }}>
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
