import React, { useState, useRef } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Fade,
} from "@material-ui/core";
import { useNavigate, useParams, useSearchParams  } from "react-router-dom";
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
import useStyles from "./styles";
import logo from "./easypay-logo.png";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import Swal from 'sweetalert2';
import { redirect } from "react-router-dom/dist";
import { capitalize } from "utilities/CommonUtility";
import { nanoid } from 'nanoid';

function Callbackbkash() {
  const classes = useStyles();
  const navigate = useNavigate();

  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const textFieldRef = useRef(null);

  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [redirectUrl, setRedirectUrl] = useState("https://eassypay.com/callbackbkash");

  const [paidStatus, setPaidStatus] = useState(0); // 0: initial, 1: success, 2: fail

  useEffect(() => {

    setIsLoading(true);

    const paymentID = searchParams.get('paymentID');
    const status = searchParams.get('status');

    paymentApi.payment().callbackbkash({paymentID, status})
      .then(res => {   
        console.log('callbackbkash ---- res', res.data);
        if (res.data.success) {
          
          // setRedirectUrl(res.data.redirectUrl);
          window.location = `${res.data.redirectUrl}?&status=${status}`; // orderId=${res.data.orderId}

        } else {
          
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: res.data.message,
            showConfirmButton: true,
          });   
              
          setPaidStatus(2);

        }

        setIsLoading(false); 

      })
      .catch(err => {

        console.log('callbackbkash ---- error', err);

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: err.message,
          showConfirmButton: true,
        });
   
        setPaidStatus(2);
          
        setIsLoading(false);

      });

  }, []);

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
        <div className={classes.logotypeContainer}>
          <img src={logo} alt="EasyPay" className={classes.logotypeImage} />
          <Typography style={{fontSize: '25px', color: 'white', fontWeight: '800', marginBottom: '30px'}}>
            Your payment is received
          </Typography>
          <Typography style={{fontSize: '16px', color: 'white', fontWeight: '500', marginBottom: '30px'}}>
            Redirecting to your website...
          </Typography>
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
          {/* <Button id="cancel2" variant="contained" onClick={handleCancel}>Close Page</Button> */}
        </div>
      }      
    </Grid>
  );
}

// export default withRouter(Login);
export default Callbackbkash;
