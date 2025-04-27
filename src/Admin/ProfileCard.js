// src/components/ProfileCard.js
import React, { useState, useContext } from 'react';
import { Pencil } from 'lucide-react';
import EditUsernameModal from './EditUsernameModal';
import { UserContext } from '../context/UserContext';

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
    backgroundColor: '#eee',
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

export default function ProfileCard({ user }) {
  const [showModal, setShowModal] = useState(false);
  const { updateUser, removeUser } = useContext(UserContext);

  if (!user) return null;

  return (
    <>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <img
            src={user.avatar || 'https://via.placeholder.com/40'}
            alt="Profile"
            style={styles.avatar}
          />
          <div>
            <div style={styles.name}>{user.username}</div>
            <div style={styles.role}>{user.role || 'Buyer'}</div>
          </div>
        </div>
        <Pencil
          size={18}
          style={styles.icon}
          onClick={() => setShowModal(true)}
        />
      </div>

      {showModal && (
        <EditUsernameModal
          onClose={() => setShowModal(false)}
          onApply={(updated) => {
            // updated contains { id, username: newName, ... }
            updateUser(user.id, updated.username);
            setShowModal(false);
          }}
          onRemove={() => {
            removeUser(user.id);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
