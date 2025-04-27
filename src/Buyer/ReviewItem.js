// src/components/ReviewItem.jsx
import React from 'react';

export default function ReviewItem({ rating, title, body, date, sellerResponse }) {
  // build ★☆☆★ style
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const stars = '★'.repeat(full) + (half ? '★' : '') + '☆'.repeat(empty);

  // Firestore Timestamp → JS Date
  const d = date?.toDate ? date.toDate() : new Date(date);
  const formatted = d.toLocaleDateString();

  return (
    <div style={styles.card}>
      <div style={styles.stars}>{stars}</div>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.body}>{body}</p>
      <div style={styles.footer}>
        <span style={styles.date}>{formatted}</span>
      </div>

      {sellerResponse && (
        <div style={styles.responseContainer}>
          <strong style={styles.responseLabel}>Seller's response:</strong>
          <p style={styles.responseText}>{sellerResponse}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    flex: '1 1 300px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  stars: { fontSize: '1rem', color: '#f59e0b' },
  title: { margin: 0, fontSize: '1.1rem', fontWeight: 600 },
  body: { flexGrow: 1, margin: 0, color: '#4b5563', fontSize: '0.95rem' },
  footer: { fontSize: '0.85rem', color: '#6b7280', textAlign: 'right' },
  date: {},

  responseContainer: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
  },
  responseLabel: {
    display: 'block',
    fontSize: '0. nine rem',
    marginBottom: '0.25rem',
    color: '#374151',
  },
  responseText: {
    margin: 0,
    fontSize: '0. nine rem',
    color: '#111827',
  },
};
