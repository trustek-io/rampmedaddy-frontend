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
  getRate,
  getCurrencies,
  getLimitErrorMessage,
  getPaymentMethodOptions,
  getSupportedRampsQuotes,
  isCryptoComProvider,
  getCryptoComLimitErrorMessage,
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
  createCryptoComPaymentApi,
  getCryptoComAssetsApi,
  Asset as AssetI,
} from 'src/web-api-client'
import { useDebounce } from 'src/hooks/use-debounce'
import CurrencySelect from './CurrencySelect'
import MemoInput from './MemoInput'
import { SUPPORTED_CRYPTO_COM_FIATS } from 'src/common/constants'

const CRYPTO_REQUIRING_MEMO = [
  'AXL',
  'ATOM',
  'EOS',
  'HBAR',
  'STX',
  'XLM',
  'XRP',
]

export interface PaymentMethodOption {
  rate: number
  quoteId: string
  paymentMethods: string
  ramp: string
  payout?: number
  paymentMethod?: string
}

enum Status {
  SUBMITTING = 'SUBMITTING',
  FETCHING_QUOTES = 'FETCHING_QUOTES',
  FETCHING_DEFAULTS = 'FETCHING_DEFAULTS',
}

interface Flags {
  providers: {
    ramp: string
    enabled: boolean
  }[]
  cryptoComProvider: boolean
}

