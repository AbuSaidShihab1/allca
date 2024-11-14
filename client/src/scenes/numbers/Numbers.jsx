import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate  } from "react-router-dom";
import { Box, useTheme, Button } from "@mui/material";
import { useGetNumbersQuery, generalApi } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
// import { merchantTableColumns } from "utilities/CommonUtility";
import DataGridCustomToolbarForMerchants from "components/DataGridCustomToolbarForMerchants";
import Edit from './Edit';
import Add from './Add';
import Swal from 'sweetalert2';

const Numbers = () => {
  const theme = useTheme();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser === null || authUser.role === "merchant" || authUser.role === "subadmin") {
      navigate('/login');
    }
  }, [authUser])

  const { data, isLoading, refetch } = useGetNumbersQuery();
  
  const merchantTableColumns = [
    {
      field: "accountNumber",
      headerName: "Account Numbers",
      flex: 1
    },
    {
      field: "merchant",
      headerName: "Merchant Name",
      flex: 1,
    },
    {
      field: "mfs",
      headerName: "MFS Company",
      flex: 1,
    },
    {
      field: "currency",
      headerName: "Currency",
      flex: 0.5,
    },
    {
      field: "limitAmount",
      headerName: "Limit Amount",
      flex: 1
    },
    {
      field: "limitRemaining",
      headerName: "Remaining Limit",
      flex: 1
    },
    {
      field: "balanceAmount",
      headerName: "Balance Amount",
      flex: 1
    },
    {
      field: "updatedAt",
      headerName: "Update Date",
      flex: 1.2
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6
    },
    {
      field: "actions",
      headerName: "Actions",    
      sortable: false,
      filterable: false,
      flex: 1,
      // hide: true,
      renderCell: (params) => (
        <>
          <Button id="edit" style={{marginRight: '10px'}} variant="contained" onClick={() => handleEdit(params.row)}>Edit</Button>
          <Button id="delete" variant="contained" onClick={() => handleDelete(params.row)}>Delete</Button>
        </>      
      )
    },
  ];
  
  useEffect(() => {
    if (!isAdding && !isEditing) {
      refetch();
    }
  }, [isAdding, isEditing]);

  const handleEdit = async row => {
   
    setSelectedRow(row);
    setIsEditing(true);
  };

  const handleDelete = row => {
    // setSelectedRow(row);

    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.value) {
        // const [employee] = employees.filter(employee => employee.id === id);
        generalApi.general().deleteAgentNumber(row._id)
        .then(res => {
          
          if (res.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: `${row.name}'s data has been deleted.`,
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            console.log(res.data.error);
            
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete.',
              showConfirmButton: true,
            });
          }

          refetch();
          
        })
        .catch(err => {
          setIsEditing(false);
    
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to delete.',
            showConfirmButton: true,
          });

          refetch();
        });

      }
    });
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="AGETNT NUMBER" subTitle="" />
      {!isAdding && !isEditing && (
        <Box
          mt="40px"
          height="75vh"
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
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={data || []}
            columns={merchantTableColumns}
            components={{Toolbar: DataGridCustomToolbarForMerchants}}
            componentsProps={{
              toolbar: {setIsAdding}
            }}
          />
        </Box>
      )}
      {isAdding && (
        <Add          
          setIsAdding={setIsAdding}
        />
      )}
      {isEditing && (
        <Edit
        selectedRow={selectedRow}
          setIsEditing={setIsEditing}
        />
      )}
    </Box>
  );
};

export default Numbers;
