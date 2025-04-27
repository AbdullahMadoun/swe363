// src/components/ReviewModal.jsx
import React, { useState, useContext } from 'react';
import StarRating from './StarRating';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { UserContext } from '../context/UserContext';
import { v4 as uuid } from 'uuid';

export default function ReviewModal({ isOpen, onClose, product }) {

  const styles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: isOpen ? 'flex' : 'none',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    modal: {
      backgroundColor: '#fff', borderRadius: '8px', padding: '24px',
      width: '90%', maxWidth: '500px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px' },
    title: { fontSize: '20px', fontWeight: '600', margin: 0 },
    closeButton: {
      background: 'transparent', border: 'none', fontSize: '28px',
      color: '#aaa', cursor: 'pointer', lineHeight: 0.6
    },
    formGroup: { marginBottom: '16px' },
    input: {
      width: '100%', padding: '10px', border: '1px solid #ddd',
      borderRadius: '4px', fontSize: '16px'
    },
    textarea: {
      width: '100%', padding: '10px', border: '1px solid #ddd',
      borderRadius: '4px', fontSize: '16px', minHeight: '100px', resize: 'vertical'
    },
    submitButton: {
      backgroundColor: '#333', color: '#fff', border: 'none',
      padding: '10px 20px', borderRadius: '4px',
      cursor: 'pointer', fontWeight: '500', marginTop: '10px'
    },
  };

  const { user } = useContext(UserContext);
  const [rating, setRating] = useState(0);
  const [title, setTitle]   = useState('');
  const [body, setBody]     = useState('');

  if (!isOpen) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to submit a review');
      return;
    }

    const itemRef = doc(db, 'items', product.id);
    const newReview = {
      id:       uuid(),                      // unique per review
      userId:   user.uid,
      rating,
      title,
      body,
      date:     Date.now(),                  // store as a plain timestamp
    };

    try {
      // push into the reviews array
      await updateDoc(itemRef, {
        reviews: arrayUnion(newReview)
      });
      onClose();
    } catch (err) {
      console.error('Error writing review:', err);
      alert('Could not submit review. Try again.');
    }
  };

  return (
    <div style={styles.overlay}>
      <form onSubmit={handleSubmit} style={styles.modal}>
        <h2>Review {product.title}</h2>
        <StarRating rating={rating} onRatingChange={setRating} />
        <input
          style={styles.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Review title"
          required
        />
        <textarea
          style={styles.textarea}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Your thoughts..."
          required
        />
        <button type="submit" style={styles.button}>Submit</button>
        <button type="button" onClick={onClose} style={styles.buttonSecondary}>Cancel</button>
      </form>
    </div>
  );
}

// ... basic inline styles omitted for brevity ...
