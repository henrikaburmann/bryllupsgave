import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CongratsPage from './pages/CongratsPage'
import GiftPage from './pages/GiftPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CongratsPage />} />
        <Route path="/gave" element={<GiftPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
