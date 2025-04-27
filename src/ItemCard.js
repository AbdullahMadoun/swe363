// src/components/ItemCard.js
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, BarChart2, Heart } from "lucide-react";
import { CartContext } from "./context/CartContext";
import { CompareContext } from "./context/CompareContext";
import { WishlistContext } from "./context/WishlistContext";

export default function ItemCard({ item }) {
  const { addToCart } = useContext(CartContext);
  const { addToCompare, compareItems } = useContext(CompareContext);
  const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);

  const {
    id,
    title,
    images,
    price,
    discount,
    stock_quantity,
    speed,
    capacity,
    brand,
    rating = 0,
  } = item;

  const finalPrice = (price * (1 - discount / 100)).toFixed(2);
  const [isHovered, setIsHovered] = useState(false);
  const [isCompareHovered, setIsCompareHovered] = useState(false);

  const isInCompareList = compareItems.some((i) => i.id === id);
  const isInWishlist = wishlist.some((i) => i.id === id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (stock_quantity > 0) {
      addToCart(item);
    }
  };

  const handleAddToCompare = (e) => {
    e.preventDefault();
    addToCompare(item);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    isInWishlist ? removeFromWishlist(item) : addToWishlist(item);
  };

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
    <Link
      to={`/products/${id}`}
      style={{ ...styles.card, cursor: "pointer", textDecoration: "none" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsCompareHovered(false); }}
    >
      <div style={styles.imageWrapper}>
        <img src={images} alt={title} style={styles.image} />

        <button
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

        <button
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
          onMouseEnter={() => setIsCompareHovered(true)}
          onMouseLeave={() => setIsCompareHovered(false)}
        >
          <BarChart2
            size={16}
            color={isInCompareList ? "#10b981" : "#111827"}
          />
        </button>

        <button onClick={handleWishlistToggle} style={styles.wishlistButton}>
          <Heart
            size={16}
            color={isInWishlist ? "#ef4444" : "#9ca3af"}
            fill={isInWishlist ? "#ef4444" : "none"}
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
    </Link>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    transition: "background-color 0.2s ease",
    backgroundColor: "#ffffff",
  },
  compareButton: {
    position: "absolute",
    top: "10px",
    right: "50px",
    padding: "6px",
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
  },
  wishlistButton: {
    position: "absolute",
    top: "10px",
    right: "90px",
    padding: "6px",
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
  },
  content: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "0.95rem",
  },
  title: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: "600",
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
