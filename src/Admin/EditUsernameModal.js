// src/components/EditUsernameModal.js
import React, { useState, useContext } from 'react';
import { X } from 'lucide-react';
import { UserContext } from '../context/UserContext';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    width: '400px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative',
  },
  closeIcon: { position: 'absolute', top: '12px', right: '12px', cursor: 'pointer' },
  label: { display: 'block', marginBottom: '8px', fontWeight: 500 },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: '8px',
    border: '1px solid #ccc', fontSize: '15px', margin: '6px 0',
    boxSizing: 'border-box',
  },
  buttonGroup: { display: 'flex', gap: '12px' },
  button: {
    padding: '8px 16px', backgroundColor: '#222',
    color: '#fff', border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontSize: '14px',
  },
};

export default function EditUsernameModal({ onClose, onApply, onRemove }) {
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState(user?.displayName || '');

  const handleApply = () => {
    onApply({ ...user, username: username });
  };

  const handleRemove = () => {
    
    onRemove();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <X size={18} style={styles.closeIcon} onClick={onClose} />
        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={handleApply}>
            Apply
          </button>
          <button style={styles.button} onClick={handleRemove}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
