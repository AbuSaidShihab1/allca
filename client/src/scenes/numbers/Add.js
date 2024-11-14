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

const Add = ({ setIsAdding }) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const { data, isLoading, refetch } = useGetMerchantsQuery();
  const limitOptionsMap = {
    'BDT': [500000, 1000000, 1500000],
    'INR': [500000, 1000000, 1500000],
    'USD': [5000, 10000, 15000]
  }
  
  const [merchant, setMerchant] = useState('');
  const [mfs, setMfs] = useState('');
  const [currency, setCurrency] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [limitOptions, setLimitOptions] = useState([]);

  const [merchantError, setMerchantError] = useState('');  
  const [mfsError, setMfsError] = useState('');  
  const [currencyError, setCurrencyError] = useState('');  
  const [accountNumberError, setAccountNumberError] = useState('');
  const [limitAmountError, setLimitAmountError] = useState('');

  const handleAdd = e => {
    e.preventDefault();

    if (!merchant) {
      setMerchantError('Please enter merchant name.');
    } else {
      setMerchantError('');
    }
    
    if (!mfs) {
      setMfsError('Please enter MFS company name.');
    } else {
      setMfsError('');
    }

    if (!currency) {
      setCurrencyError('Please select a currency.');
    } else {
      setCurrencyError('');
    }

    if (!accountNumber || !/^[0-9]{11}$/.test(accountNumber)) {
      setAccountNumberError('Please enter valid account number.');
    } else {
      setAccountNumberError('');
    }

    if (!limitAmount || !/^\d+$/.test(limitAmount)) {
      setLimitAmountError('Please enter valid limit amount.');
    } else {
      setLimitAmountError('');
    }

    if (!merchant || merchantError || !mfs || mfsError || !currency || currencyError || !accountNumber || accountNumberError || !limitAmount || limitAmountError) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please check the input fields.',
        showConfirmButton: true,
      });
    }

    generalApi.general().addAgentNumber({ merchant, mfs, currency, accountNumber, limitAmount })
    .then(res => {
      
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `${merchant}'s agent number has been added.`,
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
      console.log(err);

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Failed to add(${err.response.data.error}).`,
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
        <Header title="" subTitle="Add Agent Number Details" />
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Merchant*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={merchant}
                label="Merchant"
                onChange={handleMerchantChange}
                error={!!merchantError}
                helperText={merchantError}
              >
                {data && data.map((item) => (
                  <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">MFS company*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={mfs}
                label="MFS"
                onChange={handleMfsChange}
                error={!!mfsError}
                helperText={mfsError}
              >
                <MenuItem value={'bkash'}>Bkash</MenuItem>
                <MenuItem value={'nagad'}>Nagad</MenuItem>
                <MenuItem value={'rocket'}>Rocket</MenuItem>
                {/* <MenuItem value={'upay'}>Upay</MenuItem> */}
              </Select>
            </FormControl>
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
        </Box>        
      </Box> 
      <Button id="submit" variant="contained" onClick={handleAdd}>Add</Button>
      <Button id="cancel" variant="contained" onClick={() => setIsAdding(false)}>Cancel</Button>
    </Box>
  );
};

export default Add;
