import ReviewCard from "./ReviewCard";
export default function ProductDetailPage({ item }) {
    // Default values in case item prop isn't fully populated
    const {
      id = 1,
      title = "Corsair Vengeance LPX RAM",
      base64image = "/api/placeholder/300/300",
      price = 56,
      discount = 0,
      stock_quantity = 100,
      speed = "3200MHz",
      capacity = "32GB",
      brand = "Corsair",
      rating = 4
    } = item || {};
  
    
  
    // Sample reviews data
    const reviews = [
      {
        id: 1,
        title: "Review title",
        body: "Review body",
        reviewerName: "Reviewer name",
        date: "Date"
      },
      {
        id: 2,
        title: "Review title",
        body: "Review body",
        reviewerName: "Reviewer name",
        date: "Date"
      },
      {
        id: 3,
        title: "Review title",
        body: "Review body",
        reviewerName: "Reviewer name",
        date: "Date"
      }
    ];
  
    return (
      <div style={styles.container}>
        <div style={styles.content}>
    
  
          <div style={styles.productSection}>
            <div style={styles.imageContainer}>
              <div style={styles.heartIcon}>
                <span style={{ color: '#333' }}>♡</span>
              </div>
              <img 
                src={base64image} 
                alt={title} 
                style={styles.productImage} 
              />
            </div>
            <div style={styles.productInfo}>
              <h1 style={styles.productTitle}>{title}</h1>
              <p style={styles.price}>${price}</p>
              <p style={styles.productDescription}>
                {brand} {title} {speed} {capacity} (PC4-25600) C18 1.35V Desktop Memory - CMK32GX4M2E3200C16
              </p>
              <div style={styles.buttonContainer}>
                <button style={styles.addToCartButton}>
                  <span>🛒</span> Add to Cart
                </button>
                <button style={styles.compareButton}>
                  <span>⚖️</span> Compare
                </button>
              </div>
            </div>
          </div>
  
          <div style={styles.reviewsSection}>
            <h2 style={styles.reviewsTitle}>Latest reviews</h2>
            <div style={styles.reviewsGrid}>
              {reviews.map(review => (
                <ReviewCard 
                  key={review.id}
                  title={review.title}
                  body={review.body}
                  reviewerName={review.reviewerName}
                  date={review.date}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const styles = {
    container: {
      backgroundColor: '#f8f8f8',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '30px',
    },
    nav: {
      display: 'flex',
      gap: '20px',
    },
    navLink: {
      color: '#333',
      textDecoration: 'none',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#333',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    userDetails: {
      display: 'flex',
      flexDirection: 'column',
      fontSize: '14px',
    },
    productSection: {
      display: 'flex',
      gap: '40px',
      marginBottom: '40px',
    },
    imageContainer: {
      flex: '0 0 300px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    heartIcon: {
      position: 'absolute',
      top: '10px',
      left: '10px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
    },
    productImage: {
      maxWidth: '100%',
      maxHeight: '250px',
      objectFit: 'contain',
    },
    productInfo: {
      flex: '1',
    },
    productTitle: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '5px',
    },
    price: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '15px',
    },
    productDescription: {
      color: '#666',
      marginBottom: '20px',
      fontSize: '14px',
      lineHeight: '1.6',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
    },
    addToCartButton: {
      backgroundColor: '#333',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    compareButton: {
      backgroundColor: '#f8f8f8',
      color: '#333',
      border: '1px solid #ddd',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    reviewsSection: {
      marginTop: '40px',
    },
    reviewsTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '20px',
    },
    reviewsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
    },
  };