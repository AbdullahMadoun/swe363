// src/components/NewUserModal.js
import React, { useState, useContext } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { UserContext } from '../context/UserContext';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
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
    marginTop: '12px',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: '10px 40px 10px 10px',
    marginTop: '6px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#888',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginTop: '6px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  errorText: {
    color: '#dc3545',
    marginTop: '8px',
    fontSize: '0.9rem',
  },
  button: {
    marginTop: '16px',
    width: '100%',
    padding: '10px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default function NewUserModal({ onClose }) {
  const { signupUser } = useContext(UserContext);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Buyer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleCreate = async () => {
    const { username, email, password, role } = form;
    if (!username.trim() || !email.trim() || !password) {
      setError('All fields are required.');
      return;
    }
    try {
      await signupUser({ email, password, username, role });
      onClose();
    } catch (e) {
      console.error('Signup failed:', e);
      setError(e.message || 'Failed to create account.');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <X size={20} style={styles.closeIcon} onClick={onClose} />

        <label style={styles.label}>Username</label>
        <input
          name="username"
          style={styles.input}
          value={form.username}
          onChange={handleChange}
        />

        <label style={styles.label}>Email</label>
        <input
          name="email"
          type="email"
          style={styles.input}
          value={form.email}
          onChange={handleChange}
        />

        <label style={styles.label}>Password</label>
        <div style={styles.passwordWrapper}>
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            style={styles.input}
            value={form.password}
            onChange={handleChange}
          />
          {showPassword ? (
            <EyeOff
              size={18}
              style={styles.eyeIcon}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <Eye
              size={18}
              style={styles.eyeIcon}
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        <label style={styles.label}>Role</label>
        <select
          name="role"
          style={styles.select}
          value={form.role}
          onChange={handleChange}
        >
          <option>Buyer</option>
          <option>Seller</option>
          <option>Admin</option>
        </select>

        {error && <div style={styles.errorText}>{error}</div>}

        <button style={styles.button} onClick={handleCreate}>
          Create Account
        </button>
      </div>
    </div>
  );
}
