import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(theme => ({
  
  select: {
    position: 'relative',
  },
  
  selectToggle: {
    padding: '8px 16px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },

  customRow: {
    height: '160px', /* Set the desired height */
  },

  customDatepicker: {
    width: '100px !important', 
    height: '80px',
  },

  selectOptions: {
    position: 'absolute',
    top: '100%',
    left: '0',
    width: '100%',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
  },
  
  selectOption: {
    padding: '8px 16px',
    border: 'none',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  
  // select-option:hover {
  //   background-color: #f0f0f0;
  // }
  
}));
