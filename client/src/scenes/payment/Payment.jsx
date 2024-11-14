import React, { useState, useEffect, useContext, useRef } from "react";
import { useGetTransactionsQuery, generalApi } from "state/api";
import Header from "components/Header";
import FlexBetween from "components/FlexBetween";
import DatePicker from "react-datepicker";
import { Box, useTheme, Button, useMediaQuery, Typography } from "@mui/material";
import Switch from '@mui/material/Switch';
// import { transactionTableColumns } from "utilities/CommonUtility";
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate  } from "react-router-dom";
import Swal from 'sweetalert2';
import { ConstructionOutlined } from "@mui/icons-material";
import Detail from './Detail';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import useStyles from "./styles";
import './styles.css'; // Import your custom CSS file
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { LicenseInfo } from "@mui/x-license-pro";
import { capitalize } from "utilities/CommonUtility";

import axios from "axios";

const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

function CustomToolbar(props) {
  const { count, bdt, inr, usd } = props;

  return (
    <GridToolbarContainer>
      <FlexBetween
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div>
          <Typography>
            BDT: {bdt} | INR: {inr} | USD: {usd} | Count: {count}
          </Typography>
          {/* <input            
            type="text"
            autoFocus="autoFocus"
            value={searchInput}
            onKeyDown={(e) => {                        
              if (e.key === 'Enter') { // || e.key === ' '
                handleSearch();
                //  e.preventDefault();
              }
          }} 
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search..."
          />
          <button onClick={handleSearch}>Search</button> */}
        </div>
        <GridToolbar />
      </FlexBetween>
    </GridToolbarContainer>
  );
}

