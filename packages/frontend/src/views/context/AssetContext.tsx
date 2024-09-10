import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Contact } from 'src/mock/contacts'
import { Crypto, getAssetsApi } from 'src/web-api-client'

interface AssetContextType {
  asset: Crypto | null
  assets: Crypto[]
  setAsset: (asset: Crypto | null) => void
  isLoading: boolean
  contact: Contact | null
  setContact: (contact: Contact | null) => void
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [contact, setContact] = useState<Contact | null>(null)

  const getAssets = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getAssetsApi()
      setAssets(response.message.crypto)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getAssets()
  }, [getAssets])

  const value = useMemo(
    () => ({
      asset,
      setAsset,
      assets,
      isLoading,
      contact,
      setContact,
    }),
    [asset, assets, isLoading, contact]
  )

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
}

export default AssetProvider
