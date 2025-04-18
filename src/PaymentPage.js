import React from "react";

const PaymentPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <label style={styles.label}>Card Info</label>
        <input
          type="text"
          placeholder="0000 0000 0000 0000"
          style={styles.input}
        />
        <input
          type="text"
          placeholder="MM/YY"
          style={styles.input}
        />
        <input
          type="text"
          placeholder="CVV"
          style={styles.input}
        />
        <button style={styles.button}>Pay</button>
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

export default PaymentPage;
