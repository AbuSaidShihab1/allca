import PayinTransaction from "../model/PayinTransaction.js";
import PayoutTransaction from "../model/PayoutTransaction.js";
import User from "../model/User.js";
import getCountryISO3 from "country-iso-2-to-3";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import ShortUniqueId from 'short-unique-id';
import querystring from 'querystring';
import crypto, { sign } from 'crypto';
import TelegramBot from 'node-telegram-bot-api';
import ForwardedSms from "../model/ForwardedSms.js";
import AgentNumber from "../model/AgentNumber.js";
import ApiAccountBkash from "../model/ApiAccountBkash.js";
import { fetchPayinTransactions } from "./client_controller.js";
import cron from 'node-cron';
import { NagadGateway } from 'nagad-payment-gateway';

const SERVER_URL = 'https://eassypay.com/api';
const BASE_URL = 'https://eassypay.com';

function generate256Hash(data) {
  // Use SHA256 to generate a hash
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let NAGAD_URL = process.env.SANDBOX_NAGAD_URL;
// let NAGAD_URL = 'http://mynagad.com:10080/remote-payment-gateway-1.0';

let NAGAD_CALLBACK_URL =
  process.env.SERVER_URL + process.env.NAGAD_CALLBACK_URL;

let NAGAD_MID = process.env.SANDBOX_NAGAD_MID; // sandbox
// let NAGAD_MID = '686057456165399';

let NAGAD_MNUMBER = process.env.NAGAD_MNUMBER;
// let NAGAD_MNUMBER = "01605745616";

let NAGAD_MPRIVKEY = process.env.SANDBOX_NAGAD_MPRIVKEY;
let NAGAD_NPUBKEY = process.env.SANDBOX_NAGAD_NPUBKEY;

const config = {
  apiVersion: "v-0.2.0",
  baseURL: NAGAD_URL,
  callbackURL: NAGAD_CALLBACK_URL,
  merchantID: NAGAD_MID,
  merchantNumber: "01605745616",
  privKey: NAGAD_MPRIVKEY,
  pubKey: NAGAD_NPUBKEY,
  isPath: false,
};



const nagad = new NagadGateway(config);

export const payment_nagad = async (req, res) => {
  try {
    const data = req.body;

    // API Key validation
    const apiKey = req.headers["x-api-key"] || "";
    if (!apiKey) {
      return sendErrorResponse(res, "API key is required.", data.orderId);
    }

    // Required fields validation
    const validationError = validateRequiredFields(data);
    if (validationError) {
      return sendErrorResponse(res, validationError, data.orderId);
    }

    // Amount validation
    const amountError = validateAmount(data.amount, data.currency);
    if (amountError) {
      return sendErrorResponse(res, amountError, data.orderId);
    }

    // Merchant validation
    const merchant = await User.findOne({
      name: data.mid,
      status: "activated",
    });

    if (data.mid !== "merchant1" && (!merchant || merchant.apiKey !== apiKey)) {
      return sendErrorResponse(
        res,
        "Invalid merchant or API key",
        data.orderId
      );
    }

    // Duplicate transaction check
    console.log(data);
    const paymentConfig = {
      amount: data.amount,
      ip: data.ip,
      orderId: data.orderId,
      productDetails: { order_id: data.orderId },
      clientType: "PC_WEB",
    };
    const existingTransaction = await PayinTransaction.findOne({
      orderId: data.orderId,
      merchant: data.mid,
    });
    if (existingTransaction) {
      return sendErrorResponse(
        res,
        `Transaction with duplicated order id, ${data.orderId}.`,
        data.orderId
      );
    }

    // Create Nagad payment

    const referenceId = `${Date.now()}`;

    let nagadResponse;

    try {
      nagadResponse = await nagad.createPayment(paymentConfig);
      console.log("nagad-payment-response", nagadResponse);
    } catch (error) {
      console.log(error);
      console.error("nagad-payment-creation-error:", error);
      return sendErrorResponse(
        res,
        "Failed to create Nagad payment: " +
          (error.message || "Internal Error"),
        data.orderId
      );
    }

    if (!nagadResponse) {
      console.log("nagad-payment-creation-failed", nagadResponse);
      return sendErrorResponse(
        res,
        `Payment creation failed: ${nagadResponse.message || "Internal Error"}`,
        data.orderId
      );
    }

    // Create transaction record
    const newTransaction = await PayinTransaction.create({
      paymentId: nagadResponse.paymentId,
      merchant: data.mid,
      provider: "nagad",
      orderId: data.orderId,
      payerId: data.payerId,
      expectedAmount: data.amount,
      currency: data.currency,
      redirectUrl: data.redirectUrl,
      callbackUrl: data.callbackUrl,
      referenceId,
      submitDate: new Date(),
      paymentType: "p2c",
      status: "pending",
    });

    console.log("Transaction created successfully:", newTransaction._id);

    return res.status(200).json({
      success: true,
      message: "Payment link created.",
      orderId: data.orderId,
      paymentId: nagadResponse.paymentId,
      link: nagadResponse,
      referenceId,
    });
  } catch (error) {
    console.error("payment_nagad fatal error:", error);
    return sendErrorResponse(res, error.message, req.body?.orderId, 500);
  }
};
// Helper functions
const sendErrorResponse = (res, message, orderId, status = 200) => {
  return res.status(status).json({
    success: false,
    orderId,
    message,
  });
};

const validateRequiredFields = (data) => {
  const requiredFields = [
    "mid",
    "orderId",
    "payerId",
    "amount",
    "currency",
    "redirectUrl",
    "callbackUrl",
  ];
  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    console.log("Missing required fields:", missingFields);
    return "Required fields are not filled out.";
  }
  return null;
};

