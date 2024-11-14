import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Box, useTheme, useMediaQuery, Button } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Header from "components/Header";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useGetMerchantsQuery, generalApi } from "state/api"

const Edit = ({ selectedRow, setIsEditing }) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const { data, isLoading, refetch } = useGetMerchantsQuery();
  const limitOptionsMap = {
    'BDT': [500000, 1000000, 1500000],
    'INR': [500000, 1000000, 1500000],
    'USD': [5000, 10000, 15000]
  }
  
  const id = selectedRow._id;
  const [merchant, setMerchant] = useState(selectedRow.merchant);
  const [currency, setCurrency] = useState(selectedRow.currency);
  const [mfs, setMfs] = useState(selectedRow.mfs);
  const [accountNumber, setAccountNumber] = useState(selectedRow.accountNumber);
  const [limitAmount, setLimitAmount] = useState(selectedRow.limitAmount);
  const [limitOptions, setLimitOptions] = useState(limitOptionsMap[selectedRow.currency]);
  const [status, setStatus] = useState(selectedRow.status);

  const [merchantError, setMerchantError] = useState('');  
  const [mfsError, setMfsError] = useState('');  
  const [currencyError, setCurrencyError] = useState('');  
  const [accountNumberError, setAccountNumberError] = useState('');
  const [limitAmountError, setLimitAmountError] = useState('');
  const [statusError, setStatusError] = useState('');

  const handleUpdate = e => {
    e.preventDefault();

    if (!merchant) {
      setMerchantError('Please select a merchant name.');
    } else {
      setMerchantError('');
    }

    if (!mfs) {
      setMfsError('Please select a MFS company.');
    } else {
      setMfsError('');
    }

    if (!currency) {
      setCurrencyError('Please select a currency.');
    } else {
      setCurrencyError('');
    }

    if (!accountNumber) {
      setAccountNumberError('Please enter a valid account number.');
    } else {
      setAccountNumberError('');
    }

    if (!limitAmount) {
      setLimitAmountError('Please select a limit amount.');
    } else {
      setLimitAmountError('');
    }

    if (!status) {
      setStatusError('Please select a status.');
    } else {
      setStatusError('');
    }

    if (!merchant || merchantError || !mfs || mfsError || !currency || currencyError || !accountNumber || accountNumberError || !limitAmount || limitAmountError || !status || statusError) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please check the input fields.',
        showConfirmButton: true,
      });
    }

    generalApi.general().updateAgentNumber({ id, merchant, mfs, currency, accountNumber, limitAmount, status })
    .then(res => {
      setIsEditing(false);

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `${selectedRow.merchant}'s account number has been updated.`,
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

  const handleMerchantChange = (event) => {
    setMerchant(event.target.value);
    
    const selectedData = data.find(item => item.name === event.target.value);
    if (selectedData) {
      setCurrency(selectedData.currency);
    }    
    setLimitOptions(limitOptionsMap[selectedData.currency]);
  };

  const handleMfsChange = (event) => {
    setMfs(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleAccountNumberChange = (event) => {
    setAccountNumber(event.target.value);
  };

  const handleLimitAmountChange = (event) => {
    setLimitAmount(event.target.value);
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
        gridRow="span 3"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
      >
        <Header title="" subTitle="Edit Agent Number Details" />
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
              id="merchant"
              label="Merchant"
              style={{width:"100%"}}
              defaultValue=""
              value={merchant}
              InputProps={{
                readOnly: true,
              }}
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
              id="currency"
              label="Currency"
              style={{width:"100%"}}
              defaultValue=""
              value={currency}
              InputProps={{
                readOnly: true,
              }}
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
              id="mfs"
              label="MFS Company"
              style={{width:"100%"}}
              defaultValue=""
              value={mfs}
              InputProps={{
                readOnly: true,
              }}
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
              id="accountNumber"
              label="Account Number"
              style={{width:"100%"}}
              defaultValue=""
              value={accountNumber}
              InputProps={{
                readOnly: true,
              }}
              onChange={handleAccountNumberChange}
              error={!!accountNumberError}
              helperText={accountNumberError}
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
              <InputLabel id="demo-simple-select-label">Limit Amount*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="limitAmount"
                value={limitAmount}
                label="Limit Amount"
                onChange={handleLimitAmountChange}
                error={!!limitAmountError}
                helperText={limitAmountError}
              >
                {limitOptions.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
