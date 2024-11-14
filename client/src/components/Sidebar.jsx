import React from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "assets/profie.jpeg";
import { capitalizeRole } from "utilities/CommonUtility";

// logo
import logo from "assets/easypay-logo.png";

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  let navItems = [];
  if (user.role === "merchant" || user.role === "subadmin") {
    navItems = [
      {
        text: "Dashboard",
        icon: <HomeOutlined />,
      },
      {
        text: "Payment",
        icon: <ReceiptLongOutlined />,
      },
      {
        text: "Payout",
        icon: <PointOfSaleOutlined />,
      },
      {
        text: "Setting",
        icon: <PublicOutlined />,
      },
    ];    
  } else if (user.role === "admin") {
    navItems = [
      {
        text: "Dashboard",
        icon: <HomeOutlined />,
      },
      {
        text: "Merchants",
        icon: <Groups2Outlined />,
      },
      {
        text: "Numbers",
        icon: <PublicOutlined />,
      },
      {
        text: "Bkash API",
        icon: <PublicOutlined />,
      },
      {
        text: "Nagad API",
        icon: <PublicOutlined />,
      },
      {
        text: "Payment",
        icon: <ReceiptLongOutlined />,
      },
      {
        text: "Payout",
        icon: <PointOfSaleOutlined />,
      },
      {
        text: "Setting",
        icon: <PublicOutlined />,
      },
    ];
  }

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.grey[200],
              backgroundColor: '#1c2536', // theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <img src={logo} alt="EasyPay" style={{width: '3rem'}}/>
                  <Typography variant="h4" fontWeight="bold" sx={{color: 'white'}}>
                    EasyPay
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase().replaceAll(' ', '_');
                // console.log('lcText', lcText);
                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? "#6366f1" // theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.grey[10]
                            : theme.palette.grey[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.grey[10]
                              : theme.palette.grey[100],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* <Box position="absolute" bottom="2rem">
            <Divider />
            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.name}
                </Typography>
                <Typography
                  fontSize="0.8rem"
                  textTransform="capitalize"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {capitalizeRole(user.role)}
                </Typography>
                
              </Box>
              <SettingsOutlined
                  sx={{
                    color: theme.palette.secondary[300],
                    fontSize: "25px ",
                  }}
                />
            </FlexBetween>
          </Box> */}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
