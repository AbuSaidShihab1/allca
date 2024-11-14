import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(theme => ({
  
  container: {
    height: "100vh",
    width: "100vw",
    backgroundColor: 'gray',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  boxCheckoutLogo: {
    width: '500px', 
    borderRadius: '0.55rem',
    borderTopLeftRadius: "0",
    borderBottomLeftRadius: "0",
    backgroundColor: '#efe0e0',
    [theme.breakpoints.down("md")]: {
      
    },
  },
  boxCheckoutForm: {
    // width: '500px', 
    borderRadius: '0.55rem',
    borderTopRightRadius: "0",
    borderBottomRightRadius: "0",
    backgroundColor: '#efe0e0',
    [theme.breakpoints.down("md")]: {
      borderTopRightRadius: "0.55rem",
      borderBottomRightRadius: "0.55rem",
    },
  },
  logotypeContainer: {
    backgroundColor: 'gray', // '#1c2536', theme.palette.secondary[300], theme.palette.primary.main,
    width: "60%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "50%",
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  logotypeCheckoutContainer: {
    backgroundColor: 'gray', // '#1c2536', theme.palette.secondary[300], theme.palette.primary.main,
    width: "60%",
    height: "100%",
    // paddingLeft: '10px',
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "50%",
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  logotypeImage: {
    width: 165,
    marginBottom: theme.spacing(4),
  },
  logotypeText: {
    color: "white",
    fontWeight: 500,
    fontSize: 84,
    [theme.breakpoints.down("md")]: {
      fontSize: 48,
    },
  },
  formContainer: {
    backgroundColor: 'gray',
    width: "40%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "50%",
    },
    justifyContent: "center",
    // paddingTop:"70px"
  },
  formCheckoutContainer: {
    backgroundColor: 'gray',
    width: "40%",
    height: "100%",
    // paddingRight: '10px',
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "end",
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
    },
    // paddingTop:"70px"
  },
  form: {
    width: 320,
    minWidth: '320px'
  },
  tab: {
    fontWeight: 400,
    fontSize: 18,
  },
  greeting: {
    fontWeight: 500,
    textAlign: "center",
    marginTop: theme.spacing(4),
  },
  subGreeting: {
    fontWeight: 500,
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
  creatingButtonContainer: {
    marginTop: theme.spacing(2.5),
    height: 46,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  createAccountButton: {
    height: 46,
    textTransform: "none",
  },
  formDividerContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    display: "flex",
    alignItems: "center",
  },
  formDividerWord: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  formDivider: {
    flexGrow: 1,
    height: 1,
    backgroundColor: theme.palette.text.hint + "40",
  },
  errorMessage: {
    textAlign: "center",
    paddingTop: "20px",
    fontSize: "14px",
    fontWeight: "600"
  },
  textFieldUnderline: {
    "&:before": {
      borderBottomColor: theme.palette.primary.light,
    },
    "&:after": {
      borderBottomColor: theme.palette.primary.main,
    },
    "&:hover:before": {
      borderBottomColor: `${theme.palette.primary.light} !important`,
    },
  },
  textField: {
    borderBottomColor: theme.palette.background.light,
  },
  formButtons: {
    width: "100%",
    marginTop: theme.spacing(4),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgetButton: {
    textTransform: "none",
    fontWeight: 400,
  },
  loginLoader: {
    marginLeft: theme.spacing(4),
  },
  copyright: {
    marginTop: theme.spacing(4),
    fontStyle: "italic",
    whiteSpace: "nowrap",
    [theme.breakpoints.up("md")]: {
      position: "absolute",
      bottom: theme.spacing(2),
    },
  },
}));
