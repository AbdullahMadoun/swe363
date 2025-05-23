import { useContext } from "react";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";

function ShoppingCartPage() {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const getTotal = () => {
    return cart
      .reduce((total, item) => {
        const finalPrice = item.price - (item.price * item.discount) / 100;
        return total + finalPrice;
      }, 0)
      .toFixed(2);
  };

  const handleProceedToBuy = () => {
    navigate("/payment");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div style={styles.cartItems}>
          {cart.map((item, index) => {
            const finalPrice = item.price - (item.price * item.discount) / 100;
            return (
              <div key={index} style={styles.itemCard}>
                <img src={item.base64image} alt={item.title} style={styles.image} />
                <div>
                  <h3>{item.title}</h3>
                  <p><strong>Brand:</strong> {item.brand}</p>
                  <p><strong>Speed:</strong> {item.speed} MHz</p>
                  <p><strong>Capacity:</strong> {item.capacity}</p>
                  <p>
                    <strong>Price:</strong> ${finalPrice.toFixed(2)}
                    {item.discount > 0 && (
                      <span style={styles.discount}> (-{item.discount}%)</span>
                    )}
                  </p>
                  <button onClick={() => removeFromCart(item)} style={styles.removeButton}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          <div style={styles.footer}>
            <div style={styles.total}>
              <h2>Total: ${getTotal()}</h2>
            </div>
            <button onClick={handleProceedToBuy} style={styles.buyButton}>
              Proceed to Buy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingCartPage;

const styles = {
  container: {
    padding: "2rem",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
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
  discount: {
    marginLeft: "8px",
    color: "#ef4444",
  },
  removeButton: {
    marginTop: "0.5rem",
    padding: "0.5rem 1rem",
    border: "none",
    backgroundColor: "#ef4444",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
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
