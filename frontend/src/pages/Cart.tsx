import { useEffect, useState } from "react";
import Product from "../components/products/Product";
import { useAuthContext } from "../contexts/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

export default function Cart() {
  const { userId } = useAuthContext();
  const navigate = useNavigate();

  const [cart, setCart] = useState<
    Array<{ product: ProductProps; qty: number }>
  >([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const localStorageCart = localStorage.getItem("cart");
    setCart(localStorageCart ? JSON.parse(localStorageCart) : []);
  }, []);

  useEffect(() => {
    const calculateTotalPrice = () => {
      let newTotalPrice = 0;

      cart.map((element) => {
        const productPriceAfterDiscount: number = parseFloat(
          (element.product.price * (1 - element.product.discount)).toFixed(2)
        );

        newTotalPrice += productPriceAfterDiscount * element.qty;
      });

      setTotalPrice(newTotalPrice);
    };

    calculateTotalPrice();
  }, [cart]);

  const handleOrder = () => {
    if (userId === null) {
      navigate("/login");
      return;
    }

    let cartBref: Array<{
      id: number;
      priceAfterDiscount: number;
      quantity: number;
    }> = [];
    cart.map((element) => {
      const productPriceAfterDiscount: number = parseFloat(
        (element.product.price * (1 - element.product.discount)).toFixed(2)
      );

      cartBref.push({
        id: element.product.id,
        priceAfterDiscount: productPriceAfterDiscount,
        quantity: element.qty,
      });
    });

    const jwtToken = localStorage.getItem("jwtToken");

    const response = axios.post(
      "http://localhost:8080/orders/placeOrderWithCart",
      { jwtToken: jwtToken, cartBref: cartBref }
    );
  };

  return (
    <>
      <div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((element) => {
              const productPriceAfterDiscount: number = parseFloat(
                (
                  element.product.price *
                  (1 - element.product.discount)
                ).toFixed(2)
              );

              return (
                <tr key={element.product.id}>
                  <td>
                    {" "}
                    <Product product={element.product} />
                  </td>
                  <td>{element.qty}</td>
                  <td>
                    {(productPriceAfterDiscount * element.qty).toFixed(2)}zł
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div>Total: {totalPrice}</div>
        <button
          onClick={() => {
            localStorage.removeItem("cart");
            setCart([]);
          }}
        >
          Reset order
        </button>
        <button onClick={handleOrder}>Place order</button>
      </div>
    </>
  );
}
