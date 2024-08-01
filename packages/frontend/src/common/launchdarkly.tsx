import React, { createContext, ReactNode, FC } from 'react'
import { withLDProvider } from 'launchdarkly-react-client-sdk'
import { v4 as uuidv4 } from 'uuid'

const KEY =
  process.env.NODE_ENV === 'development'
    ? '669e28743c8c340fdb027f5d'
    : process.env.REACT_APP_LAUNCHDARKLY_KEY

interface LDProviderProps {
  children: ReactNode
}

const LDClientContext = createContext({})

const LDProviderHOC = withLDProvider({
  clientSideID: KEY!,
  user: {
    key: uuidv4(),
  },
})

const LDProvider: FC<LDProviderProps> = ({ children }) => {
  const LDProviderComponent = LDProviderHOC(() => <>{children}</>)

  return <LDProviderComponent />
}

export { LDProvider, LDClientContext }
