import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function PolicyPage() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('policyMarkdown');
    setContent(saved || '# No Policy Available');
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
