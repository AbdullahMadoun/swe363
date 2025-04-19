import React, { useState } from 'react';
import StarRating from './StarRating';
const ReviewModal = ({ isOpen, onClose, product }) => {
    const styles = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: isOpen ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      },
      modal: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '24px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
      },
      title: {
        fontSize: '20px',
        fontWeight: '600',
        marginTop: 0,
        marginBottom: '16px',
      },
      closeButton: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#aaa',
        cursor: 'pointer',
        lineHeight: '0.6',
      },
      formGroup: {
        marginBottom: '16px',
      },
      input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
      },
      textarea: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        minHeight: '100px',
        resize: 'vertical',
      },
      submitButton: {
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '500',
        marginTop: '10px',
      },
    };
  
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Review submitted:', { product, rating, title, body });
      // Here you would typically send the review data to your backend
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.header}>
            <h2 style={styles.title}>Write a Review for {product.name}</h2>
            <button 
              onClick={onClose} 
              style={styles.closeButton}
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <StarRating rating={rating} onRatingChange={setRating} />
            
            <div style={styles.formGroup}>
              <input
                type="text"
                placeholder="Review title"
                style={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div style={styles.formGroup}>
              <textarea
                placeholder="Review body"
                style={styles.textarea}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            
            <button 
              type="submit" 
              style={styles.submitButton}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };
  export default ReviewModal;