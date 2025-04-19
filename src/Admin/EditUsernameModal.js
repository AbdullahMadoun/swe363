import { useState } from 'react';
import { X } from 'lucide-react';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
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
  closeIcon: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    cursor: 'pointer',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    fontFamily: 'inherit',
    lineHeight: '1.4',
    marginTop: '6px', // space between label and input
    marginBottom: '6px',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#222',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default function EditUsernameModal({ user, onClose, onApply, onRemove }) {
   
  const [username, setUsername] = useState(user.username);

  const handleApply = () => {
    const t = {...user}
    t.username = username;
    onApply(t);
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
          <button style={styles.button} onClick={() => onRemove(user.username)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
