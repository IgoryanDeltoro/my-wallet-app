import { ThreeDots } from "react-loader-spinner";

const Loader = (switcher) => {
  return (
    <ThreeDots
      height="30"
      width="40"
      radius="9"
      color="#f7d439"
      ariaLabel="three-dots-loading"
      wrapperStyle={{ marginLeft: 43 }}
      wrapperClassName=""
      visible={switcher}
    />
  );
};

export default Loader;
