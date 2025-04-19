const StarRating = ({ rating }) => {
    const styles = {
      container: { display: 'flex', gap: '2px' },
      star: { color: '#ccc' },
      activeStar: { color: '#ffb100' },
    };
  
    return (
      <div style={styles.container}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            style={index < rating ? styles.activeStar : styles.star}
          >
            ★
          </span>
        ))}
      </div>
    );
  };
  
  export default StarRating;
  