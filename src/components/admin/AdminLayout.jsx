import React, { useContext, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  Build as BuildIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  MenuBook as LearningIcon,
  Link as LinkIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Apps as ProjectsIcon
} from '@mui/icons-material';
import styled from 'styled-components';

const drawerWidth = 240;

const Main = styled(Box)`
  flex-grow: 1;
  padding: 24px;
  background-color: #1C1C27;
  min-height: 100vh;
  color: white;
  margin-left: ${({ open }) => (open ? `${drawerWidth}px` : '0')};
  transition: margin-left 0.3s ease;
  @media (max-width: 900px) {
    margin-left: 0;
  }
`;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Profile', icon: <PersonIcon />, path: '/admin/profile' },
  { text: 'Skills', icon: <BuildIcon />, path: '/admin/skills' },
  { text: 'Projects', icon: <ProjectsIcon />, path: '/admin/projects' },
  { text: 'Experience', icon: <WorkIcon />, path: '/admin/experience' },
  { text: 'Education', icon: <SchoolIcon />, path: '/admin/education' },
  { text: 'Learning', icon: <LearningIcon />, path: '/admin/learning' },
  { text: 'Social Links', icon: <LinkIcon />, path: '/admin/social' }
];

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const handleDrawerToggle = () => {
    if (window.innerWidth < 900) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const drawer = (
    <Box sx={{ bgcolor: '#22223b', height: '100%', color: 'white' }}>
      <Toolbar>
        <Typography variant="h6" color="#854CE6" fontWeight="bold">
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => {
              navigate(item.path);
              if (window.innerWidth < 900) setMobileOpen(false);
            }}
            sx={{
              bgcolor: location.pathname === item.path ? 'rgba(133, 76, 230, 0.2)' : 'transparent',
              borderRight: location.pathname === item.path ? '4px solid #854CE6' : '4px solid transparent',
              '&:hover': {
                bgcolor: 'rgba(133, 76, 230, 0.1)'
              }
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? '#854CE6' : 'white' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#1C1C27', borderBottom: '1px solid #333' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Portfolio CMS
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            View Site
          </Button>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="persistent"
        open={desktopOpen}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #333', top: '64px' },
        }}
      >
        {drawer}
      </Drawer>

      <Main open={desktopOpen} sx={{ pt: 10 }}>
        <Outlet />
      </Main>
    </Box>
  );
};

export default AdminLayout;
