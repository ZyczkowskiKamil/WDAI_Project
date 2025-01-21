import axios from "axios";
import React, { useState } from "react";

export default function AddProduct() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number>();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [discount, setDiscount] = useState<number>(0);

  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !description || !categoryId || !price) {
      setMessage("All required fields need to be filled");
      return;
    }

    const newProduct = {
      title: title,
      description: description,
      categoryId: categoryId,
      imageUrl: imageUrl,
      price: price,
      discount: discount,
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
    <div>
      <form onSubmit={handleSubmit}>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />
        Category ID:
        <input
          type="number"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.valueAsNumber)}
          min={1}
          required
        />
        <br />
        Image URL:
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <br />
        Price:
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.valueAsNumber)}
          min={0.01}
          max={1e8}
          step={0.01}
          required
        />
        <br />
        Discount:
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.valueAsNumber)}
          min={0}
          max={0.99}
          step={0.01}
          required
        />
        <br />
        <button type="submit">Add product</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
}
