import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
import { useDebounce } from 'src/hooks/useDebounce'
import { useAssetContext } from 'src/views/context/AssetContext'

interface ContactsProps {
  isOpen: boolean
  onClose: VoidFunction
}

const Contacts: React.FC<ContactsProps> = ({ isOpen, onClose }) => {
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(CONTACTS)
  const [query, setQuery] = useState('')

  const navigate = useNavigate()
  const debouncedQuery = useDebounce(query, 300)
  const { setContact, contact } = useAssetContext()

  useEffect(() => {
    if (!debouncedQuery) {
      setFilteredContacts(CONTACTS)
      return
    }

    const filteredResult = CONTACTS.filter(
      ({ first_name, last_name }) =>
        first_name.toLowerCase().includes(debouncedQuery) ||
        last_name.toLowerCase().includes(debouncedQuery)
    )
    setFilteredContacts(filteredResult)
  }, [debouncedQuery])

  useEffect(() => {
    if (contact) {
      navigate('/send-money')
    }
  }, [contact, navigate])

  return (
    <Drawer
      anchor="bottom"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: '73vh',
          margin: 'auto',
          overflow: 'auto',
        },
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'background.paper',
          zIndex: 1,
          padding: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
          fullWidth
          placeholder="Search"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(event.target.value.toLowerCase())
          }}
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
      </Box>

      <Box
        sx={{
          py: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          flexDirection: 'column',
          gap: 1,
          mx: 2,
          cursor: 'pointer',
        }}
      >
        {filteredContacts.length ? (
          filteredContacts.map(({ last_name, first_name, color }) => (
            <Stack
              spacing={2}
              key={last_name}
              direction="row"
              alignItems="center"
              onClick={() => setContact({ last_name, first_name, color })}
              sx={{ width: '100%' }}
            >
              <Avatar
                sx={{
                  width: '15px',
                  height: '15px',
                  fontSize: '14px',
                  padding: 1,
                  backgroundColor: color,
                }}
              >
                {first_name.charAt(0)}
                {last_name.charAt(0)}
              </Avatar>
              <Typography variant="body2">
                {first_name} {last_name}
              </Typography>
            </Stack>
          ))
        ) : (
          <Typography variant="body2" align="center" sx={{ width: '100%' }}>
            No matches
          </Typography>
        )}
      </Box>
    </Drawer>
  )
}

export default Contacts
