import express from "express";
import {
  fetchUser,
  getDashboardStats,
  getChartStats,
  getPieStats,
  signin,
  signup,
  addUser,
  updateUser,
  updatePassword,
  deleteUser,
  addAgentNumber,
  updateAgentNumber,
  deleteAgentNumber,
  addApiAccountBkash,
  updateApiAccountBkash,
  deleteApiAccountBkash,
  deletePayinTransaction,
  addApiAccountNagad,
  updateApiAccountNagad,
  deleteApiAccountNagad,
} from "../controllers/general_controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/user/:id:
 *   get:
 *     summary: Fetch user by ID
 *     description: Retrieves user information based on the provided ID
 * 
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieves aggregated statistics for the dashboard
 * 
 * /api/chart:
 *   get:
 *     summary: Get chart data
 *     description: Retrieves data for chart visualizations
 * 
 * /api/pie:
 *   get:
 *     summary: Get pie chart data
 *     description: Retrieves data for pie chart visualizations
 * 
 * /api/addUser:
 *   post:
 *     summary: Add new user
 *     description: Creates a new user in the system
 * 
 * /api/updateUser:
 *   post:
 *     summary: Update user
 *     description: Updates existing user information
 * 
 * /api/updatePassword:
 *   post:
 *     summary: Update password
 *     description: Updates user password
 * 
 * /api/deleteUser:
 *   post:
 *     summary: Delete user
 *     description: Removes user from the system
 * 
 * /api/addAgentNumber:
 *   post:
 *     summary: Add agent number
 *     description: Adds new agent number to the system
 * 
 * /api/updateAgentNumber:
 *   post:
 *     summary: Update agent number
 *     description: Updates existing agent number
 * 
 * /api/deleteAgentNumber:
 *   post:
 *     summary: Delete agent number
 *     description: Removes agent number from the system
 * 
 * /api/addApiAccountBkash:
 *   post:
 *     summary: Add Bkash API account
 *     description: Adds new Bkash API account
 * 
 * /api/updateApiAccountBkash:
 *   post:
 *     summary: Update Bkash API account
 *     description: Updates existing Bkash API account
 * 
 * /api/deleteApiAccountBkash:
 *   post:
 *     summary: Delete Bkash API account
 *     description: Removes Bkash API account
 * 
 * /api/deletePayinTransaction:
 *   post:
 *     summary: Delete payin transaction
 *     description: Removes payin transaction from the system
 */

// Authentication routes (currently disabled)
// router.post("/register", signup);
// router.post("/login", signin);

// User management routes
router.get("/user/:id", fetchUser);
router.get("/dashboard", getDashboardStats);
router.get("/chart", getChartStats);
router.get("/pie", getPieStats);
router.post("/addUser", addUser);
router.post("/updateUser", updateUser);
router.post("/updatePassword", updatePassword);
router.post("/deleteUser", deleteUser);

// Agent number management routes
router.post("/addAgentNumber", addAgentNumber);
router.post("/updateAgentNumber", updateAgentNumber);
router.post("/deleteAgentNumber", deleteAgentNumber);

// Bkash API account management routes
router.post("/addApiAccountBkash", addApiAccountBkash);
router.post("/updateApiAccountBkash", updateApiAccountBkash);
router.post("/deleteApiAccountBkash", deleteApiAccountBkash);


// Nagad API account management routes
router.post("/addApiAccountNagad", addApiAccountNagad);
router.post("/updateApiAccountNagad", updateApiAccountNagad);
router.post("/deleteApiAccountNagad", deleteApiAccountNagad);

// Transaction management routes
router.post("/deletePayinTransaction", deletePayinTransaction);

export default router;
