// src/components/ReviewCard.js
import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

// Helper to format ISO date
const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
        return new Date(timestamp).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return 'Invalid Date';
    }
};

// Helper to render stars
const renderStars = (rating) => {
    const full = Math.floor(Number(rating) || 0);
    const empty = 5 - full;
    return (
        <>
            {'★'.repeat(full)}
            {'☆'.repeat(empty)}
        </>
    );
};

function ReviewCard({ review, mode = 'buyer' }) {
    const {
        id,
        rating,
        title,
        body,
        reviewerName,
        reviewerImage,
        date,
        productTitle
    } = review || {};

    const [showResponseForm, setShowResponseForm] = useState(false);
    const [responseText, setResponseText] = useState('');
    const [sellerResponse, setSellerResponse] = useState('');

    // Load seller response from localStorage
    useEffect(() => {
        const storedResponses = JSON.parse(localStorage.getItem('seller_responses') || '{}');
        if (storedResponses[id]) {
            setSellerResponse(storedResponses[id]);
        }
    }, [id]);

    const handleRespond = (e) => {
        e.preventDefault();
        const trimmed = responseText.trim();
        if (!trimmed) return alert("Please enter a response.");

        // Save to localStorage
        const stored = JSON.parse(localStorage.getItem('seller_responses') || '{}');
        stored[id] = trimmed;
        localStorage.setItem('seller_responses', JSON.stringify(stored));

        setSellerResponse(trimmed);
        setShowResponseForm(false);
        setResponseText('');
    };

    const toggleResponseForm = () => {
        setShowResponseForm(!showResponseForm);
        setResponseText('');
    };

    if (!review) return <div style={styles.card}>Review data missing.</div>;

    return (
        <div style={styles.card}>
            {mode === 'seller' && productTitle && (
                <p style={styles.productTitle}>
                    Product: <span style={styles.productTitleValue}>{productTitle}</span>
                </p>
            )}

            <div style={styles.rating}>{renderStars(rating)}</div>
            <h4 style={styles.reviewTitle}>{title || "Untitled Review"}</h4>
            <p style={styles.reviewBody}>{body}</p>

            <div style={styles.footer}>
                <div style={styles.reviewerInfo}>
                    <img
                        src={reviewerImage || '/placeholder-avatar.png'}
                        alt={reviewerName || 'Reviewer'}
                        style={styles.reviewerImage}
                    />
                    <div>
                        <span style={styles.reviewerName}>{reviewerName || 'Anonymous'}</span>
                        <span style={styles.reviewDate}>{formatDate(date)}</span>
                    </div>
                </div>

                {mode === 'seller' && !sellerResponse && (
                    <button onClick={toggleResponseForm} style={styles.respondButton}>
                        <MessageSquare size={14} style={{ marginRight: '4px' }} />
                        {showResponseForm ? 'Cancel' : 'Respond'}
                    </button>
                )}
            </div>

            {sellerResponse && (
                <div style={styles.sellerResponseSection}>
                    <h5 style={styles.sellerResponseTitle}>Your Response:</h5>
                    <p style={styles.sellerResponseBody}>{sellerResponse}</p>
                </div>
            )}

            {mode === 'seller' && showResponseForm && !sellerResponse && (
                <form onSubmit={handleRespond} style={styles.responseForm}>
                    <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Write your response..."
                        style={styles.responseTextArea}
                        rows={3}
                        required
                    />
                    <button type="submit" style={styles.submitResponseButton}>
                        Submit Response
                    </button>
                </form>
            )}
        </div>
    );
}

// --- Styles ---
const styles = {
    card: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        fontFamily: 'system-ui, sans-serif',
        color: '#1f2937',
    },
    productTitle: {
        fontSize: '0.8rem',
        color: '#6b7280',
        borderBottom: '1px dashed #e5e7eb',
        paddingBottom: '0.5rem',
        marginBottom: '0.75rem',
        fontWeight: 500,
    },
    productTitleValue: {
        fontWeight: 600,
        color: '#374151',
    },
    rating: {
        marginBottom: '0.5rem',
        color: '#f59e0b',
        fontSize: '1.1rem',
    },
    reviewTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '0.4rem',
        color: '#111827',
        lineHeight: 1.3,
    },
    reviewBody: {
        fontSize: '0.9rem',
        color: '#4b5563',
        lineHeight: '1.5',
        marginBottom: '1rem',
        flexGrow: 1,
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        borderTop: '1px solid #f3f4f6',
        paddingTop: '0.75rem',
        marginTop: 'auto',
    },
    reviewerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    reviewerImage: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        objectFit: 'cover',
        backgroundColor: '#e5e7eb',
        border: '1px solid #d1d5db',
    },
    reviewerName: {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        display: 'block',
    },
    reviewDate: {
        fontSize: '0.75rem',
        color: '#6b7280',
        display: 'block',
    },
    respondButton: {
        padding: '0.5rem 1rem',
        fontSize: '0.8rem',
        fontWeight: '500',
        borderRadius: '4px',
        border: '1px solid #d1d5db',
        backgroundColor: '#ffffff',
        color: '#374151',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
    },
    sellerResponseSection: {
        marginTop: '1rem',
        padding: '0.75rem 1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
    },
    sellerResponseTitle: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '0.3rem',
    },
    sellerResponseBody: {
        fontSize: '0.85rem',
        color: '#4b5563',
        lineHeight: 1.5,
        margin: 0,
    },
    responseForm: {
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px dashed #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    responseTextArea: {
        width: '100%',
        padding: '0.5rem 0.75rem',
        fontSize: '0.9rem',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        resize: 'vertical',
        fontFamily: 'inherit',
    },
    submitResponseButton: {
        padding: '0.6rem 1rem',
        fontSize: '0.85rem',
        fontWeight: '500',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        cursor: 'pointer',
        alignSelf: 'flex-start',
    },
};

export default ReviewCard;
