import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameProgressProvider } from './context/GameProgressContext'
import CongratsPage from './pages/CongratsPage'
import IntroPage from './pages/IntroPage'
import PuzzleGame from './pages/PuzzleGame'
import MemoryGame from './pages/MemoryGame'
import FlappyGame from './pages/FlappyGame'
import HangmanGame from './pages/HangmanGame'
import RingGame from './pages/RingGame'
import MazeGame from './pages/MazeGame'
import ProgressPage from './pages/ProgressPage'

function App() {
  return (
    <GameProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CongratsPage />} />
          <Route path="/gave" element={<IntroPage />} />
          <Route path="/spill/1" element={<PuzzleGame />} />
          <Route path="/spill/2" element={<MemoryGame />} />
          <Route path="/spill/3" element={<FlappyGame />} />
          <Route path="/spill/4" element={<HangmanGame />} />
          <Route path="/spill/5" element={<RingGame />} />
          <Route path="/spill/6" element={<MazeGame />} />
          <Route path="/fremgang" element={<ProgressPage />} />
        </Routes>
      </BrowserRouter>
    </GameProgressProvider>
  )
}

export default App
