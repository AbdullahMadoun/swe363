import React, { useContext, useState} from "react";
import { ShoppingCart, BarChart2 } from "lucide-react";
import { CartContext } from "./CartContext";
import { CompareContext } from "./context/CompareContext";

function ItemCard({ item }) {
  const { addToCart } = useContext(CartContext);
  const { addToCompare, compareItems } = useContext(CompareContext);
  
  const {
    id,
    title,
    base64image,
    price,
    discount,
    stock_quantity,
    speed,
    capacity,
    brand,
    rating = 0, // <-- fallback to 0 if undefined
  } = item;

  const finalPrice = (price * (1 - discount / 100)).toFixed(2);
  const [isHovered, setIsHovered] = useState(false);
  const [isCompareHovered, setIsCompareHovered] = useState(false);

  const handleAddToCart = () => {
    addToCart(item);
  };

  const handleAddToCompare = () => {
    addToCompare(item);
  };

  // Check if item is already in compare list
  const isInCompareList = compareItems.some(i => i.id === id);


  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div style={styles.stars}>
        {"★".repeat(fullStars)}
        {halfStar && "★"}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageWrapper}>
        <img src={base64image} alt={title} style={styles.image} />
        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleAddToCart}
          disabled={stock_quantity <= 0}
          style={{
            ...styles.cartButton,
            backgroundColor:
              stock_quantity > 0
                ? isHovered
                  ? "#f9fafb"
                  : "#ffffff"
                : "#f3f4f6",
            cursor: stock_quantity > 0 ? "pointer" : "not-allowed",
          }}
        >
          <ShoppingCart size={16} color="#111827" />
        </button>
        
        {/* Compare Button */}
        <button
          onMouseEnter={() => setIsCompareHovered(true)}
          onMouseLeave={() => setIsCompareHovered(false)}
          onClick={handleAddToCompare}
          style={{
            ...styles.compareButton,
            backgroundColor: isInCompareList 
              ? "#d1fae5" 
              : isCompareHovered
                ? "#f9fafb"
                : "#ffffff",
            cursor: isInCompareList ? "default" : "pointer",
            borderColor: isInCompareList ? "#10b981" : "#e5e7eb",
          }}
        >
          <BarChart2 
            size={16} 
            color={isInCompareList ? "#10b981" : "#111827"} 
          />
        </button>
      </div>

      <div style={styles.content}>
        <p style={styles.title}>{title}</p>
        {renderStars()}
        <div style={styles.specs}>
          <p><strong>Brand:</strong> {brand}</p>
          <p><strong>Speed:</strong> {speed} MHz</p>
          <p><strong>Capacity:</strong> {capacity}</p>
        </div>

        <div style={styles.priceContainer}>
          {discount > 0 && (
            <span style={styles.originalPrice}>${price.toFixed(2)}</span>
          )}
          <span style={styles.finalPrice}>${finalPrice}</span>
          {discount > 0 && (
            <span style={styles.discount}> (-{discount}%)</span>
          )}
        </div>

        <p
          style={{
            color: stock_quantity > 0 ? "#22c55e" : "#f87171",
            margin: 0,
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
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    overflow: "hidden",
    width: "280px",
    display: "flex",
    flexDirection: "column",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    border: "1px solid #e5e7eb",
    transition: "transform 0.2s ease",
    color: "#111111",
  },
  imageWrapper: {
    width: "100%",
    height: "180px",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f9fafb",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: "10px",
  },
  cartButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "6px",
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  },
  compareButton: {
    position: "absolute",
    top: "10px",
    right: "50px", // Position to the left of the cart button
    padding: "6px",
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    color: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  content: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "0.95rem",
    color: "#111111",
  },
  title: {
    margin: "0",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#111111",
  },
  specs: {
    fontSize: "0.85rem",
    color: "#4b5563",
    lineHeight: "1.4",
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  originalPrice: {
    textDecoration: "line-through",
    color: "#9ca3af",
    fontSize: "0.9rem",
  },
  finalPrice: {
    fontWeight: "600",
    fontSize: "1.1rem",
    color: "#111111",
  },
  discount: {
    color: "#dc2626",
    fontWeight: "500",
    fontSize: "0.9rem",
  },
  stars: {
    display: "flex",
    gap: "2px",
  },
};

export default ItemCard;