import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import AddProductPage from "./Seller/pages/AddProudctPage";

export default function AutoRedirect() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      navigate("/Admin/accounts", { replace: true });
    } else {
      navigate("/main", { replace: true });
    }
  }, [user, navigate]);

  return null; // no UI
}


