import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import debounce from 'lodash/debounce'

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
import { Crypto } from 'src/web-api-client'

// views
import AppLayout from 'src/views/templates/AppLayout'
import { useAssetContext } from 'src/views/context/AssetContext'
import Icon from 'src/views/components/Icon'

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
  const [search, setSearch] = useState<string>('')

  const { setAsset, assets, isLoading } = useAssetContext()
  const navigate = useNavigate()

  const handleNavigate = useCallback(
    (asset: Crypto) => (): void => {
      setAsset(asset)
      navigate('/asset')
    },
    [setAsset, navigate]
  )

  const clear = useCallback(() => {
    setSearch('')
  }, [])

  const filteredAssetsRef = useRef(assets)

  const filteredAssets = useMemo(() => {
    if (!search) {
      filteredAssetsRef.current = assets
      return assets
    }

    const newFilteredAssets = getFilteredAssets(
      filteredAssetsRef.current,
      search
    )
    filteredAssetsRef.current = newFilteredAssets
    return newFilteredAssets
  }, [assets, search])

  return (
    <AppLayout>
      <TextField
        fullWidth
        value={search}
        placeholder="Search"
        variant="outlined"
        sx={{
          backgroundColor: 'background.paper',
        }}
        onChange={(event) => setSearch(event.target.value)}
        inputProps={{ sx: { color: 'text.primary' } }}
        InputProps={{
          endAdornment: !!search && (
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
        <Box
          sx={{
            height: 'calc(100vh - 150px)',
            overflowY: 'scroll',
          }}
        >
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
            {filteredAssets.length
              ? filteredAssets.map((asset) => (
                  <Grid xs={6} key={asset.id} onClick={handleNavigate(asset)}>
                    <Card
                      elevation={24}
                      sx={{
                        backgroundColor: '#1e1e1e',
                        color: 'text.primary',
                        p: 2,
                        cursor: 'pointer',
                        '&:hover img': {
                          animation: `${rotate} 2s linear infinite`,
                        },
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          transformOrigin: 'center',
                        },
                      }}
                    >
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 3, sm: 2, md: 3 }}
                        sx={{ wordBreak: 'break-all' }}
                      >
                        <Grid xs={4}>
                          <Box
                            sx={{
                              height: '50px',
                              width: 'auto',
                              borderRadius: '50%',
                            }}
                            component="img"
                            alt="Crypto currency icon"
                            src={asset.icon}
                          />
                        </Grid>

                        <Grid xs={8} alignItems="center">
                          <Box
                            sx={{
                              typography: 'h6',
                            }}
                          >
                            {asset.code}
                          </Box>

                          <Box>({asset.name})</Box>
                        </Grid>
                      </Grid>
                      <Stack
                        alignItems="start"
                        spacing={3}
                        sx={{
                          color: '#9dfe1f',
                          '& .MuiBox-root': { mt: 3 },
                        }}
                      >
                        <Box
                          sx={{
                            color: '#9dfe1f',
                          }}
                        >
                          {asset.networkDisplayName}
                        </Box>
                      </Stack>
                    </Card>
                  </Grid>
                ))
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
        </Box>
      )}
    </AppLayout>
  )
}

export default Assets
