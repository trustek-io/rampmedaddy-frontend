import React, { useEffect, useState } from 'react'

// @mui
import { Box, Card, Stack } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

import { Asset, getAssetsApi } from 'src/web-api-client'

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([])

  const getAssets = async () => {
    try {
      const assets = await getAssetsApi()

      setAssets(assets)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAssets()
  }, [])

  return (
    <Grid
      container
      spacing={3}
      sx={{
        '& > .MuiGrid-item': {
          paddingLeft: 0,
          paddingRight: 0,
        },
        m: 0,
      }}
    >
      {assets.map((asset) =>
        asset.support_networks.map((network) => (
          <Grid xs={6} key={asset.currency_symbol}>
            <Card
              sx={{
                backgroundColor: '#212B36',
                color: '#ffffff',
                p: 2,
                borderRadius: '30px',
              }}
            >
              <Stack
                alignItems="center"
                spacing={3}
                sx={{ '& .MuiBox-root': { mt: 1 } }}
              >
                <Box
                  sx={{ height: '50px', width: 'auto' }}
                  component="img"
                  alt="Crypto currency icon"
                  src={network.icon_url}
                />

                <Box>{asset.currency_name}</Box>

                <Box>({asset.currency_symbol})</Box>

                <Box>{network.network_name}</Box>
              </Stack>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  )
}

export default Assets
