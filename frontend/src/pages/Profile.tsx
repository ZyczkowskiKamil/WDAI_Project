import { useAuthContext } from "../contexts/AuthContextProvider";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { userId, logout } = useAuthContext();

  return (
    <div>
      <div>Profile</div>
      <div>{userId}</div>
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
