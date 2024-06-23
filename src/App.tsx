import { useEffect } from 'react'

import logo from './logo.png'
import './App.scss'
import Assets from './views/pages/Assets'

const tele = window.Telegram.WebApp

function App() {
  useEffect(() => {
    tele.ready()
  }, [])

  return (
    <div className="App">
      <header>
        <img src={logo} className="App__logo" alt="logo" />
      </header>

      <main className="App__main">
        <Assets />
      </main>
    </div>
  )
}

export default App
