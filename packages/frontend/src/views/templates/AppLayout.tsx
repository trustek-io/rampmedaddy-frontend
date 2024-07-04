import React from 'react'

import logo from 'src/logo.png'
import './AppLayout.scss'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="AppLayout">
      <header>
        <img src={logo} className="AppLayout__logo" alt="logo" />
      </header>

      <main className="AppLayout__main">{children}</main>
    </div>
  )
}

export default AppLayout
