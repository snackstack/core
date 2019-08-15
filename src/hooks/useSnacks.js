import SnackContext from "../context/SnackContext";
import { useContext } from "react";

export default () => {
  const { enqueueSnack, closeSnack } = useContext(SnackContext);

  return [enqueueSnack, closeSnack];
};
