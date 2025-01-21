import { Link, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import { useState } from "react";

export default function Layout() {
  const [searchedValue, setSearchedValue] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(`Search: ${searchedValue}`);
  };

  return (
    <>
      <nav className={styles.navBar}>
        <ul>
          <li>
            <img className={styles.shopLogo} src="src/assets/logo.png" alt="" />
          </li>
          <li className={styles.shopName}>OnlineShop</li>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchedValue}
                onChange={(e) => {
                  setSearchedValue(e.target.value);
                }}
              />
              <button type="submit">Search</button>
            </form>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/adminPanel">AdminPanel</Link>
          </li>
        </ul>
      </nav>

      <Outlet />

      <footer className={styles.footer}>Stopka</footer>
    </>
  );
}
