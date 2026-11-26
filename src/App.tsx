import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { SpotDetailPage } from './pages/SpotDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header">
          <h1 className="site-title">台灣私房景點地圖</h1>
          <p className="site-hint">選一個地方，看看那裡藏著什麼。</p>
        </header>
        <main className="site-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/spots/:spotId" element={<SpotDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
