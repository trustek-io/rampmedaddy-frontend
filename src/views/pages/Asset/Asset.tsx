import React from 'react'

import { useAssetContext } from 'src/views/context/AssetContext'
import AppLayout from 'src/views/templates/AppLayout'

const Asset: React.FC = () => {
  const { asset } = useAssetContext()

  return (
    <AppLayout>
      <div>{asset?.currency_name}</div>
    </AppLayout>
  )
}

export default Asset
