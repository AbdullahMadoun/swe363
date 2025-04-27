// src/components/ReviewCard.js

import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

export default function ReviewCard({
  review,
  mode = 'buyer',
  onRespondClick    // <-- new prop
}) {
  const {
    id,
    rating,
    title,
    body,
    reviewerName,
    reviewerImage,
    date,
    productTitle,
    sellerResponse  // <-- coming from Firestore!
  } = review || {};

  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText]       = useState('');

  useEffect(() => {
    // whenever the review prop changes (including its sellerResponse),
    // clear the form & hide it
    setShowResponseForm(false);
    setResponseText('');
  }, [id, sellerResponse]);

  const toggleResponseForm = () => {
    setShowResponseForm(v => !v);
    setResponseText('');
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    const trimmed = responseText.trim();
    if (!trimmed) {
      alert("Please enter a response.");
      return;
    }
    // fire parent callback, which writes to Firestore
    await onRespondClick(id, trimmed);
    // we’ll pick up the updated sellerResponse via onSnapshot
  };

  // format date
  const formattedDate = date
    ? new Date(date).toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' })
    : 'N/A';

  // render stars
  const fullStars = Math.floor(rating||0);
  const emptyStars = 5 - fullStars;
  const stars = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);

  return (
    <div style={styles.card}>
      {mode === 'seller' && productTitle && (
        <p style={styles.productTitle}>
          Product: <strong>{productTitle}</strong>
        </p>
      )}

      <div style={styles.rating}>{stars}</div>
      <h4 style={styles.reviewTitle}>{title}</h4>
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
            <span style={styles.reviewDate}>{formattedDate}</span>
          </div>
        </div>

        {mode === 'seller' && !sellerResponse && (
          <button onClick={toggleResponseForm} style={styles.respondButton}>
            <MessageSquare size={14} style={{ marginRight: 4 }} />
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
            onChange={e => setResponseText(e.target.value)}
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

// --- Styles (same as before) ---
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
  rating: { marginBottom: '0.5rem', color: '#f59e0b', fontSize: '1.1rem' },
  reviewTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' },
  reviewBody: { flexGrow:1, marginBottom:'1rem', color: '#4b5563' },
  footer: {
    display: 'flex', justifyContent:'space-between', alignItems:'center',
    borderTop:'1px solid #f3f4f6', paddingTop:'0.75rem', marginTop:'auto'
  },
  reviewerInfo: { display:'flex', alignItems:'center', gap:'0.75rem' },
  reviewerImage: { width:36, height:36, borderRadius:'50%', objectFit:'cover', background:'#e5e7eb' },
  reviewerName: { display:'block', fontWeight:500 },
  reviewDate: { display:'block', fontSize:'0.75rem', color:'#6b7280' },
  respondButton: {
    padding:'0.5rem 1rem', fontSize:'0.8rem', fontWeight:500,
    borderRadius:4, border:'1px solid #d1d5db', background:'#fff',
    cursor:'pointer', display:'inline-flex', alignItems:'center'
  },
  sellerResponseSection: {
    marginTop: '1rem', padding:'0.75rem', backgroundColor:'#f9fafb', borderRadius:6
  },
  sellerResponseTitle: { margin:0, marginBottom:'0.3rem', fontSize:'0.85rem', fontWeight:600 },
  sellerResponseBody: { margin:0, fontSize:'0.85rem', color:'#4b5563' },
  responseForm: { marginTop:'1rem', paddingTop:'1rem', borderTop:'1px dashed #e5e7eb', display:'flex', flexDirection:'column', gap:'0.75rem' },
  responseTextArea: { width:'100%', padding:'0.5rem', borderRadius:6, border:'1px solid #d1d5db', fontFamily:'inherit' },
  submitResponseButton: { padding:'0.6rem 1rem', backgroundColor:'#2563eb', color:'#fff', border:'none', borderRadius:4, cursor:'pointer', alignSelf:'flex-start' },
};
