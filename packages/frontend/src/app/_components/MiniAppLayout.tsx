'use client'
import { Box } from '@mui/material'
import React from 'react'

interface MiniAppLayoutProps {
  children: React.ReactNode
  isWallet?: boolean
}

const MiniAppLayout: React.FC<MiniAppLayoutProps> = ({
  children,
  isWallet,
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        backgroundColor: '#121212',
        minHeight: '100vh',
        padding: '10px',
        color: '#ffffff',
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100px',
        }}
      >
        <img
          src={isWallet ? '/logo_wallet.png' : '/logo.png'}
          alt="logo"
          style={{
            width: 'auto',
            height: '100px',
          }}
        />
      </Box>

      <main style={{ overflow: 'hidden' }}>{children}</main>
    </div>
  )
}

export default MiniAppLayout
