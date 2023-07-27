import { Container } from "react-bootstrap";
import css from "./Form.module.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { sendTransaction } from "../../redux/operations";
import { useWallet } from "../../hooks";
import Loader from "./Loader";
import { handleErrors } from "../../toastify";

const initialState = { address: "", tokens: "" };

const FormFields = () => {
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const { isLoading, isConnected, error } = useWallet();

  useEffect(() => {
    handleErrors(error);
  }, [error]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(sendTransaction(state));
    reset();
  };

  const reset = () => {
    setState(initialState);
  };

  return (
    <Container>
      <Container className={css.modal}>
        <Form>
          <fieldset>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="disabledTextInput">Address</Form.Label>
              <Form.Control
                type="text"
                id="disabledTextInput"
                placeholder="Please, enter your address"
                value={state.address}
                onChange={({ target }) =>
                  setState((prev) => ({ ...prev, address: target.value }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="disabledTextInput">Token count</Form.Label>
              <Form.Control
                type="number"
                id="disabledTextInput"
                placeholder="Please, enter your count tokens "
                value={state.tokens}
                onChange={({ target }) =>
                  setState((prev) => ({ ...prev, tokens: target.value }))
                }
              />
            </Form.Group>
            <Button
              type="submit"
              disabled={isLoading}
              className={css.button}
              onClick={(e) => handleOnSubmit(e)}
            >
              {isConnected && isLoading ? (
                <Loader switch={isConnected} />
              ) : (
                "Send"
              )}
            </Button>
          </fieldset>
        </Form>
      </Container>
    </Container>
  );
};

export default FormFields;
