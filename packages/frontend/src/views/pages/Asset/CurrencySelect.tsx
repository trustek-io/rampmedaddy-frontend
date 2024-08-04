import React from 'react'
import { Autocomplete, TextField, Typography } from '@mui/material'

interface CurrencySelectProps {
  currencies: string[]
  onChange: (currency: string) => void
  selectedCurrency: string
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  currencies,
  onChange,
  selectedCurrency,
}) => {
  return (
    <>
      <Autocomplete
        blurOnSelect
        fullWidth
        defaultValue={''}
        value={selectedCurrency}
        options={currencies}
        getOptionLabel={(currency) => currency}
        isOptionEqualToValue={(option, value) => option === value}
        noOptionsText={
          <Typography variant="body2" color="text.disabled">
            No currency
          </Typography>
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Currency"
            inputProps={{
              ...params.inputProps,
              sx: { color: 'text.primary' },
            }}
            InputProps={{
              ...params.InputProps,
              readOnly: true,
              sx: {
                backgroundColor: 'background.paper',
              },
            }}
            sx={{
              '&.MuiFormLabel-root': { color: 'text.primary' },
              backgroundColor: 'background.paper',
              '& .MuiButtonBase-root': {
                color: 'text.disabled',
              },
            }}
            InputLabelProps={{
              sx: {
                color: 'text.primary',
                '&.Mui-focused': { color: 'text.primary' },
              },
            }}
          />
        )}
        renderOption={(props, currency) => (
          <li {...props} key={currency}>
            {currency}
          </li>
        )}
        onChange={(_e, value) => {
          if (value) {
            onChange(value.toUpperCase())
          }
        }}
        disableClearable
        sx={{ flex: 1 }}
      />
    </>
  )
}

export default CurrencySelect
