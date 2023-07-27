import { createAsyncThunk } from "@reduxjs/toolkit";
// import { formatBalance } from "../utils/index";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers, formatUnits, parseEther } from "ethers";
import { toast } from "react-toastify";

export const fetchToGetAccount = createAsyncThunk(
  "wallet/getAccount",
  async () => {
    /*****************************************/
    /* Detect the MetaMask Ethereum provider */
    /*****************************************/

    const provider = await detectEthereumProvider();

    if (provider) {
      startApp(provider);
    } else {
      console.log("Please install MetaMask!");
    }

    function startApp(provider) {
      if (provider !== window.ethereum) {
        console.error("Do you have multiple wallets installed?");
      }
    }

    /**********************************************************/
    /* Handle chain (network) and chainChanged (per EIP-1193) */
    /**********************************************************/

    await window.ethereum.request({ method: "eth_chainId" });

    window.ethereum.on("chainChanged", handleChainChanged);

    function handleChainChanged() {
      window.location.reload();
    }

    /***********************************************************/
    /* Handle user accounts and accountsChanged (per EIP-1193) */
    /***********************************************************/

    let currentAccount = null;
    window.ethereum
      .request({ method: "eth_accounts" })
      .then(handleAccountsChanged)
      .catch((err) => {
        console.error(err);
      });

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        console.log("Please connect to MetaMask.");
      } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
      }
    }

    /*********************************************/
    /* Access the user's accounts (per EIP-1102) */
    /*********************************************/

    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .catch((err) => {
        if (err.code === 4001) {
          console.log("Please connect to MetaMask.");
        } else {
          console.error(err);
        }
      });

    return {
      address: ";l;slk;ldk;lask;ldkslkdkfjfghfgd",
      balance: "lklkdlfkds",
    };

    // const { ethereum } = window;
    // const provide = await detectEthereumProvider();

    // if (provide) {
    //   try {
    //     await ethereum.request({ method: "eth_requestAccounts" });

    //     const provider = new ethers.BrowserProvider(ethereum);
    //     const signer = await provider.getSigner();

    //     const address = await signer.getAddress();
    //     const balance = await provider.getBalance(address);

    //     return {
    //       address,
    //       balance: formatBalance(balance),
    //     };
    //   } catch (error) {
    //     return thunkAPI.rejectWithValue(error);
    //   }
    // } else {
    //   return thunkAPI.rejectWithValue({
    //     code: 4042,
    //     message:
    //       "MetaMask is not installed or not available. Please, instal  MetaMask app",
    //   });
    // }
  }
);

export const sendTransaction = createAsyncThunk(
  "wallet/transaction",
  async (data, thunkAPI) => {
    const { ethereum } = window;
    const { address } = thunkAPI.getState().wallet;
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const transaction = await signer.sendTransaction({
        to: data.address,
        value: parseEther(data.tokens),
      });

      await transaction.wait();

      if (transaction) {
        const balanceInEther = await provider.getBalance(address);
        const currentBalance = formatUnits(balanceInEther, 18);
        toast.success("Transaction has been successful");

        return { balance: Number(currentBalance).toFixed(2) };
      }
    } catch ({ info }) {
      return thunkAPI.rejectWithValue(info.error);
    }
  }
);
