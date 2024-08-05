import React from 'react'
import { Autocomplete, Box, TextField, Typography } from '@mui/material'

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
    <Autocomplete
      blurOnSelect
      fullWidth
      defaultValue={''}
      value={selectedCurrency}
      options={currencies}
      getOptionLabel={(option) => option}
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
            startAdornment: (
              <Box
                sx={{
                  height: '20px',
                  width: 'auto',
                  borderRadius: '50%',
                  mr: 0.5,
                }}
                component="img"
                alt="Currency icon"
                src={`https://cdn.onramper.com/icons/fiats/${selectedCurrency.toLowerCase()}.svg`}
              />
            ),
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
          <Box
            sx={{
              height: '20px',
              width: 'auto',
              borderRadius: '50%',
              mr: 1,
            }}
            component="img"
            src={`https://cdn.onramper.com/icons/fiats/${currency.toLowerCase()}.svg`}
          />
          {currency}
        </li>
      )}
      onChange={(_e, value) => {
        if (value) {
          onChange(value.toUpperCase())
        }
      }}
      sx={{ flex: 2 }}
      disableClearable
    />
  )
}

export default CurrencySelect
