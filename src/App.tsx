import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameProgressProvider } from './context/GameProgressContext'
import CongratsPage from './pages/CongratsPage'
import IntroPage from './pages/IntroPage'
import PuzzleGame from './pages/PuzzleGame'
import MemoryGame from './pages/MemoryGame'
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
          <Route path="/fremgang" element={<ProgressPage />} />
        </Routes>
      </BrowserRouter>
    </GameProgressProvider>
  )
}

export default App
