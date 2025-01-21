import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label htmlFor="usernameInput">Login: </label>
        <input
          id="usernameInput"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <label htmlFor="passwordInput">Password: </label>
        <input
          id="passwordInput"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit" onSubmit={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}
