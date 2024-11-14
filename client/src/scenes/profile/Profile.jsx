import React, { useState, useEffect, useContext } from "react";
import TextField from '@mui/material/TextField';
import { DataGrid } from "@mui/x-data-grid";
import { useGetUserQuery, generalApi } from "state/api";
import Header from "components/Header";
import { Box, useTheme, Button } from "@mui/material";
import { refundTableColumns } from "utilities/CommonUtility";
import DataGridCustomToolbar from 'components/DataGridCustomToolbar';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate  } from "react-router-dom";
import Swal from 'sweetalert2';

const Profile = () => {
  const theme = useTheme();

  // values to send to backend
  
  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();
  const [oldP, setOldP] = useState("");
  const [newP, setNewP] = useState("");
  const [oldPError, setOldPError] = useState('');  
  const [newPError, setNewPError] = useState('');

  useEffect(() => {
    if (authUser === null) {
      navigate('/login');
    }
  }, [authUser])

  const { data, isLoading } = useGetUserQuery(authUser.id);
  // console.log('dddatttta', data, authUser.id);

  const handleOldPChange = (event) => {
    setOldP(event.target.value);
  };

  const handleNewPChange = (event) => {
    setNewP(event.target.value);
  };

  const handleUpdate = e => {
    e.preventDefault();

    if (!oldP) {
      setOldPError('Please enter old password.');
    } else {
      setOldPError('');
    }

    if (!newP) {
      setNewPError('Please enter new Password.');
    } else {
      setNewPError('');
    }

    if (!oldP || oldPError || !newP || newPError) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please check the input fields.',
        showConfirmButton: true,
      });
    }

    generalApi.general().updatePassword({ id: authUser.id, oldP, newP })
    .then(res => {
      
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Changed!',
          text: `${data.name}'s password has been changed.`,
          showConfirmButton: false,
          timer: 1500,
        });
        setOldP("");
        setNewP("");
      } else {
        console.log(res.data.error);

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: res.data.error,
          showConfirmButton: true,
        });
      }
      
    })
    .catch(err => {

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to change.',
        showConfirmButton: true,
      });
    });
    
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Profile" subTitle="" />
      {
        data 
        ?
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
          <Box
            gridColumn="span 12"
            gridRow="span 6"
            backgroundColor={theme.palette.background.alt}
            p="1rem"
            borderRadius="0.55rem"
          >
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
                  // disabled
                  InputProps={{
                    readOnly: true,
                  }}
                  id="name"
                  label={(authUser.role === "merchant")?"Merchant Name":"User Name"}
                  style={{width:"100%"}}
                  defaultValue={data.name}
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
                  // disabled
                  InputProps={{
                    readOnly: true,
                  }}
                  id="email"
                  label="Email"
                  style={{width:"100%"}}
                  defaultValue={data.email}
                />
              </Box>
              { authUser.role === "merchant" && 
                <>
                  <Box
                    width="100%"
                    gridColumn="span 6"
                    gridRow="span 1"
                    // backgroundColor={theme.palette.background.alt}
                    p="1rem"
                  >
                    <TextField
                      // disabled
                      InputProps={{
                        readOnly: true,
                      }}
                      id="type"
                      label="Website URL"
                      style={{width:"100%"}}
                      defaultValue={data.websiteUrl}
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
                      // disabled
                      InputProps={{
                        readOnly: true,
                      }}
                      id="currency"
                      label="Currency"
                      style={{width:"100%"}}
                      defaultValue={data.currency}
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
                      // disabled
                      InputProps={{
                        readOnly: true,
                      }}
                      id="apiKey"
                      label="API Key"
                      style={{width:"100%"}}
                      defaultValue={data.apiKey}
                    />
                  </Box> 
                </>
              }           
            </Box>          
          </Box>
          <Box
            gridColumn="span 12"
            gridRow="span 6"
            backgroundColor={theme.palette.background.alt}
            p="1rem"
            my="1rem"
            borderRadius="0.55rem"
          >
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
                  id="old"
                  label="Old Password"
                  style={{width:"100%"}}
                  value={oldP}
                  onChange={handleOldPChange}
                  error={!!oldPError}
                  helperText={oldPError}
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
                  id="new"
                  label="New Password"
                  style={{width:"100%"}}
                  value={newP}
                  onChange={handleNewPChange}
                  error={!!newPError}
                  helperText={newPError}
                />
              </Box>
              <Box
                width="100%"
                gridColumn="span 12"
                gridRow="span 1" 
                p="1rem"
              >
                <Button id="submit" variant="contained" onClick={handleUpdate}>Change</Button>      
              </Box>     
            </Box>          
          </Box>
        </Box>
        :
        "Loading..."
      }
    </Box>
  );
};

export default Profile;
