import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContextProvider";

export default function Cart() {
  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    if (isLoggedIn) {
      // fetch products from database
    } else {
      // fetch products from sesion cookies
    }
  }, [isLoggedIn]);

  return <>{isLoggedIn ? <div>Logged in</div> : <div>not logged in</div>}</>;
}
