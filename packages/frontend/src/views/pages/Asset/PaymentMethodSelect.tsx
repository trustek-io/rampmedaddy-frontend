import React from 'react'
import {
  Autocomplete,
  Box,
  Popper,
  PopperProps,
  TextField,
  Typography,
} from '@mui/material'

import { PaymentMethodOption } from './Asset'

interface PaymentMethodSelectProps {
  options: PaymentMethodOption[]
  selectedPaymentMethod: PaymentMethodOption | null
  onChange: (option: PaymentMethodOption) => void
  amount: string
}

const CustomPopper = (props: PopperProps) => (
  <Popper style={{ zIndex: 1300 }} placement="top-start" {...props} />
)

const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({
  options,
  selectedPaymentMethod,
  onChange,
  amount,
}) => {
  return (
    <>
      <Typography
        variant="body2"
        align="left"
        sx={{ color: 'text.disabled', mt: 2, pl: 1.5 }}
      >
        Pay using
      </Typography>

      <Autocomplete
        blurOnSelect
        disabled={!amount || !options.length}
        fullWidth
        defaultValue={
          selectedPaymentMethod || {
            name: '',
            ramp: '',
            rate: 0,
            limits: { max: 0, min: 0 },
            quoteId: '',
            paymentMethod: '',
            icon: '',
          }
        }
        value={
          selectedPaymentMethod || {
            name: '',
            ramp: '',
            rate: 0,
            limits: { max: 0, min: 0 },
            quoteId: '',
            paymentMethod: '',
            icon: '',
          }
        }
        options={options}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) =>
          option.paymentMethod === value.paymentMethod
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Payment method"
            inputProps={{
              ...params.inputProps,
              sx: { color: 'text.primary' },
            }}
            InputProps={{
              ...params.InputProps,
              readOnly: true,
              startAdornment: selectedPaymentMethod?.icon ? (
                <Box
                  component="img"
                  src={selectedPaymentMethod.icon}
                  alt={selectedPaymentMethod.name}
                  sx={{ marginRight: 1, height: 24, width: 24 }}
                />
              ) : null,
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
        renderOption={(props, option) => (
          <li {...props} key={option.name}>
            <Box
              component="img"
              src={option.icon}
              sx={{
                marginRight: 2,
                height: 24,
                width: 24,
              }}
            />
            {option.name}
          </li>
        )}
        onChange={(_e, value) => {
          if (value) {
            onChange(value)
          }
        }}
        PopperComponent={CustomPopper}
        disableClearable
      />
    </>
  )
}

export default PaymentMethodSelect
