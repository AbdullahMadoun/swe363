

// src/pages/AccountPage.js
import React, { useState, useContext } from 'react';
import ProfileCard from './ProfileCard';
import NewUserModal from './NewUserModal';
import { UserContext } from '../context/UserContext';

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#fff', padding: '2rem', fontFamily: 'sans-serif' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  searchInput: { padding: '10px', borderRadius: '9999px', border: '1px solid #ccc', width: '250px' },
  roleSwitcher: { display: 'flex', backgroundColor: '#f0f0f0', borderRadius: '9999px', overflow: 'hidden' },
  roleButton: (active) => ({ padding: '6px 14px', backgroundColor: active ? '#000' : 'transparent', color: active ? '#fff' : '#000', border: 'none', fontSize: '14px', cursor: 'pointer' }),
  addButton: { padding: '10px 20px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
};

export default function AccountPage() {
  const { users, updateUser, removeUser, signupUser } = useContext(UserContext);
  const [selectedRole, setSelectedRole] = useState('All');
  const [search, setSearch] = useState('');
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  const handleUpdate = (updated) => {
    const { uid, ...data } = updated;
    updateUser(uid, data);
  };

  const handleRemove = (id) => {
    removeUser(id);
  };

  const handleCreate = async ({ email, password, username, role }) => {
    await signupUser({ email, password, username, role });
    setShowNewUserModal(false);
  };

  // filter logic
  const filtered = users
    .filter((u) => u.username.toLowerCase().includes(search.toLowerCase()))
    .filter((u) => (selectedRole === 'All' ? true : u.role === selectedRole));

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <input
          type="text"
          placeholder="Search user..."
          style={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={styles.roleSwitcher}>
          {['All', 'Buyer', 'Seller', 'Admin'].map((role) => (
            <button
              key={role}
              style={styles.roleButton(selectedRole === role)}
              onClick={() => setSelectedRole(role)}
            >
              {selectedRole === role ? '✓ ' : ''}{role}
            </button>
          ))}
        </div>
        <button style={styles.addButton} onClick={() => setShowNewUserModal(true)}>
          + Add User
        </button>
      </div>

      <div>
        {filtered.map((user) => (
          <ProfileCard
            key={user.id}
            user={user}
            onUpdate={handleUpdate}
            onRemove={() => handleRemove(user.id)}
          />
        ))}
      </div>

      {showNewUserModal && (
        <NewUserModal
          onClose={() => setShowNewUserModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
