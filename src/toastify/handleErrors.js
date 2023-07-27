import { toast } from "react-toastify";

export const handleErrors = (error) => {
  switch (error?.code) {
    case 4001:
      toast.error(error?.message);
      break;
    case 4002:
      toast.error(error?.message);
      break;
    case -32602:
      toast.error(error?.message);
      break;
    case -32603:
      toast.error(error?.message);
      break;
    case -32000:
      toast.error("Insufficient funds");
      break;
    default:
      break;
  }
};
