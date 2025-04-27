// src/pages/SellerProductDetailPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SellerContext } from '../../context/SellerContext';
import { UserContext } from '../../context/UserContext';
import { useItems } from '../../context/ItemContext';
import Loading from '../../Loading';
import ReviewCard from '../components/ReviewCard';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function SellerProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { deleteProduct, isLoading: isSellerContextLoading } = useContext(SellerContext);
  const { items, getItemById, updateItem } = useItems();

  const [product, setProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [showEditFields, setShowEditFields] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1) load product + subscribe to its "reviews" field on Firestore
  useEffect(() => {
    if (isSellerContextLoading) return;
    setIsLoading(true);
    setError('');

    if (!user || user.role !== 'Seller') {
      setError("Access denied. Please log in as a seller.");
      setIsLoading(false);
      return;
    }

    const found = getItemById(productId);
    if (!found || String(found.sellerId) !== String(user.uid)) {
      setError("Product not found or you do not own this product.");
      setIsLoading(false);
      return;
    }

    setProduct(found);
    setEditedProduct({ ...found });

    const reviewRef = doc(db, 'items', productId);
    const unsubReview = onSnapshot(reviewRef, snap => {
      if (snap.exists()) {
        const data = snap.data();
        const list = Array.isArray(data.reviews) ? data.reviews : [];
        // sort by date descending
        list.sort((a, b) => (b.date || 0) - (a.date || 0));
        setReviews(list);
      } else {
        setReviews([]);
      }
    });

    setIsLoading(false);
    return () => unsubReview();
  }, [productId, user, isSellerContextLoading, items, getItemById]);

  // 2) seller replies -> update that one review in Firestore
  const handleAddResponse = async (reviewId, responseText) => {
    if (!user || user.role !== 'Seller') return;

    try {
      const updated = reviews.map(r =>
        r.id === reviewId ? { ...r, sellerResponse: responseText } : r
      );
      const ref = doc(db, 'items', productId);
      await updateDoc(ref, { reviews: updated });
      alert("Response added successfully!");
    } catch (e) {
      console.error("Failed to save response:", e);
      alert("Failed to save response.");
    }
  };

  const handleRemove = async () => {
    if (!product) return;
    if (window.confirm(`Remove "${product.title}"?`)) {
      const ok = await deleteProduct(productId);
      if (ok) {
        alert('Product removed.');
        navigate('/seller/products');
      } else {
        alert('Failed to remove product.');
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateItem({ ...editedProduct, id: product.id, sellerId: user.uid });
      setProduct({ ...editedProduct, sellerId: user.uid });
      setShowEditFields(false);
      alert("Product updated.");
    } catch (e) {
      console.error(e);
      alert("Failed to update product.");
    }
  };

  if (isLoading || isSellerContextLoading) return <Loading />;
  if (error) return <p style={styles.errorMessage}>{error}</p>;
  if (!product) return <p style={styles.errorMessage}>Couldn’t load product.</p>;

  return (
    <div style={styles.pageContainer}>
      {/* --- Details --- */}
      <div style={styles.detailsSection}>
        <div style={styles.imageContainer}>
          {product.images
            ? <img src={product.images} alt={product.title} style={styles.productImage} />
            : <div style={styles.noImage}>No Image</div>
          }
        </div>
        <div style={styles.infoContainer}>
          <h1 style={styles.productTitle}>{product.title}</h1>
          <p style={styles.productPrice}>${Number(product.price).toFixed(2)}</p>
          <p style={styles.productDescription}>{product.description}</p>
          <div style={styles.sellerInfo}>
            <p><strong>Stock:</strong> {product.stock_quantity}</p>
            <p><strong>Discount:</strong> {product.discount || 0}%</p>
            <p><strong>ID:</strong> {product.id}</p>
          </div>
          <div style={styles.actionButtons}>
            <button onClick={handleRemove} style={{ ...styles.button, ...styles.removeButton }}>× Remove</button>
            <button onClick={() => setShowEditFields(v => !v)} style={{ ...styles.button, ...styles.editButton }}>Edit</button>
          </div>

          {showEditFields && (
            <div style={styles.editFields}>
              {['title','price','description','stock_quantity','discount'].map(field => (
                <React.Fragment key={field}>
                  <label style={styles.label}>{field.replace('_',' ')}</label>
                  {field==='description' ? (
                    <textarea
                      style={styles.textarea}
                      value={editedProduct[field]||''}
                      onChange={e => setEditedProduct(p=>({...p,[field]:e.target.value}))}
                    />
                  ) : (
                    <input
                      style={styles.input}
                      type={field.includes('price')||field.includes('discount')||field.includes('stock')?'number':'text'}
                      value={editedProduct[field]||''}
                      onChange={e => setEditedProduct(p=>({...p,[field]:e.target.value}))}
                    />
                  )}
                </React.Fragment>
              ))}
              <div style={styles.editButtonContainer}>
                <button onClick={handleSaveEdit} style={{ ...styles.button, backgroundColor: '#10b981' }}>💾 Save</button>
                <button onClick={()=>setShowEditFields(false)} style={{ ...styles.button, backgroundColor: '#ef4444' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Reviews --- */}
      <div style={styles.reviewsSection}>
        <h2 style={styles.sectionTitle}>Latest reviews for this product</h2>
        {reviews.length > 0 ? (
          <div style={styles.reviewsGrid}>
            {reviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                mode="seller"
                onRespondClick={handleAddResponse}
              />
            ))}
          </div>
        ) : (
          <p style={styles.noReviewsMessage}>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { padding:'2rem', maxWidth:1100, margin:'2rem auto', fontFamily:'system-ui,sans-serif', background:'#fff', borderRadius:8 },
  errorMessage:{ color:'#c0392b', textAlign:'center', padding:'2rem' },
  detailsSection:{ display:'flex', flexWrap:'wrap', gap:'3rem', marginBottom:'3rem' },
  imageContainer:{ flex:'1 1 300px', maxWidth:400 },
  productImage:{ width:'100%', borderRadius:4, border:'1px solid #eee' },
  noImage:{ width:'100%', height:250, display:'flex',alignItems:'center',justifyContent:'center',background:'#f0f0f0',color:'#888',borderRadius:4 },
  infoContainer:{ flex:'2 1 400px', display:'flex',flexDirection:'column' },
  productTitle:{ fontSize:28, fontWeight:600, margin:0 },
  productPrice:{ fontSize:24, fontWeight:'bold', margin:'0.5rem 0' },
  productDescription:{ marginBottom:'1rem', color:'#4b5563' },
  sellerInfo:{ fontSize:14, color:'#374151', marginBottom:'1rem' },
  actionButtons:{ display:'flex', gap:'1rem', marginTop:'auto' },
  button:{ padding:'0.75rem 1.5rem', border:'none', borderRadius:6, cursor:'pointer', color:'#fff' },
  removeButton:{ background:'#4b5563' },
  editButton:{ background:'#374151' },
  editFields:{ marginTop:'1rem', borderTop:'1px solid #e5e7eb', paddingTop:'1rem', display:'flex',flexDirection:'column',gap:'0.75rem' },
  label:{ fontSize:14, fontWeight:500 },
  input:{ padding:'0.5rem', border:'1px solid #d1d5db', borderRadius:4 },
  textarea:{ padding:'0.5rem', border:'1px solid #d1d5db', borderRadius:4, minHeight:80 },
  editButtonContainer:{ display:'flex',gap:'1rem',marginTop:'1rem' },
  reviewsSection:{ borderTop:'1px solid #e5e7eb',paddingTop:'2rem' },
  sectionTitle:{ fontSize:24, fontWeight:600, marginBottom:'1.5rem' },
  reviewsGrid:{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'1.5rem' },
  noReviewsMessage:{ color:'#6b7280', textAlign:'center' },
};
