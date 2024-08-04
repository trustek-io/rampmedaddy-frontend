import React from 'react'
import { TextField } from '@mui/material'

interface AmountInputProps {
  amount: number | null
  onChange: (amount: number | null) => void
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
      type="tel"
      sx={{
        mt: 2,
        '& .MuiFormHelperText-root': {
          color: 'text.primary',
        },
        flex: 2,
        '& input[type=number]': {
          MozAppearance: 'textfield',
        },
        '& input[type=number]::-webkit-outer-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
        '& input[type=number]::-webkit-inner-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
      }}
      value={amount}
      fullWidth
      variant="outlined"
      inputProps={{
        sx: { color: 'text.primary', backgroundColor: 'background.paper' },
      }}
      onChange={(event) => {
        onChange(+event.target.value)
      }}
      error={!!validationError}
      helperText={validationError}
    />
  )
}

export default AmountInput
