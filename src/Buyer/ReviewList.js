// src/components/ReviewsList.jsx
import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import ReviewItem from './ReviewItem';

export default function ReviewsList({ itemId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const ref = doc(db, 'items', itemId);
    const unsub = onSnapshot(ref, snap => {
      if (!snap.exists()) {
        setReviews([]);
        return;
      }
      const data = snap.data();
      const list = Array.isArray(data.reviews) ? data.reviews : [];

      // sort newest first
      list.sort((a, b) => {
        const da = a.date?.toDate?.() || new Date(a.date);
        const db = b.date?.toDate?.() || new Date(b.date);
        return db - da;
      });

      setReviews(list);
    });
    return () => unsub();
  }, [itemId]);

  if (reviews.length === 0) {
    return <p style={{ color: '#6b7280' }}>No reviews yet.</p>;
  }

  // dedupe by review.id
  const unique = reviews.filter(
    (r, i, arr) => arr.findIndex(x => x.id === r.id) === i
  );

  return (
    <div style={styles.container}>
      {unique.map(r => (
        <ReviewItem
          key={r.id}
          rating={r.rating}
          title={r.title}
          body={r.body}
          date={r.date}
          sellerResponse={r.sellerResponse}   // 👈 pass the response here
        />
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '1rem',
  },
};
