import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Assets from './views/pages/Assets'
import AssetProvider from 'src/views/context/AssetContext'
import Asset from 'src/views/pages/Asset'

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
          <Route path="/" element={<Assets />} />
          <Route path="/asset" element={<Asset />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AssetProvider>
    </BrowserRouter>
  )
}

export default App
