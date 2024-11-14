import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";

const http = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  credentials: "include",
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Customers",
    "Products",
    "Transactions",
    "Refunds",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
    "ApiAccountBkash",
    "ApiAccountNagad",
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => `client/products`,
      providesTags: ["Products"],
    }),
    getMerchants: build.query({
      query: () => `client/merchants/`,
      providesTags: ["Merchants"],
    }),
    getUsers: build.query({
      query: () => `client/users/`,
      providesTags: ["Users"],
    }),
    getNumbers: build.query({
      query: () => `client/numbers/`,
      providesTags: ["Numbers"],
    }),
    getApiAccountBkash: build.query({
      query: () => `client/apiAccountBkash/`,
      providesTags: ["ApiAccountBkash"],
    }),
    getApiAccountNagad: build.query({
      query: () => `client/apiAccountNagad/`,
      providesTags: ["ApiAccountNagad"],
    }),
    getTransactions: build.query({
      query: ({
        id,
        startDate,
        endDate,
        page,
        pageSize,
        sort,
        search,
        mode,
      }) => ({
        url: `client/transactions`,
        method: "GET",
        params: {
          id: JSON.stringify(id),
          startDate,
          endDate,
          page,
          pageSize,
          sort,
          search,
          mode,
        },
      }),
      tagTypes: ["Transactions"],
    }),
    getRefunds: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: `client/refunds`,
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      tagTypes: ["Refunds"],
    }),
    getGeoLocations: build.query({
      query: () => `client/geography`,
      providesTags: ["Geography"],
    }),
    getOverallSales: build.query({
      query: () => `sales/sales`,
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => `management/admin`,
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      query: ({ id, startDate, endDate, mode }) => ({
        url: `general/dashboard`,
        method: "GET",
        params: { id: JSON.stringify(id), startDate, endDate, mode },
      }),
      tagTypes: ["Dashboard"],
    }),
    getChart: build.query({
      query: ({ id, startDate, endDate, mode }) => ({
        url: `general/chart`,
        method: "GET",
        params: { id: JSON.stringify(id), startDate, endDate, mode },
      }),
      tagTypes: ["Chart"],
    }),
    getPie: build.query({
      query: ({ id, startDate, endDate, mode }) => ({
        url: `general/pie`,
        method: "GET",
        params: { id: JSON.stringify(id), startDate, endDate, mode },
      }),
      tagTypes: ["Pie"],
    }),
  }),
});

export const authApi = {
  auth(url = "auth") {
    return {
      login: ({ email, password }) =>
        http.post(url + "/login", { email, password }),
      register: ({ email, name, password }) =>
        http.post(url + "/register", { email, name, password }),
    };
  },

  map(url = "map") {
    const config = {
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      withCredentials: true,
    };

    return {
      fetchAll: () => http.get(url + "/list", config),
      fetchPagination: (page, limit, name, category) =>
        http.get(
          url +
            "?page=" +
            page +
            "&limit=" +
            limit +
            "&name=" +
            name +
            "&category=" +
            category,
          config
        ),
      fetchById: (id) => http.get(url + "/" + id, config),
      create: (newRecord) => http.post(url, newRecord, config),
      update: (id, updatedRecord) =>
        http.put(url + "/" + id, updatedRecord, config),
      delete: (id) => http.delete(url + "/" + id, config),
    };
  },

  user(url = "user") {
    const config = {
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      withCredentials: true,
    };

    return {
      fetchAll: () => http.get(url + "/list", config),
      fetchPagination: (page, limit = 10, name = null, email = null) =>
        http.get(
          url +
            "?page=" +
            page +
            "&limit=" +
            limit +
            "&name=" +
            name +
            "&email=" +
            email,
          config
        ),
      fetchById: (id) => http.get(url + "/" + id, config),
      create: (newRecord) => http.post(url, newRecord, config),
      update: (id, updatedRecord) =>
        http.put(url + "/" + id, updatedRecord, config),
      delete: (id) => http.delete(url + "/" + id, config),
    };
  },
};

