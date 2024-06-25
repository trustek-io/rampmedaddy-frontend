import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// @mui
import {
  Box,
  Button,
  Card,
  CircularProgress,
  keyframes,
  Stack,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

// api
import { Asset, getAssetsApi, SupportNetwork } from 'src/web-api-client'

// views
import AppLayout from 'src/views/templates/AppLayout'
import { useAssetContext } from 'src/views/context/AssetContext'
import Icon from 'src/views/components/Icon'

// hooks
import { useDebounce } from 'src/hooks/use-debounce'

// helpers
import { getFilteredAssets } from 'src/common/helpers'

const rotate = keyframes`
  0%, 30%, 50%, 70%, 100% {
    transform: rotate(0deg) scale(1);
  }

  10% {
    transform: rotate(15deg) scale(1.2);
  }

  40% {
    transform: rotate(-15deg) scale(0.8);
  }

  60% {
    transform: rotate(10deg) scale(1.1);
  }

  80% {
    transform: rotate(-10deg) scale(0.9);
  }
`

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [search, setSearch] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const debouncedQuery = useDebounce(search, 300)
  const { setAsset } = useAssetContext()
  const navigate = useNavigate()

  const getAssets = useCallback(async () => {
    setIsLoading(true)
    try {
      const assets = await getAssetsApi()

      setAssets(assets)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleNavigate = useCallback(
    (asset: Asset, network: SupportNetwork) => (): void => {
      setAsset({ ...asset, support_networks: [network] })
      navigate('/asset')
    },
    [setAsset, navigate]
  )

  const clear = useCallback(() => {
    setFilteredAssets(assets)
    setSearch('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setFilteredAssets(assets)
  }, [assets])

  useEffect(() => {
    if (!debouncedQuery) setFilteredAssets(assets)

    const filteredAssets = getFilteredAssets(assets, debouncedQuery)
    setFilteredAssets(filteredAssets)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  return (
    <AppLayout>
      <TextField
        fullWidth
        autoFocus
        value={search}
        placeholder="Search"
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: '25px',
          '& .Mui-focused': {
            borderRadius: '25px',
          },
        }}
        onChange={(event) => setSearch(event.target.value)}
        inputProps={{ sx: { color: 'text.primary' } }}
        InputProps={{
          endAdornment: !!debouncedQuery && (
            <Button
              onClick={clear}
              sx={{ minWidth: 'unset', p: 0 }}
              startIcon={
                <Icon icon="mdi:remove-bold" sx={{ color: 'text.primary' }} />
              }
            />
          ),
        }}
      />

      {isLoading ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ height: '200px' }}
        >
          <CircularProgress />
        </Stack>
      ) : (
        <Grid
          container
          spacing={3}
          sx={{
            '& > .MuiGrid-item': {
              paddingLeft: 0,
              paddingRight: 0,
            },
            m: 0,
            height: 'calc(100vh - 150px)',
            overflowY: 'scroll',
          }}
        >
          {filteredAssets.length
            ? filteredAssets.map((asset) =>
                asset.support_networks.map((network, i) => (
                  <Grid xs={6} key={i} onClick={handleNavigate(asset, network)}>
                    <Card
                      sx={{
                        backgroundColor: '#000',
                        color: 'text.primary',
                        p: 2,
                        borderRadius: '30px',
                        cursor: 'pointer',
                        '&:hover img': {
                          animation: `${rotate} 2s linear infinite`,
                        },
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          transformOrigin: 'center',
                        },
                        boxShadow:
                          'rgba(255, 255, 255, 0.3) 0px 19px 38px, rgba(255, 255, 255, 0.22) 0px 15px 12px',
                      }}
                    >
                      <Stack
                        alignItems="center"
                        spacing={3}
                        sx={{ '& .MuiBox-root': { mt: 1 } }}
                      >
                        <Box
                          sx={{
                            height: '50px',
                            width: 'auto',
                            borderRadius: '50%',
                          }}
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
              )
            : search && (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: '200px', width: 1 }}
                >
                  Not found
                </Stack>
              )}
        </Grid>
      )}
    </AppLayout>
  )
}

export default Assets
