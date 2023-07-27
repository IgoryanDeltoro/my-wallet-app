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
    if (window.ethereum) {
      try {
        // Request account access from the user
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Set up ethers provider with MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // Use the signer to interact with the Ethereum blockchain
        // For example, signer.getAddress(), signer.sendTransaction(), etc.
        const address = await signer.getAddress();
        console.log("Connected Ethereum address:", address);

        // Example: Get the balance of the connected address
        const balance = await signer.getBalance();
        console.log("Account balance:", ethers.utils.formatEther(balance));
        return {
          address,
          balance: formatBalance(balance),
        };
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error(
        "MetaMask not detected. Please install the MetaMask extension."
      );
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
