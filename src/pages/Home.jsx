import { Box, Typography } from '@mui/material'
import React from 'react'

export default function Home() {
  return (
    <Box sx={{width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Typography variant='h3'>
        Fiction Fusion
      </Typography>
    </Box>
  )
}
