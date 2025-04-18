import { useContext } from "react";
import { WishlistContext } from "./context/WishlistContext";
import { CartContext } from "./CartContext";
import { ShoppingCart, Heart } from "lucide-react";

function WishlistPage() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div style={styles.cartItems}>
          {wishlist.map((item, index) => {
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
                  <div style={styles.actions}>
                    <ShoppingCart
                      size={22}
                      color="#1d4ed8"
                      style={{ cursor: "pointer" }}
                      onClick={() => addToCart(item)}
                    />
                    <Heart
                      fill="red"
                      color="red"
                      size={22}
                      style={{ cursor: "pointer" }}
                      onClick={() => removeFromWishlist(item)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;

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
  actions: {
    marginTop: "1rem",
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
};
