import React, { createContext, useContext, useState } from 'react'

import { Asset } from 'src/web-api-client'

interface AssetContextType {
  asset: Asset | null
  setAsset: (asset: Asset | null) => void
}

export const AssetContext = createContext<AssetContextType | null>(null)

export const useAssetContext = () => {
  const context = useContext(AssetContext)
  if (!context) {
    throw new Error('useAssetContext must be used within an AssetProvider')
  }
  return context
}

const AssetProvider = ({ children }: { children: React.ReactNode }) => {
  const [asset, setAsset] = useState<Asset | null>(null)

  return (
    <AssetContext.Provider value={{ asset, setAsset }}>
      {children}
    </AssetContext.Provider>
  )
}

export default AssetProvider
