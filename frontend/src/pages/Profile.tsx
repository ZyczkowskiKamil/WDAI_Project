import React from "react";
import { useAuthContext } from "../contexts/AuthContextProvider";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  return (
    <div>
      <div>Profile</div>
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
