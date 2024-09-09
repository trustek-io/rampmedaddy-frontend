import React from 'react'

import logo from 'src/logo.png'
import logoWallet from 'src/logo_wallet.png'
import './AppLayout.scss'

interface AppLayoutProps {
  children: React.ReactNode
  isWallet?: boolean
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, isWallet }) => {
  return (
    <div className="AppLayout">
      <header>
        <img
          src={isWallet ? logoWallet : logo}
          className="AppLayout__logo"
          alt="logo"
        />
      </header>

      <main className="AppLayout__main">{children}</main>
    </div>
  )
}

export default AppLayout
