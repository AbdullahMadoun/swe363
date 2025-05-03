// src/pages/PaymentPage.jsx

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { CartContext } from "./context/CartContext";
import { UserContext } from "./context/UserContext";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
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
      const now = new Date().toISOString();

      for (const [sellerId, items] of Object.entries(bySeller)) {
        const itemIds = items.map(i => i.id); // Store item IDs, not the whole item
        const orderData = {
          sellerId,
          buyerId: user.uid,
          items: itemIds, // Changed to itemIds
          createdAt: now,
          status: "pending", // you can update later
          totalPrice: items.reduce((total, item) => total + (item.price * item.quantity), 0), //add total price
        };
        await addDoc(ordersCol, orderData);
      }

      // 3) clear the buyer’s cart
      await clearCart();
      navigate("/orders"); // or wherever your seller orders page lives
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment could not be processed. Please try again.");
      setProcessing(false);
    }
  };

  // Dummy card input and styles for demonstration
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Payment Details</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Card Number</label>
          <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Cardholder Name</label>
          <input type="text" placeholder="John Doe" style={styles.input} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Expiry Date</label>
            <input type="text" placeholder="MM/YY" style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CVV</label>
            <input type="text" placeholder="CVC" style={styles.input} />
          </div>
        </div>
        <button
          style={styles.button}
          onClick={handlePay}
          disabled={processing}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
        {processing && <p style={{ textAlign: 'center', marginTop: '10px' }}>Processing your payment...</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5", // Light grey background
  },
  card: {
    width: "90%",
    maxWidth: "400px", // Responsive width
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333", // Darker label color
    marginBottom: "5px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd", // Lighter border
    outline: "none",
    backgroundColor: "white",
    color: "#333",
  },
  button: {
    padding: "12px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "5px",
    backgroundColor: "#007bff", // Blue button
    color: "white",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease", // Smooth transition
    marginTop: '20px',
  },
  
};

export default PaymentPage;
