import React, { useMemo, useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate  } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import DatePicker from "react-datepicker";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import EuroIcon from '@mui/icons-material/Euro';

import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "components/BreakdownChart";
import OverviewChart from "components/OverviewChart";
import { useGetDashboardQuery, useGetChartQuery } from "state/api";
import StatBox from "components/StatBox";
import Chart from 'react-apexcharts';

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();

  const [isPayout, setIsPayout] = useState(false);

  useEffect(() => {
    if (authUser === null) {
      navigate('/login');
    } else if ( authUser?.role === "subadmin") {
      navigate('/payment');
    }
  }, [authUser])

  const dateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 as month is zero-based
    const day = String(date.getDate()).padStart(2, '0');

    // Format the date string
    const formattedDate = `${year}-${month}-${day}`;
    // console.log(formattedDate);
    
    return formattedDate;
  }

  // Current date
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');  
  const curDate = `${year}-${month}-${day}`;

  currentDate.setMonth(currentDate.getMonth() - 1);
  const pyear = currentDate.getFullYear();
  const pmonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const pday = String(currentDate.getDate()).padStart(2, '0');

  const preDate = `${pyear}-${pmonth}-${pday}`;
  // console.log(preDate, curDate);
 
  const [startDate, setStartDate] = useState(new Date(preDate));
  const [endDate, setEndDate] = useState(new Date(curDate));
  // console.log('endDate', endDate);

  const { data, isLoading } = useGetDashboardQuery({id: authUser, startDate: dateToString(startDate), endDate: dateToString(endDate), mode: isPayout?"payout":"payin"});

  const data1 = useGetChartQuery({id: authUser, startDate: dateToString(startDate), endDate: dateToString(endDate), mode: isPayout?"payout":"payin"});
  // console.log('dailydata', data1);
  
  // const [formattedData] = useMemo(() => {
  //   if (!data1.data) return [];
  //   // console.log(data1.data);
  //   const dailyData = data1.data;

  //   const approvedData = dailyData.map(({ date, approvedCount }) => (
  //     approvedCount
  //   ));

  //   const declinedData = dailyData.map(({ date, declinedCount }) => (
  //     declinedCount
  //   ));
  
  //   const pendingData = dailyData.map(({ date, pendingCount }) => (
  //     pendingCount
  //   ));
  
  //   const options = {
  //     chart: {
  //       background: 'transparent',
  //       stacked: false,
  //       toolbar: {
  //         show: false
  //       }
  //     },
  //     colors: ['#00ff00', '#ff0000', '#ffff00'],
  //     dataLabels: {
  //       enabled: false
  //     },
  //     fill: {
  //       opacity: 1,
  //       type: 'solid'
  //     },
  //     grid: {
  //       borderColor: theme.palette.divider,
  //       strokeDashArray: 2,
  //       xaxis: {
  //         lines: {
  //           show: false
  //         }
  //       },
  //       yaxis: {
  //         lines: {
  //           show: true
  //         }
  //       }
  //     },
  //     legend: {
  //       show: false
  //     },
  //     plotOptions: {
  //       bar: {
  //         columnWidth: '10px'
  //       }
  //     },
  //     stroke: {
  //       colors: ['transparent'],
  //       show: true,
  //       width: 2
  //     },
  //     theme: {
  //       mode: theme.palette.mode
  //     },
  //     xaxis: {
  //       axisBorder: {
  //         color: theme.palette.divider,
  //         show: true
  //       },
  //       axisTicks: {
  //         color: theme.palette.divider,
  //         show: true
  //       },
  //       categories: dailyData.map(({ date }) => date),
  //       labels: {
  //         offsetY: 5,
  //         style: {
  //           colors: theme.palette.text.secondary
  //         }
  //       }
  //     },
  //     yaxis: {
  //       labels: {
  //         formatter: (value) => (value > 0 ? `${value}` : `${value}`),
  //         offsetX: -10,
  //         style: {
  //           colors: theme.palette.text.secondary
  //         }
  //       }
  //     }
  //   };
  
  //   const formattedData = [approvedData, declinedData, pendingData, options];
  //   console.log(formattedData);
  //   return [formattedData];
  // }, [data1.data, startDate, endDate]); 

  const [formattedData] = useMemo(() => {
    if (!data1.data) return [];
    // console.log(data1.data);
    const dailyData = data1.data;
    const totalSalesLine = {
      id: "Processed",
      color: theme.palette.secondary[600],
      data: [],
    };
    const totalUnitsLine = {
      id: "Total",
      color: theme.palette.secondary[200],
      data: [],
    };

    Object.values(dailyData).forEach(({ date, approvedCount, totalCount }) => {
      const dateFormatted = new Date(date);
      if (dateFormatted >= startDate && dateFormatted <= endDate) {
        const splitDate = date.substring(date.indexOf("-") + 1);

        totalSalesLine.data = [
          ...totalSalesLine.data,
          { x: splitDate, y: approvedCount },
        ];
        totalUnitsLine.data = [
          ...totalUnitsLine.data,
          { x: splitDate, y: totalCount },
        ];
      }
    });

    const formattedData = [totalSalesLine, totalUnitsLine];
    return [formattedData];
  }, [data1.data, startDate, endDate]);

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
    },
  }));

  const handleSwitchChange = () => {
    setIsPayout(!isPayout);
  };

  const CustomInput = ({ value, onClick }) => (
    <input
      type="text"
      value={value}
      onClick={onClick}
      style={{
        width: '100%',
        height: '1.6rem',
        borderRadius: '5px',
        borderColor: '#aaa',
        color: 'black', // 'white',
        backgroundColor: theme.palette.background.alt
      }}
    />
  );

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Dashboard" subtitle="Welcome to your dashboard" />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography style={{ marginRight: "5px" }}>Payment</Typography>
          <Switch checked={isPayout} onChange={handleSwitchChange} />
          <Typography style={{ marginLeft: "5px" }}>Payout</Typography>
        </div>
        <Box display="flex">
          {/* <Box
            width="8rem"
            marginRight="0.5rem"
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Merchant</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={currency}
                label="Currency"
                // onChange={handleCurrencyChange}
                // error={!!currencyError}
                // helperText={currencyError}
              >
                <MenuItem value={'BDT'}>ALL</MenuItem>
                <MenuItem value={'INR'}>INR</MenuItem>
                <MenuItem value={'USD'}>USD</MenuItem>
              </Select>
            </FormControl>
          </Box> */}
          <Box width="8rem">
            <Box marginBottom="0.1rem">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                style={{ width: "100%", height: "100%" }}
                customInput={<CustomInput />}
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
                style={{ width: "100%", height: "100%" }}
                customInput={<CustomInput />}
              />
            </Box>
          </Box>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="TOTAL VOLUME PROCESSED (BKASH)"
          value={data && data.bkashAmount}
          approved={data && data.bkashApproved}
          rate={
            data &&
            (
              (data.bkashApproved /
                (data.bkashTotal === 0 ? 1 : data.bkashTotal)) *
              100
            ).toFixed(1)
          }
          icon={"৳"}
        />
        <StatBox
          title="TOTAL VOLUME PROCESSED (ROCKET)"
          value={data && data.rocketAmount}
          approved={data && data.rocketApproved}
          rate={
            data &&
            (
              (data.rocketApproved /
                (data.rocketTotal === 0 ? 1 : data.rocketTotal)) *
              100
            ).toFixed(1)
          }
          icon={"৳"}
        />
        <StatBox
          title="TOTAL VOLUME PROCESSED (NAGAD)"
          value={data && data.nagadAmount}
          approved={data && data.nagadApproved}
          rate={
            data &&
            (
              (data.nagadApproved /
                (data.nagadTotal === 0 ? 1 : data.nagadTotal)) *
              100
            ).toFixed(1)
          }
          icon={"৳"}
        />
        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            TRANSACTIONS
          </Typography>
          <Box height={"95%"} position="relative">
            {data1.data ? (
              <ResponsiveLine
                data={formattedData}
                theme={{
                  axis: {
                    domain: {
                      line: {
                        stroke: theme.palette.secondary[200],
                      },
                    },
                    legend: {
                      text: {
                        fill: theme.palette.secondary[200],
                      },
                    },
                    ticks: {
                      line: {
                        stroke: theme.palette.secondary[200],
                        strokeWidth: 1,
                      },
                      text: {
                        fill: theme.palette.secondary[200],
                      },
                    },
                  },
                  legends: {
                    text: {
                      fill: theme.palette.secondary[200],
                    },
                  },
                  tooltip: {
                    container: {
                      color: theme.palette.secondary[800],
                    },
                  },
                }}
                colors={{ datum: "color" }}
                margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: false,
                  reverse: false,
                }}
                yFormat=" >-.2f"
                curve="catmullRom"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  orient: "bottom",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 90,
                  legend: "Date",
                  legendOffset: 60,
                  legendPosition: "middle",
                }}
                axisLeft={{
                  orient: "left",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Total",
                  legendOffset: -50,
                  legendPosition: "middle",
                }}
                enableGridX={false}
                enableGridY={false}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                  {
                    anchor: "top-right",
                    direction: "column",
                    justify: false,
                    translateX: 50,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemBackground: "rgba(0, 0, 0, .03)",
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              />
            ) : (
              // <Chart options={formattedData[3]} series={[{ name: 'Paid Count', data: formattedData[0] }, { name: 'Declined Count', data: formattedData[1] }, { name: 'Pending Count', data: formattedData[2] }]} type="bar" height="100%" />
              <>Loading...</>
            )}
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            (AR) TURNOVER RATIO (%)
          </Typography>
          <BreakdownChart
            isDashboard={true}
            name={authUser}
            startDate={startDate}
            endDate={endDate}
            mode={isPayout ? "payout" : "payin"}
          />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          ></Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;