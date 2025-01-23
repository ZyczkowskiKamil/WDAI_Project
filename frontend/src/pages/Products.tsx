import { useEffect, useState } from "react";
import Product from "../components/products/Product";
import axios from "axios";
import styles from "./Products.module.css";

interface ProductProps {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  brandId: number;
  imageUrl: string | null;
  price: number;
  discount: number;
}

interface CategoryProps {
  categoryId: number;
  categoryName: string;
}

interface BrandProps {
  brandId: number;
  brandName: string;
}

export default function Products() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [brands, setBrands] = useState<BrandProps[]>([]);

  const [tempSearchedValue, setTempSearchedValue] = useState<string>("");
  const [searchedValue, setSearchedValue] = useState<string>("");
  const [tempCategoryId, setTempCategoryId] = useState<number>();
  const [categoryId, setCategoryId] = useState<number>();
  const [tempBrandId, setTempBrandId] = useState<number>();
  const [brandId, setBrandId] = useState<number>();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSearchedValue(tempSearchedValue);
    setCategoryId(tempCategoryId);
    setBrandId(tempBrandId);
  };

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
    const fetchCategories = async () => {
      const response = await axios.get("http://localhost:8080/categories");
      setCategories(response.data);
    };
    const fetchBrands = async () => {
      const response = await axios.get("http://localhost:8080/brands");
      setBrands(response.data);
    };

    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.productsWrapper}>
      <div className={styles.searchDiv}>
        Search:
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={tempSearchedValue}
            onChange={(e) => {
              setTempSearchedValue(e.target.value);
            }}
          />
          <br />
          <label htmlFor="categorySelect">Category: </label>
          <br />
          <select
            id="categorySelect"
            value={tempCategoryId}
            onChange={(e) => setTempCategoryId(parseInt(e.target.value))}
            defaultValue={undefined}
          >
            <option value={undefined}>Choose category...</option>
            {categories.map((category) => {
              return (
                <option value={category.categoryId} key={category.categoryId}>
                  {category.categoryName}
                </option>
              );
            })}
          </select>
          <br />
          <label htmlFor="brandSelect">Brand: </label>
          <br />
          <select
            id="brandSelect"
            value={tempBrandId}
            onChange={(e) => setTempBrandId(parseInt(e.target.value))}
            defaultValue={undefined}
          >
            <option value={undefined}>Choose brand...</option>
            {brands.map((brand) => {
              return (
                <option value={brand.brandId} key={brand.brandId}>
                  {brand.brandName}
                </option>
              );
            })}
          </select>
          <br />
          <br />
          <button type="submit">Search</button>
        </form>
      </div>
      <div className={styles.productsDiv}>
        {products.map((product) => {
          const regex = new RegExp(searchedValue, "i");
          if (
            (!categoryId || product.categoryId === categoryId) &&
            (!brandId || product.brandId === brandId) &&
            regex.test(product.title)
          )
            return <Product key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
}
