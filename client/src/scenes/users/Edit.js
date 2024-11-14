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
  const [name, setName] = useState(selectedRow.name);
  const [authCode, setAuthCode] = useState(selectedRow.authCode);
  const [status, setStatus] = useState(selectedRow.status);

  
  const [nameError, setNameError] = useState('');  
  const [authCodeError, setAuthCodeError] = useState(''); 
  const [statusError, setStatusError] = useState('');

  const handleUpdate = e => {
    e.preventDefault();

    if (!name) {
      setNameError('Please enter user name.');
    } else {
      setNameError('');
    }

    if (!authCode) {
      setAuthCodeError('Please enter auth code.');
    } else {
      setAuthCodeError('');
    }

    if (!status) {
      setStatusError('Please select status.');
    } else {
      setStatusError('');
    }

    if (!name || nameError || !authCode || authCodeError || !status || statusError) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please check the input fields.',
        showConfirmButton: true,
      });
    }

    generalApi.general().updateUser({ id, name, authCode, websiteUrl: "", currency: "", apiKey: "", status })
    .then(res => {
      setIsEditing(false);

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `${selectedRow.name}'s data has been updated.`,
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

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAuthCodeChange = (event) => {
    setAuthCode(event.target.value);
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
        gridRow="span 2"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
      >
        <Header title="" subTitle="Edit Ussers Details" />
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="80px"
        >
          <Box
            width="100%"
            gridColumn="span 4"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="name"
              label="Merchant Name"
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
            gridColumn="span 4"
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
          <Box
            width="100%"
            gridColumn="span 4"
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
