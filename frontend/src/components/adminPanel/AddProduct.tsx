import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./AddProduct.module.css";

interface CategoryProps {
  categoryId: number;
  categoryName: string;
}

interface BrandProps {
  brandId: number;
  brandName: string;
}

export default function AddProduct() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number>();
  const [brandId, setBrandId] = useState<number>();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [discount, setDiscount] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>();

  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("http://localhost:8080/categories");
      setCategories(response.data);
    };
    const fetchBrands = async () => {
      const response = await axios.get("http://localhost:8080/brands");
      setBrands(response.data);
    };

    fetchCategories();
    fetchBrands();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !description || !categoryId || !price || !stockQuantity) {
      setMessage("All required fields need to be filled");
      return;
    }

    const newProduct = {
      title: title,
      description: description,
      categoryId: categoryId,
      brandId: brandId,
      imageUrl: imageUrl,
      price: price,
      discount: discount,
      stockQuantity: stockQuantity,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/products",
        newProduct
      );

      setMessage("Product added successfully");
      console.log(response.data.product);
    } catch (err) {
      setMessage("There was an error while adding product");
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="titleInput">Title: </label>
          <input
            id="titleInput"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <br />
          <label htmlFor="descriptionInput">Description: </label>
          <input
            id="descriptionInput"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <br />
          <label htmlFor="categorySelect">Category: </label>
          <select
            id="categorySelect"
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value))}
            required
          >
            <option value="" selected disabled hidden>
              Choose category...
            </option>
            {categories.map((category) => {
              return (
                <option value={category.categoryId}>
                  {category.categoryName}
                </option>
              );
            })}
          </select>
          <br />
          <label htmlFor="brandSelect">Brand: </label>
          <select
            id="brandSelect"
            value={brandId}
            onChange={(e) => setBrandId(parseInt(e.target.value))}
            required
          >
            <option value="" selected disabled hidden>
              Choose brand...
            </option>
            {brands.map((brand) => {
              return <option value={brand.brandId}>{brand.brandName}</option>;
            })}
          </select>
          <br />
          <label htmlFor="imageUrlInput">Image URL: </label>
          <input
            id="imageUrlInput"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <br />
          <label htmlFor="priceInput">Price: </label>
          <input
            id="priceInput"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.valueAsNumber)}
            min={0.01}
            max={1e8}
            step={0.01}
            required
          />
          <br />
          <label htmlFor="discountInput">Discount: </label>
          <input
            id="discountInput"
            type="number"
            value={Math.round(discount * 100)}
            onChange={(e) => setDiscount(e.target.valueAsNumber / 100)}
            min={0}
            max={99}
            step={1}
            required
          />
          %
          <br />
          <label htmlFor="stockQuantityInput">Stock quantity: </label>
          <input
            id="stockQuantityInput"
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.valueAsNumber)}
            min={0}
            max={1e4}
            required
          />
          <br />
          <button type="submit">Add product</button>
        </form>
        {message && <div>{message}</div>}
      </div>
    </>
  );
}
