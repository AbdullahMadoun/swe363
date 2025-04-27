// src/components/ComparePage.jsx
import React, { useEffect, useContext } from "react";
import { Plus, X, ShoppingCart } from "lucide-react";
import { CompareContext } from "./context/CompareContext";
import { CartContext } from "./context/CartContext"; // <-- import CartContext

function ComparePage({ onNavigate = () => {} }) {
  const { compareItems, addToCompare, removeFromCompare } = useContext(CompareContext);
  const { addToCart } = useContext(CartContext); // <-- get addToCart

  const products = [
    ...compareItems,
    { id: "add-placeholder", isAddPlaceholder: true }
  ];

  const handleNav = (path) => {
    onNavigate(path);
    window.location.href = path;
  };

  return (
    <div style={styles.container}>
      <div style={styles.productsGrid}>
        {products.map((p) =>
          p.isAddPlaceholder ? (
            <div key={p.id} style={styles.productCard}>
              <div style={styles.productImage} onClick={() => handleNav("/main")}>
                <Plus size={32} />
              </div>
            </div>
          ) : (
            <div key={p.id} style={styles.productCard}>
              <div style={styles.productImage} onClick={() => addToCompare(p)}>
                <img
                  src={p.images}
                  alt={p.title}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
              <h3 style={styles.productTitle}>{p.title}</h3>
              <p style={styles.productPrice}>{p.price}</p>
            </div>
          )
        )}
      </div>

      {compareItems.length > 0 && (
        <section style={styles.compareSection}>
          <p style={styles.compareTitle}>
            Comparison: {compareItems.map(i => i.title).join(" Vs. ")}
          </p>
          <table style={styles.comparisonTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}></th>
                {compareItems.map((item) => (
                  <th key={item.id} style={styles.tableHeader}>
                    {item.title}
                    <span
                      style={{ ...styles.iconButton, right: '2rem' }}
                      onClick={() => addToCart(item)} // <-- add to cart
                      title="Add to cart"
                    >
                      <ShoppingCart size={16} />
                    </span>
                    <span
                      style={styles.removeButton}
                      onClick={() => removeFromCompare(item.id)}
                      title="Remove from compare"
                    >
                      <X size={16} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Price", "price"],
                ["Speed", "speed"],
                ["Capacity", "capacity"],
                ["Brand", "brand"],
                ["Rating", "rating"]
              ].map(([label, key]) => (
                <tr key={key} style={styles.tableRow}>
                  <td style={{ ...styles.tableCell, ...styles.propertyCell }}>{label}</td>
                  {compareItems.map(item => (
                    <td key={item.id} style={styles.tableCell}>
                      {item[key] != null ? item[key] : "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.legends}>
            <span>Legends:</span>
            <span style={styles.legendIcon}>⭐</span>
            <span>Add to Compare</span>
          </div>
        </section>
      )}
    </div>
  );
}

export default ComparePage;

const styles = {
  container: {
    maxWidth: '72rem',
    margin: '0 auto',
    background: 'white',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    borderRadius: '.5rem',
    padding: '1rem'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  productCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '.25rem',
    padding: '1rem',
    position: 'relative'
  },
  productImage: {
    width: '100%',
    height: '8rem',
    background: '#f3f4f6',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  productTitle: {
    fontSize: '.875rem',
    fontWeight: 500
  },
  productPrice: {
    fontSize: '.875rem',
    fontWeight: 700,
    marginTop: '.25rem'
  },
  compareSection: {
    marginTop: '2rem'
  },
  compareTitle: {
    fontSize: '.875rem',
    color: '#4b5563',
    marginBottom: '1rem'
  },
  comparisonTable: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    textAlign: 'left',
    fontWeight: 500,
    fontSize: '.875rem',
    borderBottom: '1px solid #e5e7eb',
    padding: '.5rem 1rem',
    position: 'relative'
  },
  iconButton: {
    position: 'absolute',
    top: '-.5rem',
    right: '2rem',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'color .2s'
  },
  removeButton: {
    position: 'absolute',
    top: '-.5rem',
    right: '.5rem',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'color .2s'
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb'
  },
  tableCell: {
    padding: '.5rem 1rem',
    fontSize: '.875rem'
  },
  propertyCell: {
    fontWeight: 500,
    color: '#374151'
  },
  legends: {
    marginTop: '1rem',
    fontSize: '.75rem',
    color: '#4b5563',
    display: 'flex',
    alignItems: 'center',
    gap: '.25rem'
  },
  legendIcon: {
    color: '#374151'
  }
};
