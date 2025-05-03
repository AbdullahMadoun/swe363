// src/components/ShoppingCartPage.jsx

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./context/CartContext";
import { ShoppingCart, MinusCircle, PlusCircle } from "lucide-react";

export default function ShoppingCartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // 1) Aggregate items by id to get quantities
  const aggregated = cart.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = { item, qty: 0 };
    }
    acc[item.id].qty += 1;
    return acc;
  }, {});
  const itemsWithQty = Object.values(aggregated);

  // 2) Compute total across quantity
  const getTotal = () => {
    return itemsWithQty
      .reduce((total, { item, qty }) => {
        const finalPrice = item.price * (1 - item.discount / 100);
        return total + finalPrice * qty;
      }, 0)
      .toFixed(2);
  };

  const handleProceedToBuy = () => {
    navigate("/payment");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Shopping Cart</h1>
      {itemsWithQty.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <button style={styles.clearButton} onClick={clearCart}>
            Clear Cart
          </button>
          <div style={styles.cartItems}>
            {itemsWithQty.map(({ item, qty }) => {
              const finalPrice = item.price * (1 - item.discount / 100);
              return (
                <div key={item.id} style={styles.itemCard}> 
                  <img
                    src={item.images}
                    alt={item.title}
                    style={styles.image}
                  />
                  <div style={styles.info}>
                    <h3>{item.title}</h3>
                    <p><strong>Brand:</strong> {item.brand}</p>
                    <p><strong>Speed:</strong> {item.speed} MHz</p>
                    <p><strong>Capacity:</strong> {item.capacity}</p>
                    <p>
                      <strong>Unit Price:</strong> ${finalPrice.toFixed(2)}
                      {item.discount > 0 && (
                        <span style={styles.discount}> (-{item.discount}%)</span>
                      )}
                    </p>
                    <div style={styles.quantityControls}>
                      <MinusCircle
                        size={20}
                        style={styles.qtyButton}
                        onClick={() => removeFromCart(item)}
                      />
                      <span style={styles.qtyText}>{qty}</span>
                      <PlusCircle
                        size={20}
                        style={styles.qtyButton}
                        onClick={() => addToCart(item)}
                      />
                    </div>
                    <p style={styles.subtotal}>
                      Subtotal: ${(finalPrice * qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={styles.footer}>
            <div style={styles.total}>
              <h2>Total: ${getTotal()}</h2>
            </div>
            <button
              onClick={handleProceedToBuy}
              style={styles.buyButton}
            >
              Proceed to Buy
            </button>
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
    marginBottom: "1rem",
  },
  clearButton: {
    marginBottom: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cartItems: {
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
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  discount: {
    marginLeft: "8px",
    color: "#ef4444",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "0.5rem",
  },
  qtyButton: {
    cursor: "pointer",
  },
  qtyText: {
    minWidth: "24px",
    textAlign: "center",
    fontSize: "1rem",
  },
  subtotal: {
    marginTop: "0.5rem",
    fontWeight: "600",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "2rem",
    flexWrap: "wrap",
  },
  total: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  buyButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#1d1d1f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    marginTop: "1rem",
  },
};
