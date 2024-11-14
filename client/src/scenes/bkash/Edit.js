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

const Edit = ({ selectedRow, setIsEditing }) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const id = selectedRow._id;
  const [accountName, setAccountName] = useState(selectedRow.accountName);
  const [accountNumber, setAccountNumber] = useState(selectedRow.accountNumber);
  const [username, setUsername] = useState(selectedRow.username);
  const [password, setPassword] = useState(selectedRow.password);
  const [appKey, setAppKey] = useState(selectedRow.appKey);
  const [appSecretKey, setAppSecretKey] = useState(selectedRow.appSecretKey);
  const [status, setStatus] = useState(selectedRow.status);

  const [accountNameError, setAccountNameError] = useState('');  
  const [accountNumberError, setAccountNumberError] = useState('');  
  const [usernameError, setUsernameError] = useState('');  
  const [passwordError, setPasswordError] = useState('');  
  const [appKeyError, setAppKeyError] = useState('');
  const [appSecretKeyError, setAppSecretKeyError] = useState('');
  const [statusError, setStatusError] = useState('');

  const handleUpdate = e => {
    e.preventDefault();

    if (!accountName) {
      setAccountNameError('Please enter API account name.');
    } else {
      setAccountNameError('');
    }
    
    if (!accountNumber) {
      setAccountNumberError('Please enter API account number.');
    } else {
      setAccountNumberError('');
    }
    
    if (!username) {
      setUsernameError('Please enter API username.');
    } else {
      setUsernameError('');
    }

    if (!password) {
      setPasswordError('Please enter API password.');
    } else {
      setPasswordError('');
    }

    if (!appKey) {
      setAppKeyError('Please enter API app key.');
    } else {
      setAppKeyError('');
    }

    if (!appSecretKey) {
      setAppSecretKeyError('Please enter API app secret key.');
    } else {
      setAppSecretKeyError('');
    }

    if (!status) {
      setStatusError('Please select a status.');
    } else {
      setStatusError('');
    }

    if (!accountName || accountNameError || !accountNumber || accountNumberError || !username || usernameError || !password || passwordError || !appKey || appKeyError || !appSecretKey || appSecretKeyError || !status || statusError) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please check the input fields.',
        showConfirmButton: true,
      });
    }

    generalApi.general().updateApiAccountBkash({ id, accountName, accountNumber, username, password, appKey, appSecretKey, status })
    .then(res => {
      setIsEditing(false);

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `${selectedRow.accountName}'s API account has been updated.`,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.log(res.data.error);

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to update.',
          showConfirmButton: true,
        });
      }
      
    })
    .catch(err => {
      setIsEditing(false);
      console.log(err);

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update.',
        showConfirmButton: true,
      });
    });
    
  };

  const handleAccountNameChange = (event) => {
    setAccountName(event.target.value);
  };

  const handleAccountNumberChange = (event) => {
    setAccountNumber(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleAppKeyChange = (event) => {
    setAppKey(event.target.value);
  };

  const handleAppSecretKeyChange = (event) => {
    setAppSecretKey(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
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
        gridRow="span 5"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
      >
        <Header title="" subTitle="Edit Bkash API Account Details" />
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
              id="accountName"
              label="Account Name"
              style={{width:"100%"}}
              defaultValue=""
              value={accountName}
              onChange={handleAccountNameChange}
              error={!!accountNameError}
              helperText={accountNameError}
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
              id="accountNumber"
              label="Account Number"
              style={{width:"100%"}}
              defaultValue=""
              value={accountNumber}
              onChange={handleAccountNumberChange}
              error={!!accountNumberError}
              helperText={accountNumberError}
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
              id="username"
              label="Username"
              style={{width:"100%"}}
              defaultValue=""
              value={username}
              onChange={handleUsernameChange}
              error={!!usernameError}
              helperText={usernameError}
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
              label="Password"
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
              id="appKey"
              label="App Key"
              style={{width:"100%"}}
              defaultValue=""
              value={appKey}
              onChange={handleAppKeyChange}
              error={!!appKeyError}
              helperText={appKeyError}
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
              id="appSecretKey"
              label="App Secret Key"
              style={{width:"100%"}}
              defaultValue=""
              value={appSecretKey}
              onChange={handleAppSecretKeyChange}
              error={!!appSecretKeyError}
              helperText={appSecretKeyError}
            />
          </Box>
          <Box
            width="100%"
            gridColumn="span 3"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="Status"
                onChange={handleStatusChange}
                error={!!statusError}
                helperText={statusError}
              >
                <MenuItem value={'activated'}>activated</MenuItem>
                <MenuItem value={'deactivated'}>deactivated</MenuItem>
              </Select>
            </FormControl>
          </Box>          
        </Box>        
      </Box> 
      <Button id="submit" variant="contained" onClick={handleUpdate}>Update</Button>
      <Button id="cancel" variant="contained" onClick={() => setIsEditing(false)}>Cancel</Button>
    </Box>
    
  );
};

export default Edit;
