import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { Box, useTheme, useMediaQuery, Button } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Header from "components/Header";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AuthContext } from "../../context/AuthContext";
import {  useGetMerchantsQuery, paymentApi } from "state/api"

const Add = ({ setIsAdding }) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();
  
  const { data, isLoading, refetch } = useGetMerchantsQuery();

  const [merchant, setMerchant] = useState('');
  const [orderId, setOrderId] = useState('');
  const [payeeId, setPayeeId] = useState('');
  const [payeeAccount, setPayeeAccount] = useState('');
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');

  
  const [merchantError, setMerchantError] = useState('');  
  const [orderIdError, setOrderIdError] = useState('');  
  const [payeeIdError, setPayeeIdError] = useState('');  
  const [payeeAccountError, setPayeeAccountError] = useState('');
  const [providerError, setProviderError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [currencyError, setCurrencyError] = useState('');  

  const handleAdd = e => {
    e.preventDefault();

    if (!merchant) {
      setMerchantError('Please select a merchant.');
    } else {
      setMerchantError('');
    }

    if (!orderId) {
      setOrderIdError('Please enter order ID.');
    } else {
      setOrderIdError('');
    }
    
    if (!payeeId) {
      setPayeeIdError('Please enter payee ID.');
    } else {
      setPayeeIdError('');
    }

    if (!payeeAccount) {
      setPayeeAccountError('Please enter payee wallet number.');
    } else {
      setPayeeAccountError('');
    }

    if (!provider) {
      setProviderError('Please select wallet provider.');
    } else {
      setProviderError('');
    }
    
    if (!amount) {
      setAmountError('Please enter payout amount.');
    } else {
      setAmountError('');
    }

    if (!currency) {
      setCurrencyError('Please select a currency.');
    } else {
      setCurrencyError('');
    }

    if (!merchant || merchantError || !orderId || orderIdError || !payeeId || payeeIdError || !payeeAccount || payeeAccountError || !provider || providerError || !amount || amountError || !currency || currencyError) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please check the input fields.',
        showConfirmButton: true,
      });
    }

    paymentApi.payment().payout({ merchant, orderId, payeeId, payeeAccount, provider, currency, amount, callbackUrl })
    .then(res => {
      
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: res.data.message,
          showConfirmButton: false,
          timer: 1500,
        });

        setIsAdding(false);
      } else {
        console.log(res.data.error);

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: res.data.message,
          showConfirmButton: true,
        });
      }
      
    })
    .catch(err => {

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to payout.',
        showConfirmButton: true,
      });
    });
    
  };

  const handleMerchantChange = (event) => {
    setMerchant(event.target.value);

    const selectedData = data.find(item => item.name === event.target.value);
    if ((event.target.value !== "easypay") && selectedData) {
      setCurrency(selectedData.currency);
    }    
    
  };

  const handlePayeeIdChange = (event) => {
    setPayeeId(event.target.value);
  };

  const handleOrderIdChange = (event) => {
    setOrderId(event.target.value);
  };

  const handlePayeeAccountChange = (event) => {
    setPayeeAccount(event.target.value);
  };

  const handleProviderChange = (event) => {
    setProvider(event.target.value);
  };

  const handleCallbackUrlChange = (event) => {
    setCallbackUrl(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
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
        gridRow="span 4"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
      >
        <Header title="" subTitle="Payout Details" />
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
                defaultValue="Easypay"
                value={merchant}
                label="Merchant"
                onChange={handleMerchantChange}
                error={!!merchantError}
                helperText={merchantError}
              >
                <MenuItem key={"easypay"} value={"easypay"}>{"Easypay"}</MenuItem>
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
              id="payeeId"
              label="Payee ID"
              style={{width:"100%"}}
              defaultValue=""
              value={payeeId}
              onChange={handlePayeeIdChange}
              error={!!payeeIdError}
              helperText={payeeIdError}
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
              id="orderId"
              label="Order ID"
              style={{width:"100%"}}
              defaultValue=""
              value={orderId}
              onChange={handleOrderIdChange}
              error={!!orderIdError}
              helperText={orderIdError}
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
              <InputLabel id="demo-simple-select-label">Currency*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue="BDT"
                value={currency}
                label="Currency"
                onChange={handleCurrencyChange}
                error={!!currencyError}
                helperText={currencyError}
              >
                <MenuItem value={'BDT'}>BDT</MenuItem>
                <MenuItem value={'USD'}>USD</MenuItem>
                <MenuItem value={'INR'}>INR</MenuItem>
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
              id="amount"
              label="Amount"
              style={{width:"100%"}}
              defaultValue=""
              value={amount}
              onChange={handleAmountChange}
              error={!!amountError}
              helperText={amountError}
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
              <InputLabel id="demo-simple-select-label">Wallet Provider*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue="Bkash"
                value={provider}
                label="Wallet Provider"
                onChange={handleProviderChange}
                error={!!providerError}
                helperText={providerError}
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
            gridColumn="span 4"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              required
              id="payeeAccount"
              label="Payee Wallet No"
              style={{width:"100%"}}
              defaultValue=""
              value={payeeAccount}
              onChange={handlePayeeAccountChange}
              error={!!payeeAccountError}
              helperText={payeeAccountError}
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
              // required
              id="callbackUrl"
              label="Callback URL"
              style={{width:"100%"}}
              defaultValue=""
              value={callbackUrl}
              onChange={handleCallbackUrlChange}
              // error={!!callbackUrlError}
              // helperText={callbackUrlError}
            />
          </Box>
        </Box>        
      </Box> 
      <Button id="submit" variant="contained" onClick={handleAdd}>Submit</Button>
      <Button id="cancel" variant="contained" onClick={() => setIsAdding(false)}>Cancel</Button>
    </Box>
  );
};

export default Add;
