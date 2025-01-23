import { Link, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

export default function Layout() {
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
            <Link to="/products">Products</Link>
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
            <Link to="/adminPanel">AdminPanel</Link>
          </li>
        </ul>
      </nav>

      <Outlet />

      <footer className={styles.footer}>Stopka</footer>
    </>
  );
}
