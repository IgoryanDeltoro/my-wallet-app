import { createAsyncThunk } from "@reduxjs/toolkit";
import { formatBalance } from "../utils/index";
import { ethers } from "ethers";
import { toast } from "react-toastify";

export const fetchToGetAccount = createAsyncThunk(
  "wallet/getAccount",
  async (_, thunkAPI) => {
    const { ethereum } = window;
    try {
      if (typeof ethereum !== "undefined") {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        const balance = await ethereum?.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        });

        toast.success("Connection to the wallet has been successful");
        return {
          address: accounts[0],
          balance: formatBalance(balance),
        };
      } else {
        return thunkAPI.rejectWithValue({
          code: 4042,
          message: "MetaMask is not installed or not available.",
        });
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const sendTransaction = createAsyncThunk(
  "wallet/transaction",
  async (data, thunkAPI) => {
    const { ethereum } = window;
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const transaction = await signer.sendTransaction({
        to: data.address,
        value: ethers.utils.parseEther(data.tokens),
      });

      await transaction.wait();

      if (transaction) {
        const balanceInEther = await signer.getBalance();
        const currentBalance = ethers.utils.formatUnits(balanceInEther, 18);
        toast.success("Transaction has been successful");

        return { balance: Number(currentBalance).toFixed(2) };
      }
    } catch ({ error }) {
      return thunkAPI.rejectWithValue(
        error
          ? error
          : { code: 4001, message: "User denied transaction signature" }
      );
    }
  }
);
