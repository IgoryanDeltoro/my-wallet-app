import { createAsyncThunk } from "@reduxjs/toolkit";
import { formatBalance } from "../utils/index";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { toast } from "react-toastify";

export const fetchToGetAccount = createAsyncThunk(
  "wallet/getAccount",
  async (_, thunkAPI) => {
    const { ethereum } = window;
    const provider = await detectEthereumProvider();

    if (provider) {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const address = await signer.getAddress();
        const balance = await signer.getBalance();

        return {
          address,
          balance: formatBalance(balance),
        };
      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    } else {
      return thunkAPI.rejectWithValue({
        code: 4042,
        message:
          "MetaMask is not installed or not available. Please, instal  MetaMask app",
      });
    }
    // try {
    //   if (provider) {
    //     if (provider === ethereum) {
    //       const accounts = await ethereum?.request({
    //         method: "eth_requestAccounts",
    //       });

    //       const balance = await ethereum?.request({
    //         method: "eth_getBalance",
    //         params: [accounts[0], "latest"],
    //       });

    //       toast.success("Connection to the wallet has been successful");
    //       return {
    //         address: accounts[0],
    //         balance: formatBalance(balance),
    //       };
    //     } else {
    //       return thunkAPI.rejectWithValue({
    //         code: 4042,
    //         message: "Do you have multiple wallets installed?",
    //       });
    //     }
    //   } else {
    //     return thunkAPI.rejectWithValue({
    //       code: 4042,
    //       message:
    //         "MetaMask is not installed or not available. Please, instal  MetaMask app",
    //     });
    //   }
    // } catch (error) {
    //   return thunkAPI.rejectWithValue(error);
    // }
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
