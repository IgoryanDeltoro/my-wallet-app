import { ethers } from "ethers";

export const isValidEtherAddress = (address) => {
  if (ethers.isAddress(address)) {
    return true;
  }
  return false;
};
