import React, { createContext, ReactNode, FC } from 'react'
import { withLDProvider } from 'launchdarkly-react-client-sdk'
import { v4 as uuidv4 } from 'uuid'

interface LDProviderProps {
  children: ReactNode
}

const LDClientContext = createContext({})

const LDProviderHOC = withLDProvider({
  // TODO: Complete launchdarkly
  clientSideID: '66616d7931660710585593fe',
  user: {
    key: uuidv4(),
  },
})

const LDProvider: FC<LDProviderProps> = ({ children }) => {
  const LDProviderComponent = LDProviderHOC(() => <>{children}</>)

  return <LDProviderComponent />
}

export { LDProvider, LDClientContext }
