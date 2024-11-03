import React from 'react'

// @mui
import { IconButton, Stack, Typography } from '@mui/material'
import Icon from './Icon'

interface BackButtonProps {
  onClick: VoidFunction
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <Stack alignItems="flex-start">
      <IconButton
        disableRipple
        onClick={onClick}
        sx={{
          color: 'text.secondary',
          typography: 'subtitle2',
          '&:hover': {
            backgroundColor: 'background.paper',
          },
          '&:focus': {
            backgroundColor: 'background.paper',
          },
          mb: 3,
        }}
      >
        <Icon
          icon="eva:arrow-ios-back-fill"
          sx={{ width: '26px', height: '26px' }}
        />{' '}
        <Typography component="span" variant="body2" sx={{ pr: 1 }}>
          Back
        </Typography>
      </IconButton>
    </Stack>
  )
}

export default BackButton
