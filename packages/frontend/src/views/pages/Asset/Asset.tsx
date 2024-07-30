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
import {
  getLimitErrorMessage,
  getPaymentMethodOptions,
} from 'src/common/helpers'

// views
import Icon from 'src/views/components/Icon'
import AppLayout from 'src/views/templates/AppLayout'
import AmountInput from './AmountInput'
import WalletInput from './WalletInput'
import PaymentMethodSelect from './PaymentMethodSelect'

// context
import { useAssetContext } from 'src/views/context/AssetContext'

// api
import {
  buyCryptoApi,
  getBuyQuotesApi,
  Limit,
  BuyQuote,
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

const Asset: React.FC = () => {
  const { asset } = useAssetContext()
  const navigate = useNavigate()

  const [amount, setAmount] = useState<string>('')
  const [wallet, setWallet] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isQuotesFetching, setIsQuotesFetching] = useState<boolean>(false)
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<
    PaymentMethodOption[]
  >([])
  const [quotes, setQuotes] = useState<BuyQuote[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodOption | null>(null)

  const debouncedAmount = useDebounce(amount, 300)

  const getBuyQuotes = useCallback(
    async (amount: string) => {
      if (!asset || !amount) return

      setIsQuotesFetching(true)
      try {
        const buyQuotes = await getBuyQuotesApi({
          sourceCurrency: 'usd',
          destinationCurrency: asset.code.toLowerCase(),
          network: asset.network,
          amount,
          ...(!!selectedPaymentMethod && {
            paymentMethod: selectedPaymentMethod.paymentMethod,
          }),
        })

        setPaymentMethodOptions(getPaymentMethodOptions(buyQuotes))

        setQuotes(buyQuotes)
      } catch (error) {
        console.log(error)
      } finally {
        setIsQuotesFetching(false)
      }
    },
    [asset, selectedPaymentMethod]
  )

  useEffect(() => {
    if (!asset) navigate('/')
  }, [asset, navigate])

  useEffect(() => {
    getBuyQuotes(debouncedAmount)
  }, [debouncedAmount, getBuyQuotes])

  const bestRate = useMemo(() => {
    return (
      quotes.find((quote) => quote.recommendations?.includes('BestPrice'))
        ?.rate ||
      quotes.find((quote) => quote.recommendations?.includes('LowKyc'))?.rate
    )
  }, [quotes])

  const limitError = useMemo(() => {
    if (isQuotesFetching || bestRate) return ''

    return getLimitErrorMessage(quotes)
  }, [quotes, isQuotesFetching, bestRate])

  const hasQuoteError = useMemo(
    () =>
      !paymentMethodOptions.length &&
      !limitError &&
      debouncedAmount &&
      !isQuotesFetching,
    [paymentMethodOptions, isQuotesFetching, limitError, debouncedAmount]
  )

  const isBuyDisabled = useMemo(
    () =>
      !wallet ||
      !!limitError ||
      isLoading ||
      !amount ||
      hasQuoteError ||
      isQuotesFetching,
    [limitError, wallet, isLoading, amount, hasQuoteError, isQuotesFetching]
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
                success: process.env.REACT_APP_REDIRECT_URL || '',
                failure: process.env.REACT_APP_REDIRECT_URL || '',
              },
            },
          },
          metaData: {
            quoteId: selectedPaymentMethod?.quoteId!,
          },
        })

        const redirectUrl = response.message.transactionInformation.url
        if (redirectUrl) window.location.href = redirectUrl
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isBuyDisabled, asset, selectedPaymentMethod]
  )

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
            validationError={limitError}
          />

          {isQuotesFetching && (
            <Typography align="left" variant="body2" color="text.disabled">
              <CircularProgress size={13} sx={{ color: 'text.disabled' }} />{' '}
              Fetching best price...
            </Typography>
          )}

          {hasQuoteError && (
            <Typography align="left" variant="body2" color="text.disabled">
              <FormHelperText error sx={{ px: 2, textAlign: 'left' }}>
                No onramp available for these details. Please select a different
                payment method or crypto.
              </FormHelperText>
            </Typography>
          )}

          {bestRate && !isQuotesFetching && (
            <Typography align="left" variant="body2" color="text.disabled">
              1 {asset?.code} ≈ {bestRate.toFixed(2)} USD`
            </Typography>
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
