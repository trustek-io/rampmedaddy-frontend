'use client'
import { useEffect, useState } from 'react'
import { CardContent } from '~/components/ui/card'
import { Fingerprint } from 'lucide-react'
import { api } from '~/trpc/react'
import { useSessionStore } from '~/hooks/stores/useSessionStore'
import LoadingDots from '~/components/icons/loading-dots'
import Image from 'next/image'
import { useContractStore } from '~/hooks/stores/useContractStore'
import { Button, Card, Stack, Typography } from '@mui/material'
import { Wallet } from '../_components/Wallet'

export default function Home() {
  const [isTelegramAppReady, setIsTelegramAppReady] = useState<boolean>(false)

  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)
  const [authFailed, setAuthFailed] = useState<boolean>(false)
  const [biometricAttempted, setBiometricAttempted] = useState<boolean>(false)
  const { user, isAuthenticated, setIsAuthenticated, setUser, clearSession } =
    useSessionStore()
  const { setContractId } = useContractStore()

  const { data: updatedUser } = api.telegram.getUser.useQuery(
    { telegramUserId: String(user?.id) },
    {
      enabled: !!user?.id,
      refetchIntervalInBackground: true,
      refetchInterval: 5000,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    }
  )

  const registerUser = api.telegram.saveUser.useMutation({
    onSuccess: (data) => {
      console.log('User registered successfully:', data)
    },
    onError: (error) => {
      console.error('Error registering user:', error)
    },
  })

  useEffect(() => {
    setContractId('')
  }, [])

  useEffect(() => {
    if (updatedUser?.defaultContractAddress) {
      setContractId(updatedUser?.defaultContractAddress)
    }
  }, [updatedUser, setContractId])

  const loadTelegramScript = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      if (document.getElementById('telegram-web-app-script')) {
        console.log('Telegram WebApp script is already loaded')
        return resolve(false)
      }

      const script = document.createElement('script')
      script.id = 'telegram-web-app-script'
      script.src = 'https://telegram.org/js/telegram-web-app.js'
      script.async = true
      script.onload = () => resolve(true)
      script.onerror = () =>
        reject(new Error('Failed to load Telegram WebApp script'))
      document.head.appendChild(script)
    })
  }

  useEffect(() => {
    console.log('Somple console log to watch out on re-renders :)')
  }, [])

  const triggerHapticFeedback = (
    type:
      | 'light'
      | 'medium'
      | 'heavy'
      | 'rigid'
      | 'soft'
      | 'success'
      | 'warning'
      | 'error'
      | 'selectionChanged'
  ) => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      switch (type) {
        case 'light':
        case 'medium':
        case 'heavy':
        case 'rigid':
        case 'soft':
          window.Telegram.WebApp.HapticFeedback.impactOccurred(type)
          break
        case 'success':
        case 'warning':
        case 'error':
          window.Telegram.WebApp.HapticFeedback.notificationOccurred(type)
          break
        case 'selectionChanged':
          window.Telegram.WebApp.HapticFeedback.selectionChanged()
          break
        default:
          console.warn('Invalid haptic feedback type')
      }
    } else {
      console.error('Haptic feedback is not supported')
    }
  }

  const authenticate = () => {
    setIsAuthenticating(true)

    if (window.Telegram?.WebApp) {
      if (window.Telegram.WebApp.BiometricManager.isInited) {
        requestBiometrics()
      } else {
        window.Telegram.WebApp.BiometricManager.init(() => {
          requestBiometrics()
        })
      }
    } else {
      console.log('Telegram not available')
    }
    setIsAuthenticating(false)
  }

  const requestBiometricAccess = (cb: () => void) => {
    if (!window.Telegram?.WebApp?.BiometricManager.isAccessGranted) {
      window.Telegram.WebApp.BiometricManager.requestAccess(
        {
          reason:
            'We require access to Biometric authentication to keep your Wallet data safe',
        },
        (isAccessGranted) => {
          if (isAccessGranted) {
            console.log('Biometric access granted')
            cb()
          } else {
            if (
              window.confirm(
                'Biometric access denied. Please enable biometric access in settings'
              )
            ) {
              window.Telegram.WebApp.BiometricManager.openSettings()
            }
          }
        }
      )
    }
  }

  const authenticateWithBiometrics = () => {
    window.Telegram?.WebApp?.BiometricManager.authenticate(
      {
        reason: 'Authenticate to access your account',
      },
      (isAuthenticated) => {
        console.log('Biometric authentication result:', isAuthenticated)
        if (isAuthenticated) {
          triggerHapticFeedback('success')
          setIsAuthenticated(true)
        } else {
          setAuthFailed(true)
        }
      }
    )
  }

  const requestBiometrics = () => {
    if (window.Telegram?.WebApp?.BiometricManager.isBiometricAvailable) {
      if (window.Telegram.WebApp.BiometricManager.isAccessGranted) {
        authenticateWithBiometrics()
      } else {
        requestBiometricAccess(authenticateWithBiometrics)
        console.log('Biometric access not granted')
      }
    } else {
      console.log(
        'Biometric not available',
        window.Telegram.WebApp.BiometricManager.isAccessRequested
      )
    }
  }

  useEffect(() => {
    console.log('Simple console log to watch out on re-renders :)')
  }, [])

  useEffect(() => {
    loadTelegramScript()
      .then((requiresAuth) => {
        console.log('Telegram script loaded:', requiresAuth)
        if (requiresAuth) {
          window.Telegram.WebApp.ready()
          window.Telegram.WebApp.expand()

          setIsTelegramAppReady(true)

          const userData = window.Telegram.WebApp.initDataUnsafe?.user
          if (userData) {
            registerUser.mutate({
              telegramId: userData.id,
              username: userData.username ?? '',
              firstName: userData.first_name,
              lastName: userData.last_name ?? '',
            })
            setUser(userData)
          }
          authenticate()
        }
      })
      .catch((err) => {
        console.error('Error loading Telegram script:', err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRetry = () => {
    setAuthFailed(false)
    setBiometricAttempted(false)
    authenticate()
  }

  const openQRScanner = () => {
    if (window?.Telegram?.WebApp) {
      window.Telegram.WebApp.showScanQrPopup({
        text: 'Please scan the QR code',
      })

      // Listen for the event when QR code data is received
      window.Telegram.WebApp.onEvent(
        'qrTextReceived',
        (data: { data?: string }) => {
          if (data?.data) {
            openUrl(data.data)
          } else {
            alert('No data received from QR scan')
            console.error('No data received from QR scan')
          }
        }
      )

      // Listen for when the QR scanner popup is closed
      window.Telegram.WebApp.onEvent('scanQrPopupClosed', () => {
        console.log('QR code scan popup closed')
      })
    } else {
      console.error('Telegram WebApp is not available.')
    }
  }

  const openUrl = (url: string) => {
    return window.Telegram.WebApp.openLink(url)
  }

  const handleLogout = () => {
    clearSession()
    window.Telegram.WebApp.BiometricManager.updateBiometricToken('')
  }

  return (
    <div>
      {isAuthenticated ? (
        <Wallet
          openUrl={openUrl}
          openQRScanner={openQRScanner}
          onLogout={handleLogout}
          triggerHapticFeedback={triggerHapticFeedback}
        />
      ) : (
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
            <CardContent className="space-y-8 p-8">
              <div className="space-y-2 text-center">
                <Image
                  className="mx-auto my-0"
                  src={'/logo.png'}
                  alt="RampMeDaddy Logo"
                  width={65}
                  height={65}
                />
                <Typography variant="h1" fontSize={20}>
                  Secure Access
                </Typography>
                <p className="text-sm text-zinc-500">
                  Authenticate to view your wallet
                </p>
              </div>

              {!isAuthenticated && (
                <Button
                  onClick={handleRetry}
                  color="primary"
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
                  <Fingerprint className="mr-2 h-6 w-6" />
                  {isAuthenticating ? (
                    <LoadingDots color="black" />
                  ) : biometricAttempted ? (
                    'Retry'
                  ) : (
                    'Authenticate'
                  )}
                </Button>
              )}
              {authFailed && (
                <span className="">
                  <p className="text-sm text-red-500">
                    Biometrics Auth failed. Please try again.
                  </p>
                </span>
              )}

              <div className="rounded-lg bg-zinc-200 p-4 text-sm">
                {user && (
                  <>
                    <p className="font-mono text-zinc-700">
                      <span className="text-zinc-400">User:</span>{' '}
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="font-mono text-zinc-700">
                      <span className="text-zinc-400">Username:</span>{' '}
                      {user?.username}
                    </p>
                  </>
                )}
                {!isTelegramAppReady && (
                  <div className="flex items-center justify-center">
                    <LoadingDots />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Stack>
      )}
    </div>
  )
}
