import React from "react";
import { Pencil } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function ItemCard({ item, mode = 'seller' }) {
  const navigate = useNavigate();

  const {
    id,
    title,
    base64image,
    price,
    discount = 0,
    stock_quantity = 0,
    speed,
    capacity,
    brand,
  } = item;

  const numericPrice = Number(price) || 0;
  const numericDiscount = Number(discount) || 0;
  const finalPrice = (numericPrice * (1 - numericDiscount / 100)).toFixed(2);

  const handleCardClick = () => {
    if (mode === 'seller') {
      navigate(`/seller/product/${id}`);
    }
  };

  const renderModifyButton = () => (
    <button
      onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
      style={styles.modifyButton}
      aria-label="Modify item"
    >
      <Pencil size={16} style={{ marginRight: "4px" }} />
      Modify
    </button>
  );

  return (
    <div
      style={{ ...styles.card, cursor: 'pointer' }}
      onClick={handleCardClick}
    >
      <div style={styles.imageWrapper}>
        <img src={base64image} alt={title} style={styles.image} />
        {renderModifyButton()}
      </div>

      <div style={styles.content}>
        <p style={styles.title}>{title || "No Title"}</p>

        <div style={styles.specs}>
          <p><strong>Brand:</strong> {brand || 'N/A'}</p>
          {speed && <p><strong>Speed:</strong> {speed} MHz</p>}
          {capacity && <p><strong>Capacity:</strong> {capacity}</p>}
        </div>

        <div style={styles.priceContainer}>
          {numericDiscount > 0 && (
            <span style={styles.originalPrice}>${numericPrice.toFixed(2)}</span>
          )}
          <span style={styles.finalPrice}>${finalPrice}</span>
          {numericDiscount > 0 && (
            <span style={styles.discount}> (-{numericDiscount}%)</span>
          )}
        </div>

        <p
          style={{
            ...styles.stockStatus,
            color: stock_quantity > 0 ? "#22c55e" : "#f87171",
          }}
        >
          {stock_quantity > 0
            ? `${stock_quantity} in stock`
            : "Out of stock"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
    overflow: "hidden",
    width: "280px",
    display: "flex",
    flexDirection: "column",
    fontFamily: "system-ui, sans-serif",
    border: "1px solid #e5e7eb",
    transition: "box-shadow 0.2s ease",
    color: "#1f2937",
  },
  imageWrapper: {
    width: "100%",
    height: "200px",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f9fafb",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    maxWidth: "90%",
    maxHeight: "90%",
    objectFit: "contain",
  },
  modifyButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    padding: "4px 8px",
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    color: "#111827",
    cursor: "pointer",
  },
  content: {
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "0.9rem",
    color: "#1f2937",
    flexGrow: 1,
  },
  title: {
    margin: "0",
    fontSize: "1rem",
    fontWeight: "500",
    color: "#111827",
    lineHeight: 1.3,
  },
  specs: {
    fontSize: "0.8rem",
    color: "#6b7280",
    lineHeight: "1.4",
    marginTop: '4px',
  },
  priceContainer: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    marginTop: 'auto',
    paddingTop: '8px',
  },
  originalPrice: {
    textDecoration: "line-through",
    color: "#9ca3af",
    fontSize: "0.85rem",
  },
  finalPrice: {
    fontWeight: "600",
    fontSize: "1.15rem",
    color: "#111827",
  },
  discount: {
    color: "#dc2626",
    fontWeight: "500",
    fontSize: "0.8rem",
  },
  stockStatus: {
    fontSize: '0.8rem',
    fontWeight: '500',
    margin: '4px 0 0 0',
  }
};

export default ItemCard;
