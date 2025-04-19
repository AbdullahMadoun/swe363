  import React, { useContext } from 'react';
  import { SellerContext } from '../../context/SellerContext';
  import { UserContext } from '../../UserContext';
  import ItemCard from '../components/ItemCardSeller'; // Adjust path if ItemCard is moved
  import Loading from '../../Loading'; // Assuming you have a Loading component

  function MyProductsPage() {
    const { sellerProducts, /* add potential loading state from context */ } = useContext(SellerContext);
    const { user } = useContext(UserContext); // To display username or check role

    // Basic loading check (could be refined in context)
    const isLoading = !sellerProducts; // Or use a dedicated loading state

    if (isLoading) {
      return <Loading />;
    }

    if (!user || user.role !== 'Seller') {
      return <p style={styles.message}>Access denied. Please log in as a seller.</p>;
    }

    return (
      <div style={styles.pageContainer}>
        <h1 style={styles.pageTitle}>My Products</h1>
        {sellerProducts.length === 0 ? (
          <p style={styles.message}>You haven't added any products yet.</p>
        ) : (
          <div style={styles.gridContainer}>
            {sellerProducts.map((product) => (
              <ItemCard
                key={product.id}
                item={product}
                mode="seller" // <-- Set mode to seller!
                // Pass action handlers if needed (e.g., if clicking leads somewhere)
                // onViewDetailsClick={() => navigate(`/seller/product/${product.id}`)} // Navigation is now inside ItemCard
              />
            ))}
          </div>
        )}
        {/* Consider adding a button here to navigate to "Add Product" page */}
        {/* <button onClick={() => navigate('/seller/products/add')}>Add New Product</button> */}
      </div>
    );
  }

  // Basic Styles for MyProductsPage
  const styles = {
    pageContainer: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto', // Center the content
      fontFamily: 'system-ui, sans-serif',
    },
    pageTitle: {
      fontSize: '1.8rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      color: '#1f2937',
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', // Responsive grid
      gap: '1.5rem', // Spacing between cards
    },
    message: {
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#6b7280',
        marginTop: '3rem',
    }
  };

  export default MyProductsPage;