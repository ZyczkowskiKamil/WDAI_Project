import axios from "axios";
import { useState } from "react";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!login || !password || !firstName || !lastName || !email) {
      setError("All fields need to be filled");
      return;
    }

    const newUser = {
      login: login,
      password: password,
      firstName: firstName,
      lastName: lastName,
      email: email,
    };

    try {
      try {
        const loginResponse = await axios.get(
          `http://localhost:8080/users/checkloginavailable/${login}`
        );

        if (
          loginResponse.status === 200 &&
          loginResponse.data.available === true
        ) {
          // expected - username is available
        } else {
          setError("Username is already taken");
          return;
        }
      } catch (err) {
        console.log("Error checking username in database: ", err);
        setError("An error occurred while validating the username");
        return;
      }

      try {
        const emailResponse = await axios.get(
          `http://localhost:8080/users/checkemailavailable/${email}`
        );

        if (
          emailResponse.status === 200 &&
          emailResponse.data.available === true
        ) {
          // expected - email is available
        } else {
          setError("Email is already taken");
          return;
        }
      } catch (err) {
        console.log("Error checking email in database: ", err);
        setError("An error occurred while validating the email");
        return;
      }

      await axios.post("http://localhost:8080/users", newUser);

      setError("Registered successfully");

      console.log();

      navigate("/login");
    } catch (err) {
      setError("There was an error during register");
      console.log(err);
    }
  };

  return (
    <div className={styles.pageDiv}>
      <div className={styles.registerWrapper}>
        <h1>REGISTER</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login-input">
              <input
                id="login-input"
                type="text"
                value={login}
                placeholder="Username"
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </label>
          </div>

          <div>
            <label htmlFor="password-input">
              <input
                id="password-input"
                type="text"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>

          <div>
            <label htmlFor="firstname-input">
              <input
                id="firstname-input"
                type="text"
                value={firstName}
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
          </div>

          <div>
            <label htmlFor="lastname-input">
              <input
                id="lastname-input"
                type="text"
                value={lastName}
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
          </div>

          <div>
            <label htmlFor="email-input">
              <input
                id="email-input"
                type="text"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>

          <div>
            {" "}
            <button type="submit">Sign up</button>
          </div>
        </form>

        {error ? <div className={styles.errorMessageDiv}>{error}</div> : <></>}
      </div>
    </div>
  );
}
