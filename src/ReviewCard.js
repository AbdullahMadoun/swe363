import StarRating from './StarRating';

const ReviewCard = ({ title, body, reviewerName, date }) => {
  const styles = {
    card: {
      padding: '15px',
      borderRadius: '4px',
      border: '1px solid #eee',
      marginBottom: '15px',
    },
    title: {
      fontWeight: '500',
      marginBottom: '5px',
      fontSize: '16px',
    },
    body: {
      color: '#666',
      marginBottom: '15px',
      fontSize: '14px',
    },
    reviewerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '14px',
    },
    avatar: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#ddd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      color: '#666',
    },
    reviewerName: {
      fontWeight: '500',
    },
    date: {
      color: '#999',
    },
  };

  return (
    <div style={styles.card}>
      <StarRating rating={Math.floor(Math.random() * 5) + 1} />
      <h4 style={styles.title}>{title}</h4>
      <p style={styles.body}>{body}</p>
      <div style={styles.reviewerInfo}>
        <div style={styles.avatar}>{reviewerName.charAt(0)}</div>
        <div>
          <span style={styles.reviewerName}>{reviewerName}</span>
          <div style={styles.date}>{date}</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
