import { useEffect, useState, type RefObject } from 'react'
import './CoinBurst.css'

interface Coin {
  id: number
  startX: number
  startY: number
  dx: number
  dy: number
  delay: number
}

interface CoinBurstProps {
  active: boolean
  originRef: RefObject<HTMLElement | null>
  onDone: () => void
}

const COIN_COUNT = 8
const FLIGHT_DURATION_MS = 800
const STAGGER_MS = 70

function CoinBurst({ active, originRef, onDone }: CoinBurstProps) {
  const [coins, setCoins] = useState<Coin[]>([])

  useEffect(() => {
    if (!active) return

    const originEl = originRef.current
    const targetEl = document.getElementById('treasure-chest-target')

    if (!originEl || !targetEl) {
      onDone()
      return
    }

    const originRect = originEl.getBoundingClientRect()
    const targetRect = targetEl.getBoundingClientRect()
    const startX = originRect.left + originRect.width / 2
    const startY = originRect.top + originRect.height / 2
    const targetX = targetRect.left + targetRect.width / 2
    const targetY = targetRect.top + targetRect.height / 2

    setCoins(
      Array.from({ length: COIN_COUNT }, (_, i) => ({
        id: i,
        startX,
        startY,
        dx: targetX - startX + (Math.random() - 0.5) * 20,
        dy: targetY - startY + (Math.random() - 0.5) * 20,
        delay: i * STAGGER_MS,
      })),
    )

    const timeout = setTimeout(() => {
      setCoins([])
      onDone()
    }, FLIGHT_DURATION_MS + COIN_COUNT * STAGGER_MS)

    return () => clearTimeout(timeout)
  }, [active, originRef, onDone])

  if (coins.length === 0) return null

  return (
    <>
      {coins.map((coin) => (
        <span
          key={coin.id}
          className="coin-burst"
          style={{
            left: coin.startX,
            top: coin.startY,
            animationDelay: `${coin.delay}ms`,
            animationDuration: `${FLIGHT_DURATION_MS}ms`,
            ['--dx' as string]: `${coin.dx}px`,
            ['--dy' as string]: `${coin.dy}px`,
          }}
        >
          🪙
        </span>
      ))}
    </>
  )
}

export default CoinBurst
