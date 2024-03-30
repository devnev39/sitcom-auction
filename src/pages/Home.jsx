import { Box, Button } from '@mui/material'
import { useNavigate } from 'react-router'

export default function Home() {
  const navigate = useNavigate();
  return (
    <Box sx={{width: "100vw", height: "70vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Button variant='outlined' onClick={() => {
        navigate("/view");
      }}>
        Open Auction View
      </Button>
    </Box>
  )
}
