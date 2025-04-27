// src/components/OrderCard.jsx

import React from "react";

export default function OrderCard({ product, status, onStatusChange }) {
    if (!product) return null;

  // Destructure with defaults
  const {
    id            = '',
    title         = 'Unknown',
    images        = '',
    price         = 0,
    discount      = 0,
    speed,
    capacity,
    brand,
  } = product;

  const numericPrice    = Number(price) || 0;
  const numericDiscount = Number(discount) || 0;
  const finalPrice      = (numericPrice * (1 - numericDiscount / 100)).toFixed(2);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    onStatusChange(product.id, newStatus);
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageWrapper}>
        <img src={images} alt={title} style={styles.image} />
      </div>
      <div style={styles.content}>
        <p style={styles.title}>{title || "No Title"}</p>

        <div style={styles.specs}>
          {brand && <p><strong>Brand:</strong> {brand}</p>}
          {speed && <p><strong>Speed:</strong> {speed} MHz</p>}
          {capacity && <p><strong>Capacity:</strong> {capacity}</p>}
        </div>

        <div style={styles.priceContainer}>
          {numericDiscount > 0 && (
            <span style={styles.originalPrice}>${numericPrice.toFixed(2)}</span>
          )}
          <span style={styles.finalPrice}>${finalPrice}</span>
          {numericDiscount > 0 && (
            <span style={styles.discount}>(-{numericDiscount}%)</span>
          )}
        </div>

        <div style={styles.statusContainer}>
          <label htmlFor={`status-${id}`} style={styles.statusLabel}>Status</label>
          <select
            id={`status-${id}`}
            value={status}
            onChange={handleStatusChange}
            style={styles.select}
          >
            <option value="pending">Pending</option>
            <option value="delivering">Delivering</option>
            <option value="arrived">Arrived</option>
          </select>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
    width: "280px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    fontFamily: "system-ui, sans-serif",
    color: "#1f2937",
  },
  imageWrapper: {
    width: "100%",
    height: "180px",
    backgroundColor: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    maxWidth: "90%",
    maxHeight: "90%",
    objectFit: "contain",
  },
  content: {
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flexGrow: 1,
  },
  title: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
  },
  specs: {
    fontSize: "0.85rem",
    color: "#4b5563",
    lineHeight: 1.4,
  },
  priceContainer: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    marginTop: "auto",
  },
  originalPrice: {
    textDecoration: "line-through",
    color: "#9ca3af",
    fontSize: "0.9rem",
  },
  finalPrice: {
    fontSize: "1.1rem",
    fontWeight: 600,
  },
  discount: {
    fontSize: "0.9rem",
    color: "#dc2626",
  },
  statusContainer: {
    marginTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  statusLabel: {
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "#374151",
  },
  select: {
    padding: "8px",
    fontSize: "0. nine rem",
    borderRadius: "4px",
    border: "1px solid #d1d5db",
    outline: "none",
  },
};
