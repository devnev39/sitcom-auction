import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import GavelIcon from '@mui/icons-material/Gavel';
import { ComponentSelection } from '../context/componentSelection';
import { UserAuth } from '../context/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { UserContext } from '../context/UserContext';
import usersApi from '../api/usersApi';
import { AlertContext } from '../context/AlertContext';

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const { user, googleSignIn, logout } = UserAuth();
  const {appUser, setUser} = React.useContext(UserContext);

  const {OpenAlert} = React.useContext(AlertContext);

  const {currentComponent, setCurrentComponent} = React.useContext(ComponentSelection);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    if (!user) return;
    console.log(user.email);
    usersApi.getUserEmail(user.email).then((resp) => {
      if(resp.exists()) {
        setUser(resp.data());
      } else {
        OpenAlert('User not found !');
        logout();
      }
    })
  }, [OpenAlert, logout, setUser, user]);

  React.useEffect(() => {
    console.log(currentComponent);
  }, [currentComponent])

  return (
    <AppBar position="static" sx={{display: window.location.toString().includes('/view') ? "none" : 'block'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <GavelIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FictionFusion
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={() => setCurrentComponent('Home')}>
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
              {appUser ? <MenuItem onClick={() => setCurrentComponent('Auction')}>
                <Typography textAlign="center">Auction</Typography>
              </MenuItem> : null}
              {appUser ? <MenuItem onClick={() => setCurrentComponent('IAM')}>
                <Typography textAlign="center">IAM</Typography>
              </MenuItem> : null}
              <MenuItem onClick={() => setCurrentComponent('Team View')}>
                <Typography textAlign="center">Team View</Typography>
              </MenuItem>
              <MenuItem onClick={() => setCurrentComponent('About')}>
                <Typography textAlign="center">About</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <GavelIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FictionFusion
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
                onClick={() => setCurrentComponent('Home')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Home
            </Button>
            {appUser ? <Button
                onClick={() => setCurrentComponent('Auction')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Auction
            </Button> : null}
            {appUser ? <Button
                onClick={() => setCurrentComponent('IAM')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                IAM
            </Button> : null}
            <Button
                onClick={() => setCurrentComponent('Team View')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Team View
            </Button>
            <Button
                onClick={() => setCurrentComponent('About')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                About
            </Button>

          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={(event) => {
                if (user) {
                  handleOpenUserMenu(event);
                } else {
                  googleSignIn();
                }
              }} sx={{ p: 0 }}>
                {user ? <AccountCircleIcon /> : <GoogleIcon />}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={logout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
