// src/pages/WishlistPage.jsx

import React, { useContext } from "react";
import { WishlistContext } from "./context/WishlistContext";
import { CartContext } from "./context/CartContext";
import { ShoppingCart, Heart } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, addToWishlist, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <>
          <button style={styles.clearButton} onClick={clearWishlist}>
            Clear Wishlist
          </button>

          <div style={styles.items}>
            {wishlist.map((item) => {
              const finalPrice = item.price - (item.price * item.discount) / 100;
              return (
                <div key={item.id} style={styles.itemCard}>
                  <img
                    src={item.images}
                    alt={item.title}
                    style={styles.image}
                  />
                  <div style={styles.info}>
                    <h3>{item.title}</h3>
                    {item.brand && <p><strong>Brand:</strong> {item.brand}</p>}
                    {item.speed && <p><strong>Speed:</strong> {item.speed} MHz</p>}
                    {item.capacity && <p><strong>Capacity:</strong> {item.capacity}</p>}
                    <p>
                      <strong>Price:</strong> ${finalPrice.toFixed(2)}
                      {item.discount > 0 && (
                        <span style={styles.discount}> (-{item.discount}%)</span>
                      )}
                    </p>
                    <div style={styles.actions}>
                      <ShoppingCart
                        size={22}
                        style={styles.icon}
                        onClick={() => addToCart(item)}
                      />
                      <Heart
                        fill="red"
                        color="red"
                        size={22}
                        style={styles.icon}
                        onClick={() => removeFromWishlist(item)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "system-ui, sans-serif",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
  },
  clearButton: {
    marginBottom: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  items: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  itemCard: {
    display: "flex",
    gap: "1rem",
    padding: "1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  info: {
    flex: 1,
  },
  discount: {
    marginLeft: "8px",
    color: "#ef4444",
  },
  actions: {
    marginTop: "1rem",
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  icon: {
    cursor: "pointer",
  },
};
