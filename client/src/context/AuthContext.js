import React from "react";
import { authApi } from "state/api";
import jwt from "jwt-decode";
import { toast } from "react-toastify";

// Create AuthContext for authentication state management
let AuthContext;
const { Provider, Consumer } = (AuthContext = React.createContext());

// AuthProvider component to manage and provide authentication state
class AuthProvider extends React.PureComponent {
  // Define initial state
  state = {
    token: null,
    authUser: null,
    errorMsg: null,
  };

  /**
   * Checks if the user is authenticated by validating the token.
   * If expired, clears the session and shows a session expiry toast message.
   * @returns {boolean} - True if authenticated, otherwise false
   */
  isAuthenticated = () => {
    const token = this.state.token || localStorage.getItem("token");
    if (!token) return false;

    const decoded = jwt(token);
    if (Date.now() / 1000 > decoded.exp) {
      localStorage.removeItem("token");
      toast.error("Session has expired, please re-login");
      return false;
    }

    return true;
  };

  /**
   * Retrieves authenticated user's data from state.
   * @returns {object|null} - User object or null if no user data
   */
  getAuthUser = () => {
    return this.state.authUser;
  };

  /**
   * Sets or clears login state and stores token in localStorage.
   * @param {object|null} data - Login data with token and user info, or null to clear
   */
  setLogin = (data) => {
    if (data) {
      const decoded = jwt(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          id: decoded.id,
          name: data.user.name,
        })
      );
      this.setState({
        token: data.token,
        authUser: {
          id: decoded.id,
          name: data.user.name,
          role: decoded.role,
          websiteUrl: decoded.websiteUrl,
          apiKey: decoded.apiKey,
        },
      });
    } else {
      this.setState({
        token: null,
        authUser: null,
      });
      localStorage.removeItem("token");
    }
  };

  /**
   * Handles user login by authenticating with email and password,
   * setting loading and error states as needed.
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {function} setIsLoading - Sets loading state
   * @param {function} setErrorMessage - Sets error message state
   * @returns {boolean} - True if login successful, otherwise false
   */
  login = async (email, password, setIsLoading, setErrorMessage) => {
    setIsLoading(true);
    this.setLogin(null);

    if (email && password) {
      const res = await authApi
        .auth()
        .login({ email, password })
        .then((res) => {
          if (res.status === 200 && res.data) {
            this.setLogin(res.data);
            setIsLoading(false);
            setErrorMessage(null);
            return true;
          } else {
            setIsLoading(false);
            setErrorMessage(res.data.message);
            return false;
          }
        })
        .catch((err) => {
          setIsLoading(false);
          if (err.response) setErrorMessage(err.response.data.message);
          else setErrorMessage(err);
          return false;
        });
      return res;
    } else {
      setIsLoading(false);
      setErrorMessage("Email and password are required");
      return false;
    }
  };

  /**
   * Handles user registration, setting loading and error states as necessary.
   * @param {string} email - User's email
   * @param {string} name - User's name
   * @param {string} password - User's password
   * @param {function} setIsLoading - Sets loading state
   * @param {function} setErrorMessage - Sets error message state
   * @returns {boolean} - True if registration successful, otherwise false
   */
  register = async (email, name, password, setIsLoading, setErrorMessage) => {
    setIsLoading(true);

    if (email && name && password) {
      const res = await authApi
        .auth()
        .register({ email, name, password })
        .then((res) => {
          setErrorMessage(null);
          setIsLoading(false);
          return true;
        })
        .catch((err) => {
          setErrorMessage(err.response.data.error);
          setIsLoading(false);
          return false;
        });
      return res;
    } else {
      setErrorMessage("All fields are required");
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Clears authentication state, removes token and user data from localStorage.
   */
  logout = () => {
    this.setState({
      token: null,
      authUser: null,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
  };

  /**
   * Renders the Provider component to pass authentication state and methods to children.
   */
  render() {
    return (
      <Provider
        value={{
          ...this.state,
          login: this.login,
          register: this.register,
          logout: this.logout,
          isAuthenticated: this.isAuthenticated,
          getAuthUser: this.getAuthUser,
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

// Export AuthProvider and Consumer for use in the application
export { AuthProvider, Consumer, AuthContext };
