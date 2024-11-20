'use client'
import { type FC, useState } from 'react'
import { api } from '~/trpc/react'
import { useSearchParams } from 'next/navigation'
import LoadingDots from '~/components/icons/loading-dots'
import { useCreateStellarPasskey } from '~/hooks/useCreateStellarPasskey'
import { env } from '~/env'
import Image from 'next/image'
import { AlertCircle, Fingerprint } from 'lucide-react'
import LoadingCard from '~/app/_components/LoadingCard'
import { CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { ClientTRPCErrorHandler } from '~/lib/utils'
import toast from 'react-hot-toast'
import { useSigner } from '~/hooks/useSigner'
import { Button, Card, Stack } from '@mui/material'

const NewPassKey: FC = () => {
  const [creatingPasskey, setCreatingPasskey] = useState(false)
  const [connectingPasskey, setConnectingPasskey] = useState(false)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('sessionId')

  const session = api.telegram.getSession.useQuery(
    {
      sessionId: sessionId!,
    },
    {
      enabled: !!sessionId,
    }
  )

  const { mutateAsync: linkContractIdToSession } =
    api.telegram.updateSession.useMutation({
      onSuccess: () => toast.success('Session updated'),
      onError: ClientTRPCErrorHandler,
    })

  const { create, loading: loadingPasskeySession } = useCreateStellarPasskey(
    session.data?.user
  )

  const { connect } = useSigner()

  if (session.isLoading || !session?.data?.user) {
    return <LoadingCard />
  }

  const createPasskey = async () => {
    setCreatingPasskey(true)
    const contractId = await create().catch((err) => {
      setCreatingPasskey(false)
      throw err
    })
    await linkContractIdToSession({
      sessionId: sessionId!,
      contractAddressId: contractId,
    })
    setCreatingPasskey(false)
    window.location.href = env.NEXT_PUBLIC_TELEGRAM_BOT_URL
  }

  const connectPasskey = async () => {
    setConnectingPasskey(true)
    const contractId = await connect().catch((err) => {
      setConnectingPasskey(false)
      throw err
    })
    await linkContractIdToSession({
      sessionId: sessionId!,
      contractAddressId: contractId,
    })
    setConnectingPasskey(false)
    window.location.href = env.NEXT_PUBLIC_TELEGRAM_BOT_URL
  }

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: 'calc(100vh - 25px)', px: '20px' }}
    >
      <Card
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: '20px',
          width: '100%',
        }}
      >
        <CardHeader className="flex items-center justify-center space-y-1">
          <Image
            className="mx-auto my-0"
            src={'/logo.png'}
            alt="RampMeDaddy Logo"
            width={150}
            height={150}
          />

          <CardTitle className="text-center text-2xl font-semibold ">
            Passkey Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 rounded-lg bg-zinc-200 p-4">
            <h2 className="text-sm font-semibold text-zinc-700">
              Passkey details
            </h2>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-zinc-500">Host:</span>
                <span className="font-mono text-zinc-700">
                  {env.NEXT_PUBLIC_APP_URL}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-zinc-500">Telegram username</span>
                <span className="font-mono text-zinc-700">
                  {session?.data?.user?.telegramUsername}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 rounded-lg bg-zinc-50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-zinc-500" />
            <p className="text-xs text-zinc-600">
              By creating a passkey, you will be able to securely sign
              transactions using your Telegram account and your device&apos;s
              biometrics.
            </p>
          </div>

          <Button
            disabled={
              loadingPasskeySession || creatingPasskey || connectingPasskey
            }
            onClick={createPasskey}
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
            {loadingPasskeySession || creatingPasskey ? (
              <>
                <LoadingDots color="black" />
              </>
            ) : (
              <>
                <Fingerprint className="mr-2 h-6 w-6" />
                Create New Passkey
              </>
            )}
          </Button>

          <Button
            disabled={
              loadingPasskeySession || creatingPasskey || connectingPasskey
            }
            onClick={connectPasskey}
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
            {connectingPasskey ? (
              <>
                <LoadingDots color="black" />
              </>
            ) : (
              <>
                <Fingerprint className="mr-2 h-6 w-6" />
                Connect Passkey
              </>
            )}
          </Button>

          <p className="text-center text-xs text-zinc-500">
            By signing, you agree to the terms of service and privacy policy.
          </p>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default NewPassKey
