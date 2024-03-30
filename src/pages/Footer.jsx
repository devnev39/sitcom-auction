import { Box, Card, Divider, IconButton, Typography } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
  return (
    <Box marginTop={'5rem'} alignItems={'center'} width={'100%'} display={'flex'} justifyContent={'space-between'}>
        <Box marginLeft={'2rem'}>
          <Typography>
            Developed and maintained by @devnev39
          </Typography>
          
        </Box>
        <Box display={'flex'} justifyContent={'center'} marginRight={'2rem'}>          
          <Card
          variant="outlined"
          sx={{
            display: 'flex',
            color: 'text.secondary',
            '& svg': {
              m: 1,
            },
            '& hr': {
              mx: 0.5,
            },
          }}
        >
            <IconButton size='small' onClick={() => window.open('https://www.github.com/devnev39')}>
              <GitHubIcon />  
            </IconButton>
            <Divider orientation="vertical" variant="middle" flexItem />
            <IconButton size='small' onClick={() => window.open('https://www.linkedin.com/in/bhuvanesh-bonde-58793615b')}>
              <LinkedInIcon />
            </IconButton>
          </Card>
        </Box>
      </Box>
  )
}
