import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { SpotDetailPage } from './pages/SpotDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header">
          <Link className="site-brand" to="/" aria-label="台灣私房景點地圖首頁">
            <span className="brand-seal" aria-hidden="true">台灣</span>
            <span className="site-title">台灣私房景點地圖</span>
          </Link>
          <Link className="header-map-link" to="/">探索地圖 <span aria-hidden="true">↗</span></Link>
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
