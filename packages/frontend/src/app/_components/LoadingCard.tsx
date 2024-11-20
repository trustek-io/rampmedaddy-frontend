import { CardContent } from '~/components/ui/card'
import LoadingDots from '~/components/icons/loading-dots'
import { Card } from '@mui/material'
import Image from 'next/image'

const LoadingCard = () => {
  return (
    <div className="flex min-h-[95vh] items-center justify-center">
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
              width={150}
              height={150}
            />
            <h1 className="flex items-center justify-center text-2xl font-semibold ">
              Secure Access
            </h1>
            <p className="text-sm text-zinc-500">
              Verifying secure session for enhanced security
            </p>
          </div>

          <div className="items-center justify-center rounded-lg bg-zinc-200 p-4 text-sm">
            <LoadingDots />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoadingCard
