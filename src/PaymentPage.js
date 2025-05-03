// src/pages/PaymentPage.jsx

import React, { useContext, useState } from "react";
import { useNavigate }       from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db }                from "./firebase";
import { CartContext }       from "./context/CartContext";
import { UserContext }       from "./context/UserContext";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { user }            = useContext(UserContext);
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    if (!user) {
      alert("Please sign in to complete payment.");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    setProcessing(true);

    try {
      // 1) Group cart items by sellerId
      const bySeller = cart.reduce((acc, item) => {
        (acc[item.sellerId] ||= []).push(item);
        return acc;
      }, {});

      // 2) For each seller, create an order doc
      const ordersCol = collection(db, "orders");
      const now       = new Date().toISOString();

      for (const [sellerId, items] of Object.entries(bySeller)) {
        const itemIds = items.map(i => i.id);
        await addDoc(ordersCol, {
          sellerId,
          buyerId:   user.uid,
          items:     itemIds,
          createdAt: now,
          status:    "pending"  // you can update later
        });
      }

      // 3) clear the buyer’s cart
      await clearCart();
      navigate("/orders"); // or wherever your seller orders page lives
    } catch (e) {
      console.error("Payment failed:", e);
      alert("Payment could not be processed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* ... your card inputs ... */}
      <button
        style={styles.button}
        onClick={handlePay}
        disabled={processing}
      >
        {processing ? "Processing..." : "Pay"}
      </button>
    </div>
  );
}

// ... styles omitted for brevity ...


const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  card: {
    width: "360px",
    padding: "32px",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: "4px",
    color: "#1f2937",
  },
  input: {
    padding: "12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
    color: "#111827",
  },
  button: {
    marginTop: "12px",
    padding: "12px",
    backgroundColor: "#1f1f1f",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
};
