import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; // Make sure to install: npm install react-markdown

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
  },
  textarea: {
    width: '100%',
    minHeight: '200px',
    padding: '1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    marginBottom: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#222',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  preview: {
    padding: '1rem',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
};

export default function PolicyControl() {
  const [markdown, setMarkdown] = useState('');

  // Load from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem('policyMarkdown');
    if (saved) setMarkdown(saved);
  }, []);

  // Save to localStorage
  const handleApply = () => {
    localStorage.setItem('policyMarkdown', markdown);
    alert('Policy saved to localStorage!');
  };

  // Download as .md file
  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'policies.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <textarea
        style={styles.textarea}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Edit your markdown here..."
      />
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={handleApply}>Apply</button>
        <button style={styles.button} onClick={handleDownload}>Download</button>
      </div>

      <h3>Live Preview</h3>
      <div style={styles.preview}>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
