import React from 'react'
import {
  Autocomplete,
  Popper,
  PopperProps,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { capitalize } from 'lodash'

import { PaymentMethodOption } from './Asset'

interface PaymentMethodSelectProps {
  options: PaymentMethodOption[]
  selectedPaymentMethod: PaymentMethodOption | null
  onChange: (option: PaymentMethodOption) => void
  amount: string
  assetCode?: string
}

export const EMPTY_PAYMENT_METHOD: PaymentMethodOption = {
  ramp: '',
  rate: 0,
  quoteId: '',
  paymentMethods: '',
}

const CustomPopper = (props: PopperProps) => (
  <Popper style={{ width: '100%' }} placement="top-start" {...props} />
)

const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({
  options,
  selectedPaymentMethod,
  onChange,
  amount,
  assetCode,
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
        defaultValue={selectedPaymentMethod || EMPTY_PAYMENT_METHOD}
        value={selectedPaymentMethod || EMPTY_PAYMENT_METHOD}
        options={options}
        getOptionLabel={(option) => capitalize(option.ramp)}
        isOptionEqualToValue={(option, value) => option.ramp === value.ramp}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Available ramps"
            inputProps={{
              ...params.inputProps,
              sx: { color: 'text.primary' },
              readOnly: true,
            }}
            InputProps={{
              ...params.InputProps,
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
          <Stack
            sx={{ justifyContent: 'space-between !important' }}
            component="li"
            spacing={2}
            direction="row"
            key={option.ramp}
            {...props}
          >
            <Stack spacing={0.5}>
              <Typography
                sx={{ textTransform: 'capitalize', fontSize: '14px' }}
              >
                {option.ramp}
              </Typography>

              <Typography variant="body2" sx={{ fontSize: '10px' }}>
                {option.paymentMethods}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ fontSize: '14px', textAlign: 'end' }}>
              {`${option.payout} ${assetCode}`}
            </Stack>
          </Stack>
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
