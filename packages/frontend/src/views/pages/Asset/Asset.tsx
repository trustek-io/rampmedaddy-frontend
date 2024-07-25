import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

// @mui
import {
  Autocomplete,
  Box,
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

// helpers
import { formatNumber, getPaymentMethodOptions } from 'src/common/helpers'

// views
import Icon from 'src/views/components/Icon'
import AppLayout from 'src/views/templates/AppLayout'

// context
import { useAssetContext } from 'src/views/context/AssetContext'

// api
import {
  buyCryptoApi,
  BuyQuote,
  getBuyQuotesApi,
  Limit,
} from 'src/web-api-client'
import { useDebounce } from 'src/hooks/use-debounce'

export interface PaymentMethodOption {
  name: string
  rate: number
  limits: Limit
  quoteId: string
  paymentMethod: string
  icon: string
  ramp: string
}

interface CustomError {
  error: {
    type: string
    code: string
    param: {
      [key: string]: string[]
    }
    error_message: string
  }
}

const URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : process.env.REACT_APP_REDIRECT_URL

const Asset: React.FC = () => {
  const [amount, setAmount] = useState<string>('')
  const [wallet, setWallet] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const [redirectUrl, setRedirectUrl] = useState<string>('')
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<
    PaymentMethodOption[]
  >([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodOption | null>(null)

  useEffect(() => {
    setSelectedPaymentMethod(paymentMethodOptions[0])
  }, [paymentMethodOptions])

  const debouncedAmount = useDebounce(amount, 300)

  console.log(paymentMethodOptions)

  const { asset } = useAssetContext()
  const navigate = useNavigate()

  const getBuyQuotes = useCallback(
    async (amount: string) => {
      if (!amount || !asset) return

      setIsLoading(true)
      try {
        const buyQuotes = await getBuyQuotesApi({
          sourceCurrency: 'usd',
          destinationCurrency: asset.code.toLowerCase(),
          amount,
        })

        setPaymentMethodOptions(getPaymentMethodOptions(buyQuotes))
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    },
    [amount, asset]
  )

  const getValidationError = useCallback(() => {
    if (!asset || !amount) return ''

    // if (+amount < asset.min_amount_collection['USD'])
    //   return `Amount should be more than $${asset.min_amount_collection['USD']}`

    // if (+amount > asset.max_amount_collection['USD'])
    //   return `Amount should be less than $${asset.max_amount_collection['USD']}`
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

      console.log('selectedPaymentMethod', selectedPaymentMethod)

      try {
        const response = await buyCryptoApi({
          source: 'usd',
          destination: asset.code,
          amount: +amount,
          type: 'buy',
          paymentMethod: selectedPaymentMethod?.paymentMethod!,
          wallet,
          onramp: selectedPaymentMethod?.ramp!,
          supportedParams: {
            partnerData: {
              redirectUrl: {
                success: 'https://rampmedaddy-staging.trustek.io/',
                failure: 'https://rampmedaddy-staging.trustek.io/',
              },
            },
          },
          metaData: {
            quoteId: selectedPaymentMethod?.quoteId!,
          },
        })
        setRedirectUrl(response.message.transactionInformation.url)
      } catch (errorResponse) {
        // const error = (errorResponse as AxiosError).response?.data
        // if (
        //   (error as CustomError).error.param.wallet_address[0] ===
        //   'invalid format'
        // )
        //   setHasError(true)
      } finally {
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isBuyDisabled, asset, amount, selectedPaymentMethod]
  )

  useEffect(() => {
    if (!asset) navigate('/')
  }, [asset, navigate])

  useEffect(() => {
    if (redirectUrl) window.location.href = redirectUrl
  }, [redirectUrl])

  useEffect(() => {
    getBuyQuotes(debouncedAmount)
  }, [debouncedAmount])

  return (
    <AppLayout>
      <Stack alignItems="flex-start">
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            color: 'text.primary',
            typography: 'subtitle2',
          }}
        >
          <Icon icon="eva:arrow-ios-back-fill" />{' '}
          <Typography component="span" variant="body2">
            Back
          </Typography>
        </IconButton>
      </Stack>

      <Typography sx={{ mt: 3 }}>
        How much {asset?.name} would you like?
      </Typography>

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
            variant="outlined"
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
              },
            }}
            error={!!getValidationError()}
            // onBlur={getBuyQuotes}
            // helperText={
            //   getValidationError() ||
            //   `Min amount $${asset?.min_amount_collection['USD']}`
            // }
          />

          <TextField
            placeholder="Receiving wallet"
            fullWidth
            variant="outlined"
            value={wallet}
            onChange={(event) => {
              setHasError(false)
              setWallet(event.target.value)
            }}
            inputProps={{ sx: { color: 'text.primary' } }}
            InputProps={{
              sx: {
                backgroundColor: 'background.paper',
              },
            }}
            sx={{
              mt: 2,
              '&.MuiFormLabel-root': { color: 'text.primary' },
              backgroundColor: 'background.paper',
            }}
            InputLabelProps={{
              shrink: true,
              sx: {
                color: 'text.primary',
                '&.Mui-focused': { color: 'text.primary' },
              },
            }}
          />
          {hasError && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              Invalid wallet address
            </FormHelperText>
          )}

          <Autocomplete
            disabled={!debouncedAmount || !paymentMethodOptions.length}
            disableClearable
            fullWidth
            defaultValue={paymentMethodOptions[0]}
            value={paymentMethodOptions[0]}
            options={paymentMethodOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option) =>
              option.name === selectedPaymentMethod?.name
            }
            renderInput={(params) => (
              <TextField
                label="From"
                {...params}
                inputProps={{
                  ...params.inputProps,
                  sx: { color: 'text.primary' },
                }}
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    backgroundColor: 'background.paper',
                  },
                }}
                sx={{
                  mt: 2,
                  '&.MuiFormLabel-root': { color: 'text.primary' },
                  backgroundColor: 'background.paper',
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    color: 'text.primary',
                    '&.Mui-focused': { color: 'text.primary' },
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.name}>
                <Icon icon={option.icon} sx={{ color: 'text.primary' }} />{' '}
                {option.name}
              </li>
            )}
            onChange={(_e, value) => {
              if (value) {
                setSelectedPaymentMethod(value)
              }
            }}
          />

          <Button
            variant="outlined"
            disabled={isBuyDisabled}
            type="submit"
            sx={{
              color: 'text.primary',
              borderColor: '#9dfe1f',
              '&:focused': { borderColor: 'text.primary' },
              '&:hover': { borderColor: 'text.primary', opacity: 0.8 },
              mt: 3,
              '&.Mui-disabled': {
                borderColor: '#9dfe1f',
                opacity: 0.6,
                color: 'text.primary',
              },
            }}
          >
            Buy {asset?.code}
          </Button>
        </form>
      </Stack>
    </AppLayout>
  )
}

export default Asset