const validateAmount = (amount, currency) => {
  try {
    const amountFloat = parseFloat(amount);
    if ((currency === "BDT" || currency === "INR") && amountFloat < 150) {
      return `Minimum deposit amount should be at least 150 for ${currency} currency.`;
    }
    if (currency === "USD" && amountFloat < 10) {
      return "Minimum deposit amount should be at least 10 for USD currency.";
    }
    return null;
  } catch {
    throw new Error("Invalid amount format");
  }
};

export const callback_nagad = async (req, res) => {
  const data = req.body;
  console.log("nagad-callback-data", data);
  // return;

  try {
    const transaction = await PayinTransaction.findOne({
      paymentId: data.paymentID,
    });
    if (!transaction) {
      console.log(
        "bkash-callback-no-transaction-with-paymentID",
        data.paymentID
      );
      return res.status(200).json({
        success: false,
        message:
          "There is no transaction with provided payment ID, " +
          data.paymentID +
          ".",
      });
    }

    res.status(200).json({
      success: true,
      // orderId: transaction.orderId,
      redirectUrl: transaction.redirectUrl,
    });

    if (data.status !== "success") return;

    if (transaction.status !== "pending") {
      console.log("bkash-callback-transaction-already-done");
      return;
    }

    const token = await get_token_bkash();
    if (!token) {
      console.log("bkash-token-is-null");
      return;
    }

    const body = {
      paymentID: data.paymentID,
    };

    const executeObj = await axios.post(`${BKASH_URL}/execute`, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-app-key": BKASH_APP_KEY,
        Authorization: token,
      },
    });

    console.log("bkash-payment-execute-resp", executeObj.data); // return;

    if (executeObj.data.statusCode && executeObj.data.statusCode === "0000") {
      if (executeObj.data.transactionStatus === "Initiated") {
        return fetch_bkash(data.paymentID);
      } else {
        let transaction_status = "processing";

        if (executeObj.data.transactionStatus === "Completed") {
          transaction_status = "fully paid";
        } else if (executeObj.data.transactionStatus === "Pending Authorized") {
          transaction_status = "hold";
        } else if (executeObj.data.transactionStatus === "Expired") {
          transaction_status = "expired";
        } else if (executeObj.data.transactionStatus === "Declined") {
          transaction_status = "suspended";
        }

        const currentTime = new Date();
        transaction.status = transaction_status;
        transaction.statusDate = currentTime;
        transaction.transactionDate = currentTime;
        transaction.transactionId = executeObj.data.trxID;
        transaction.receivedAmount = executeObj.data.amount;
        transaction.payerAccount = executeObj.data.customerMsisdn;
        await transaction.save();

        if (
          transaction.callbackUrl &&
          (transaction.status === "fully paid" ||
            transaction.status === "expired" ||
            transaction.status === "suspended")
        ) {
          const merchant = await User.findOne({
            name: transaction.merchant,
            role: "merchant",
          });
          if (!merchant) throw Error("Merchant to callback does not exist");

          const hash = generate256Hash(
            transaction.paymentId +
              transaction.orderId +
              transaction.receivedAmount.toString() +
              transaction.currency +
              merchant.apiKey
          );

          let payload = {
            paymentId: transaction.paymentId,
            orderId: transaction.orderId,
            amount: transaction.receivedAmount,
            currency: transaction.currency,
            transactionId: transaction.transactionId,
            status: transaction.status,
            hash,
          };

          await axios
            .post(transaction.callbackUrl, payload, {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
            .then(async (resp) => {
              console.log(
                "bkash-payment-execute-callback-to-mechant-resp",
                resp.data,
                resp.status
              );
              if (resp.status == 200) {
                transaction.sentCallbackDate = new Date();
                await transaction.save();
              }
              console.log(
                "Callback has been sent to the merchant successfully"
              );
            })
            .catch((e) => {
              console.log(
                "bkash-payment-execute-callback-to-mechant-resp-error",
                e.message
              );
              console.log("Callback to the merchant failed");
            });
        }
      }
    } else if (executeObj.data.statusCode) {
      console.log(
        "bkash-payment-execute-others",
        executeObj.data.statusCode,
        executeObj.data.statusMessage
      );
      return;
    } else if (executeObj.data.errorCode) {
      console.log(
        "bkash-payment-execute-fail",
        executeObj.data.errorCode,
        executeObj.data.errorMessage
      );

      if (transaction.status !== "pending") {
        console.log("bkash-callback-transaction-already-done");
        return;
      }

      const currentTime = new Date();
      transaction.status = "suspended";
      transaction.statusDate = currentTime;
      await transaction.save();

      if (transaction.callbackUrl) {
        const merchant = await User.findOne({
          name: transaction.merchant,
          role: "merchant",
        });
        if (!merchant) throw Error("Merchant to callback does not exist");

        const hash = generate256Hash(
          transaction.paymentId +
            transaction.orderId +
            "0" +
            transaction.currency +
            merchant.apiKey
        );

        let payload = {
          paymentId: transaction.paymentId,
          orderId: transaction.orderId,
          amount: 0,
          currency: transaction.currency,
          transactionId: null,
          status: transaction.status,
          hash,
        };

        await axios
          .post(transaction.callbackUrl, payload, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then(async (resp) => {
            console.log(
              "bkash-payment-execute-callback-to-mechant-resp",
              resp.data
            );
            if (resp.data.success) {
              transaction.sentCallbackDate = new Date();
              await transaction.save();
            }
            console.log("Callback has been sent to the merchant successfully");
          })
          .catch((e) => {
            console.log(
              "bkash-payment-execute-callback-to-mechant-resp-error",
              e.message
            );
            console.log("Callback to the merchant failed");
          });
      }
    }
  } catch (e) {
    console.log("bkash-callback-error", e.message);
  }
};

const fetch_bkash = async (paymentID) => {
  console.log("bkash-fetch-data", paymentID);
  sleep(1000);

  try {
    const transaction = await PayinTransaction.findOne({
      paymentId: paymentID,
    });
    if (!transaction) {
      console.log("bkash-fetch-no-transaction-with-paymentID", paymentID);
      return;
    }

    const token = await get_token_bkash();
    if (!token) {
      console.log("bkash-token-is-null");
      return res.status(200).json({
        success: false,
        orderId: data.orderId,
        message: "Internal Error",
      });
    }

    const body = {
      paymentID,
    };

    const queryObj = await axios.post(`${BKASH_URL}/payment/status`, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-app-key": BKASH_APP_KEY,
        Authorization: token,
      },
    });

    console.log("bkash-payment-query-resp", queryObj.data); // return;

    if (queryObj.data.statusCode && queryObj.data.statusCode === "0000") {
      if (queryObj.data.transactionStatus === "Initiated") {
        fetch_bkash(paymentID);
      } else {
        let transaction_status = "processing";

        if (queryObj.data.transactionStatus === "Completed") {
          transaction_status = "fully paid";
        } else if (queryObj.data.transactionStatus === "Pending Authorized") {
          transaction_status = "hold";
        } else if (queryObj.data.transactionStatus === "Expired") {
          transaction_status = "expired";
        } else if (queryObj.data.transactionStatus === "Declined") {
          transaction_status = "suspended";
        }

        const currentTime = new Date();
        transaction.status = transaction_status;
        transaction.statusDate = currentTime;
        transaction.transactionDate = currentTime;
        transaction.transactionId = queryObj.data.trxID;
        transaction.receivedAmount = queryObj.data.amount;
        transaction.payerAccount = queryObj.data.customerMsisdn;
        await transaction.save();

        if (
          transaction.callbackUrl &&
          (transaction.status === "fully paid" ||
            transaction.status === "expired" ||
            transaction.status === "suspended") &&
          !transaction.sentCallbackDate
        ) {
          const merchant = await User.findOne({
            name: transaction.merchant,
            role: "merchant",
          });
          if (!merchant) throw Error("Merchant to callback does not exist");

          const hash = generate256Hash(
            transaction.paymentId +
              transaction.orderId +
              transaction.receivedAmount.toString() +
              transaction.currency +
              merchant.apiKey
          );

          let payload = {
            paymentId: transaction.paymentId,
            orderId: transaction.orderId,
            amount: transaction.receivedAmount,
            currency: transaction.currency,
            transactionId: transaction.transactionId,
            status: transaction.status,
            hash,
          };

          await axios
            .post(transaction.callbackUrl, payload, {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
            .then(async (resp) => {
              console.log("bkash-fetch-callback-to-mechant-resp", resp.data);
              if (resp.data.success) {
                transaction.sentCallbackDate = new Date();
                await transaction.save();
              }
              console.log(
                "Callback has been sent to the merchant successfully"
              );
            })
            .catch((e) => {
              console.log(
                "bkash-fetch-callback-to-mechant-resp-error",
                e.message
              );
              console.log("Callback to the merchant failed");
            });
        }
      }
    } else {
      console.log(
        "bkash-payment-query-fail",
        queryObj.data.errorCode,
        queryObj.data.errorMessage
      );
      const currentTime = new Date();
      transaction.status = "suspended";
      transaction.statusDate = currentTime;
      await transaction.save();
    }
  } catch (e) {
    console.log("bkash-fetch-error", e.message);
    fetch_bkash(paymentID);
  }
};