export const generalApi = {
  general(url = "general") {
    return {
      getUser: (id) =>
        http
          .get(url + `/getUser/${id}`, { withCredentials: true })
          .then((res) => res.data),
      addUser: ({ name, email, password, websiteUrl, currency, role }) =>
        http.post(
          url + `/addUser`,
          { name, email, password, websiteUrl, currency, role },
          { withCredentials: true }
        ), // authCode,  authCode,
      updateUser: ({ id, name, websiteUrl, currency, apiKey, status }) =>
        http.post(
          url + `/updateUser`,
          { id, name, websiteUrl, currency, apiKey, status },
          { withCredentials: true }
        ), // authCode, authCode,
      updatePassword: ({ id, oldP, newP }) =>
        http.post(
          url + `/updatePassword`,
          { id, oldP, newP },
          { withCredentials: true }
        ),
      deleteUser: (id) =>
        http.post(url + `/deleteUser`, { id }, { withCredentials: true }),
      addAgentNumber: ({
        merchant,
        mfs,
        currency,
        accountNumber,
        limitAmount,
      }) =>
        http.post(
          url + `/addAgentNumber`,
          { merchant, mfs, currency, accountNumber, limitAmount },
          { withCredentials: true }
        ),
      updateAgentNumber: ({
        id,
        merchant,
        mfs,
        currency,
        accountNumber,
        limitAmount,
        status,
      }) =>
        http.post(
          url + `/updateAgentNumber`,
          { id, merchant, mfs, currency, accountNumber, limitAmount, status },
          { withCredentials: true }
        ),
      deleteAgentNumber: (id) =>
        http.post(
          url + `/deleteAgentNumber`,
          { id },
          { withCredentials: true }
        ),
      addApiAccountBkash: ({
        accountName,
        accountNumber,
        username,
        password,
        appKey,
        appSecretKey,
      }) =>
        http.post(
          url + `/addApiAccountBkash`,
          {
            accountName,
            accountNumber,
            username,
            password,
            appKey,
            appSecretKey,
          },
          { withCredentials: true }
        ),
      addApiAccountNagad: ({
        accountName,
        accountNumber,
        username,
        password,
        appKey,
        appSecretKey,
      }) =>
        http.post(
          url + `/addApiAccountNagad`,
          {
            accountName,
            accountNumber,
            username,
            password,
            appKey,
            appSecretKey,
          },
          { withCredentials: true }
        ),
      updateApiAccountBkash: ({
        id,
        accountName,
        accountNumber,
        username,
        password,
        appKey,
        appSecretKey,
        status,
      }) =>
        http.post(
          url + `/updateApiAccountBkash`,
          {
            id,
            accountName,
            accountNumber,
            username,
            password,
            appKey,
            appSecretKey,
            status,
          },
          { withCredentials: true }
        ),
      updateApiAccountNagad: ({
        id,
        accountName,
        accountNumber,
        username,
        password,
        appKey,
        appSecretKey,
        status,
      }) =>
        http.post(
          url + `/updateApiAccountNagad`,
          {
            id,
            accountName,
            accountNumber,
            username,
            password,
            appKey,
            appSecretKey,
            status,
          },
          { withCredentials: true }
        ),
      deleteApiAccountBkash: (id) =>
        http.post(
          url + `/deleteApiAccountBkash`,
          { id },
          { withCredentials: true }
        ),
      deleteApiAccountNagad: (id) =>
        http.post(
          url + `/deleteApiAccountNagad`,
          { id },
          { withCredentials: true }
        ),
      deletePayinTransaction: (id) =>
        http.post(
          url + `/deletePayinTransaction`,
          { id },
          { withCredentials: true }
        ),
      deletePayoutTransaction: (id) =>
        http.post(
          url + `/deletePayoutTransaction`,
          { id },
          { withCredentials: true }
        ),
      refundTransaction: (mid, apiKey, transactionId, amount) =>
        http.post(
          `payment/refund2d`,
          { mid, transactionId, amount },
          { headers: { "x-api-key": apiKey }, withCredentials: true }
        ),
    };
  },
};

export const paymentApi = {
  payment(url = "payment") {
    return {
      checkout: ({ paymentId }) =>
        http.post(url + `/checkout`, { paymentId }, { withCredentials: true }),
      paymentSubmit: ({
        paymentId,
        provider,
        agentAccount,
        payerAccount,
        transactionId,
      }) =>
        http.post(
          url + `/paymentSubmit`,
          { paymentId, provider, agentAccount, payerAccount, transactionId },
          { withCredentials: true }
        ),
      payout: ({
        merchant,
        orderId,
        payeeId,
        payeeAccount,
        provider,
        callbackUrl,
        currency,
        amount,
      }) =>
        http.post(
          url + `/payout`,
          {
            mid: merchant,
            orderId,
            payeeId,
            payeeAccount,
            provider,
            callbackUrl,
            currency,
            amount,
          },
          { withCredentials: true }
        ),
      payment: ({
        mid,
        provider,
        orderId,
        payerId,
        amount,
        currency,
        redirectUrl,
      }) =>
        http.post(
          url + `/payment`,
          { mid, provider, orderId, payerId, amount, currency, redirectUrl },
          { withCredentials: true }
        ),
      callbackbkash: ({ paymentID, status }) =>
        http.post(
          url + `/p2c/bkash/callback`,
          { paymentID, status },
          { withCredentials: true }
        ),
    };
  },
};

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetUsersQuery,
  useGetNumbersQuery,
  useGetApiAccountBkashQuery,
  useGetApiAccountNagadQuery,
  useGetMerchantsQuery,
  useGetTransactionsQuery,
  useGetRefundsQuery,
  useGetGeoLocationsQuery,
  useGetOverallSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
  useGetChartQuery,
  useGetPieQuery,
} = api;
