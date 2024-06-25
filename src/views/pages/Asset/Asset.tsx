import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// @mui
import {
  Box,
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

// helpers
import { formatNumber } from 'src/common/helpers'

// views
import Icon from 'src/views/components/Icon'
import AppLayout from 'src/views/templates/AppLayout'

// context
import { useAssetContext } from 'src/views/context/AssetContext'

// api
import { buyCryptoApi } from 'src/web-api-client'

const URL = 'https://rampmedaddy-frontend-rust.vercel.app/'

const Asset: React.FC = () => {
  const [amount, setAmount] = useState<string>('')
  const [wallet, setWallet] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const [redirectUrl, setRedirectUrl] = useState<string>('')

  const { asset } = useAssetContext()
  const navigate = useNavigate()

  const getValidationError = useCallback(() => {
    if (!asset) return ''

    if (amount) {
      if (+amount < asset.min_amount_collection['USD'])
        return `Amount should be more than $${asset.min_amount_collection['USD']}`

      if (+amount > asset.max_amount_collection['USD'])
        return `Amount should be less than $${asset.max_amount_collection['USD']}`
    }

    return ''
  }, [amount, asset])

  const isBuyDisabled = useMemo(
    () => !wallet || !!getValidationError() || isLoading,
    [getValidationError, wallet, isLoading]
  )

  const buyCrypto = useCallback(
    async (event: React.FormEvent) => {
      setHasError(false)
      if (isBuyDisabled || !asset) return

      event.stopPropagation()
      event.preventDefault()

      setIsLoading(true)
      try {
        const response = await buyCryptoApi({
          currency: 'USD',
          fiat_amount: +amount * 100,
          order_currency: asset.currency_symbol,
          network: asset.support_networks[0].network_name,
          wallet_address: wallet,
          return_url: URL,
          cancel_url: URL,
        })

        setRedirectUrl(response.redirect_url)
      } catch (error) {
        console.log(error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isBuyDisabled, asset, amount]
  )

  useEffect(() => {
    if (!asset) navigate('/')
  }, [asset, navigate])

  useEffect(() => {
    if (redirectUrl) window.location.href = redirectUrl
  }, [redirectUrl])

  return (
    <AppLayout>
      <Stack alignItems="flex-start">
        <IconButton
          onClick={() => navigate('/')}
          sx={{ color: 'text.primary' }}
        >
          <Icon icon="eva:arrow-ios-back-fill" />{' '}
          <Typography component="span" variant="body2">
            Back
          </Typography>
        </IconButton>
      </Stack>

      <Typography>How much {asset?.currency_name} would you like?</Typography>

      <Stack sx={{ px: 2 }}>
        <form onSubmit={buyCrypto}>
          <TextField
            placeholder="0.00"
            sx={{
              mt: 2,
              '& .MuiFormHelperText-root': {
                color: 'text.primary',
              },
            }}
            value={formatNumber(amount)}
            fullWidth
            autoFocus
            type="text"
            inputProps={{ sx: { color: 'text.primary' } }}
            onChange={(event) => {
              setHasError(false)
              if (event.target.value.includes('.')) {
                const [amount, decimalValue] = event.target.value
                  .replaceAll(',', '')
                  .split('.')

                setAmount(`${amount}.${decimalValue.slice(0, 2)}`)

                return
              }

              setAmount(event.target.value.replaceAll(',', ''))
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box
                    sx={{
                      typography: 'subtitle2',
                      py: '3px',
                      px: '8px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      mr: 2,
                      color: 'text.primary',
                      fontSize: '22px',
                    }}
                  >
                    | USD
                  </Box>
                </InputAdornment>
              ),
              sx: {
                p: 0.5,
                mt: 1,
                backgroundColor: 'background.paper',
                borderRadius: '25px',
                '& .Mui-focused': {
                  borderRadius: '25px',
                },
              },
            }}
            error={!!getValidationError()}
            helperText={
              getValidationError() ||
              `Min amount $${asset?.min_amount_collection['USD']}`
            }
          />

          <TextField
            placeholder="Wallet address"
            fullWidth
            value={wallet}
            onChange={(event) => {
              setHasError(false)
              setWallet(event.target.value)
            }}
            inputProps={{ sx: { color: 'text.primary' } }}
            InputProps={{
              sx: {
                backgroundColor: 'background.paper',
                borderRadius: '25px',
                '& .Mui-focused': {
                  borderRadius: '25px',
                },
              },
            }}
            sx={{
              mt: 2,
              '&.MuiFormLabel-root': { color: 'text.primary' },
              backgroundColor: 'background.paper',
              borderRadius: '25px',
              '& .Mui-focused': {
                borderRadius: '25px',
              },
            }}
            InputLabelProps={{
              shrink: true,
              sx: {
                color: 'text.primary',
                '&.Mui-focused': { color: 'text.primary' },
              },
            }}
          />

          <Button
            variant="outlined"
            disabled={isBuyDisabled}
            type="submit"
            sx={{
              color: 'text.primary',
              borderColor: 'text.primary',
              '&:focused': { borderColor: 'text.primary' },
              '&:hover': { borderColor: 'text.primary', opacity: 0.8 },
              mt: 3,
              '&.Mui-disabled': {
                borderColor: 'text.primary',
                opacity: 0.6,
                color: 'text.primary',
              },
            }}
          >
            Buy {asset?.currency_name}
          </Button>

          {hasError && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center', mt: 3 }}>
              Something went wrong!
            </FormHelperText>
          )}
        </form>
      </Stack>
    </AppLayout>
  )
}

export default Asset
