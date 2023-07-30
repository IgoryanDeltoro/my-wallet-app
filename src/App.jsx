import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
