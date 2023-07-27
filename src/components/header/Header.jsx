import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { fetchToGetAccount } from "../../redux/operations";
import { cutString } from "../../utils/index";
import { useWallet } from "../../hooks";
import logo from "../../assets/ethereum-logo.svg";
import css from "./Header.module.css";

const Header = () => {
  const { address, isLoading, isConnected, balance } = useWallet();
  const dispatch = useDispatch();
  const cutAddress = cutString(address);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    dispatch(fetchToGetAccount());
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand className={css.logo}>
            <img
              alt="logo"
              src={logo}
              width="40"
              className="d-inline-block align-top"
            />
            Ethereum Wallet
          </Navbar.Brand>
          {!isConnected && (
            <Button
              className={css.button}
              variant="outline-success"
              onClick={(event) => handleOnSubmit(event)}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Connect wallet"}
            </Button>
          )}

          {isConnected && (
            <>
              <Navbar.Text className={css.balanceTxt}>{balance}</Navbar.Text>
              <Navbar.Text className={css.addressTxt}>{cutAddress}</Navbar.Text>
            </>
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
