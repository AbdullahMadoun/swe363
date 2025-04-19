import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ReviewModal from './ReviewModal';

export default function OrdersPage() {
    const styles = {
      container: {
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        padding: '20px',
      },
      content: {
        maxWidth: '1200px',
        margin: '0 auto',
      },
      title: {
        fontSize: '24px',
        marginBottom: '20px',
        fontWeight: '600',
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
      },
    };
  
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    // Sample product data
    const products = [
      { id: 1, name: "Corsair Vengeance RAM(1)", price: 43 },
      { id: 2, name: "NVIDIA RTX 3080", price: 699 },
      { id: 3, name: "AMD Ryzen 7 5800X", price: 349 },
    ];
    
    const handleReviewClick = (product) => {
      setSelectedProduct(product);
      setModalOpen(true);
    };
    
    const handleCloseModal = () => {
      setModalOpen(false);
    };
    
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.title}>Your Orders</h1>
          
          <div style={styles.grid}>
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onReviewClick={handleReviewClick} 
              />
            ))}
          </div>
          
          {selectedProduct && (
            <ReviewModal 
              isOpen={modalOpen} 
              onClose={handleCloseModal} 
              product={selectedProduct} 
            />
          )}
        </div>
      </div>
    );
  }