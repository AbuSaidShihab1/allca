import React from "react";
import { Search } from "@mui/icons-material";
import { IconButton, TextField, InputAdornment, Button } from "@mui/material";
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import FlexBetween from "./FlexBetween";

const DataGridCustomToolbarForMerchants = ({ setIsAdding }) => {
  return (
    <GridToolbarContainer>
      <FlexBetween width="100%">
        <FlexBetween>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </FlexBetween>
        <FlexBetween>
          {/* <TextField
            label="Search..."
            sx={{
              mb: "0.5rem",
              width: "15rem",
            }}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setSearch(searchInput);
                      setSearchInput("");
                    }}
                  >
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />           */}
          <Button id="add" style={{marginBottom: '10px'}} variant="contained" onClick={() => setIsAdding(true)}>Add</Button>
        </FlexBetween>
        
      </FlexBetween>
    </GridToolbarContainer>
  );
};

// export function handleAddRow() {
//   // Logic to handle editing the row
//   console.log('Adding new row');
//   alert('Adding new row');
// }

export default DataGridCustomToolbarForMerchants;
