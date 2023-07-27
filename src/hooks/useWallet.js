import { useSelector } from "react-redux";
import {
  selectAddress,
  selectIsConnected,
  selectError,
  selectIsLoading,
  selectBalance,
} from "../redux/selectors";

export const useWallet = () => {
  const address = useSelector(selectAddress);
  const isConnected = useSelector(selectIsConnected);
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);
  const balance = useSelector(selectBalance);

  return {
    error,
    address,
    balance,
    isLoading,
    isConnected,
  };
};
