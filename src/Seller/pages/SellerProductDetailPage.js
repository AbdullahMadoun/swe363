import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SellerContext } from '../../context/SellerContext';
import { UserContext } from '../../UserContext';
import Loading from '../../Loading';
import ReviewCard from '../components/ReviewCard';

const PRODUCTS_STORAGE_KEY = "ecommerce_products";
const REVIEWS_STORAGE_KEY = "ecommerce_reviews";

const getProductByIdFromStorage = (productId, sellerId) => {
    try {
        const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        const allProducts = storedProducts ? JSON.parse(storedProducts) : [];
        return allProducts.find(p => String(p.id) === String(productId) && String(p.sellerId) === String(sellerId));
    } catch (e) {
        console.error("Error reading product from storage:", e);
        return null;
    }
};

const getReviewsByProductIdFromStorage = (productId) => {
    try {
        const storedReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
        const allReviews = storedReviews ? JSON.parse(storedReviews) : [];
        return allReviews.filter(r => String(r.productId) === String(productId));
    } catch (e) {
        console.error("Error reading reviews from storage:", e);
        return [];
    }
};

const saveAllReviewsToStorage = (reviews) => {
    try {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
        console.error("Error saving reviews to localStorage:", e);
    }
};

function SellerProductDetailPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { deleteProduct, isLoading: isSellerContextLoading } = useContext(SellerContext);

    const [product, setProduct] = useState(null);
    const [editedProduct, setEditedProduct] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showEditFields, setShowEditFields] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isSellerContextLoading) return;
        setIsLoading(true);
        setError('');
        if (!user || user.role !== 'Seller') {
            setError("Access denied. Please log in as a seller.");
            setIsLoading(false);
            return;
        }
        try {
            const foundProduct = getProductByIdFromStorage(productId, user.id);
            if (foundProduct) {
                setProduct(foundProduct);
                setEditedProduct({ ...foundProduct });
                const productReviews = getReviewsByProductIdFromStorage(productId);
                productReviews.sort((a, b) => (b.date || 0) - (a.date || 0));
                setReviews(productReviews);
            } else {
                setError("Product not found or you do not own this product.");
            }
        } catch (e) {
            setError("Failed to load product details or reviews.");
        } finally {
            setIsLoading(false);
        }
    }, [productId, user, isSellerContextLoading]);

    const handleAddResponse = (reviewId, responseText) => {
        if (!user || user.role !== 'seller') return;
        try {
            const allReviews = getReviewsByProductIdFromStorage(productId).map(r =>
                r.id === reviewId ? { ...r, sellerResponse: responseText } : r
            );
            const globalReviews = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) || '[]').map(r =>
                r.id === reviewId && r.sellerId === user.id ? { ...r, sellerResponse: responseText } : r
            );
            saveAllReviewsToStorage(globalReviews);
            setReviews(allReviews);
            alert("Response added successfully!");
        } catch (e) {
            alert("Failed to save response.");
        }
    };

    const handleRemove = () => {
        if (!product) return;
        if (window.confirm(`Are you sure you want to remove "${product.title}"?`)) {
            const success = deleteProduct(product.id);
            if (success) {
                alert('Product removed successfully.');
                navigate('/seller/products');
            } else {
                alert('Failed to remove product.');
            }
        }
    };

    const handleEditToggle = () => {
        setShowEditFields(!showEditFields);
    };

    const handleEditChange = (field, value) => {
        setEditedProduct(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = () => {
        const stored = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY)) || [];
        const updated = stored.map(p =>
            p.id === product.id && p.sellerId === user.id ? { ...p, ...editedProduct } : p
        );
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
        setProduct(editedProduct);
        setShowEditFields(false);
        alert("Product updated successfully.");
    };

    const displayImage = product?.images?.[0] || product?.base64image;

    if (isLoading || isSellerContextLoading) return <Loading />;
    if (error) return <p style={styles.errorMessage}>{error}</p>;
    if (!product) return <p style={styles.errorMessage}>Product details could not be loaded.</p>;

    return (
        <div style={styles.pageContainer}>
            <div style={styles.detailsSection}>
                <div style={styles.imageContainer}>
                    {displayImage ? (
                        <img src={displayImage} alt={product.title} style={styles.productImage} />
                    ) : (
                        <div style={styles.noImage}>No Image Provided</div>
                    )}
                </div>
                <div style={styles.infoContainer}>
                    <div>
                        <h1 style={styles.productTitle}>{product.title}</h1>
                        <p style={styles.productPrice}>${Number(product.price).toFixed(2)}</p>
                        <p style={styles.productDescription}>{product.description}</p>
                        <div style={styles.sellerInfo}>
                            <p><strong>Stock Quantity:</strong> {product.stock_quantity}</p>
                            <p><strong>Discount:</strong> {product.discount > 0 ? `${product.discount}%` : 'None'}</p>
                            <p><strong>Product ID:</strong> {product.id}</p>
                        </div>
                        <div style={styles.actionButtons}>
                            <button onClick={handleRemove} style={{ ...styles.button, ...styles.removeButton }}>× Remove</button>
                            <button onClick={handleEditToggle} style={{ ...styles.button, ...styles.editButton }}>Edit</button>
                        </div>
                    </div>
                    {showEditFields && (
                        <div style={styles.editFields}>
                            <label htmlFor="title" style={styles.label}>Title</label>
                            <input
                                id="title"
                                value={editedProduct?.title || ''}
                                onChange={e => handleEditChange('title', e.target.value)}
                                style={styles.input}
                            />
                            <label htmlFor="price" style={styles.label}>Price</label>
                            <input
                                id="price"
                                type="number"
                                value={editedProduct?.price || ''}
                                onChange={e => handleEditChange('price', e.target.value)}
                                style={styles.input}
                            />
                            <label htmlFor="description" style={styles.label}>Description</label>
                            <textarea
                                id="description"
                                value={editedProduct?.description || ''}
                                onChange={e => handleEditChange('description', e.target.value)}
                                style={styles.textarea}
                            />
                            <label htmlFor="stock_quantity" style={styles.label}>Stock Quantity</label>
                            <input
                                id="stock_quantity"
                                type="number"
                                value={editedProduct?.stock_quantity || ''}
                                onChange={e => handleEditChange('stock_quantity', e.target.value)}
                                style={styles.input}
                            />
                            <label htmlFor="discount" style={styles.label}>Discount (%)</label>
                            <input
                                id="discount"
                                type="number"
                                value={editedProduct?.discount || ''}
                                onChange={e => handleEditChange('discount', e.target.value)}
                                style={styles.input}
                            />
                            <div style={styles.editButtonContainer}>
                                <button onClick={handleSaveEdit} style={{ ...styles.button, backgroundColor: '#10b981' }}>💾 Save</button>
                                <button onClick={() => setShowEditFields(false)} style={{ ...styles.button, backgroundColor: '#ef4444' }}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

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
                    <p style={styles.noReviewsMessage}>No reviews for this product yet.</p>
                )}
            </div>
        </div>
    );
}

