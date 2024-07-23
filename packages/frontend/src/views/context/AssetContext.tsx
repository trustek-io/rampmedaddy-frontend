import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { Crypto, getAssetsApi } from 'src/web-api-client'

interface AssetContextType {
  asset: Crypto | null
  assets: Crypto[]
  setAsset: (asset: Crypto | null) => void
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
  const [asset, setAsset] = useState<Crypto | null>(null)
  const [assets, setAssets] = useState<Crypto[]>([])

  const getAssets = useCallback(async () => {
    // setIsLoading(true)
    try {
      const response = await getAssetsApi()

      setAssets(response.message.crypto)
    } catch (error) {
      console.log(error)
    } finally {
      // setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AssetContext.Provider value={{ asset, setAsset, assets }}>
      {children}
    </AssetContext.Provider>
  )
}

export default AssetProvider
