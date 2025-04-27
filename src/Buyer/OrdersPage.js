// src/pages/OrdersPage.jsx

import React, { useEffect, useState, useContext } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserContext } from '../context/UserContext';
import ProductCard from './ProductCard';
import ReviewModal from './ReviewModal';

export default function OrdersPage() {
  const { user } = useContext(UserContext);
  const [orders, setOrders]             = useState([]); // raw order docs
  const [orderDetails, setOrderDetails] = useState([]); // enriched with products[]
  const [modalOpen, setModalOpen]       = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 1) Subscribe to this buyer's orders
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    const q = query(
      collection(db, 'orders'),
      where('buyerId', '==', user.uid)
    );
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  // 2) Whenever orders change, fetch each order's unique products
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const details = [];
      for (const ord of orders) {
        const uniqueIds = Array.from(new Set(ord.items || []));
        const products  = [];
        for (const itemId of uniqueIds) {
          const itemQuery = query(
            collection(db, 'items'),
            where('id', '==', itemId)
          );
          const snap = await getDocs(itemQuery);
          snap.forEach(d => products.push({ id: d.id, ...d.data() }));
        }
        details.push({
          orderId:   ord.id,
          createdAt: ord.createdAt,
          status:    ord.status || 'pending',
          products,
          count:     (ord.items || []).length
        });
      }
      if (!cancelled) setOrderDetails(details);
    })();
    return () => { cancelled = true; };
  }, [orders]);

  const handleReviewClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  const statusColors = {
    pending:    { background: '#fef3c7', color: '#92400e' },
    delivering: { background: '#bfdbfe', color: '#1e3a8a' },
    arrived:    { background: '#d1fae5', color: '#064e3b' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Orders</h1>

      {orderDetails.length === 0 ? (
        <p style={styles.none}>You have no orders yet.</p>
      ) : (
        <div style={styles.grid}>
          {orderDetails.map(o => (
            <div key={o.orderId} style={styles.card}>
              <div style={styles.header}>
                <div>
                  <div style={styles.orderId}>Order #{o.orderId}</div>
                  <div style={styles.meta}>
                    <span>{o.count} item{o.count !== 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span>{new Date(o.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div
                  style={{
                    ...styles.statusBadge,
                    ...statusColors[o.status] || statusColors.pending
                  }}
                >
                  {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                </div>
              </div>
              <div style={styles.productsGrid}>
                {o.products.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onReviewClick={handleReviewClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ReviewModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'system-ui, sans-serif',
    background: '#f9fafb',
    minHeight: '100vh'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
    color: '#111827'
  },
  none: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '1.1rem'
  },
  grid: {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'
  },
  card: {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderId: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#1f2937'
  },
  meta: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.25rem',
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 500
  },
  productsGrid: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))'
  }
};
