import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  container: {
    backgroundColor: "#f5f5f5",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  logotypeContainer: {
    backgroundColor: theme.palette.primary.main,
    width: "50%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: "30%",
    },
  },
  logotypeImage: {
    width: 400,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      width: 200,
    },
  },
  logotypeText: {
    color: "#ffffff",
    fontWeight: 800,
    fontSize: 85,
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: 48,
    },
  },
  formContainer: {
    backgroundColor: "#ffffff",
    width: "50%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(4),
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      width: "100%",
      height: "60%",
    },
  },
  form: {
    width: "100%",
    maxWidth: 400,
    [theme.breakpoints.down("sm")]: {
      maxWidth: 300,
    },
  },
  tab: {
    fontWeight: 400,
    fontSize: 18,
  },
  errorMessage: {
    textAlign: "center",
    paddingTop: theme.spacing(2),
    fontSize: "14px",
    fontWeight: "600",
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
  loginLoader: {
    marginLeft: theme.spacing(4),
  },
  copyright: {
    marginTop: "auto",
    whiteSpace: "nowrap",
    textAlign: "center",
    [theme.breakpoints.down("md")]: {
      marginTop: theme.spacing(2),
    },
  },
}));