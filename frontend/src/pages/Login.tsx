import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import axios from "axios";
import { useAuthContext } from "../contexts/AuthContextProvider";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setError("All fields need to be filled");
      return;
    }

    const loginAuth = {
      login: username,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/users/authenticateLogin",
        loginAuth
      );

      if (response.status === 200) {
        const jwtToken = response.data.jwtToken;

        login(jwtToken);
        navigate("/products");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          setError("Invalid username or password. Please try again.");
        } else {
          setError("There was an error during authentication");
        }
      } else {
        setError("There was an error during authentication");
      }
    }
  };

  return (
    <div className={styles.pageDiv}>
      <div className={styles.loginWrapper}>
        <h1>LOGIN</h1>

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="usernameInput">
              <input
                id="usernameInput"
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>

          <div>
            <label htmlFor="passwordInput">
              <input
                id="passwordInput"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>

          <div>
            <button type="submit">Login</button>
          </div>
        </form>

        {error ? <div className={styles.errorMessageDiv}>{error}</div> : <></>}

        <div>
          Don't have account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