const Asset: React.FC = () => {
  const { asset } = useAssetContext()
  const navigate = useNavigate()
  const { providers, cryptoComProvider } = useFlags<Flags>()

  const supportedRamps = useMemo(
    () =>
      providers?.length
        ? providers.filter(({ enabled }) => enabled).map(({ ramp }) => ramp)
        : [],
    [providers]
  )

  const isCryptoComProviderFlagEnabled = useMemo(
    () => cryptoComProvider,
    [cryptoComProvider]
  )

  const [amount, setAmount] = useState<number | null>(null)
  const [wallet, setWallet] = useState<string>('')
  const [memo, setMemo] = useState<string>('')
  const [status, setStatus] = useState<Status | null>(null)
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<
    PaymentMethodOption[]
  >([])
  const [quotes, setQuotes] = useState<BuyQuote[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodOption | null>(null)
  const [currencies, setCurrencies] = useState<string[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [cryptoComAssets, setCryptoComAssets] = useState<AssetI[]>([])

  const debouncedAmount = useDebounce(amount, 300)

  const supportedCryptoComAssets = useMemo(() => {
    const assets: {
      code: string
      network: string
      max: number
      min: number
    }[] = []

    cryptoComAssets.forEach((cryptoComAsset) => {
      cryptoComAsset.support_networks.forEach((network) => {
        assets.push({
          code: cryptoComAsset.currency_symbol,
          network: network.network_name.toLowerCase(),
          max: cryptoComAsset.max_amount_collection.USD,
          min: cryptoComAsset.min_amount_collection.USD,
        })
      })
    })

    return assets
  }, [cryptoComAssets])

  const cryptoComAsset = useMemo(
    () =>
      supportedCryptoComAssets.find(
        (supportedCryptoComAsset) =>
          supportedCryptoComAsset.code === asset?.code
      ),
    [supportedCryptoComAssets, asset]
  )

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

        if (
          isCryptoComProviderFlagEnabled &&
          SUPPORTED_CRYPTO_COM_FIATS.includes(selectedCurrency) &&
          cryptoComAsset &&
          cryptoComAsset.network === asset.network &&
          selectedCurrency === 'USD'
        ) {
          setPaymentMethodOptions((prev) => [
            ...prev,
            {
              rate: 0,
              quoteId: '',
              paymentMethods: '',
              ramp: 'crypto.com',
            },
          ])
        }
      } catch (error) {
        console.log(error)
      } finally {
        setStatus(null)
      }
    },
    [
      asset,
      supportedRamps,
      wallet,
      selectedCurrency,
      isCryptoComProviderFlagEnabled,
      cryptoComAsset,
    ]
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

  const getCryptoComAssets = useCallback(async () => {
    try {
      const assets = await getCryptoComAssetsApi()

      setCryptoComAssets(assets)
    } catch (error) {
      console.log(error)
    } finally {
      setStatus(null)
    }
  }, [])

  const limitError = useMemo(() => {
    if (status === Status.FETCHING_QUOTES || !!paymentMethodOptions.length)
      return ''

    return getLimitErrorMessage(quotes, selectedCurrency)
  }, [quotes, selectedCurrency, paymentMethodOptions, status])

  const cryptoComLimitError = useMemo(() => {
    if (
      isCryptoComProvider(selectedPaymentMethod) &&
      selectedCurrency === 'USD'
    )
      return getCryptoComLimitErrorMessage({
        amount,
        max: cryptoComAsset?.max,
        min: cryptoComAsset?.min,
      })
  }, [selectedCurrency, cryptoComAsset, amount, selectedPaymentMethod])

  const rate = useMemo(() => {
    if (limitError || !amount) return ''

    return selectedPaymentMethod?.ramp
      ? selectedPaymentMethod.rate
      : getRate(quotes)
  }, [quotes, limitError, amount, selectedPaymentMethod])

  const hasQuoteError = useMemo(
    () => !limitError && !paymentMethodOptions.length && !!quotes.length,
    [limitError, paymentMethodOptions, quotes]
  )

  const isMemoRequired = useMemo(
    () => asset && CRYPTO_REQUIRING_MEMO.includes(asset.code),
    [asset]
  )

  const isBuyDisabled = useMemo(
    () =>
      !!(
        !wallet ||
        limitError ||
        status ||
        !amount ||
        hasQuoteError ||
        (isMemoRequired && !memo) ||
        !selectedPaymentMethod?.ramp
      ),
    [
      limitError,
      wallet,
      amount,
      hasQuoteError,
      status,
      isMemoRequired,
      memo,
      selectedPaymentMethod,
    ]
  )

  const buyCrypto = useCallback(
    async (event: React.FormEvent) => {
      if (
        isBuyDisabled ||
        !asset ||
        !amount ||
        (isMemoRequired && !memo) ||
        !selectedPaymentMethod?.paymentMethod
      )
        return

      event.stopPropagation()
      event.preventDefault()

      setStatus(Status.SUBMITTING)

      try {
        const response = await buyCryptoApi({
          source: selectedCurrency.toLowerCase(),
          destination: asset.id,
          amount,
          type: 'buy',
          paymentMethod: selectedPaymentMethod.paymentMethod,
          wallet: {
            address: wallet,
            ...(isMemoRequired && { memo }),
          },
          onramp: selectedPaymentMethod.ramp,
          supportedParams: {
            partnerData: {
              redirectUrl: {
                success: process.env.REACT_APP_REDIRECT_URL ?? '',
                failure: process.env.REACT_APP_REDIRECT_URL ?? '',
              },
            },
          },
          metaData: {
            quoteId: selectedPaymentMethod.quoteId,
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
    [
      isBuyDisabled,
      asset,
      selectedPaymentMethod,
      isMemoRequired,
      amount,
      wallet,
      memo,
      selectedCurrency,
    ]
  )

  useEffect(() => {
    getDefaults()
    getCryptoComAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const createCryptoComPayment = useCallback(
    async (event: React.FormEvent) => {
      if (isBuyDisabled || !asset || !amount || (isMemoRequired && !memo))
        return

      event.stopPropagation()
      event.preventDefault()

      setStatus(Status.SUBMITTING)

      const URL =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/'
          : process.env.REACT_APP_REDIRECT_URL

      try {
        const response = await createCryptoComPaymentApi({
          amount,
          currency: selectedCurrency,
          crypto_currency: asset.code,
          wallet_address: wallet,
          network: asset.network,
          return_url: URL!,
          cancel_url: URL!,
        })

        const redirectUrl = response.payment_url
        if (redirectUrl) window.location.href = redirectUrl
      } catch (error) {
        const errorMessage =
          (error as any).response.data.error.code === 'amount_too_small'
            ? 'Amount too small'
            : 'Something went wrong'
        setError(errorMessage)
      } finally {
        setStatus(null)
      }
    },
    [
      isBuyDisabled,
      asset,
      isMemoRequired,
      amount,
      memo,
      selectedCurrency,
      wallet,
    ]
  )

  const submitApi = isCryptoComProvider(selectedPaymentMethod)
    ? createCryptoComPayment
    : buyCrypto

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

      <Typography sx={{ mt: 3, mb: 1 }}>
        How much {asset?.name} would you like?
      </Typography>

      <Stack sx={{ px: 2 }}>
        <form onSubmit={submitApi}>
          <Stack direction="row" spacing={3}>
            <AmountInput
              onChange={(amount) => {
                setAmount(amount ? +amount.toFixed(2) : null)
                setError('')
              }}
              amount={amount}
              validationError={limitError || cryptoComLimitError || error}
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
                    different payment method, fiat or crypto.
                  </FormHelperText>
                )}
                {!!rate && (
                  <>
                    1 {asset?.code} ≈ {rate.toFixed(2)} {selectedCurrency}
                  </>
                )}
              </>
            )}
          </Typography>

          <WalletInput wallet={wallet} onChange={setWallet} />

          {isMemoRequired && <MemoInput memo={memo} onChange={setMemo} />}

          <PaymentMethodSelect
            amount={debouncedAmount}
            selectedPaymentMethod={selectedPaymentMethod}
            onChange={setSelectedPaymentMethod}
            options={paymentMethodOptions}
            assetCode={asset?.code}
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
