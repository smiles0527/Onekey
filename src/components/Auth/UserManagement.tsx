import React, { useState } from 'react';
import { useAuthStore, User } from '../../store/authStore';
import { format } from 'date-fns';

interface UserManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ isOpen, onClose }) => {
  const { users, addUser, removeUser, updateUserRole, user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'users' | 'add' | 'permissions'>('users');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as User['role'],
    department: '',
    firstName: '',
    lastName: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newUserForm.username.trim()) newErrors.username = 'Username is required';
    if (!newUserForm.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(newUserForm.email)) newErrors.email = 'Email is invalid';
    if (!newUserForm.password.trim()) newErrors.password = 'Password is required';
    if (newUserForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (newUserForm.password !== newUserForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (users.some(u => u.username === newUserForm.username)) {
      newErrors.username = 'Username already exists';
    }
    if (users.some(u => u.email === newUserForm.email)) {
      newErrors.email = 'Email already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const userData = {
      username: newUserForm.username,
      email: newUserForm.email,
      role: newUserForm.role,
      password: newUserForm.password,
      // In production, these would be stored in a more comprehensive user profile
      firstName: newUserForm.firstName,
      lastName: newUserForm.lastName,
      department: newUserForm.department
    };

    await addUser(userData);
    
    // Reset form
    setNewUserForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      department: '',
      firstName: '',
      lastName: ''
    });
    setErrors({});
    setActiveTab('users');
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      alert("You cannot delete your own account!");
      return;
    }
    await removeUser(userId);
    setShowDeleteConfirm(null);
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    if (userId === currentUser?.id) {
      alert("You cannot change your own role!");
      return;
    }
    await updateUserRole(userId, newRole);
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'super_admin': return '#e74c3c';
      case 'admin': return '#f39c12';
      default: return '#3498db';
    }
  };

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'super_admin': return 'fas fa-crown';
      case 'admin': return 'fas fa-shield-alt';
      default: return 'fas fa-user';
    }
  };

  const formatRole = (role: User['role']) => {
    switch (role) {
      case 'super_admin': return 'Admin';
      case 'admin': return 'Admin';
      default: return 'User';
    }
  };

  const permissions = {
    super_admin: [
      'Manage all users',
      'Delete any user (except self)',
      'Change user roles',
      'Access all timeline events',
      'Administration',
      'View activity logs',
      'Export data'
    ],
    admin: [
      'Add/edit timeline events',
      'View all events',
      'Moderate content',
      'View user list',
      'Basic administration'
    ],
    user: [
      'View public content',
      'View timeline events',
      'Basic profile access'
    ]
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-content admin-panel" style={{ maxWidth: '600px', maxHeight: '80vh' }}>
        <div className="modal-header">
          <h2>User Management</h2>
          <div className="header-actions">
            <button className="btn-secondary" onClick={onClose}>
              Close Panel
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="management-tabs">
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            All Users ({users.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Create New User
          </button>
          <button 
            className={`tab-btn ${activeTab === 'permissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('permissions')}
          >
            Role Permissions
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="tab-content">
            <div className="users-list">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-info">
                    <div className="user-details">
                      <div className="user-name">
                        <h4>{user.username}</h4>
                        <span className={`user-status ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p>{user.email}</p>
                      {user.firstName && user.lastName && (
                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#555' }}>
                          {user.firstName} {user.lastName}
                        </p>
                      )}
                      {user.department && (
                        <p style={{ margin: '0', fontSize: '0.8rem', color: '#888' }}>
                          {user.department}
                        </p>
                      )}
                      <small>Created: {format(new Date(user.createdAt), 'MMM dd, yyyy')}</small>
                      {user.lastLoginAt && (
                        <div className="last-login">
                          Last login: {format(new Date(user.lastLoginAt), 'MMM dd, yyyy HH:mm')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="user-actions">
                    <div className="role-selector">
                      <label>Role:</label>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                        disabled={user.id === currentUser?.id}
                        style={{ 
                          color: getRoleColor(user.role),
                          fontWeight: 'bold'
                        }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Admin</option>
                      </select>
                    </div>
                    
                                         {user.id !== currentUser?.id && (
                       <button
                         className="delete-user-btn"
                         onClick={() => setShowDeleteConfirm(user.id)}
                       >
                         Delete
                       </button>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add User Tab */}
        {activeTab === 'add' && (
          <div className="tab-content">
            <form onSubmit={handleAddUser} className="add-user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={newUserForm.firstName}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={newUserForm.lastName}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, username: e.target.value }))}
                    required
                    placeholder="johndoe"
                  />
                  {errors.username && <span className="error">{errors.username}</span>}
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    placeholder="Min 6 characters"
                  />
                  {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <div className="form-group">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    value={newUserForm.confirmPassword}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                    style={{ color: getRoleColor(newUserForm.role), fontWeight: 'bold' }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    value={newUserForm.department}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g. Music, Education"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                <i className="fas fa-user-plus"></i> Add User
              </button>
            </form>
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <div className="tab-content">
            <div className="permissions-overview">
              {Object.entries(permissions).map(([role, perms]) => (
                <div key={role} className="permission-group">
                  <h3 style={{ color: getRoleColor(role as User['role']) }}>
                    <i className={getRoleIcon(role as User['role'])}></i>
                    {formatRole(role as User['role'])}
                  </h3>
                  <ul className="permissions-list">
                    {perms.map((permission, index) => (
                      <li key={index}>
                        <i className="fas fa-check"></i>
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="confirmation-overlay">
            <div className="confirmation-modal">
              <h3><i className="fas fa-exclamation-triangle"></i> Confirm Deletion</h3>
              <p>Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="confirmation-actions">
                <button 
                  className="btn-cancel"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement; 