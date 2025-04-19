import { useState } from 'react';
import ProfileCard from './ProfileCard';
import NewUserModal from './NewUserModal';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    padding: '2rem',
    fontFamily: 'sans-serif',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  leftNav: {
    display: 'flex',
    gap: '1rem',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '9999px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatarCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#000',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  profileText: {
    textAlign: 'right',
  },
  roleSwitcher: {
    display: 'flex',
    backgroundColor: '#f0f0f0',
    borderRadius: '9999px',
    overflow: 'hidden',
    marginLeft: '1rem',
  },
  roleButton: (active) => ({
    padding: '8px 16px',
    backgroundColor: active ? '#000' : 'transparent',
    color: active ? '#fff' : '#000',
    border: 'none',
    cursor: 'pointer',
  }),
  searchInput: {
    padding: '10px 16px',
    borderRadius: '9999px',
    border: '1px solid #ccc',
    width: '300px',
    marginBottom: '2rem',
  },
  searchInput: {
    padding: '10px',
    borderRadius: '9999px',
    border: '1px solid #ccc',
    width: '250px',
  },
  
  roleSwitcher: {
    display: 'flex',
    backgroundColor: '#f0f0f0',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  
  roleButton: (active) => ({
    padding: '6px 14px',
    backgroundColor: active ? '#000' : 'transparent',
    color: active ? '#fff' : '#000',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
  }),  
};



export default function AccountPage() {
  const [selectedRole, setSelectedRole] = useState('All');
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')));
  const [search, setSearch] = useState('');
  const [showNewUserModal, setShowNewUserModal] = useState(false);


  const handleUpdate = (id, updatedUser) => {
    const updated = users.map((user) =>
      user.username === id ? { ...user, ...updatedUser } : user
    );
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated)); // <-- this line syncs it
  };
  
  const handleRemove = (id) => {
    const filtered = users.filter((user) => user.username !== id);
    setUsers(filtered);
    localStorage.setItem('users', JSON.stringify(filtered)); // <-- sync on delete
  };
  

  return (
    <div style={styles.page}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Someone"
              style={{
                ...styles.searchInput,
                paddingRight: '2.5rem',
                paddingLeft: '1rem',
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#888',
                fontSize: '1rem',
              }}
            >
              🔍
            </span>
          </div>
  
          {/* Role Filter */}
          <div style={styles.roleSwitcher}>
            {['All', 'Buyer', 'Seller'].map((role) => (
              <button
                key={role}
                style={styles.roleButton(selectedRole === role)}
                onClick={() => setSelectedRole(role)}
              >
                {selectedRole === role ? '✓ ' : ''}{role}
              </button>
            ))}
          </div>
        </div>
  
        
        <button
          onClick={() => setShowNewUserModal(true)}
          style={{
            padding: '10px 20px',
            marginTop: '2rem',
            marginBottom: '1rem',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          + Add User
        </button>

      </div>
  
      {/* Filtered Profile Cards */}
      <div>
        {users
          .filter((user) =>
            user.username.toLowerCase().includes(search.toLowerCase())
          )
          .filter((user) =>
            selectedRole === 'All' ? true : user.role === selectedRole
          )
          .map((user) => (
            <ProfileCard
              key={user.id}
              user={user}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
      </div>
      {showNewUserModal && (
        <NewUserModal
          onClose={() => setShowNewUserModal(false)}
          onCreate={(newUser) => {
            const updated = [...users, newUser];
            setUsers(updated);
            localStorage.setItem('users', JSON.stringify(updated));
          }}
        />
      )}

    </div>
    
  );
  
  
}
