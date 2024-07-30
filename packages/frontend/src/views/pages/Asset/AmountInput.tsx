import React from 'react'
import { Box, InputAdornment, TextField } from '@mui/material'

import { formatNumber } from 'src/common/helpers'

interface AmountInputProps {
  amount: string
  onChange: (amount: string) => void
  validationError?: string
}

const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  onChange,
  validationError,
}) => {
  return (
    <TextField
      placeholder="0.00"
      sx={{
        mt: 2,
        '& .MuiFormHelperText-root': {
          color: 'text.primary',
        },
      }}
      value={formatNumber(amount)}
      fullWidth
      variant="outlined"
      type="text"
      inputProps={{ sx: { color: 'text.primary' } }}
      onChange={(event) => {
        if (event.target.value.includes('.')) {
          const [amount, decimalValue] = event.target.value
            .replaceAll(',', '')
            .split('.')

          onChange(`${amount}.${decimalValue.slice(0, 2)}`)

          return
        }

        onChange(event.target.value.replaceAll(',', ''))
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Box
              sx={{
                typography: 'subtitle2',
                py: '3px',
                px: '8px',
                borderRadius: '6px',
                fontWeight: 600,
                mr: 2,
                color: 'text.primary',
                fontSize: '22px',
              }}
            >
              | USD
            </Box>
          </InputAdornment>
        ),
        sx: {
          p: 0.5,
          mt: 1,
          backgroundColor: 'background.paper',
        },
      }}
      error={!!validationError}
      helperText={validationError}
    />
  )
}

export default AmountInput
