import { useEffect } from 'react'

import OnramperWidget from './views/pages/OnramperWidget'

const tele = window.Telegram.WebApp

function App() {
  useEffect(() => {
    tele.ready()
    tele.expand()
  }, [])

  return <OnramperWidget />
}

export default App
