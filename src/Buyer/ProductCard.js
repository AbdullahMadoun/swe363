import React, { useState } from 'react';

// Product Card Component
const ProductCard = ({ product, onReviewClick }) => {
    const styles = {
      card: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      },
      imageContainer: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
      },
      image: {
        height: '200px',
        objectFit: 'contain',
      },
      details: {
        padding: '15px',
      },
      name: {
        fontWeight: '500',
        marginBottom: '5px',
      },
      price: {
        fontWeight: '600',
        marginBottom: '10px',
      },
      button: {
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
      },
    };
  
    return (
      <div style={styles.card}>
        <div style={styles.imageContainer}>
          <img 
            src={product.image || "/api/placeholder/250/200"} 
            alt={product.name} 
            style={styles.image}
          />
        </div>
        <div style={styles.details}>
          <h3 style={styles.name}>{product.name}</h3>
          <p style={styles.price}>${product.price}</p>
          <button 
            onClick={() => onReviewClick(product)}
            style={styles.button}
          >
            Review
          </button>
        </div>
      </div>
    );
  };
  export default ProductCard;