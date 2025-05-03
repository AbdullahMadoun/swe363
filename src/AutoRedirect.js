import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";

export default function AutoRedirect() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    

    if (user === null) {
      navigate("/login", { replace: true }); // Not logged in
    } else if (user.role === "admin") {
      navigate("/admin/accounts", { replace: true });
    } else {
      navigate("/main", { replace: true });
    }
  }, [user, navigate]);

  return null;
}
