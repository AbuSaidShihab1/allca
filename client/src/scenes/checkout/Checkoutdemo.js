import React, { useState, useRef } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Fade,
} from "@material-ui/core";
import { useNavigate, useParams  } from "react-router-dom";
import { Box, useTheme, useMediaQuery, Button } from "@mui/material";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Header from "components/Header";
import Select, { SelectChangeEvent } from '@mui/material/Select';

import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { paymentApi, generalApi } from "state/api";
import useStyles from "../checkout/styles";
import logo from "./easypay-logo.png";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import Swal from 'sweetalert2';
import { redirect } from "react-router-dom/dist";
import { capitalize } from "utilities/CommonUtility";
import { nanoid } from 'nanoid';

function Checkoutdemo() {
  const classes = useStyles();
  const navigate = useNavigate();

  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const textFieldRef = useRef(null);

  // let { paymentId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [provider, setProvider] = useState("bkash");
  const [providerLogo, setProviderLogo] = useState("./easypay-logo.png");
  const [mid, setMid] = useState("merchant1");
  const [payerId, setPayerId] = useState("m1-p-123");
  const [orderId, setOrderId] = useState("m1-o-123");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("BDT");
  const [redirectUrl, setRedirectUrl] = useState("https://eassypay.com/depositdemo");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [amountError, setAmountError] = useState('');

  const [paidStatus, setPaidStatus] = useState(0); // 0: initial, 1: success, 2: fail

  useEffect(() => {

    setOrderId(nanoid(8));

    // setIsLoading(true);

    // paymentApi.payment().checkout({})
    //   .then(res => {   
    //     console.log('checkout ---- res', res.data);
    //     if (res.data.success) {
          
    //       setProvider(res.data.data.provider);
    //       setProviderLogo('./' + res.data.data.provider + '_logo.png');
    //       setAmount(res.data.data.amount);
    //       setCurrency(res.data.data.currency);
    //       setAgentAccount(res.data.data.agentAccount);
    //       setRedirectUrl(res.data.data.redirectUrl);

    //       // Swal.fire({
    //       //   icon: 'success',
    //       //   title: 'Success!',
    //       //   text: res.data.data.agentAccount,
    //       //   showConfirmButton: true,
    //       // });

    //     } else {
          
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Error!',
    //         text: res.data.message,
    //         showConfirmButton: true,
    //       });   
              
    //       setPaidStatus(2);

    //     }

    //     setIsLoading(false); 

    //   })
    //   .catch(err => {
        
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Error!',
    //       text: err.message,
    //       showConfirmButton: true,
    //     });
   
    //     setPaidStatus(2);
          
    //     setIsLoading(false);

    //   });

  }, []);

  const handleProviderChange = (event) => {
    setProvider(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
    
    if (!amount && !event.target.value) {
      setAmountError('Please enter amount to deposit.');
    } else {
      setAmountError('');
    }

  };

  const handleSubmit = async () => {

    if (!amount) {
      setAmountError('Please enter amount to deposit.');
    } else {
      setAmountError('');
    }

    if (!amount || amountError) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please check the input fields.',
        showConfirmButton: true,
      });
    }

    paymentApi.payment().payment({mid, provider, orderId, payerId, amount, currency, redirectUrl, callbackUrl})
      .then(res => {   
        console.log('payment ---- res', res.data);
        if (res.data.success) {
         
          window.location = res.data.link;
          
        } else {
          
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: res.data.message,
            showConfirmButton: true,
          });             
          
        }

        setOrderId(nanoid(8));
        setAmount("");
        setIsLoading(false); 

      })
      .catch(err => {
        
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: err.message,
          showConfirmButton: true,
        });
   
        setOrderId(nanoid(8));
        setAmount("");
        setIsLoading(false);

      });
  }

  const handleCancel = async () => {

    Swal.fire({
      icon: 'warning',
      title: 'Warning!',
      text: "You are redirected to your website.",
      showConfirmButton: true,
    });

    window.location = redirectUrl;

  }

  return (
    <Grid container className={classes.container}>
      {
        paidStatus === 0 &&
        <>
          <div className={classes.formCheckoutContainer} style={{justifyContent: 'center'}}>
            <div className={classes.form} >
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
                  gridRow="span 8"
                  className={classes.boxCheckoutForm}
                  // backgroundColor={theme.palette.background.alt}
                  p="1rem"
                  borderRadius="0.55rem"
                  borderTopRightRadius="0.55rem"
                  borderBottomRightRadius="0.55rem"
                >
                  <Header title="" subTitle={'Demo Deposit for Merchant Testing'} />              
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(12, 1fr)"
                    gridAutoRows="80px"
                  >
                    <Box
                      width="100%"
                      gridColumn="span 12"
                      gridRow="span 1"
                      // backgroundColor={theme.palette.background.alt}
                      pt="2rem" pl="1.2rem"
                    >                
                      <Typography style={{fontSize: '12px', fontWeight: '600'}}>mid: '{mid}' (e.g.)</Typography>
                      <Typography style={{fontSize: '12px', fontWeight: '600'}}>player id: '{payerId}' (e.g.)</Typography>
                      <Typography style={{fontSize: '12px', fontWeight: '600'}}>order id: '{orderId}' (e.g., unique)</Typography>
                    </Box>
                    
                    <Box
                      width="100%"
                      gridColumn="span 12"
                      gridRow="span 1"
                      // backgroundColor={theme.palette.background.alt}
                      pt="3rem" pl="1.2rem"
                    >                
                      <Typography style={{fontSize: '14px', fontWeight: '600'}}>Provider</Typography>
                    </Box>
                    <Box
                      width="100%"
                      gridColumn="span 12"
                      gridRow="span 1"
                      // backgroundColor={theme.palette.background.alt}
                      p="1rem"
                    >
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Provider*</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          defaultValue={provider}
                          value={provider}
                          label="Provider"
                          onChange={handleProviderChange}
                        >
                          <MenuItem value={'bkash'}>Bkash</MenuItem>
                          <MenuItem value={'nagad'}>Nagad</MenuItem>
                          <MenuItem value={'rocket'}>Rocket</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>  
                    <Box
                      width="100%"
                      gridColumn="span 12"
                      gridRow="span 1"
                      // backgroundColor={theme.palette.background.alt}
                      pt="3rem" pl="1.2rem"
                    >                
                      <Typography style={{fontSize: '14px', fontWeight: '600'}}>Amount(BDT)</Typography>
                    </Box>
                    <Box
                      width="100%"
                      gridColumn="span 12"
                      gridRow="span 1"
                      // backgroundColor={theme.palette.background.alt}
                      p="1rem"
                    >
                      <TextField
                        required
                        id="amount"
                        label="Amount"
                        placeholder=""
                        style={{width:"100%"}}
                        defaultValue=""
                        value={amount}
                        onChange={handleAmountChange}
                        error={!!amountError}
                        helperText={amountError}
                      />
                    </Box>          
                  </Box>
                  <Box
                    width="100%"
                    gridColumn="span 12"
                    gridRow="span 1"
                    // backgroundColor={theme.palette.background.alt}
                    p="1.2rem"
                  >      
                    {/* <Button id="cancel" variant="contained" style={{ marginRight: '20px' }} onClick={handleCancel}>Cancel</Button>  */}
                    <Button id="submit" variant="contained" onClick={handleSubmit}>Submit</Button>
                  </Box>  
                </Box>
              </Box>              
            </div>
            {/* <Typography color="primary" className={classes.copyright} style={{display: 'flex', justifyContent: 'center'}}>
              powered by EasyPay
            </Typography> */}
          </div>
          {/* <div className={classes.logotypeCheckoutContainer}>
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
                gridRow="span 8"
                className={classes.boxCheckoutLogo}
                // style={{width: '500px', borderRadius: '0.55rem'}}
                // backgroundColor={'#efe0e0'}
                p="1rem"
              >
                <div style={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
                  <img src={logo} alt="EasyPay" style={{height: '35px', marginRight: '10px'}} />
                  <Typography style={{fontSize: '18px', color: '#1b1fc1', fontWeight: '600'}}>EasyPay</Typography>
                </div>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  gridAutoRows="60px"
                >
                  <Box
                    width="100%"
                    gridColumn="span 12"
                    gridRow="span 1"
                    // backgroundColor={theme.palette.background.alt}
                    pt="1.5rem" pl="1.2rem"
                  >                
                    <Typography style={{fontSize: '14px', fontWeight: '600'}}>Wallet provider</Typography>
                    <Typography style={{fontSize: '12px', fontWeight: '600', marginLeft: '5px'}}>ওয়ালেট প্রদানকারী</Typography>
                  </Box>
                  <Box
                    width="100%"
                    gridColumn="span 8"
                    gridRow="span 1"
                    p="1.5rem"
                  >
                    <div style={{display: 'flex', padding: '0.8rem', justifyContent: 'start', alignItems: 'center',border: 'solid 1px gray', borderRadius: '5px'}}>
                      <img src={logo} alt={provider} style={{width: '35px', marginRight: '10px'}} />
                      <Typography style={{fontSize: '15px', color: 'gray', fontWeight: '500'}}>{capitalize(provider) + ' Cashout'}</Typography>
                    </div>
                  </Box>
                  <Box
                    width="100%"
                    gridColumn="span 12"
                    gridRow="span 1"
                    // backgroundColor={theme.palette.background.alt}
                    pt="4rem" px="1.2rem"
                  >                
                    <Typography style={{fontSize: '14px', fontWeight: '600'}}>Warning</Typography>
                    <Typography style={{fontSize: '12px', fontWeight: '600', marginLeft: '5px'}}>সতর্কতা</Typography>
                  </Box>
                  <Box
                    width="100%"
                    gridColumn="span 12"
                    gridRow="span 1"
                    // backgroundColor={theme.palette.background.alt}
                    pt="3.5rem" px="1.2rem"
                  >
                    <Typography style={{fontSize: '14px', marginLeft: '5px'}}>
                      Please note that you make deposit to {capitalize(provider)} Cashout. Be sure that you make the payment from the same wallet, otherwise it may be lost.
                    </Typography>
                  </Box>  
                  <Box
                    width="100%"
                    gridColumn="span 12"
                    gridRow="span 1"
                    // backgroundColor={theme.palette.background.alt}
                    pt="4.3rem" px="1.2rem"
                  >
                    <Typography style={{fontSize: '13px', marginLeft: '5px'}}>
                      দয়া করে মনে রাখবেন যে আপনি {capitalize(provider)} Cashout এ আমানত করেন। নিশ্চিত হন যে আপনি একই ওয়ালেট থেকে অর্থপ্রদান করেছেন, অন্যথায় এটি হারিয়ে যেতে পারে।
                    </Typography>
                  </Box>
                  <Box
                    width="100%"
                    gridColumn="span 12"
                    gridRow="span 1"
                    // backgroundColor={theme.palette.background.alt}
                    pt="4.5rem" px="1.2rem"
                  >
                    <Typography style={{fontSize: '14px', marginLeft: '5px'}}>
                      Please make sure that your deposit amount must be at least 5,000.00 BDT.
                    </Typography>
                  </Box>  
                  <Box
                    width="100%"
                    gridColumn="span 12"
                    gridRow="span 1"
                    // backgroundColor={theme.palette.background.alt}
                    pt="4rem" px="1.2rem"
                  >
                    <Typography style={{fontSize: '13px', marginLeft: '5px'}}>
                      অনুগ্রহ করে নিশ্চিত করুন যে আপনার জমার পরিমাণ কমপক্ষে 5,000.00 BDT হতে হবে।
                    </Typography>
                  </Box>         
                </Box>              
              </Box>
            </Box>
          </div> */}
        </>
      }
      {
        paidStatus === 1 &&
        <div className={classes.logotypeContainer}>
          <img src={logo} alt="EasyPay" className={classes.logotypeImage} />
          <Typography style={{fontSize: '25px', color: 'white', fontWeight: '800', marginBottom: '30px'}}>
            Your payment is received
          </Typography>
          <Typography style={{fontSize: '16px', color: 'white', fontWeight: '500', marginBottom: '30px'}}>
            Please wait while your payment is being processed. Each payment requires manual verification
          </Typography>
          <Button id="cancel1" variant="contained" onClick={handleCancel}>Close Page</Button>
        </div>
      }
      {
        paidStatus === 2 &&
        <div className={classes.logotypeContainer}>
          <img src={logo} alt="EasyPay" className={classes.logotypeImage} />
          <Typography style={{fontSize: '25px', color: 'white', fontWeight: '800', marginBottom: '30px'}}>
            Your payment is failed
          </Typography>che
          <Typography style={{fontSize: '16px', color: 'white', fontWeight: '500', marginBottom: '30px'}}>
            Please try again later.
          </Typography>
          <Button id="cancel2" variant="contained" onClick={handleCancel}>Close Page</Button>
        </div>
      }
      
    </Grid>
  );
}

// export default withRouter(Login);
export default Checkoutdemo;
