import { useState } from 'react';
import { Pencil } from 'lucide-react';
import EditUsernameModal from './EditUsernameModal';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '400px',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    marginBottom: '1rem',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  name: {
    fontWeight: 600,
    color: '#333',
  },
  role: {
    fontSize: '0.875rem',
    color: '#777',
  },
  icon: {
    color: '#555',
    cursor: 'pointer',
  },
};

export default function ProfileCard({ user, onUpdate, onRemove }) {
  const [showModal, setShowModal] = useState(false);

  if (!user) return null;

  return (
    <>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <img
            src={user.avatar || ''}
            alt="Profile"
            style={styles.avatar}
          />
          <div>
            <div style={styles.name}>{user.username}</div>
            <div style={styles.role}>{user.role || 'Buyer'}</div>
          </div>
        </div>
        <Pencil size={18} style={styles.icon} onClick={() => setShowModal(true)} />
      </div>

      {showModal && (
        <EditUsernameModal
          user={user}
          onClose={() => setShowModal(false)}
          onApply={(updatedUser) => {
            onUpdate(user.username, updatedUser);
            setShowModal(false);
          }}
          onRemove={(id) => {
            onRemove(id);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
