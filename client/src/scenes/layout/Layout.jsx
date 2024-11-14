import React, { useState, useContext, useEffect } from "react";
import { useNavigate  } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { useGetUserQuery } from "state/api";
import { AuthContext } from "../../context/AuthContext";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const userId = useSelector((state) => state.global.userId);
  
  // const { data } = useGetUserQuery(userId);
  
  const navigate = useNavigate();
  const { getAuthUser, isAuthenticated } = useContext(AuthContext);
  const authUser = getAuthUser();
  console.log("authUser", authUser);

  const _isAuthenticated = isAuthenticated();
  console.log("isAuthenticated", _isAuthenticated);

  useEffect(() => {
    if (authUser === null || !_isAuthenticated) {
      navigate("/login");
    }
  }, [authUser, _isAuthenticated, navigate]);

  // console.log(data);

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        user={authUser || {}}
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <Box flexGrow={1}>
        <Navbar
          user={authUser || {}}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
