// src/pages/ProductDetailPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { CartContext } from '../context/CartContext';
import { CompareContext } from '../context/CompareContext';
import { WishlistContext } from '../context/WishlistContext';
import ReviewsList from './ReviewList';
import { ShoppingCart, BarChart2, Heart as HeartIcon } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { addToCompare } = useContext(CompareContext);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const ref = doc(db, 'items', id);
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
      else setProduct(null);
    });
    return () => unsub();
  }, [id]);

  if (product === null) return <p style={styles.loading}>Loading...</p>;

  const {
    title,
    images,
    base64image,
    price,
    discount = 0,
    description,
    stock_quantity,
  } = product;

  const displayImage = images || base64image;
  const finalPrice = (price * (1 - discount / 100)).toFixed(2);
  const isInWishlist = wishlist.some(i => i.id === id);

  const handleWishlistToggle = () => {
    isInWishlist ? removeFromWishlist(product) : addToWishlist(product);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.detailsContainer}>
        <div style={styles.imageContainer}>
          {displayImage
            ? <img src={displayImage} alt={title} style={styles.productImage} />
            : <div style={styles.noImage}>No Image</div>
          }
        </div>

        <div style={styles.infoContainer}>
          <div style={styles.titleRow}>
            <h1 style={styles.productTitle}>{title}</h1>
            <button onClick={handleWishlistToggle} style={styles.wishlistButton}>
              <HeartIcon
                size={24}
                color={isInWishlist ? '#ef4444' : '#9ca3af'}
                fill={isInWishlist ? '#ef4444' : 'none'}
              />
            </button>
          </div>

          <p style={styles.productPrice}>${finalPrice}</p>
          <p style={styles.productDescription}>{description}</p>

          <div style={styles.actionRow}>
            <button
              onClick={() => addToCart(product)}
              disabled={stock_quantity <= 0}
              style={styles.cartButton}
            >
              <ShoppingCart size={16} style={{ marginRight: '8px' }} />
              Add to Cart
            </button>

            <button
              onClick={() => addToCompare(product)}
              style={styles.compareButton}
            >
              <BarChart2 size={16} style={{ marginRight: '8px' }} />
              Compare
            </button>
          </div>

          <p style={{
            ...styles.stockInfo,
            color: stock_quantity > 0 ? '#22c55e' : '#f87171'
          }}>
            {stock_quantity > 0
              ? `${stock_quantity} in stock`
              : 'Out of stock'}
          </p>
        </div>
      </div>

      <div style={styles.reviewsSection}>
        <h2 style={styles.sectionTitle}>Latest reviews</h2>
        <ReviewsList itemId={id} />
      </div>
    </div>
  );
}

const styles = {
  loading: {
    padding: '2rem',
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#6b7280'
  },
  pageContainer: {
    maxWidth: '1100px',
    margin: '2rem auto',
    padding: '0 1rem',
    fontFamily: 'system-ui, sans-serif',
  },
  detailsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    marginBottom: '3rem',
  },
  imageContainer: {
    flex: '1 1 300px',
    maxWidth: '400px',
  },
  productImage: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  noImage: {
    width: '100%',
    height: '300px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    borderRadius: '8px'
  },
  infoContainer: {
    flex: '2 1 400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  productTitle: {
    fontSize: '1.8rem',
    fontWeight: 600,
    margin: 0,
    color: '#111827'
  },
  wishlistButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  productPrice: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  },
  productDescription: {
    fontSize: '1rem',
    color: '#4b5563',
    lineHeight: 1.6
  },
  actionRow: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  cartButton: {
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    backgroundColor: '#111827',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  compareButton: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #111827',
    backgroundColor: '#fff',
    color: '#111827',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  stockInfo: {
    fontSize: '0.95rem',
    marginTop: '0.5rem'
  },
  reviewsSection: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '2rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#111827',
    marginBottom: '1rem'
  }
};
