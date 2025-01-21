import { useState } from "react";
import styles from "./AdminPanel.module.css";
import AddProduct from "../components/adminPanel/AddProduct";

export default function AdminPanel() {
  const [bigAddProduct, setBigAddProduct] = useState<boolean>(false);

  return (
    <>
      <div className={styles.panelDiv}>
        <div
          className={styles.optionDiv}
          onClick={() => setBigAddProduct(true)}
        >
          Add product
        </div>
        <div className={styles.optionDiv}>Modify product</div>
      </div>

      {bigAddProduct && (
        <div className={styles.disableOutsideClicks}>
          <div className={styles.bigAddProductDiv}>
            <AddProduct />
            <button onClick={() => setBigAddProduct(false)}>CLOSE</button>
          </div>
        </div>
      )}
    </>
  );
}
