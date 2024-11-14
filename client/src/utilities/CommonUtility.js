
import { Button } from "@mui/material";

export const capitalizeRole = (role) => {
  if (role === "superadmin") {
    return "Super Admin";
  } else if (role === "subadmin") {
    return "Sub Admin";
  } else if (role === "admin") {
    return "Admin";
  } else if (role === "merchant") {
    return "Merchant";
  } else {
    return role;
  }
};

export const capitalize = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const merchantTableColumns = [
  // {
  //   field: "_id",
  //   headerName: "ID",
  //   flex: 1,
  // },
  {
    field: "name",
    headerName: "Merchant Name",
    flex: 1,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
  },
  // {
  //   field: "phoneNumber",
  //   headerName: "Phone Number",
  //   flex: 0.5,
  //   renderCell: (params) => {
  //     return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
  //   },
  // },
  // {
  //   field: "country",
  //   headerName: "COUNTRY",
  //   flex: 0.4
  // },
  {
    field: "type",
    headerName: "Type",
    flex: 0.5
  },
  {
    field: "currency",
    headerName: "Currency",
    flex: 0.5
  },
  {
    field: "apiKey",
    headerName: "API Key",
    flex: 2
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
    hide: true,
    renderCell: (params) => (
      <>
        <Button id="edit" style={{marginRight: '10px'}} variant="contained" onClick={() => handleEditRow(params.row)}>Edit</Button>
        <Button id="delete" variant="contained" onClick={() => handleDeleteRow(params.row)}>Delete</Button>
      </>      
    )
  },
];

export function handleEditRow(row) {
  // Logic to handle editing the row
  console.log('Editing row:', row);
  alert('Editing: ' + row._id)
}

export function handleDeleteRow(row) {
  // Logic to handle editing the row
  console.log('Deleting row:', row);
  alert('Deleting: ' + row._id)
}

export function handleRefundRow(row) {
  // Logic to handle editing the row
  console.log('Refunding row:', row);
  alert('Refunding: ' + row.transactionId)
}

export const transactionTableColumns = [
  {
    field: "merchantId",
    headerName: "Merchant ID",
    flex: 0.7,
  },
  {
    field: "transactionId",
    headerName: "Txn ID",
    flex: 1,
  },
  {
    field: "orderId",
    headerName: "Order ID",
    flex: 1,
  },{
    field: "orderDetail",
    headerName: "Order Detail",
    flex: 1,
  },
  {
    field: "transactionType",
    headerName: "Type",
    flex: 0.5,
  },
  {
    field: "paymentMethod",
    headerName: "Solution",
    flex: 0.5,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "cardNumber",
    headerName: "Card Number",
    flex: 1,
  },
  // {
  //   field: "cardType",
  //   headerName: "Card Type",
  //   flex: 0.5,
  // },
  // {
  //   field: "country",
  //   headerName: "Country",
  //   flex: 1,
  // },
  {
    field: "amount",
    headerName: "Amount",
    flex: 0.5,
  },
  {
    field: "currency",
    headerName: "Currency",
    flex: 0.5,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 0.5,
  },
  // {
  //   field: "response",
  //   headerName: "Response",
  //   flex: 1,
  // },
  {
    field: "createdAt",
    headerName: "Create Date",
    flex: 1,
  },
  {
    field: "statusDate",
    headerName: "Status Date",
    flex: 1,
  },
  { 
    field: 'action',
    headerName: 'Action',
    sortable: false,
    flex: 1,
    renderCell: (params) => (
      // <Button id="submit" variant="contained" onClick={() => handleRefundRow(params.row)}>Refund</Button>
      <Button id="delete" variant="contained" onClick={() => handleDeleteRow(params.row)}>Delete</Button>
      // <button onClick={() => handleRefundRow(params.row)}>Refund</button>
    )
  },
  // {
  //   field: "products",
  //   headerName: "# of Products",
  //   flex: 0.5,
  //   sortable: false,
  //   renderCell: (params) => params.value.length,
  // },
  // {
  //   field: "cost",
  //   headerName: "Cost",
  //   flex: 1,
  //   renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
  // },
];

export const refundTableColumns = [
  {
    field: "merchantId",
    headerName: "Merchant ID",
    flex: 1,
  },
  {
    field: "transactionId",
    headerName: "Txn ID",
    flex: 1,
  },
  {
    field: "orderId",
    headerName: "Order ID",
    flex: 1,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "card",
    headerName: "Card Number",
    flex: 1,
  },
  {
    field: "cardType",
    headerName: "Card Type",
    flex: 1,
  },
  {
    field: "country",
    headerName: "Country",
    flex: 1,
  },
  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
  },
  {
    field: "currency",
    headerName: "Currency",
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
  },
  {
    field: "response",
    headerName: "Response",
    flex: 1,
  },
  {
    field: "createdAt",
    headerName: "Create Date",
    flex: 1,
  },
  {
    field: "statusDate",
    headerName: "Status Date",
    flex: 1,
  },
  // {
  //   field: "products",
  //   headerName: "# of Products",
  //   flex: 0.5,
  //   sortable: false,
  //   renderCell: (params) => params.value.length,
  // },
  // {
  //   field: "cost",
  //   headerName: "Cost",
  //   flex: 1,
  //   renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
  // },
];

export const performancecTableColumns = [
  {
    field: "_id",
    headerName: "ID",
    flex: 1,
  },
  {
    field: "userId",
    headerName: "User ID",
    flex: 1,
  },
  {
    field: "createdAt",
    headerName: "CreatedAt",
    flex: 1,
  },
  {
    field: "products",
    headerName: "# of Products",
    flex: 0.5,
    sortable: false,
    renderCell: (params) => params.value.length,
  },
  {
    field: "cost",
    headerName: "Cost",
    flex: 1,
    renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
  },
];