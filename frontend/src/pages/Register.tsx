import axios from "axios";
import { useState } from "react";

export default function Register() {
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
    } catch (err) {
      setError("There was an error during register");
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-input">Login: </label>
        <input
          id="login-input"
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password-input">Password: </label>
        <input
          id="password-input"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <label htmlFor="firstname-input">First name: </label>
        <input
          id="firstname-input"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <br />
        <label htmlFor="lastname-input">Last name: </label>
        <input
          id="lastname-input"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <br />
        <label htmlFor="email-input">Email: </label>
        <input
          id="email-input"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>
      {error != null && error}
    </div>
  );
}
