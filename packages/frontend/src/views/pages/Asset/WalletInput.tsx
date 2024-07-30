import React from 'react'
import { TextField } from '@mui/material'

interface WalletInputProps {
  wallet: string
  onChange: (wallet: string) => void
}

const WalletInput: React.FC<WalletInputProps> = ({ wallet, onChange }) => {
  return (
    <TextField
      placeholder="Receiving wallet"
      fullWidth
      variant="outlined"
      value={wallet}
      onChange={(event) => {
        onChange(event.target.value)
      }}
      inputProps={{ sx: { color: 'text.primary' } }}
      InputProps={{
        sx: {
          backgroundColor: 'background.paper',
        },
      }}
      sx={{
        mt: 2,
        '&.MuiFormLabel-root': { color: 'text.primary' },
        backgroundColor: 'background.paper',
      }}
      InputLabelProps={{
        shrink: true,
        sx: {
          color: 'text.primary',
          '&.Mui-focused': { color: 'text.primary' },
        },
      }}
    />
  )
}

export default WalletInput
