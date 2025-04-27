// src/pages/PolicyPage.jsx

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'sans-serif',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  preview: {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    borderRadius: '8px',
    lineHeight: 1.6,
  },
};

export default function PolicyPage() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const policyRef = doc(db, 'policies', 'policy');
        const snap = await getDoc(policyRef);
        if (snap.exists()) {
          setContent(snap.data().markdown || '# No Policy Available');
        } else {
          setContent('# No Policy Available');
        }
      } catch (err) {
        console.error('Error fetching policy:', err);
        setContent('# No Policy Available');
      }
    };

    fetchPolicy();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Site Policies</h1>
      <div style={styles.preview}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
