import React, { useState } from 'react'

import {
  Avatar,
  Box,
  Button,
  Drawer,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CONTACTS, { Contact } from 'src/mock/contacts'

interface ContactsProps {
  isOpen: boolean
  onClose: VoidFunction
}

const getRandomColor = () => {
  const randomValue = () => Math.floor(Math.random() * 156 + 100) // Values between 100 and 255 for softer colors
  return `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`
}

const Contacts: React.FC<ContactsProps> = ({ isOpen, onClose }) => {
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(CONTACTS)

  return (
    <Drawer
      anchor="bottom"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: '70vh',
          margin: 'auto',
          overflow: 'auto',
        },
      }}
    >
      <Button
        onClick={onClose}
        sx={{ alignSelf: 'baseline', fontSize: '12px' }}
      >
        Cancel
      </Button>
      <Typography align="center" variant="body2">
        Search contacts
      </Typography>

      <TextField
        placeholder="Search"
        sx={{
          mx: 2,
          mt: 2,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'defaultColor',
            },
            '&:hover fieldset': {
              borderColor: 'hoverColor',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'text.secondary',
            },
          },
        }}
        inputProps={{
          sx: {
            color: 'text.primary',
            backgroundColor: '#000',
            fontSize: '12px',
            borderRadius: '5px',
          },
        }}
      />
      <Box
        sx={{
          py: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          flexDirection: 'column',
          gap: 1,
          mx: 2,
        }}
      >
        {filteredContacts.map(({ last_name, first_name }) => (
          <Stack
            spacing={2}
            key={last_name}
            direction="row"
            alignItems="center"
            sx={{ cursor: 'pointer' }}
          >
            <Avatar
              sx={{
                width: '15px',
                height: '15px',
                fontSize: '14px',
                padding: 1,
                backgroundColor: getRandomColor(),
              }}
            >
              {first_name.charAt(0)}
              {last_name.charAt(0)}
            </Avatar>
            <Typography variant="body2">
              {first_name} {last_name}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Drawer>
  )
}

export default Contacts