const Payment = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const classes = useStyles();

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const toggleRefs = useRef([]);
  // values to send to backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isDetail, setIsDetail] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState([]);

  // Current date
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const curDate = `${year}-${month}-${day}`;

  currentDate.setMonth(currentDate.getMonth() - 1);
  const pyear = currentDate.getFullYear();
  const pmonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const pday = String(currentDate.getDate()).padStart(2, "0");
  const preDate = `${pyear}-${pmonth}-${pday}`;

  const [startDate, setStartDate] = useState(new Date(preDate));
  const [endDate, setEndDate] = useState(new Date(curDate));
  const [provider, setProvider] = useState("all");
  const [orderId, setOrderId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [payerId, setPayerId] = useState("");
  const [agentAccount, setAgentAccount] = useState("");
  const [payerAccount, setPayerAccount] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");

  const [isTest, setIsTest] = useState(false);

  const { getAuthUser } = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();

  const selectOptions = [
    { label: "PENDING", value: "pending" },
    { label: "PROCESSING", value: "processing" },
    // { label: 'HOLD', value: 'hold' },
    { label: "FULLY PAID", value: "fully paid" },
    { label: "PARTIALLY PAID", value: "partially paid" },
    // { label: 'COMPLETED', value: 'completed' },
    { label: "SUSPENDED", value: "suspended" },
    { label: "EXPIRED", value: "expired" },
  ];

  const dateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 as month is zero-based
    const day = String(date.getDate()).padStart(2, "0");

    // Format the date string
    const formattedDate = `${year}-${month}-${day}`;
    // console.log(formattedDate);

    return formattedDate;
  };

  useEffect(() => {
    if (authUser === null) {
      navigate("/login");
    }
  }, [authUser]);
  // console.log('user', authUser);

  let transactionTableColumns = [
    {
      field: "orderId_paymentId",
      headerName: "ORERDER ID",
      flex: 0.7,
      renderCell: (params) => (
        <>
          {params.row.orderId}
          <br></br>
          {params.row.paymentId}
        </>
      ),
    },
  ];

  if (authUser?.role === "admin" || authUser?.role === "subadmin") {
    transactionTableColumns.push({
      field: "merchant",
      headerName: "MERCHANT",
      flex: 0.7,
      renderCell: (params) => (
        <>
          {params.row.merchant}
          <br></br>
          {params.row.merchant_url}
        </>
      ),
    });
  }

  let remainColums = [
    {
      field: "method",
      headerName: "METHOD",
      flex: 0.5,
      renderCell: (params) => {
        const type = params.row.paymentType;
        return (
          <>
            {type === "p2p" ? (
              <>
                {capitalize(params.row.provider)}
                <br></br>
                {params.row.agentAccount}
              </>
            ) : (
              <>
                {capitalize(params.row.provider)} API<br></br>
                {params.row.agentAccount}
              </>
            )}
          </>
        );
      },
    },
    {
      field: "payer",
      headerName: "PAYER",
      flex: 0.5,
      renderCell: (params) => (
        <>
          {params.row.payerId}
          <br></br>
          {params.row.payerAccount}
        </>
      ),
    },
    {
      field: "submittime",
      headerName: "CREATED TIME",
      flex: 0.7,
      renderCell: (params) => {
        const date = new Date(params.row.submitDate);

        const options = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };

        const formattedDate = date.toLocaleString("en-US", options);
        return <>{formattedDate ? <span>{formattedDate}</span> : ""}</>;
      },
    },
    {
      field: "trans",
      headerName: "TRANSACTION ID",
      flex: 1,
      renderCell: (params) => {
        // Define variables outside JSX
        const dateCheckout = new Date(params.row.submitDate);
        const dateCashout = new Date(
          params.row.paymentType === "p2p"
            ? params.row.transactionDate
            : params.row.statusDate
        );

        const options = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };

        const formattedCheckoutDate = dateCheckout.toLocaleString(
          "en-US",
          options
        );
        const formattedCashoutDate = dateCashout.toLocaleString(
          "en-US",
          options
        );

        const expirationDuration = 24 * 60 * 60 * 1000;
        const elapsedTime = dateCheckout - dateCashout;

        const delayed = elapsedTime > expirationDuration ? true : false;

        // Return JSX with the variables
        return (
          <>
            <div
              style={
                delayed
                  ? { color: "red", cursor: "pointer" }
                  : { cursor: "pointer" }
              }
              title={formattedCheckoutDate ? formattedCheckoutDate : ""}
            >
              {params.row.transactionId}
              <br></br>
              {formattedCashoutDate ? formattedCashoutDate : ""}
            </div>
          </>
        );
      },
    },
    {
      field: "expected",
      headerName: "EXPECTED",
      flex: 0.5,
      renderCell: (params) => (
        <>
          {params.row.expectedAmount ? (
            <span>
              {params.row.currency} {params.row.expectedAmount}
            </span>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      field: "received",
      headerName: "RECEIVED",
      flex: 0.5,
      renderCell: (params) => (
        <>
          {params.row.receivedAmount ? (
            <span>
              {params.row.currency} {params.row.receivedAmount}
            </span>
          ) : (
            ""
          )}
        </>
      ),
    },
    // {
    //   field: "statustime",
    //   headerName: "STATUS TIME",
    //   flex: 0.7,
    //   renderCell: (params) => (
    //     <>
    //       {params.row.statusDate?<span>{params.row.statusDate}</span>:''}
    //     </>
    //   )
    // },
  ];

  transactionTableColumns = transactionTableColumns.concat(remainColums);

  if (authUser?.role === "admin" || authUser?.role === "subadmin") {
    transactionTableColumns.push({
      field: "callback",
      headerName: "CALLBACK",
      sortable: false,
      flex: 0.7,
      renderCell: (params) => {
        const sentCallback = params.row.sentCallbackDate ? true : false;
        // console.log('callback--------', params.row.paymentId, params.row.sentCallbackDate, sentCallback)
        return (
          <>
            <Button
              id="view"
              style={
                !sentCallback
                  ? {
                      color: "red",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      lineHeight: "inherit",
                    }
                  : {
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      lineHeight: "inherit",
                    }
              }
              variant="contained"
              onClick={() => handleResendCallback(params.row._id)}
            >
              resend <br /> callback
            </Button>
          </>
        );
      },
    });
  }

  if (authUser?.role === "admin" || authUser?.role === "subadmin") {
    transactionTableColumns.push({
      field: "status",
      headerName: "STATUS",
      sortable: false,
      flex: 0.7,
      renderCell: (params) => {
        const selectedOption = selectOptions.find(
          (option) => option.value === params.row.status
        );
        const paid =
          params.row.status === "fully paid" ||
          params.row.status === "partially paid"
            ? true
            : false;
        const type = params.row.paymentType;
        return (
          <>
            {/* { 
              type === 'p2p'
              ? */}
            <div className="select" style={{}}>
              <Button
                ref={(ref) => (toggleRefs.current[params.row._id] = ref)}
                style={
                  paid
                    ? { color: "green", position: "relative", zIndex: "999" }
                    : { position: "relative", zIndex: "999" }
                }
                className="selectToggle"
                variant="contained"
                onClick={() => toggleDropdown(params.row._id)}
              >
                {selectedOption?.label}
              </Button>
              {openDropdownIndex === params.row._id && (
                <div
                  className="selectOptions"
                  style={{
                    position: "fixed",
                    top:
                      toggleRefs.current[params.row._id].getBoundingClientRect()
                        .bottom - 430,
                    left:
                      toggleRefs.current[params.row._id].getBoundingClientRect()
                        .left - 300,
                    zIndex: "9999",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#d9d0d0",
                    padding: "10px",
                  }}
                >
                  {selectOptions.map((option) => (
                    <Button
                      key={option.value}
                      style={{ marginBottom: "5px" }}
                      variant="contained"
                      className="selectOption"
                      onClick={() =>
                        handleChangeStatus(params.row, option.value)
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            {/* :
              <span>{params.row.status}</span>
             } */}
          </>
        );
      },
    });
  } else {
    transactionTableColumns.push({
      field: "status",
      headerName: "STATUS",
      flex: 0.7,
    });
  }

  // const { data, isLoading, refetch } = useGetTransactionsQuery({
  //   id: authUser,
  //   startDate: dateToString(startDate),
  //   endDate: dateToString(endDate),
  //   page,
  //   pageSize,
  //   sort: JSON.stringify(sort),
  //   search,
  // });

  const fetchTransactions = () => {
    setLoading(true); // console.log('start-fetch', loading);
    http
      .get(`/client/payinTransactions`, {
        params: {
          authUser: JSON.stringify(authUser),
          provider,
          orderId,
          paymentId,
          agentAccount,
          payerAccount,
          payerId,
          transactionId,
          minAmount,
          maxAmount,
          paymentStatus,
          startDate: dateToString(startDate),
          endDate: dateToString(endDate),
          page,
          pageSize,
          sort: JSON.stringify(sort),
          mode: isTest ? "test" : "live",
        },
      })
      .then((res) => {
        setData(res.data);
        setStatus(
          res.data.transactions.map((transaction) => {
            return { [transaction._id]: transaction.status };
          })
        );
        // console.log('statussssss', status)
      })
      .catch((err) => console.log(err.log))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, pageSize, isTest]);

  useEffect(() => {
    if (!isDetail) {
      fetchTransactions();
    }
  }, [isDetail]);

  const handlePaginationModelChange = (newModel) => {
    // console.log(newModel);
    setPage(newModel.page);
    setPageSize(newModel.pageSize);
  };

  const handleView = async (row) => {
    setSelectedRow(row);
    setIsDetail(true);
    // Swal.fire({
    //   icon: 'success',
    //   title: 'Transaction Detail',
    //   text: `${row.merchantId}'s transaction ${row.transactionId} has been ${row.status}.`,
    //   showConfirmButton: true,
    // });
  };

  const handleRefund = (row) => {
    let mid,
      apiKey = "";
    if (authUser?.role === "admin" || authUser?.role === "superadmin") {
      mid = "merchant1";
      apiKey =
        "0701050dde1b146e99fb3705fef896bb217b6c40cc87b5ea8f670d26d7d91c52";
    } else {
      mid = authUser.name;
      apiKey = authUser.apiKey;
    }

    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes, refund it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.value) {
        // const [employee] = employees.filter(employee => employee.id === id);
        generalApi
          .general()
          .refundTransaction(mid, apiKey, row.transactionId, row.amount)
          .then((res) => {
            if (res.data.status === "refunded") {
              Swal.fire({
                icon: "success",
                title: "Refunded!",
                text: `${row.orderId}'s data has been refunded.`,
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              console.log(res.data);

              Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Failed to refund.",
                showConfirmButton: true,
              });
            }

            fetchTransactions();
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Failed to refund.",
              showConfirmButton: true,
            });

            fetchTransactions();
          });
      }
    });
  };

  const handleDelete = (row) => {
    // setSelectedRow(row);

    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.value) {
        // const [employee] = employees.filter(employee => employee.id === id);
        generalApi
          .general()
          .deletePayinTransaction(row._id)
          .then((res) => {
            if (res.data.success) {
              Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: `${row.transactionId}'s data has been deleted.`,
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              console.log(res.data.error);

              Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Failed to delete.",
                showConfirmButton: true,
              });
            }

            fetchTransactions();
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Failed to delete.",
              showConfirmButton: true,
            });

            fetchTransactions();
          });
      }
    });
  };

  const handleSearch = () => {
    // Implement your search logic here
    setSearch(searchInput);
    // fetchTransactions();
  };

  const handleSwitchChange = () => {
    setIsTest(!isTest);
  };

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleChangeStatus = (row, value) => {
    // setSelectedOption(option);

    if (
      !row.receivedAmount &&
      (value === "fully payid" || value === "partially payid")
    ) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Cannot change the status as PAID.",
        showConfirmButton: true,
      });

      setOpenDropdownIndex(null);
      return;
    }

    setLoading(true); // console.log('handleChangeStatus', row, value);

    http
      .post(`/payment/changePaymentStatus`, {
        id: row._id,
        status: value,
      })
      .then((res) => {
        if (res.data.message) {
          Swal.fire({
            icon: "info",
            title: "Info!",
            text: res.data.message,
            showConfirmButton: true,
          });
        }

        fetchTransactions();
      })
      .catch((err) => console.log(err.log))
      .finally(() => setLoading(false));

    setOpenDropdownIndex(null);
  };

  const getRowClassName = (params) => {
    return {
      customRow: true, // Add custom class for styling
    };
  };

  const handleResendCallback = (id) => {
    // alert(event.target.value + '///' + row._id);
    // setStatus(status.map(stat => {
    //   stat[row._id] = event.target.value;
    //   return stat;
    // }));

    setLoading(true); // console.log('start-fetch', loading);
    http
      .post(`/payment/resendCallbackPayment`, {
        id,
      })
      .then((res) => {
        if (res.data.message) {
          Swal.fire({
            icon: "info",
            title: "Info!",
            text: res.data.message,
            showConfirmButton: true,
          });
        }

        fetchTransactions();
      })
      .catch((err) => console.log(err.log))
      .finally(() => setLoading(false));
  };

  const CustomInput = ({ value, onClick }) => (
    <input
      type="text"
      value={value}
      onClick={onClick}
      style={{
        width: "100%",
        height: "3.3rem",
        borderRadius: "5px",
        borderColor: "#ddd",
      }}
    />
  );

  return (
    <Box m="0rem 1.5rem">
      {!isDetail && (
        <>
          <FlexBetween style={{ marginBottom: "1rem" }}>
            <Header title="" subTitle="Payment Transactions" />
            {/* <Box>
              <Box>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
              </Box>
              <Box>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                />
              </Box>
            </Box> */}
          </FlexBetween>
          <Box
            mb="1rem"
            // display="grid"
            // gridTemplateColumns="repeat(12, 1fr)"
            // gridAutoRows="60px"
            // gap="20px"
            // sx={{
            //   "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
            // }}
          >
            <Box
              gridColumn="span 12"
              gridRow="span 3"
              backgroundColor={theme.palette.background.alt}
              p="0.5rem"
              borderRadius="0.55rem"
            >
              <Header title="" subTitle="Filter & Search" p="0.rem" />
              <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="4rem"
              >
                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  // backgroundColor={theme.palette.background.alt}
                  p="0.5rem"
                >
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Provider
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={provider}
                      label="Provider"
                      onChange={(event) => setProvider(event.target.value)}
                    >
                      <MenuItem value={"all"}>ALL</MenuItem>
                      <MenuItem value={"bkash"}>Bkash Agent</MenuItem>
                      <MenuItem value={"nagad"}>Nagad Agent</MenuItem>
                      <MenuItem value={"rocket"}>Rocket Agent</MenuItem>
                      {/* <MenuItem value={'upay'}>Upay Agent</MenuItem> */}
                    </Select>
                  </FormControl>
                </Box>
                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  // backgroundColor={theme.palette.background.alt}
                  p="0.5rem"
                >
                  <TextField
                    id="orderId"
                    label="Order ID"
                    style={{ width: "100%" }}
                    defaultValue=""
                    value={orderId}
                    onChange={(event) => setOrderId(event.target.value)}
                  />
                </Box>
                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  // backgroundColor={theme.palette.background.alt}
                  p="0.5rem"
                >
                  <TextField
                    id="paymentId"
                    label="Payment ID"
                    style={{ width: "100%" }}
                    defaultValue=""
                    value={paymentId}
                    onChange={(event) => setPaymentId(event.target.value)}
                  />
                </Box>
                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  // backgroundColor={theme.palette.background.alt}
                  p="0.5rem"
                >
                  <TextField
                    id="agentAccount"
                    label="Bank Account"
                    style={{ width: "100%" }}
                    defaultValue=""
                    value={agentAccount}
                    onChange={(event) => setAgentAccount(event.target.value)}
                  />
                </Box>
                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  // backgroundColor={theme.palette.background.alt}
                  p="0.5rem"
                >
                  <TextField
                    id="payerId"
                    label="Payer ID"
                    style={{ width: "100%" }}
                    defaultValue=""
                    value={payerId}
                    onChange={(event) => setPayerId(event.target.value)}
                  />
                </Box>
                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  // backgroundColor={theme.palette.background.alt}
                  p="0.5rem"
                >
                  <TextField
                    id="payerAccount"
                    label="Payer Account"
                    style={{ width: "100%" }}
                    defaultValue=""
                    value={payerAccount}
                    onChange={(event) => setPayerAccount(event.target.value)}
                  />
                </Box>
                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  // backgroundColor={theme.palette.background.alt}
                  p="0.5rem"
                >
                  <TextField
                    id="transactionId"
                    label="Transaction ID"
                    style={{ width: "100%" }}
                    defaultValue=""
                    value={transactionId}
                    onChange={(event) => setTransactionId(event.target.value)}
                  />
                </Box>
                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  // backgroundColor={theme.palette.background.alt}
                  p="0.5rem"
                >
                  <TextField
                    id="minAmount"
                    label="Min. Amount"
                    style={{ width: "100%" }}
                    defaultValue=""
                    value={minAmount}
                    onChange={(event) => setMinAmount(event.target.value)}
                  />
                </Box>
                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  // backgroundColor={theme.palette.background.alt}
                  p="0.5rem"
                >
                  <TextField
                    id="maxAmount"
                    label="Max. Amount"
                    style={{ width: "100%" }}
                    defaultValue=""
                    value={maxAmount}
                    onChange={(event) => setMaxAmount(event.target.value)}
                  />
                </Box>
                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  // backgroundColor={theme.palette.background.alt}
                  p="0.5rem"
                >
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Payment Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={paymentStatus}
                      label="Payment Status"
                      onChange={(event) => setPaymentStatus(event.target.value)}
                    >
                      <MenuItem value={"all"}>ALL</MenuItem>
                      <MenuItem value={"pending"}>PENDING</MenuItem>
                      <MenuItem value={"processing"}>PROCESSING</MenuItem>
                      {/* <MenuItem value={'hold'}>HOLD</MenuItem> */}
                      <MenuItem value={"fully paid"}>FULLY PAID</MenuItem>
                      <MenuItem value={"partially paid"}>
                        PARTIALLY PAID
                      </MenuItem>
                      {/* <MenuItem value={'completed'}>COMPLETED</MenuItem> */}
                      <MenuItem value={"suspended"}>SUSPENDED</MenuItem>
                      <MenuItem value={"expired"}>EXPIRED</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box
                  width="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  // backgroundColor={theme.palette.background.alt}
                  p="0.5rem"
                >
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    customInput={<CustomInput />}
                  />
                </Box>
                <Box
                  width="100%"
                  height="100%"
                  gridColumn="span 2"
                  gridRow="span 1"
                  // backgroundColor={theme.palette.background.alt}
                  p="0.5rem"
                >
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    style={{ width: "100%", height: "100%" }}
                    customInput={<CustomInput />}
                  />
                </Box>
              </Box>
              <Box width="100%" display="flex" justifyContent="end" p="0.5rem">
                <Button
                  id="search"
                  variant="contained"
                  onClick={() => fetchTransactions()}
                >
                  Search
                </Button>
              </Box>
            </Box>
          </Box>
          <Box
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme.palette.primary.light,
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
                borderTop: "none",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${theme.palette.secondary[200]} !important`,
              },
            }}
          >
            <DataGrid
              sx={{
                "& .css-zkx8c-MuiCircularProgress-root": {
                  color: theme.palette.secondary[100],
                },
              }}
              // getRowClassName={getRowClassName}
              loading={loading}
              getRowId={(row) => row._id}
              rows={(data && data.transactions) || []}
              columns={transactionTableColumns}
              rowCount={(data && data.total) || 0}
              rowHeight={70}
              pagination
              paginationMode={"server"}
              onPaginationModelChange={handlePaginationModelChange}
              pageSizeOptions={[20, 100, 1000, 10000, 20000]}
              paginationModel={{ page: page, pageSize: pageSize }}
              onSortModelChange={(newSortModel) => setSort(newSortModel)}
              // slots={{ toolbar: GridToolbar }}
              components={{
                Toolbar: (props) => (
                  <CustomToolbar
                    {...props}
                    bdt={(data.amounts && data.amounts.bdtAmount) || 0}
                    inr={(data.amounts && data.amounts.inrAmount) || 0}
                    usd={(data.amounts && data.amounts.usdAmount) || 0}
                    count={(data && data.total) || 0}
                  />
                ),
              }}
            />
          </Box>
        </>
      )}
      {isDetail && (
        <>
          <Header title="TRANSACTION" subTitle="Details of a transaction" />
          <Detail selectedRow={selectedRow} setIsDetail={setIsDetail} />
        </>
      )}
    </Box>
  );
};

export default Payment;
