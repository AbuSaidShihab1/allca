import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate  } from "react-router-dom";
import { Box, useTheme, Button } from "@mui/material";
import { useGetUsersQuery, generalApi } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
// import { merchantTableColumns } from "utilities/CommonUtility";
import DataGridCustomToolbarForMerchants from "components/DataGridCustomToolbarForMerchants";
import Edit from './Edit';
import Add from './Add';
import Swal from 'sweetalert2';

const Users = () => {
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

  const { data, isLoading, refetch } = useGetUsersQuery();
  
  const merchantTableColumns = [
    {
      field: "name",
      headerName: "User Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "authCode",
      headerName: "Auth Code",
      flex: 0.5
    },
    {
      field: "createdAt",
      headerName: "Create Date",
      flex: 1
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5
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
        generalApi.general().deleteUser(row._id)
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
      <Header title="USERS" subTitle="" />
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

export default Users;
