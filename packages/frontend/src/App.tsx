import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Assets from './views/pages/Assets'
import AssetProvider from 'src/views/context/AssetContext'
import Asset from 'src/views/pages/Asset'
import Wallet from './views/pages/Wallet'

const tele = window.Telegram.WebApp

function App() {
  useEffect(() => {
    tele.ready()
    tele.expand()
  }, [])

  return (
    <BrowserRouter>
      <AssetProvider>
        <Routes>
          <Route path="/" element={<Wallet />} />
          <Route path="/asset" element={<Asset />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AssetProvider>
    </BrowserRouter>
  )
}

export default App
