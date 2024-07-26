import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// @mui
import {
  Button,
  CircularProgress,
  FormHelperText,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'

// helpers
import { getLimit, getPaymentMethodOptions } from 'src/common/helpers'

// views
import Icon from 'src/views/components/Icon'
import AppLayout from 'src/views/templates/AppLayout'
import AmountInput from './AmountInput'
import WalletInput from './WalletInput'
import PaymentMethodSelect from './PaymentMethodSelect'

// context
import { useAssetContext } from 'src/views/context/AssetContext'

// api
import { buyCryptoApi, getBuyQuotesApi, Limit } from 'src/web-api-client'
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

const Asset: React.FC = () => {
  const [amount, setAmount] = useState<string>('200')
  const [wallet, setWallet] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isQuotesFetching, setIsQuotesFetching] = useState<boolean>(false)
  const [redirectUrl, setRedirectUrl] = useState<string>('')
  const [limit, setLimit] = useState<Limit | null>(null)
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<
    PaymentMethodOption[]
  >([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodOption | null>(null)

  useEffect(() => {
    const recommended = paymentMethodOptions.filter((method) =>
      Math.min(method.rate)
    )[0]

    if (recommended) setSelectedPaymentMethod(recommended)

    if (!limit && !!paymentMethodOptions.length)
      setLimit(getLimit(paymentMethodOptions))
  }, [paymentMethodOptions, limit, setLimit])

  const debouncedAmount = useDebounce(amount, 300)

  const { asset } = useAssetContext()
  const navigate = useNavigate()

  const getBuyQuotes = useCallback(
    async (amount: string) => {
      if (!amount || !asset) return

      setIsQuotesFetching(true)
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
        setIsQuotesFetching(false)
      }
    },
    [asset]
  )

  useEffect(() => {
    getBuyQuotes('200')
  }, [getBuyQuotes])

  const getValidationError = useCallback(() => {
    if (!paymentMethodOptions.length || !limit) return ''

    if (+amount < limit.min || +amount > limit.max)
      return `Amount should be in between USD ${limit.min} and USD ${limit.max}`

    return ''
  }, [paymentMethodOptions, limit, amount])

  const isBuyDisabled = useMemo(
    () => !wallet || !!getValidationError() || isLoading,
    [getValidationError, wallet, isLoading]
  )

  const buyCrypto = useCallback(
    async (event: React.FormEvent) => {
      if (isBuyDisabled || !asset) return

      event.stopPropagation()
      event.preventDefault()

      setIsLoading(true)

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
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isBuyDisabled, asset, selectedPaymentMethod]
  )

  useEffect(() => {
    if (!asset) navigate('/')
  }, [asset, navigate])

  useEffect(() => {
    if (redirectUrl) window.location.href = redirectUrl
  }, [redirectUrl])

  useEffect(() => {
    getBuyQuotes(debouncedAmount)
  }, [debouncedAmount, getBuyQuotes])

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
          <AmountInput
            onChange={setAmount}
            amount={amount}
            validationError={getValidationError()}
          />

          {!getValidationError() && (
            <Typography align="left" variant="body2" color="text.disabled">
              {isQuotesFetching && (
                <>
                  <CircularProgress size={13} sx={{ color: 'text.disabled' }} />{' '}
                  Fetching best price...
                </>
              )}
              {selectedPaymentMethod?.rate &&
                !isQuotesFetching &&
                `1 ${asset?.code} ≈ ${selectedPaymentMethod.rate.toFixed(2)} USD`}
            </Typography>
          )}

          {!(paymentMethodOptions.length || isQuotesFetching) && (
            <FormHelperText error sx={{ px: 2, textAlign: 'left' }}>
              No onramp available for these details. Please select a different
              payment method, fiat or crypto.
            </FormHelperText>
          )}

          <WalletInput wallet={wallet} onChange={setWallet} />

          <PaymentMethodSelect
            amount={debouncedAmount}
            selectedPaymentMethod={selectedPaymentMethod}
            onChange={setSelectedPaymentMethod}
            options={paymentMethodOptions}
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
