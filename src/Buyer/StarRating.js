import { useState } from 'react';

// Star Rating Component
const StarRating = ({ rating, onRatingChange }) => {
  const styles = {
    container: {
      display: 'flex',
      gap: '5px',
      marginBottom: '15px',
      fontSize: '24px',
    },
    star: {
      color: '#ccc',
      cursor: 'pointer',
    },
    activeStar: {
      color: '#ffb100',
      cursor: 'pointer',
    }
  };

  const handleStarClick = (index) => {
    onRatingChange(index + 1);
  };

  return (
    <div style={styles.container}>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          style={index < rating ? styles.activeStar : styles.star}
          onClick={() => handleStarClick(index)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;