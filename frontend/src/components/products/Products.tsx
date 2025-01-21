import { useEffect, useState } from "react";
import Product from "./Product";
import axios from "axios";
import styles from "./Products.module.css";

interface ProductProps {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  imageUrl: string | null;
  price: number;
  discount: number;
}

export default function Products() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products");
        setProducts(response.data);
      } catch (err) {
        setError("Error fetching products");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className={styles.productsDiv}>
        {products.map((product) => {
          return <Product key={product.id} product={product} />;
        })}
      </div>
    </>
  );
}
