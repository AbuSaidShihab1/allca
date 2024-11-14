import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
  Paper,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";

// Custom styles
import useStyles from "./styles";

// Assets
import logo from "./easypay-logo.png";

// Context for authentication
import { AuthContext, AuthProvider } from "../../context/AuthContext";

function Login() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { login, register } = useContext(AuthContext);
  const { isAuthenticated } = new AuthProvider();

  // Local state for form handling and UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeTabId, setActiveTabId] = useState(0);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  // useEffect(() => {
  //   // Check if the user is already authenticated
  //   // Implement this function to check auth state
  //   if (isAuthenticated()) {
  //     console.log(isAuthenticated());
  //     navigate("/dashboard");
  //   }
  // }, [navigate, isAuthenticated]);

  /**
   * Switches between Login and Register tabs
   * @param {number} id - Tab ID to set as active
   */
  const handleChangeTab = (id) => {
    setActiveTabId(id);
    setErrorMessage(null); // Clear error message when switching tabs
  };

  /**
   * Handles the Login functionality
   * Authenticates user and redirects to dashboard on success
   */
  const handleLogin = async () => {
    console.log("Attempting to log in with:", emailValue, passwordValue);
    const isLoggedIn = await login(
      emailValue,
      passwordValue,
      setIsLoading,
      setErrorMessage
    );
    console.log("Login successful:", isLoggedIn);
    if (isLoggedIn) {
      console.log("Navigating to dashboard");
      navigate("/dashboard");
    } else {
      console.log("Login failed");
    }
  };

  /**
   * Handles the Register functionality
   * Registers a new user and switches back to Login tab on success
   */
  const handleRegister = async () => {
    const isRegistered = await register(
      emailValue,
      nameValue,
      passwordValue,
      setIsLoading,
      setErrorMessage
    );
    if (isRegistered) {
      setActiveTabId(0); // Switch to login tab after successful registration
    }
  };

  return (
    <Grid container className={classes.container}>
      {/* Logo Section */}
      <Paper className={classes.logotypeContainer}>
        <img src={logo} alt="EasyPay" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>EassyPay</Typography>
      </Paper>

      {/* Form Section */}
      <Paper className={classes.formContainer}>
        <div className={classes.form}>
          {/* Tabs for Login and Register */}
          <Tabs
            value={activeTabId}
            onChange={(e, id) => handleChangeTab(id)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" classes={{ root: classes.tab }} />
            {/* <Tab disabled label="Register" classes={{ root: classes.tab }} /> */}
          </Tabs>

          {/* Login Tab */}
          {activeTabId === 0 && (
            <>
              {errorMessage && (
                <Fade in={true}>
                  <Typography
                    color="secondary"
                    className={classes.errorMessage}
                  >
                    {errorMessage.toString()}
                  </Typography>
                </Fade>
              )}

              {/* Login Form Fields */}
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                margin="normal"
                label="Email"
                placeholder="Email"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                margin="normal"
                label="Password"
                placeholder="Password"
                type="password"
                fullWidth
              />

              {/* Login Button */}
              <div className={classes.creatingButtonContainer}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      emailValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={handleLogin}
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    className={classes.createAccountButton}
                  >
                    Login
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Register Tab */}
          {activeTabId === 1 && (
            <>
              {errorMessage && (
                <Fade in={true}>
                  <Typography
                    color="secondary"
                    className={classes.errorMessage}
                  >
                    {errorMessage}
                  </Typography>
                </Fade>
              )}

              {/* Register Form Fields */}
              <TextField
                id="name"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                margin="normal"
                label="Name"
                placeholder="Name"
                type="text"
                fullWidth
              />
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                margin="normal"
                label="Email"
                placeholder="Email"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                margin="normal"
                label="Password"
                placeholder="Password"
                type="password"
                fullWidth
              />

              {/* Register Button */}
              <div className={classes.creatingButtonContainer}>
                {isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                  <Button
                    onClick={handleRegister}
                    disabled={
                      emailValue.length === 0 ||
                      passwordValue.length === 0 ||
                      nameValue.length === 0
                    }
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.createAccountButton}
                  >
                    Create your account
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <Typography color="primary" className={classes.copyright}>
          © 2024 EasyPay. All rights reserved.
        </Typography>
      </Paper>
    </Grid>
  );
}

export default Login;