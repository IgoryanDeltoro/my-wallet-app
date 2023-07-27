export const handlePending = (state) => {
  state.isConnected = false;
  state.isLoading = true;
};

export const handlePendingTransaction = (state) => {
  state.isLoading = true;
};

export const handleRejected = (state, { payload }) => {
  state.isLoading = false;
  state.error = payload;
};

export const handleGetAccountFulfilled = (state, { payload }) => {
  state.isLoading = false;
  state.address = payload.address;
  state.balance = payload.balance;
  state.isConnected = true;
  state.error = null;
};

export const sendTransactionsFulfilled = (state, { payload }) => {
  state.isLoading = false;
  state.balance = payload.balance;
  state.error = null;
};
