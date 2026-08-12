import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameProgressProvider } from './context/GameProgressContext'
import CongratsPage from './pages/CongratsPage'
import IntroPage from './pages/IntroPage'
import PuzzleGame from './pages/PuzzleGame'
import ProgressPage from './pages/ProgressPage'

function App() {
  return (
    <GameProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CongratsPage />} />
          <Route path="/gave" element={<IntroPage />} />
          <Route path="/spill/1" element={<PuzzleGame />} />
          <Route path="/fremgang" element={<ProgressPage />} />
        </Routes>
      </BrowserRouter>
    </GameProgressProvider>
  )
}

export default App
