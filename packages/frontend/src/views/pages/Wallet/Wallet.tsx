import React from 'react'
import { Stack, Typography, IconButton, Box } from '@mui/material'

import AppLayout from 'src/views/templates/AppLayout'
import Icon from 'src/views/components/Icon'
import { useNavigate } from 'react-router-dom'
import { useAssetContext } from 'src/views/context/AssetContext'

const Wallet: React.FC = () => {
  const navigate = useNavigate()

  const { isLoading } = useAssetContext()

  const actionsButtons = [
    {
      icon: 'add_funds',
      label: 'Add Funds',
      onClick: () => {
        navigate('/assets')
      },
      disabled: isLoading,
    },
    {
      icon: 'send_money',
      label: 'Send Money',
      onClick: () => {
        navigate('/send-money')
      },
      id: 'send_button',
    },
    {
      icon: 'cash_out',
      label: 'Cash Out',
      onClick: () => {},
    },
  ]

  const buttons = [
    {
      icon: 'friends',
      label: 'Friends',
      content: 'My Friends',
      onClick: () => {},
    },
    {
      icon: 'history',
      label: 'History',
      onClick: () => {},
      content: 'Transactions History',
    },
    {
      icon: 'settings',
      label: 'Settings',
      content: 'AccountSettings',
      onClick: () => {},
    },
  ]

  return (
    <AppLayout isWallet>
      <Typography color="#CFCDCD">Total Balance</Typography>

      <Stack alignItems="center" justifyContent="center">
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Icon
            icon="bx:dollar"
            sx={{ width: '56px', height: '66px', color: '#707579' }}
          />
          <Typography sx={{ fontSize: '60px' }}>250</Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          {actionsButtons.map(({ label, onClick, icon, disabled }) => (
            <IconButton
              sx={{ borderRadius: '10px', backgroundColor: '#212121' }}
              key={icon}
              onClick={onClick}
              disabled={disabled}
            >
              <Stack spacing={1} alignItems="center">
                <Box
                  sx={{ width: '32px', height: '24px' }}
                  component="img"
                  src={`icons/${icon}.png`}
                  alt={label}
                ></Box>
                <Typography
                  color="text.primary"
                  sx={{ fontWeight: 700, fontSize: '12px' }}
                >
                  {label}
                </Typography>
              </Stack>
            </IconButton>
          ))}
        </Stack>

        <Stack spacing={2} sx={{ width: '358px', mt: 4 }}>
          {buttons.map(({ label, onClick, icon, content }) => (
            <IconButton
              sx={{
                borderRadius: '10px',
                backgroundColor: '#212121',
                justifyContent: 'flex-start',
                px: 2,
              }}
              key={icon}
              onClick={onClick}
            >
              <Stack>
                <Stack spacing={1} alignItems="center" direction="row">
                  <Box
                    sx={{ width: '22px', height: '22px' }}
                    component="img"
                    src={`icons/${icon}.png`}
                    alt={label}
                  ></Box>
                  <Typography
                    color="text.primary"
                    sx={{ fontWeight: 700, fontSize: '15px' }}
                  >
                    {label}
                  </Typography>
                </Stack>

                <Stack>
                  <Typography color="text.disabled">{content}</Typography>
                </Stack>
              </Stack>
            </IconButton>
          ))}
        </Stack>
      </Stack>
    </AppLayout>
  )
}

export default Wallet
