import { Link, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import { useAuthContext } from "../contexts/AuthContextProvider";

export default function Layout() {
  const { userId } = useAuthContext();

  return (
    <>
      <nav className={styles.navBar}>
        <ul>
          <li>
            <img className={styles.shopLogo} src="src/assets/logo.png" alt="" />
          </li>
          <li className={styles.shopName}>
            <Link to="/">OnlineShop</Link>
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
            {userId ? (
              <Link to="/profile">Profile</Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>

      <Outlet />

      <footer className={styles.footer}>
        Stopka
        <Link to="/adminPanel">AdminPanel</Link>
      </footer>
    </>
  );
}
