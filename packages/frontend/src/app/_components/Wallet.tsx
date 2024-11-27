import { Button } from '~/components/ui/button'
import { ArrowUpIcon, Camera, Download, Eye, EyeOff, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CardContent, CardHeader } from '~/components/ui/card'
import { fromStroops, shortStellarAddress } from '~/lib/utils'
import { api } from '~/trpc/react'
import { CreatePasskey } from '~/app/_components/CreatePasskey'
import SendMoneyForm from '~/app/_components/SendMoneyForm'
import ReceiveMoney from '~/app/_components/ReceiveMoney'
import { useContractStore } from '~/hooks/stores/useContractStore'
import LoadingDots from '~/components/icons/loading-dots'
import { Button as MuiButton, Card, Stack } from '@mui/material'
import MiniAppLayout from './MiniAppLayout'

interface WalletProps {
  openUrl: (url: string) => void
  onLogout?: () => void
  openQRScanner?: () => void
  triggerHapticFeedback?: (
    style:
      | 'light'
      | 'medium'
      | 'heavy'
      | 'rigid'
      | 'soft'
      | 'success'
      | 'warning'
      | 'error'
      | 'selectionChanged'
  ) => void
}

export const Wallet: React.FC<WalletProps> = ({
  openUrl,
  onLogout,
  triggerHapticFeedback,
  openQRScanner,
}) => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showSendMoneyForm, setShowSendMoneyForm] = useState(false)
  const { contractId } = useContractStore()

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden((prev) => !prev)
  }

  const { data: balance, isLoading } = api.stellar.getBalance.useQuery(
    { contractAddress: String(contractId) },
    { enabled: !!contractId, refetchInterval: 5000 }
  )

  useEffect(() => {
    setShowSendMoneyForm(false)
    setShowQR(false)
  }, [])

  if (isLoading)
    return (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ height: 'calc(100vh - 25px)', px: '20px' }}
      >
        <LoadingDots color="white" />
      </Stack>
    )

  if (!contractId) {
    return (
      <CreatePasskey
        openUrl={openUrl}
        triggerHapticFeedback={triggerHapticFeedback}
      />
    )
  }

  return (
    <MiniAppLayout isWallet>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ pt: 3 }}
      >
        <Card
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: '20px',
            width: '100%',
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-1">
            {onLogout && (
              <Button
                onClick={onLogout}
                variant="ghost"
                size="icon"
                aria-label="Scan QR Code"
                className="font-semibold text-zinc-500 hover:text-zinc-700"
              >
                Logout
              </Button>
            )}
            {openQRScanner && (
              <Button
                onClick={openQRScanner}
                variant="ghost"
                size="icon"
                aria-label="Scan QR Code"
                className="border-[1px] border-zinc-300 text-zinc-500 hover:text-zinc-700"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-zinc-200 p-6 text-center">
              <h2 className="mb-2 text-sm font-medium text-zinc-500">
                Current Balance {shortStellarAddress(contractId)}
              </h2>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-4xl font-bold text-zinc-900">
                  {isBalanceHidden
                    ? '•••••'
                    : fromStroops(String(balance ?? ''))}{' '}
                  XLM
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleBalanceVisibility}
                  className="text-zinc-500 hover:text-zinc-700"
                >
                  {isBalanceHidden ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {isBalanceHidden ? 'Show balance' : 'Hide balance'}
                  </span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <MuiButton
                sx={{
                  mt: 3,
                  width: '100%',
                  backgroundColor: 'text.secondary',
                  color: '#000',
                  fontWeight: 700,
                  '&:focused': { backgroundColor: 'text.secondary' },
                  '&:hover': {
                    backgroundColor: 'text.secondary',
                    opacity: 0.8,
                  },
                  height: '40px',
                }}
                onClick={() => {
                  setShowQR(false)
                  setShowSendMoneyForm(!showSendMoneyForm)
                }}
              >
                {!showSendMoneyForm ? (
                  <Send className="mr-2 h-5 w-5" />
                ) : (
                  <ArrowUpIcon className="mr-2 h-5 w-5" />
                )}
                {showSendMoneyForm ? 'Hide' : 'Send'}
              </MuiButton>
              <MuiButton
                onClick={() => {
                  setShowSendMoneyForm(false)
                  setShowQR(!showQR)
                }}
                sx={{
                  mt: 3,
                  width: '100%',
                  backgroundColor: 'text.secondary',
                  color: '#000',
                  fontWeight: 700,
                  '&:focused': { backgroundColor: 'text.secondary' },
                  '&:hover': {
                    backgroundColor: 'text.secondary',
                    opacity: 0.8,
                  },
                  height: '40px',
                }}
              >
                {!showQR ? (
                  <Download className="mr-2 h-5 w-5" />
                ) : (
                  <ArrowUpIcon className="mr-2 h-5 w-5" />
                )}
                {showQR ? 'Hide QR' : 'Receive'}
              </MuiButton>
            </div>

            <p className="mt-4 text-center text-xs text-zinc-500">
              Last updated: 2 minutes ago (hardcoded)
            </p>
            {showSendMoneyForm && (
              <SendMoneyForm openUrl={openUrl} openQRScanner={openQRScanner} />
            )}
            {showQR && <ReceiveMoney />}
          </CardContent>
        </Card>
      </Stack>
    </MiniAppLayout>
  )
}
