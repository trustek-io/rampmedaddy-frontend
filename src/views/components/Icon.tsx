import { forwardRef } from 'react'
import { Icon as ReactIcon, IconifyIcon } from '@iconify/react'

import Box, { BoxProps } from '@mui/material/Box'

type IconProps = IconifyIcon | string

interface Props extends BoxProps {
  icon: IconProps
}

const Icon = forwardRef<SVGElement, Props>(
  ({ icon, width = 20, sx, ...other }, ref) => (
    <Box
      ref={ref}
      component={ReactIcon}
      className="component-iconify"
      icon={icon}
      sx={{ width, height: width, ...sx }}
      {...other}
    />
  )
)

export default Icon
