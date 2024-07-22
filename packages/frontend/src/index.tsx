import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LDProvider } from 'src/common/launchdarkly'

const theme = createTheme({
  palette: {
    background: {
      default: '#000000',
      paper: '#212B36',
    },
    text: {
      primary: '#ffffff',
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LDProvider>
        <App />
      </LDProvider>
    </ThemeProvider>
  </React.StrictMode>
)

reportWebVitals()