// --- Basic Styles (Mimicking the image) ---
const styles = {
    pageContainer: {
        padding: '2rem 3rem',
        maxWidth: '1100px',
        margin: '2rem auto',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#fff', // Assuming a white background like the image content area
        borderRadius: '8px', // Optional: adds slight rounding
        // boxShadow: '0 2px 10px rgba(0,0,0,0.05)', // Optional: subtle shadow
    },
    errorMessage: {
        color: '#c0392b',
        textAlign: 'center',
        fontSize: '1.1rem',
        padding: '2rem',
    },
    detailsSection: {
        display: 'flex',
        flexDirection: 'row', // Arrange image and info side-by-side
        gap: '3rem', // Space between image and info
        marginBottom: '3rem', // Space before reviews
        flexWrap: 'wrap', // Allow wrapping on smaller screens
    },
    imageContainer: {
        flex: '1 1 300px', // Allows shrinking/growing, base width 300px
        maxWidth: '400px', // Max width for the image area
        position: 'relative', // For potential absolute positioning inside (like wishlist btn)
    },
    productImage: {
        width: '100%',
        height: 'auto',
        display: 'block',
        objectFit: 'contain', // Use 'contain' to see the whole image
        borderRadius: '4px', // Slight rounding on image
        border: '1px solid #eee' // Faint border
    },
    noImage: {
        width: '100%',
        height: '250px', // Example height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        color: '#888',
        borderRadius: '4px',
    },
    // wishlistButton: { /* Style the heart button if needed */ },
    infoContainer: {
        flex: '2 1 400px', // Take more space, base width 400px
        display: 'flex',
        flexDirection: 'column',
    },
    productTitle: {
        fontSize: '1.8rem', // Larger title
        fontWeight: '600',
        color: '#1f2937', // Dark gray
        marginBottom: '0.5rem',
    },
    productPrice: {
        fontSize: '1.75rem',
        fontWeight: 'bold',
        color: '#111827', // Almost black
        marginBottom: '1rem',
    },
    productDescription: {
        fontSize: '0.95rem',
        color: '#4b5563', // Medium gray
        lineHeight: '1.6',
        marginBottom: '1.5rem',
        flexGrow: 1, // Push buttons down if space allows
    },
    sellerInfo: {
        marginBottom: '1rem',
        fontSize: '0.9rem',
        color: '#374151',
    },
    actionButtons: {
        display: 'flex',
        gap: '1rem', // Space between buttons
        marginTop: 'auto', // Push to bottom if info container grows
        paddingTop: '1rem', // Space above buttons
    },
    button: {
        padding: '0.75rem 1.5rem',
        fontSize: '0.9rem',
        fontWeight: '500',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
    },
    removeButton: {
        backgroundColor: '#4b5563', // Darker gray/charcoal
        color: '#fff',
    },
    editButton: {
        backgroundColor: '#374151', // Slightly different gray
        color: '#fff',
    },
    // --- Edit Fields Styles ---
    editFields: {
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    label: {
        fontSize: '0.9rem',
        color: '#374151',
        fontWeight: '500',
    },
    input: {
        padding: '0.6rem 0.8rem',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '0.9rem',
    },
    textarea: {
        padding: '0.6rem 0.8rem',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '0.9rem',
        minHeight: '80px',
    },
    editButtonContainer: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem',
    },
    // --- Review Styles ---
    reviewsSection: {
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: '1px solid #e5e7eb', // Separator line
    },
    sectionTitle: {
        fontSize: '1.4rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#1f2937',
    },
    reviewsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', // Responsive grid
        gap: '1.5rem',
    },
    noReviewsMessage: {
        color: '#6b7280',
        fontSize: '1rem',
        textAlign: 'center',
        padding: '1rem 0',
    },
    // --- Placeholder ReviewCard Styles ---
    reviewCard: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
    },
    reviewRating: {
        marginBottom: '0.5rem',
        color: '#f59e0b', // Amber/yellow for stars
        fontSize: '1.1rem',
    },
    reviewTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '0.4rem',
        color: '#111827',
    },
    reviewBody: {
        fontSize: '0.9rem',
        color: '#4b5563',
        lineHeight: '1.5',
        marginBottom: '1rem',
        flexGrow: 1,
    },
    reviewFooter: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.75rem',
    },
    reviewerImage: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        objectFit: 'cover',
        backgroundColor: '#eee', // Placeholder bg
    },
    editButton: {
        backgroundColor: '#374151',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#4b5563',
        }
    },
    sellerInfo: {
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
        color: '#4b5563',
    },
    reviewsSection: {
        marginTop: '2rem',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '2rem',
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '1.5rem',
    },
    reviewsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    noReviewsMessage: {
        color: '#6b7280',
        textAlign: 'center',
        padding: '2rem',
    },
    formGroup: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '500',
        color: '#374151',
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        fontSize: '0.95rem',
    },
    fileInput: {
        padding: '0.5rem 0',    
    },
    previewContainer: {
        marginTop: '1rem',
    },
    previewImage: {
        maxWidth: '150px',
        maxHeight: '150px',
        objectFit: 'contain',
        border: '1px solid #eee',
        borderRadius: '4px',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        marginTop: '1.5rem',
    },
    cancelButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#f3f4f6',
        color: '#4b5563',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    submitButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#374151',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
    }
};

export default SellerProductDetailPage;