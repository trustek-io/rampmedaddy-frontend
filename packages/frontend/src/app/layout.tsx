import '~/styles/globals.css'

import { GeistSans } from 'geist/font/sans'
import { type Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { TRPCReactProvider } from '~/trpc/react'
import ToasterProvider from '~/providers/toaster-provider'
import CustomThemeProvider from './_components/ThemeProvider'
// import Script from 'next/script'
import AssetProvider from '~/context/AssetContext'

export const metadata: Metadata = {
  title: 'RampMeDaddy',
  description: 'RampMeDaddy',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head title={metadata.title as string}>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description!} />
        {/* <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        /> */}
      </head>
      <body>
        <TRPCReactProvider>
          <ToasterProvider />
          <CustomThemeProvider>
            <AssetProvider>
              <div
                style={{
                  textAlign: 'center',
                  backgroundColor: '#121212',
                  height: '100vh',
                  padding: '10px',
                  color: '#ffffff',
                  overflow: 'hidden',
                }}
              >
                <header>
                  {/* <img
                  src={isWallet ? logoWallet : logo}
                  className="AppLayout__logo"
                  alt="logo"
                /> */}
                </header>

                <main style={{ overflow: 'hidden' }}>{children}</main>
              </div>
            </AssetProvider>
          </CustomThemeProvider>
          <Analytics />
        </TRPCReactProvider>
      </body>
    </html>
  )
}
