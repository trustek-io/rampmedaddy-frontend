import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFlags } from 'launchdarkly-react-client-sdk'

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
  getBestRate,
  getCurrencies,
  getLimitErrorMessage,
  getPaymentMethodOptions,
  getSupportedRampsQuotes,
} from 'src/common/helpers'

// views
import Icon from 'src/views/components/Icon'
import AppLayout from 'src/views/templates/AppLayout'
import AmountInput from './AmountInput'
import WalletInput from './WalletInput'
import PaymentMethodSelect, {
  EMPTY_PAYMENT_METHOD,
} from './PaymentMethodSelect'

// context
import { useAssetContext } from 'src/views/context/AssetContext'

// api
import {
  buyCryptoApi,
  getBuyQuotesApi,
  BuyQuote,
  getDefaultsApi,
} from 'src/web-api-client'
import { useDebounce } from 'src/hooks/use-debounce'
import CurrencySelect from './CurrencySelect'

export interface PaymentMethodOption {
  name: string
  rate: number
  quoteId: string
  paymentMethod: string
  icon: string
  ramp: string
}

enum Status {
  SUBMITTING = 'SUBMITTING',
  FETCHING_QUOTES = 'FETCHING_QUOTES',
  FETCHING_DEFAULTS = 'FETCHING_DEFAULTS',
}

interface Provider {
  ramp: string
  enabled: boolean
}

const Asset: React.FC = () => {
  const { asset } = useAssetContext()
  const navigate = useNavigate()
  const flags = useFlags<{ providers: Provider[] }>()

  const supportedRamps = useMemo(
    () =>
      flags.providers?.length
        ? flags.providers
            .filter(({ enabled }) => enabled)
            .map(({ ramp }) => ramp)
        : [],
    [flags.providers]
  )

  const [amount, setAmount] = useState<number | null>(null)
  const [wallet, setWallet] = useState<string>('')
  const [status, setStatus] = useState<Status | null>(null)
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<
    PaymentMethodOption[]
  >([])
  const [quotes, setQuotes] = useState<BuyQuote[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodOption | null>(null)
  const [currencies, setCurrencies] = useState<string[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<string>('')

  const debouncedAmount = useDebounce(amount, 300)

  const getBuyQuotes = useCallback(
    async (amount: string, currency: string) => {
      if (!asset || !amount || !currency) return

      setStatus(Status.FETCHING_QUOTES)
      setQuotes([])

      try {
        const buyQuotes = await getBuyQuotesApi({
          sourceCurrency: currency.toLowerCase(),
          destinationCurrency: asset.id,
          network: asset.network,
          amount,
          ...(selectedPaymentMethod?.paymentMethod && {
            paymentMethod: selectedPaymentMethod.paymentMethod,
          }),
          ...(wallet && {
            walletAddress: wallet,
          }),
        })

        const supportedRampsQuotes = getSupportedRampsQuotes(
          buyQuotes,
          supportedRamps
        )

        setQuotes(supportedRampsQuotes)

        setPaymentMethodOptions(getPaymentMethodOptions(supportedRampsQuotes))
      } catch (error) {
        console.log(error)
      } finally {
        setStatus(null)
      }
    },
    [asset, selectedPaymentMethod, supportedRamps, wallet]
  )

  const getDefaults = useCallback(async () => {
    setStatus(Status.FETCHING_DEFAULTS)
    setQuotes([])

    try {
      const {
        message: { defaults, recommended },
      } = await getDefaultsApi()

      const currencies = getCurrencies(defaults)

      setCurrencies(currencies)
      setSelectedCurrency(recommended.source)
    } catch (error) {
      console.log(error)
    } finally {
      setStatus(null)
    }
  }, [])

  useEffect(() => {
    getDefaults()
  }, [getDefaults])

  useEffect(() => {
    if (!asset) navigate('/')
  }, [asset, navigate])

  useEffect(() => {
    if (!paymentMethodOptions.length)
      setSelectedPaymentMethod(EMPTY_PAYMENT_METHOD)
  }, [paymentMethodOptions])

  useEffect(() => {
    getBuyQuotes(debouncedAmount, selectedCurrency)
  }, [debouncedAmount, getBuyQuotes, selectedCurrency])

  const limitError = useMemo(() => getLimitErrorMessage(quotes), [quotes])

  const bestRate = useMemo(() => {
    if (limitError) return ''

    return getBestRate(quotes)
  }, [quotes, limitError])

  const hasQuoteError = useMemo(
    () => !limitError && !paymentMethodOptions.length && !!quotes.length,
    [limitError, paymentMethodOptions, quotes]
  )

  const isBuyDisabled = useMemo(
    () => !!(!wallet || limitError || status || !amount || hasQuoteError),
    [limitError, wallet, amount, hasQuoteError, status]
  )

  const buyCrypto = useCallback(
    async (event: React.FormEvent) => {
      if (isBuyDisabled || !asset || !amount) return

      event.stopPropagation()
      event.preventDefault()

      setStatus(Status.SUBMITTING)

      try {
        const response = await buyCryptoApi({
          source: 'usd',
          destination: asset.id,
          amount,
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
        setStatus(null)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isBuyDisabled, asset, selectedPaymentMethod]
  )

  return (
    <AppLayout>
      <Stack alignItems="flex-start">
        <IconButton
          disableRipple
          onClick={() => navigate('/')}
          sx={{
            color: 'text.primary',
            typography: 'subtitle2',
            '&:hover': {
              backgroundColor: 'background.paper',
            },
            '&:focus': {
              backgroundColor: 'background.paper',
            },
          }}
        >
          <Icon icon="eva:arrow-ios-back-fill" />{' '}
          <Typography component="span" variant="body2" sx={{ pr: 1 }}>
            Back
          </Typography>
        </IconButton>
      </Stack>

      <Typography sx={{ mt: 3 }}>
        How much {asset?.name} would you like?
      </Typography>

      <Stack sx={{ px: 2 }}>
        <form onSubmit={buyCrypto}>
          <Stack direction="row" spacing={3}>
            <AmountInput
              onChange={(amount) =>
                setAmount(amount ? +amount.toFixed(2) : null)
              }
              amount={amount}
              validationError={limitError}
            />

            <CurrencySelect
              onChange={setSelectedCurrency}
              currencies={currencies}
              selectedCurrency={selectedCurrency}
            />
          </Stack>

          <Typography align="left" variant="body2" color="text.disabled">
            {status === Status.FETCHING_QUOTES ? (
              <>
                <CircularProgress size={13} sx={{ color: 'text.disabled' }} />{' '}
                Fetching best price...
              </>
            ) : (
              <>
                {hasQuoteError && (
                  <FormHelperText error sx={{ px: 2, textAlign: 'left' }}>
                    No onramp available for these details. Please select a
                    different payment method or crypto.
                  </FormHelperText>
                )}
                {bestRate && (
                  <>
                    1 {asset?.code} ≈ {bestRate.toFixed(2)} USD
                  </>
                )}
              </>
            )}
          </Typography>

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
