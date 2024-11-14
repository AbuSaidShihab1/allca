import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { Box, useTheme, useMediaQuery, Button } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Header from "components/Header";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { generalApi } from "state/api"

const Detail = ({ selectedRow, setIsDetail }) => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();

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
      <Button id="cancel" variant="contained" onClick={() => setIsDetail(false)}>Back</Button>
      {
        authUser.role !== "merchant" &&
        <Box
        gridColumn="span 12"
        gridRow="span 2"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
      >
        <Header title="" subTitle="MERCHANT DETAILS" />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
        >
          <Box
            width="100%"
            gridColumn="span 12"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="mid"
              label="Merchant Name"
              style={{width:"100%"}}
              defaultValue={selectedRow.merchantId}
            />
          </Box>
          <Box
            width="100%"
            gridColumn="span 12"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="type"
              label="Payment Type"
              style={{width:"100%"}}
              defaultValue={selectedRow.transactionType}
            />
          </Box>
          <Box
            width="100%"
            gridColumn="span 12"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="method"
              label="Payment Method"
              style={{width:"100%"}}
              defaultValue={selectedRow.paymentMethod}
            />
          </Box>
        </Box>          
        </Box>
      }
      <Box
        gridColumn="span 12"
        gridRow={authUser.role !== "merchant"?"span 5":"span 4"}
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
      >
        <Header title="" subTitle="TRANSACTION DETAILS" />
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
              InputProps={{
                readOnly: true,
              }}
              id="transactionId"
              label="Transaction ID"
              style={{width:"100%"}}
              defaultValue={selectedRow.transactionId}
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
              InputProps={{
                readOnly: true,
              }}
              id="paymentId"
              label="Payment ID"
              style={{width:"100%"}}
              defaultValue={selectedRow.paymentId}
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
              InputProps={{
                readOnly: true,
              }}
              id="createdAt"
              label="Created Time"
              style={{width:"100%"}}
              defaultValue={selectedRow.createdAt}
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
              InputProps={{
                readOnly: true,
              }}
              id="statusDate"
              label="Status Time"
              style={{width:"100%"}}
              defaultValue={selectedRow.statusDate}
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
              InputProps={{
                readOnly: true,
              }}
              id="status"
              label="Status"
              style={{width:"100%"}}
              defaultValue={selectedRow.status}
            />
          </Box>
          {
            authUser.role !== "merchant" &&
            <Box
              width="100%"
              gridColumn="span 12"
              gridRow="span 1"
              // backgroundColor={theme.palette.background.alt}
              p="1rem"
            >
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                id="response"
                label="Response Data"
                style={{width:"100%"}}
                defaultValue={selectedRow.response}
              />
            </Box>
          }
          <Box
            width="100%"
            gridColumn="span 6"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="redirectUrl"
              label="Redirect URL"
              style={{width:"100%"}}
              defaultValue={selectedRow.redirectUrl}
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
              InputProps={{
                readOnly: true,
              }}
              id="callbackUrl"
              label="Callback URL"
              style={{width:"100%"}}
              defaultValue={selectedRow.callbackUrl}
            />
          </Box>
        </Box>          
      </Box>  
      <Box
        gridColumn="span 12"
        gridRow="span 3"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
      >
        <Header title="" subTitle="ORDER DETAILS" />
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
              InputProps={{
                readOnly: true,
              }}
              id="orderId"
              label="Order ID"
              style={{width:"100%"}}
              defaultValue={selectedRow.orderId}
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
              InputProps={{
                readOnly: true,
              }}
              id="orderDetail"
              label="Order Detail"
              style={{width:"100%"}}
              defaultValue={selectedRow.orderDetail}
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
              InputProps={{
                readOnly: true,
              }}
              id="amount"
              label="Amount"
              style={{width:"100%"}}
              defaultValue={selectedRow.amount}
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
              InputProps={{
                readOnly: true,
              }}
              id="currency"
              label="Currency"
              style={{width:"100%"}}
              defaultValue={selectedRow.currency}
            />
          </Box>
        </Box>          
      </Box>  
      <Box
        gridColumn="span 12"
        gridRow="span 2"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
      >
        <Header title="" subTitle="CARD DETAILS" />
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
              InputProps={{
                readOnly: true,
              }}
              id="cardNumber"
              label="Card Number"
              style={{width:"100%"}}
              defaultValue={selectedRow.cardNumber}
            />
          </Box>
          <Box
            width="100%"
            gridColumn="span 3"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="cardExpDate"
              label="Card Expiry Date"
              style={{width:"100%"}}
              defaultValue={(selectedRow.cardExpMonth)?`${selectedRow.cardExpMonth}/${selectedRow.cardExpYear}`:""}
            />            
          </Box>
          <Box
            width="100%"
            gridColumn="span 3"
            gridRow="span 1"
            // backgroundColor={theme.palette.background.alt}
            p="1rem"
          >
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="cardCVV"
              label="CVV Code"
              style={{width:"100%"}}
              defaultValue={selectedRow.cardCVV}
            />
          </Box> 
        </Box>        
      </Box>
      <Box
        gridColumn="span 12"
        gridRow="span 6"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
      >
        <Header title="" subTitle="CUSTOMER DETAILS" />
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
              InputProps={{
                readOnly: true,
              }}
              id="firstName"
              label="First Name"
              style={{width:"100%"}}
              defaultValue={selectedRow.firstName}
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
              InputProps={{
                readOnly: true,
              }}
              id="lastName"
              label="Last Name"
              style={{width:"100%"}}
              defaultValue={selectedRow.lastName}
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
              InputProps={{
                readOnly: true,
              }}
              id="phone"
              label="Phone Number"
              style={{width:"100%"}}
              defaultValue={selectedRow.phone}
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
              InputProps={{
                readOnly: true,
              }}
              id="email"
              label="Email Address"
              style={{width:"100%"}}
              defaultValue={selectedRow.email}
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
              InputProps={{
                readOnly: true,
              }}
              id="state"
              label="State"
              style={{width:"100%"}}
              defaultValue={selectedRow.state}
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
              InputProps={{
                readOnly: true,
              }}
              id="address"
              label="Address"
              style={{width:"100%"}}
              defaultValue={selectedRow.address}
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
              InputProps={{
                readOnly: true,
              }}
              id="pincode"
              label="Zip Code"
              style={{width:"100%"}}
              defaultValue={selectedRow.zipCode}
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
              InputProps={{
                readOnly: true,
              }}
              id="city"
              label="City"
              style={{width:"100%"}}
              defaultValue={selectedRow.city}
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
              InputProps={{
                readOnly: true,
              }}
              id="country"
              label="Country"
              style={{width:"100%"}}
              defaultValue={selectedRow.country}
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
              InputProps={{
                readOnly: true,
              }}
              id="clientIp"
              label="IP Address"
              style={{width:"100%"}}
              defaultValue={selectedRow.clientIp}
            />
          </Box>
        </Box>          
      </Box>
      <Button id="cancel" variant="contained" onClick={() => setIsDetail(false)}>Ok</Button>
    </Box>    
  );
};

export default Detail;
