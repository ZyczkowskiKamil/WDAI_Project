import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface OrdersProps {
  orderId: number;
  userId: number;
  orderDate: string;
  paidDate: string | null;
  paid: boolean;
  completed: boolean;
}

export default function Profile() {
  const navigate = useNavigate();
  const { userId, logout } = useAuthContext();

  const [userOrders, setUserOrder] = useState<OrdersProps[]>([]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");

        const response = await axios.post(
          "http://localhost:8080/orders/getOrdersWithToken",
          { jwtToken }
        );

        setUserOrder(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserOrders();
  }, []);

  return (
    <div>
      <div>Profile</div>
      <div>{userId}</div>
      <div>Orders:</div>
      <div>
        {userOrders.map((order) => {
          return <div key={order.orderId}>{order.orderId}</div>;
        })}
      </div>
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}
