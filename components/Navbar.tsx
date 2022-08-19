import * as React from 'react';
import { useRouter } from 'next/router'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { ListItemIcon, ListItemText, SvgIconTypeMap } from '@mui/material';
import Link from 'next/link'

import {userService} from '../services'
interface Page {
  title: string,
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  },
  link: string
}

const pages : Page[] = [
  {
    title: 'Map view',
    icon: PersonOutlineOutlinedIcon,
    link: '/map'
  },
  {
    title: 'List view',
    icon: PhotoOutlinedIcon,
    link: '/listview'
  },
  {
    title: 'Post',
    icon: SendOutlined,
    link: '/picture'
  },
  {
    title: 'Units',
    icon: BusinessCenterOutlinedIcon,
    link: '/'
  },
  {
    title: 'Screen background',
    icon: GroupOutlinedIcon,
    link: '/'
  }
]

// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Navbar = ({ title }: { title: string | undefined}) => {
  const history = useRouter()

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClicked = (path: string) => () => {
    handleCloseNavMenu()
    history.push(path)
  }

  const logoutClicked = () => {
    handleCloseNavMenu()
    userService.logout()
  }

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 1000,
              fontSize: '2rem',
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link href={"/"} passHref={true}>
              <Box component={"img"} src='/logo.png'  sx={{
                cursor: "pointer",
                width: "4rem",
                height: "4.2rem"
              }} />
            </Link>
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
                // background: "linear-gradient(to bottom right, #7d59bd, #5241a0) no-repeat center fixed",
                // backgroundSize: "cover",
              }}
            >
              {pages.map((page) => (
                <Link key={page.title} href={page.link} passHref={true}>
                  <MenuItem
                    sx={{
                      // background: "linear-gradient(to bottom right, #7d59bd, #5241a0) no-repeat center fixed",
                      // backgroundSize: "cover",
                    }}
                  >
                    <ListItemIcon>
                      <page.icon color={ 'primary' } />  
                    </ListItemIcon>
                    <ListItemText>
                      <Typography color={'primary'}>{ page.title }</Typography>
                    </ListItemText>
                  </MenuItem>
                </Link>
                ))}
              <MenuItem
                  onClick={logoutClicked}
                  sx={{
                    // background: "linear-gradient(to bottom right, #7d59bd, #5241a0) no-repeat center fixed",
                    // backgroundSize: "cover",
                  }}
                >
                  <ListItemIcon>
                    <LogoutOutlined color={ 'primary' } />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography color={'primary'}>{ 'logout' }</Typography>
                  </ListItemText>
                </MenuItem>
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
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
            {
              title === undefined || title === '' ? 'SWEN' : title
            }
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'right'} }}>
            {pages.map((page) => (
              <Link key={page.title} href={page.link} passHref={true}>
                <Button
                  // onClick={handleMenuItemClicked(page.link)}
                  sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
                >
                  {`${page.title}`}
                </Button>
              </Link>
            ))}
              <Button
                onClick={logoutClicked}
                sx={{ my: 2, mx: 1, color: 'white', display: 'block' }}
              >
                {`logout`}
              </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;