import React, { useEffect, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import AppLayout from 'src/views/templates/AppLayout'

const ProgressSteps = () => {
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStep(1), 1000),
      setTimeout(() => setActiveStep(2), 2000),
      setTimeout(() => setActiveStep(3), 3000),
    ]

    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [])

  useEffect(() => {
    if (activeStep === 3) {
      setTimeout(() => {
        navigate('/')
      }, 1000)
    }
  }, [activeStep, navigate])

  return (
    <AppLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#888',
          mt: 6,
        }}
      >
        <Box>
          <Box sx={stepStyle}>
            <Box
              sx={{
                ...circleStyle,
                backgroundColor: activeStep >= 1 ? 'text.secondary' : 'white',
              }}
            />
            <Stack>
              <Typography sx={labelStyle}> Submitting transaction </Typography>
              <Typography
                sx={{
                  ...statusStyle,
                  color: activeStep >= 1 ? 'text.secondary' : '#888',
                }}
              >
                {activeStep >= 1 ? 'Confirmed' : 'Pending'}
              </Typography>
            </Stack>
          </Box>

          <Box sx={stepStyle}>
            <Box
              sx={{
                ...circleStyle,
                backgroundColor: activeStep >= 2 ? 'text.secondary' : 'white',
              }}
            />
            <Stack>
              <Typography sx={labelStyle}> Sending transaction </Typography>
              <Typography
                sx={{
                  ...statusStyle,
                  color: activeStep >= 2 ? 'text.secondary' : '#888',
                }}
              >
                {activeStep >= 2 ? 'Processing' : 'Pending'}
              </Typography>
            </Stack>
          </Box>

          <Box sx={stepStyle}>
            <Box
              sx={{
                ...circleStyle,
                backgroundColor: activeStep >= 3 ? 'text.secondary' : 'white',
              }}
            />

            <Stack>
              <Typography sx={labelStyle}> Transaction received </Typography>
              <Typography
                sx={{
                  ...statusStyle,
                  color: activeStep >= 3 ? 'text.secondary' : '#888',
                }}
              >
                {activeStep >= 3 ? 'Received' : 'Pending'}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  )
}

const stepStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  mb: 5,
  position: 'relative',
}

const circleStyle = {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  mr: 2,
}

const labelStyle = {
  fontSize: '14px',
  flexGrow: 1,
  color: 'text.disabled',
  textAlign: 'left',
}

const statusStyle = {
  fontSize: '14px',
  color: '#888',
  textAlign: 'left',
}

export default ProgressSteps
