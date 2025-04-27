// src/pages/MyProductsPage.js
import React, { useContext } from "react";
import { useItems } from "../../context/ItemContext";
import { UserContext } from "../../context/UserContext";
import ItemCard from "../components/ItemCardSeller";
import Loading from "../../Loading";

export default function MyProductsPage() {
  const { items } = useItems();
  const { user } = useContext(UserContext);

  // Access control
  console.log("User:", user);
  if (!user || user.role !== "Seller") {
    return (
      <p style={styles.message}>
        Access denied. Please log in as a seller.
      </p>
    );
  }

  // Optionally show a loader if you have one—here we assume `items` is [] until ready
  if (items === null) {
    return <Loading />;
  }

  // Filter only the products belonging to this seller
  const sellerProducts = items.filter(
    (product) => product.sellerId === user.uid
  );

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>My Products</h1>
      {sellerProducts.length === 0 ? (
        <p style={styles.message}>
          You haven’t added any products yet.
        </p>
      ) : (
        <div style={styles.gridContainer}>
          {sellerProducts.map((product) => (
            <ItemCard
              key={product.id}
              item={product}
              mode="seller"
            />
          ))}
        </div>
      )}
      {/* <button onClick={() => navigate('/seller/addproduct')}>
        Add New Product
      </button> */}
    </div>
  );
}

const styles = {
  pageContainer: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "system-ui, sans-serif",
  },
  pageTitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    color: "#1f2937",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  message: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#6b7280",
    marginTop: "3rem",
  },
};
