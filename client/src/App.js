import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import { useMemo, useContext } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import { AuthProvider } from "./context/AuthContext";
// context
// import { AuthContext } from "./context/AuthContext";
import {
  Dashboard,
  Layout,
  Products,
  Users,
  Merchants,
  Numbers,
  Bkash,
  Payment,
  Payout,
  Geography,
  Overview,
  Daily,
  Monthly,
  Breakdown,
  Admin,
  Performance,
  Pointofsale,
  Profile,
  Checkout,
  Checkoutdemo,
  Callbackbkash,
  Login,
  PageNotFound
} from "scenes";
import Nagad from "scenes/nagad/Nagad";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route element={<Layout />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/users" element={<Users />} />
                <Route path="/merchants" element={<Merchants />} />
                <Route path="/numbers" element={<Numbers />} />
                <Route path="/bkash_api" element={<Bkash />} />
                <Route path="/nagad_api" element={<Nagad />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payout" element={<Payout />} />
                <Route path="/point_of_sale" element={<Pointofsale />} />
                <Route path="/setting" element={<Profile />} />
                <Route path="/geography" element={<Geography />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/daily" element={<Daily />} />
                <Route path="/monthly" element={<Monthly />} />
                <Route path="/breakdown" element={<Breakdown />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/performance" element={<Performance />} />
              </Route>
              <Route path="/checkout/:paymentId" element={<Checkout />} />
              <Route path="/depositdemo" element={<Checkoutdemo />} />
              <Route path="/callbackbkash" element={<Callbackbkash />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
