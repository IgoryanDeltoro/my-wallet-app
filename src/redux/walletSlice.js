import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { fetchToGetAccount, sendTransaction } from "./operations";
import {
  handlePending,
  handleRejected,
  handleGetAccountFulfilled,
  sendTransactionsFulfilled,
  handlePendingTransaction,
} from "./constants";

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchToGetAccount.pending, handlePending)
      .addCase(fetchToGetAccount.fulfilled, handleGetAccountFulfilled)
      .addCase(fetchToGetAccount.rejected, handleRejected)
      .addCase(sendTransaction.pending, handlePendingTransaction)
      .addCase(sendTransaction.fulfilled, sendTransactionsFulfilled)
      .addCase(sendTransaction.rejected, handleRejected);
  },
});

export default walletSlice.reducer;
