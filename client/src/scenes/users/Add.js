import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Box, useTheme, useMediaQuery, Button } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Header from "components/Header";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { generalApi } from "state/api"

const Add = ({ setIsAdding }) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');

  
  const [nameError, setNameError] = useState('');  
  const [emailError, setEmailError] = useState('');  
  const [passwordError, setPasswordError] = useState('');
  const [authCodeError, setAuthCodeError] = useState('');

  const handleAdd = e => {
    e.preventDefault();

    if (!name) {
      setNameError('Please enter user name.');
    } else {
      setNameError('');
    }
    
    if (!email) {
      setEmailError('Email is required.');
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email address.');
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Please enter password.');
    } else {
      setPasswordError('');
    }

    if (!authCode) {
      setAuthCodeError('Please enter authentication code.');
    } else {
      setAuthCodeError('');
    }
    
    if (!name || nameError || !email || emailError || !password || passwordError || !authCode || authCodeError) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please check the input fields.',
        showConfirmButton: true,
      });
    }

    generalApi.general().addUser({ name, email, password, authCode, websiteUrl: "", currency: "", role: "subadmin" })
    .then(res => {
      
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `${name}'s data has been added.`,
          showConfirmButton: false,
          timer: 1500,
        });

        setIsAdding(false);
      } else {
        console.log(res.data.error);

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: `Failed to add(${res.data.error}).`,
          showConfirmButton: true,
        });
      }
      
    })
    .catch(err => {

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to add.',
        showConfirmButton: true,
      });
    });
    
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleAuthCodeChange = (event) => {
    setAuthCode(event.target.value);
  };

  return (
    <Box
      mt="20px"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="60px"
      gap="20px"
      sx={{
        "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
      }}
    >
      <Box
        gridColumn="span 12"
        gridRow="span 3"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
      >
        <Header title="" subTitle="Add User Details" />
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="80px"
        >
          <Box
            width="100%"
            gridColumn="span 6"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="name"
              label="User Name"
              style={{width:"100%"}}
              defaultValue=""
              value={name}
              onChange={handleNameChange}
              error={!!nameError}
              helperText={nameError}
            />
          </Box>  
          <Box
            width="100%"
            gridColumn="span 6"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="email"
              label="User Email"
              style={{width:"100%"}}
              defaultValue=""
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
            />
          </Box>  
          <Box
            width="100%"
            gridColumn="span 6"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="password"
              label="User Password"
              style={{width:"100%"}}
              defaultValue=""
              value={password}
              onChange={handlePasswordChange}
              error={!!passwordError}
              helperText={passwordError}
            />
          </Box>  
          <Box
            width="100%"
            gridColumn="span 6"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="authCode"
              label="Auth Code"
              style={{width:"100%"}}
              defaultValue=""
              value={authCode}
              onChange={handleAuthCodeChange}
              error={!!authCodeError}
              helperText={authCodeError}
            />
          </Box>          
        </Box>        
      </Box> 
      <Button id="submit" variant="contained" onClick={handleAdd}>Add</Button>
      <Button id="cancel" variant="contained" onClick={() => setIsAdding(false)}>Cancel</Button>
    </Box>
  );
};

export default Add;
