import React from 'react'
import { TextField } from '@mui/material'

interface MemoInputProps {
  memo: string
  onChange: (walmemolet: string) => void
}

const MemoInput: React.FC<MemoInputProps> = ({ memo, onChange }) => {
  return (
    <TextField
      placeholder="Memo"
      fullWidth
      variant="outlined"
      value={memo}
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

export default MemoInput
