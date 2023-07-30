import { ToastContainer } from "react-toastify";
import { FormFields, Header } from "./components";

const App = () => {
  return (
    <>
      <Header />
      <FormFields />
      <ToastContainer />
    </>
  );
};

export default App;
