import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, User } from '../store/authStore';
import { useTimelineStore, TimelineEvent } from '../store/timelineStore';
import { useTeamStore, TeamMember } from '../store/teamStore';
import { apiService } from '../services/api';
import TeamPhotoField from '../components/Admin/TeamPhotoField';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isAuthenticated, 
    user, 
    users, 
    activityLogs, 
    activityLogsPagination,
    isLoading: authLoading,
    addUser, 
    removeUser, 
    updateUserRole, 
    updateUserStatus, 
    changePassword,
    logActivity,
    fetchUsers,
    fetchAllActivityLogs
  } = useAuthStore();

  // DEBUG LOGS
  console.log('[AdminDashboard] Render', { isAuthenticated, user: user?.username, authLoading });

  const { 
    events, 
    addEvent, 
    removeEvent, 
    updateEvent, 
    fetchEvents,
    isLoading: timelineLoading
  } = useTimelineStore();
  const { teamMembers, addTeamMember, updateTeamMember, removeTeamMember, fetchTeamMembers } = useTeamStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'user',
    password: '',
    confirmPassword: ''
  });
  const [newEventData, setNewEventData] = useState({
    name: '',
    date: '',
    category: 'performances' as TimelineEvent['category'],
    location: '',
    time: '',
    attendees: '',
    performers: '',
    duration: '',
    description: '',
    photo: null as File | null,
    photos: [] as File[]
  });
  const [newTeamData, setNewTeamData] = useState({
    name: '',
    role: '',
    school: '',
    bio: '',
    instagram: '',
    image: '',
    section: 'leadership' as TeamMember['section']
  });

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const { login, error: loginError, isLoading: loginLoading } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('[AdminDashboard] Fetching initial data');
      fetchUsers();
      fetchEvents();
      fetchTeamMembers();
      fetchAllActivityLogs(currentPage, itemsPerPage, activityFilter);
    }
  }, [isAuthenticated, user, fetchUsers, fetchEvents, fetchTeamMembers, fetchAllActivityLogs, currentPage, itemsPerPage, activityFilter]);

  // Remove the redirect effect
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[AdminDashboard] Attempting login', loginData.username);
    await login(loginData.username, loginData.password);
  };

  if (!isAuthenticated || !user) {
    console.log('[AdminDashboard] Showing login form. Auth:', isAuthenticated, 'User:', user);
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-surface-50">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold font-display text-surface-900">Admin Login</h1>
            <p className="text-surface-500">Please sign in to continue</p>
          </div>

          {loginError && (
            <div className="p-4 mb-6 text-sm text-red-600 rounded-lg bg-red-50">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-surface-700">Email</label>
              <input
                type="email"
                value={loginData.username}
                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 transition-all border rounded-lg outline-none border-surface-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-surface-700">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 transition-all border rounded-lg outline-none border-surface-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="flex items-center justify-center w-full py-3 btn-primary"
            >
              {loginLoading ? (
                <span className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="pt-6 mt-6 text-center border-t border-surface-100">
            <p className="mb-4 text-sm text-surface-500">First time setup?</p>
            <button
              type="button"
              onClick={async () => {
                if (window.confirm('This will create a default admin user (admin@onekey.com / admin123). Continue?')) {
                  try {
                    const { apiService } = await import('../services/api');
                    const result = await apiService.createUser({
                      username: 'admin',
                      email: 'admin@onekey.com',
                      password: 'admin123',
                      role: 'super_admin',
                      firstName: 'System',
                      lastName: 'Admin'
                    });
                    
                    if (result.success) {
                      alert('Admin user created! You can now login with:\nEmail: admin@onekey.com\nPassword: admin123');
                    } else {
                      alert('Error: ' + result.error);
                    }
                  } catch (e) {
                    alert('Error creating admin: ' + e);
                  }
                }
              }}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Initialize Admin Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login': return 'fas fa-sign-in-alt';
      case 'logout': return 'fas fa-sign-out-alt';
      case 'create': return 'fas fa-plus';
      case 'update': return 'fas fa-edit';
      case 'delete': return 'fas fa-trash';
      case 'failed_login': return 'fas fa-exclamation-triangle';
      case 'change_role': return 'fas fa-user-tag';
      case 'change_status': return 'fas fa-toggle-on';
      case 'change_password': return 'fas fa-key';
      case 'add_user': return 'fas fa-user-plus';
      case 'remove_user': return 'fas fa-user-minus';
      case 'add_event': return 'fas fa-calendar-plus';
      case 'update_event': return 'fas fa-calendar-edit';
      case 'delete_event': return 'fas fa-calendar-times';
      case 'add_team_member': return 'fas fa-user-friends';
      case 'update_team_member': return 'fas fa-user-edit';
      case 'remove_team_member': return 'fas fa-user-slash';
      default: return 'fas fa-info-circle';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newUserData.password !== newUserData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    const success = await addUser({
      username: newUserData.username,
      email: newUserData.email,
      firstName: newUserData.firstName,
      lastName: newUserData.lastName,
      role: newUserData.role as 'admin' | 'user',
      password: newUserData.password
    });
    
    // if (success && user) {
    //   logActivity(user.id, 'add_user', `Created new user: ${newUserData.username} (${newUserData.role})`);
    // }
    
    setShowCreateUserModal(false);
    setNewUserData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: 'user',
      password: '',
      confirmPassword: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || timelineLoading) return;
    
    try {
      let photoUrls: string[] = [];
      
      // Upload photos to Firebase Storage
      if (newEventData.photos.length > 0) {
        for (const photo of newEventData.photos) {
          try {
            const uploadResult = await apiService.uploadImage(photo);
            if (uploadResult.success && uploadResult.data) {
              photoUrls.push(uploadResult.data.filePath);
            } else {
              console.error('Failed to upload photo:', uploadResult.error);
              alert(`Failed to upload photo: ${photo.name}`);
            }
          } catch (error) {
            console.error('Error uploading photo:', error);
          }
        }
      }
      
      const newEvent = await addEvent({
        ...newEventData,
        photo: photoUrls[0] || null, // Keep first photo as main photo for now
        photos: photoUrls, // Store all photos
        createdBy: user.id
      });
      
      // if (newEvent) {
      //   // Log the event creation
      //   logActivity(user.id, 'add_event', `Created event: ${newEvent.name} (${newEvent.category})`);
      // }
      
      setShowCreateEventModal(false);
      setNewEventData({
        name: '',
        date: '',
        category: 'performances',
        location: '',
        time: '',
        attendees: '',
        performers: '',
        duration: '',
        description: '',
        photo: null,
        photos: []
      });
      
      console.log('Event created:', newEvent);
      
      console.log('Event created:', newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setNewEventData(prev => ({
        ...prev,
        photos: fileArray
      }));
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const event = events.find(e => e.id === eventId);
      await removeEvent(eventId);
      
      // Log the event deletion
      // if (user && event) {
      //   logActivity(user.id, 'delete_event', `Deleted event: ${event.name} (${event.category})`);
      // }
    }
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setEditingEvent(event);
    setNewEventData({
      name: event.name,
      date: event.date,
      category: event.category,
      location: event.location || '',
      time: event.time || '',
      attendees: event.attendees || '',
      performers: event.performers || '',
      duration: event.duration || '',
      description: event.description || '',
      photo: null,
      photos: []
    });
    setShowEditEventModal(true);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !editingEvent || timelineLoading) return;
    
    try {
      let photoUrls: string[] = [];
      
      // Upload new photos to Firebase Storage
      if (newEventData.photos.length > 0) {
        for (const photo of newEventData.photos) {
          try {
            const uploadResult = await apiService.uploadImage(photo);
            if (uploadResult.success && uploadResult.data) {
              photoUrls.push(uploadResult.data.filePath);
            } else {
              console.error('Failed to upload photo:', uploadResult.error);
              alert(`Failed to upload photo: ${photo.name}`);
            }
          } catch (error) {
            console.error('Error uploading photo:', error);
          }
        }
      }
      
      // Keep existing photos if no new ones uploaded
      if (photoUrls.length === 0 && editingEvent.photos) {
        photoUrls = editingEvent.photos;
      }
      
      await updateEvent(editingEvent.id, {
        ...newEventData,
        photo: photoUrls[0] || null,
        photos: photoUrls
      });
      
      // Log the event update
      // logActivity(user.id, 'update_event', `Updated event: ${editingEvent.name} (${editingEvent.category})`);
      
      setShowEditEventModal(false);
      setEditingEvent(null);
      setNewEventData({
        name: '',
        date: '',
        category: 'performances',
        location: '',
        time: '',
        attendees: '',
        performers: '',
        duration: '',
        description: '',
        photo: null,
        photos: []
      });
      
      console.log('Event updated successfully');
      
      console.log('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });


  const handleTeamInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTeamData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addTeamMember(newTeamData);
      setShowCreateTeamModal(false);
      setNewTeamData({
        name: '',
        role: '',
        school: '',
        bio: '',
        instagram: '',
        image: '',
        section: 'leadership'
      });
    } catch (error) {
      console.error('Error creating team member:', error);
      alert('Failed to create team member');
    }
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setNewTeamData({
      name: member.name,
      role: member.role,
      school: member.school,
      bio: member.bio,
      instagram: member.instagram,
      image: member.image,
      section: member.section
    });
    setShowEditTeamModal(true);
  };

  const handleUpdateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamMember) return;

    try {
      await updateTeamMember(editingTeamMember.id, newTeamData);
      setShowEditTeamModal(false);
      setEditingTeamMember(null);
      setNewTeamData({
        name: '',
        role: '',
        school: '',
        bio: '',
        instagram: '',
        image: '',
        section: 'leadership'
      });
    } catch (error) {
      console.error('Error updating team member:', error);
      alert('Failed to update team member');
    }
  };

  const handleDeleteTeamMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      await removeTeamMember(memberId);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUserData({
      username: user.username,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role,
      password: '',
      confirmPassword: ''
    });
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;

    if (newUserData.password && newUserData.password !== newUserData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Update user role
      await updateUserRole(editingUser.id, newUserData.role as User['role']);
      
      // Update password if provided
      if (newUserData.password) {
        await changePassword(editingUser.id, newUserData.password);
      }

      setShowEditUserModal(false);
      setEditingUser(null);
      setNewUserData({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        role: 'user',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const targetUser = users.find(u => u.id === userId);
      await removeUser(userId);
      
      // Log the user deletion
      // if (user && targetUser) {
      //   logActivity(user.id, 'remove_user', `Deleted user: ${targetUser.username}`);
      // }
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      await updateUserStatus(userId, !targetUser.isActive);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">Admin Dashboard</h1>
          {/* Welcome message hidden */}
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-chart-bar"></i>
              Overview
            </button>
            
            <button 
              className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="fas fa-users"></i>
              Users
            </button>
            
            <button 
              className={`sidebar-item ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              <i className="fas fa-user-friends"></i>
              Edit Team
            </button>
            
            <button 
              className={`sidebar-item ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <i className="fas fa-list"></i>
              Activity
            </button>
            
            <button 
              className={`sidebar-item ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              <i className="fas fa-calendar"></i>
              Timeline
            </button>

            <div className="mt-8 pt-4 border-t border-white/10">
              <button
                className="sidebar-item text-yellow-400 hover:text-yellow-300"
                onClick={async () => {
                  if (window.confirm('This will create a default admin user (admin@onekey.com / admin123). Continue?')) {
                    try {
                      const { apiService } = await import('../services/api');
                      const result = await apiService.createUser({
                        username: 'admin',
                        email: 'admin@onekey.com',
                        password: 'admin123',
                        role: 'super_admin',
                        firstName: 'System',
                        lastName: 'Admin'
                      });
                      
                      if (result.success) {
                        alert('Admin user created! You can now login with:\nEmail: admin@onekey.com\nPassword: admin123');
                      } else {
                        alert('Error: ' + result.error);
                      }
                    } catch (e) {
                      alert('Error creating admin: ' + e);
                    }
                  }
                }}
              >
                <i className="fas fa-key"></i>
                Setup Admin
              </button>
            </div>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="admin-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <div className="content-header">
                <h2 className="content-title">Dashboard Overview</h2>
              </div>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon users">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{users.length}</h3>
                    <p>Total Users</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon active">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{users.filter(u => u.isActive).length}</h3>
                    <p>Active Users</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon admin">
                    <i className="fas fa-shield"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{users.filter(u => u.role === 'admin' || u.role === 'super_admin').length}</h3>
                    <p>Administrators</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon logs">
                    <i className="fas fa-list"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{activityLogs.length}</h3>
                    <p>Activity Logs</p>
                  </div>
                </div>
              </div>

              <div className="activity-feed">
                <h3>Recent Activity</h3>
                {activityLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="activity-item">
                    <div className="activity-icon">
                      <i className={getActionIcon(log.action)}></i>
                    </div>
                    <div className="activity-content">
                      <p className="activity-text">{log.details}</p>
                      <span className="activity-time">{formatDate(log.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <>
              <div className="content-header">
                <h2 className="content-title">User Management</h2>
                <div className="content-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateUserModal(true)}
                  >
                    <i className="fas fa-plus"></i>
                    Add User
                  </button>
                </div>
              </div>

              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                  className="filter-select"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="super_admin">Admin</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div>
                          <strong>{user.username}</strong>
                          {user.firstName && user.lastName && (
                            <div className="text-muted">{user.firstName} {user.lastName}</div>
                          )}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="content-actions">
                          <button 
                            className="btn btn-sm btn-icon"
                            onClick={() => handleEditUser(user)}
                            title="Edit User"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className={`btn btn-sm btn-icon ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => handleToggleUserStatus(user.id)}
                            title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          >
                            <i className={`fas ${user.isActive ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-icon btn-danger"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete User"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Activity Logs Tab */}
          {activeTab === 'logs' && (
            <>
              <div className="content-header">
                <h2 className="content-title">Activity Logs</h2>
                <div className="content-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => fetchAllActivityLogs(currentPage, itemsPerPage, activityFilter)}
                    disabled={authLoading}
                  >
                    <i className="fas fa-sync-alt"></i>
                    {authLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>

              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                  className="filter-select"
                  value={activityFilter}
                  onChange={(e) => {
                    setActivityFilter(e.target.value);
                    setCurrentPage(1); // Reset to first page when filtering
                  }}
                >
                  <option value="all">All Actions</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="add_user">Add User</option>
                  <option value="update_user">Update User</option>
                  <option value="delete_user">Delete User</option>
                  <option value="add_event">Add Event</option>
                  <option value="update_event">Update Event</option>
                  <option value="delete_event">Delete Event</option>
                  <option value="add_team_member">Add Team Member</option>
                  <option value="update_team_member">Update Team Member</option>
                  <option value="delete_team_member">Delete Team Member</option>
                </select>
                <select 
                  className="filter-select"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>

              {authLoading ? (
                <div className="loading-state">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Loading activity logs...</p>
                </div>
              ) : (
                <>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Details</th>
                        <th>IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityLogs
                        .filter(log => 
                          searchTerm === '' || 
                          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.username && log.username.toLowerCase().includes(searchTerm.toLowerCase()))
                        )
                        .map((log) => (
                        <tr key={log.id}>
                          <td>{formatDate(log.timestamp)}</td>
                          <td>
                            {log.username ? (
                              <div>
                                <strong>{log.username}</strong>
                                {log.firstName && log.lastName && (
                                  <>
                                    <br />
                                    <small>{log.firstName} {log.lastName}</small>
                                  </>
                                )}
                              </div>
                            ) : (
                              'Unknown User'
                            )}
                          </td>
                          <td>
                            <span className="role-badge admin">
                              <i className={getActionIcon(log.action)}></i>
                              {log.action.replace(/_/g, ' ').toUpperCase()}
                            </span>
                          </td>
                          <td>{log.details}</td>
                          <td>{log.ipAddress || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {activityLogsPagination && activityLogsPagination.totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || authLoading}
                      >
                        <i className="fas fa-chevron-left"></i>
                        Previous
                      </button>
                      
                      <span className="pagination-info">
                        Page {activityLogsPagination.page} of {activityLogsPagination.totalPages} 
                        ({activityLogsPagination.total} total logs)
                      </span>
                      
                      <button
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, activityLogsPagination.totalPages))}
                        disabled={currentPage === activityLogsPagination.totalPages || authLoading}
                      >
                        Next
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Team Management Tab */}
          {activeTab === 'team' && (
            <>
              <div className="content-header">
                <h2 className="content-title">Team Management</h2>
                <div className="content-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateTeamModal(true)}
                  >
                    <i className="fas fa-plus"></i>
                    Add Team Member
                  </button>
                </div>
              </div>

              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                  className="filter-select"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Sections</option>
                  <option value="leadership">Leadership</option>
                  <option value="communications">Communications</option>
                  <option value="coordinators">Coordinators</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>School</th>
                    <th>Section</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers
                    .filter(member => {
                      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                           member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                           member.school.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesSection = roleFilter === 'all' || member.section === roleFilter;
                      return matchesSearch && matchesSection;
                    })
                    .map((member) => (
                    <tr key={member.id}>
                      <td>
                        <img 
                          src={member.image} 
                          alt={member.name}
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                        <div 
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            background: '#f7fafc',
                            borderRadius: '8px',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: '#a0aec0',
                            border: '2px solid #e2e8f0'
                          }}
                        >
                          No img
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{member.name}</strong>
                          <div className="text-muted">{member.bio.substring(0, 50)}...</div>
                        </div>
                      </td>
                      <td>{member.role}</td>
                      <td>{member.school}</td>
                      <td>
                        <span className={`role-badge ${member.section}`}>
                          {member.section}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${member.isActive ? 'active' : 'inactive'}`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="content-actions">
                          <button 
                            className="btn btn-sm btn-icon"
                            onClick={() => handleEditTeamMember(member)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-icon btn-warning"
                            onClick={() => updateTeamMember(member.id, { isActive: !member.isActive })}
                          >
                            <i className={`fas ${member.isActive ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-icon btn-danger"
                            onClick={() => handleDeleteTeamMember(member.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Timeline Management Tab */}
          {activeTab === 'timeline' && (
            <>
              <div className="content-header">
                <h2 className="content-title">Timeline Management</h2>
                <div className="content-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateEventModal(true)}
                  >
                    <i className="fas fa-plus"></i>
                    Add Event
                  </button>
                </div>
              </div>

              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                  className="filter-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="performances">Performances</option>
                  <option value="homework">Homework Help</option>
                  <option value="charity">Charity Events</option>
                </select>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Photo</th>
                    <th>Event Details</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.filter(event => categoryFilter === 'all' || event.category === categoryFilter).map((event) => (
                    <tr key={event.id}>
                      <td>
                        <div>
                          <strong>{formatDate(event.date)}</strong>
                          {event.time && (
                            <div className="text-muted">{event.time}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        {event.photo ? (
                          <img 
                            src={event.photo} 
                            alt={event.name}
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              objectFit: 'contain',
                              borderRadius: '8px',
                              border: '2px solid #e2e8f0',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        ) : (
                          <div 
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              background: '#f7fafc',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              color: '#a0aec0',
                              border: '2px solid #e2e8f0'
                            }}
                          >
                            No img
                          </div>
                        )}
                      </td>
                      <td>
                        <div>
                          <strong>{event.name}</strong>
                          {event.description && (
                            <div className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>
                              {event.description.length > 100 ? 
                                `${event.description.substring(0, 100)}...` : 
                                event.description
                              }
                            </div>
                          )}
                          {event.performers && (
                            <div className="text-muted" style={{ fontSize: '11px', marginTop: '2px', color: '#718096' }}>
                              <i className="fas fa-microphone"></i> {event.performers}
                            </div>
                          )}
                          {event.attendees && (
                            <div className="text-muted" style={{ fontSize: '11px', marginTop: '2px', color: '#718096' }}>
                              <i className="fas fa-users"></i> {event.attendees}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${event.category}`}>
                          {event.category}
                        </span>
                      </td>
                      <td>{event.location}</td>
                      <td>{event.duration || 'N/A'}</td>
                      <td>
                        <div className="content-actions">
                          <button 
                            className="btn btn-sm btn-icon"
                            onClick={() => handleEditEvent(event)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-icon btn-danger"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </main>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="modal-overlay active" onClick={() => setShowCreateUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New User</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateUserModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="modal-form">
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newUserData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUserData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={newUserData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={newUserData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  name="role"
                  value={newUserData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUserData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={newUserData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateUserModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <div className="modal-overlay active" onClick={() => setShowCreateEventModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Event</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateEventModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="modal-form">
              <div className="form-group">
                <label htmlFor="eventName">Event Name *</label>
                <input
                  type="text"
                  id="eventName"
                  name="name"
                  value={newEventData.name}
                  onChange={handleEventInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="eventDate">Date *</label>
                <input
                  type="date"
                  id="eventDate"
                  name="date"
                  value={newEventData.date}
                  onChange={handleEventInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="eventTime">Time</label>
                <input
                  type="time"
                  id="eventTime"
                  name="time"
                  value={newEventData.time}
                  onChange={handleEventInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="eventLocation">Location</label>
                <input
                  type="text"
                  id="eventLocation"
                  name="location"
                  value={newEventData.location}
                  onChange={handleEventInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="eventCategory">Category *</label>
                <select
                  id="eventCategory"
                  name="category"
                  value={newEventData.category}
                  onChange={handleEventInputChange}
                  required
                >
                  <option value="performances">Performances</option>
                  <option value="homework">Homework Help</option>
                  <option value="charity">Charity Events</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="eventDescription">Description</label>
                <textarea
                  id="eventDescription"
                  name="description"
                  value={newEventData.description}
                  onChange={handleEventInputChange}
                  rows={3}
                />
              </div>
              
              {newEventData.category !== 'homework' && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="eventAttendees">Expected Attendees</label>
                    <input
                      type="number"
                      id="eventAttendees"
                      name="attendees"
                      value={newEventData.attendees}
                      onChange={handleEventInputChange}
                      min="0"
                      placeholder="Enter number of attendees"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="eventPerformers">Performers</label>
                    <input
                      type="number"
                      id="eventPerformers"
                      name="performers"
                      value={newEventData.performers}
                      onChange={handleEventInputChange}
                      min="0"
                      placeholder="Enter number of performers"
                    />
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="eventPhoto">EVENT PHOTO(S)</label>
                <div style={{
                  border: '2px dashed #c4ae7b',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: '#ffffff',
                  marginTop: '0.5rem'
                }}>
                  <input
                    type="file"
                    id="eventPhoto"
                    name="photo"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    style={{ 
                      display: 'none'
                    }}
                  />
                  <label 
                    htmlFor="eventPhoto"
                    style={{
                      display: 'inline-block',
                      padding: '0.75rem 1.5rem',
                      background: '#c4ae7b',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      border: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#b39a6a';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#c4ae7b';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                  >
                    Choose Files
                  </label>
                  <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                    Select image files (JPG, PNG, GIF) - Multiple files allowed
                  </p>
                </div>
                {newEventData.photos.length > 0 && (
                  <div className="photo-preview" style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#ffffff',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#666' }}>
                      Photo Preview ({newEventData.photos.length} file{newEventData.photos.length > 1 ? 's' : ''} selected):
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                      {newEventData.photos.map((photo, index) => (
                        <img 
                          key={index}
                          src={URL.createObjectURL(photo)} 
                          alt={`Preview ${index + 1}`} 
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            objectFit: 'contain',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block', textAlign: 'center' }}>
                  Adding photos helps make your event more engaging
                </small>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateEventModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={timelineLoading}>
                  {timelineLoading ? (
                    <span className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                  ) : (
                    'Create Event'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditEventModal && editingEvent && (
        <div className="modal-overlay active" onClick={() => setShowEditEventModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Event</h3>
              <button 
                className="modal-close"
                onClick={() => setShowEditEventModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleUpdateEvent} className="modal-form">
              <div className="form-group">
                <label htmlFor="editEventName">Event Name *</label>
                <input
                  type="text"
                  id="editEventName"
                  name="name"
                  value={newEventData.name}
                  onChange={handleEventInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editEventDate">Date *</label>
                <input
                  type="date"
                  id="editEventDate"
                  name="date"
                  value={newEventData.date}
                  onChange={handleEventInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editEventTime">Time</label>
                <input
                  type="time"
                  id="editEventTime"
                  name="time"
                  value={newEventData.time}
                  onChange={handleEventInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editEventLocation">Location</label>
                <input
                  type="text"
                  id="editEventLocation"
                  name="location"
                  value={newEventData.location}
                  onChange={handleEventInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editEventCategory">Category *</label>
                <select
                  id="editEventCategory"
                  name="category"
                  value={newEventData.category}
                  onChange={handleEventInputChange}
                  required
                >
                  <option value="performances">Performances</option>
                  <option value="homework">Homework Help</option>
                  <option value="charity">Charity Events</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="editEventDescription">Description</label>
                <textarea
                  id="editEventDescription"
                  name="description"
                  value={newEventData.description}
                  onChange={handleEventInputChange}
                  rows={3}
                />
              </div>
              
              {newEventData.category !== 'homework' && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editEventAttendees">Expected Attendees</label>
                    <input
                      type="number"
                      id="editEventAttendees"
                      name="attendees"
                      value={newEventData.attendees}
                      onChange={handleEventInputChange}
                      min="0"
                      placeholder="Enter number of attendees"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="editEventPerformers">Performers</label>
                    <input
                      type="number"
                      id="editEventPerformers"
                      name="performers"
                      value={newEventData.performers}
                      onChange={handleEventInputChange}
                      min="0"
                      placeholder="Enter number of performers"
                    />
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="editEventPhoto">EVENT PHOTO(S)</label>
                <div style={{
                  border: '2px dashed #c4ae7b',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: '#ffffff',
                  marginTop: '0.5rem'
                }}>
                  <input
                    type="file"
                    id="editEventPhoto"
                    name="photo"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    style={{ 
                      display: 'none'
                    }}
                  />
                  <label 
                    htmlFor="editEventPhoto"
                    style={{
                      display: 'inline-block',
                      padding: '0.75rem 1.5rem',
                      background: '#c4ae7b',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      border: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#b39a6a';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#c4ae7b';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                  >
                    Choose Files
                  </label>
                  <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                    Select image files (JPG, PNG, GIF) - Multiple files allowed
                  </p>
                </div>
                {newEventData.photos.length > 0 && (
                  <div className="photo-preview" style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#ffffff',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#666' }}>
                      New Photo Preview ({newEventData.photos.length} file{newEventData.photos.length > 1 ? 's' : ''} selected):
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                      {newEventData.photos.map((photo, index) => (
                        <img 
                          key={index}
                          src={URL.createObjectURL(photo)} 
                          alt={`Preview ${index + 1}`} 
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            objectFit: 'contain',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {editingEvent.photos && editingEvent.photos.length > 0 && (
                  <div className="photo-preview" style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#666' }}>
                      Current Photos ({editingEvent.photos.length} photo{editingEvent.photos.length > 1 ? 's' : ''}):
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                      {editingEvent.photos.map((photo, index) => (
                        <img 
                          key={index}
                          src={photo} 
                          alt={`Current ${index + 1}`} 
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            objectFit: 'contain',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      ))}
                    </div>
                    <small style={{ color: '#666', fontSize: '0.7rem', marginTop: '0.5rem', display: 'block' }}>
                      Upload new photos to replace current ones, or leave empty to keep existing photos
                    </small>
                  </div>
                )}
                <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block', textAlign: 'center' }}>
                  Adding photos helps make your event more engaging
                </small>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditEventModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={timelineLoading}>
                  {timelineLoading ? (
                    <span className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                  ) : (
                    'Update Event'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Team Member Modal */}
      {showCreateTeamModal && (
        <div className="modal-overlay active" onClick={() => setShowCreateTeamModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Team Member</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateTeamModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateTeamMember} className="modal-form">
              <div className="form-group">
                <label htmlFor="teamName">Name *</label>
                <input
                  type="text"
                  id="teamName"
                  name="name"
                  value={newTeamData.name}
                  onChange={handleTeamInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="teamRole">Role *</label>
                <input
                  type="text"
                  id="teamRole"
                  name="role"
                  value={newTeamData.role}
                  onChange={handleTeamInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="teamSchool">School *</label>
                <input
                  type="text"
                  id="teamSchool"
                  name="school"
                  value={newTeamData.school}
                  onChange={handleTeamInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="teamSection">Section *</label>
                <select
                  id="teamSection"
                  name="section"
                  value={newTeamData.section}
                  onChange={handleTeamInputChange}
                  required
                >
                  <option value="leadership">Leadership</option>
                  <option value="communications">Communications</option>
                  <option value="coordinators">Coordinators</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="teamBio">Bio *</label>
                <textarea
                  id="teamBio"
                  name="bio"
                  value={newTeamData.bio}
                  onChange={handleTeamInputChange}
                  rows={4}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="teamInstagram">Instagram URL</label>
                <input
                  type="url"
                  id="teamInstagram"
                  name="instagram"
                  value={newTeamData.instagram}
                  onChange={handleTeamInputChange}
                  placeholder="https://www.instagram.com/username/"
                />
              </div>
              
              <TeamPhotoField
                id="teamImage"
                label="Photo"
                value={newTeamData.image}
                onChange={(path) => setNewTeamData(prev => ({ ...prev, image: path }))}
              />

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateTeamModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Member Modal */}
      {showEditTeamModal && editingTeamMember && (
        <div className="modal-overlay active" onClick={() => setShowEditTeamModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Team Member</h3>
              <button 
                className="modal-close"
                onClick={() => setShowEditTeamModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleUpdateTeamMember} className="modal-form">
              <div className="form-group">
                <label htmlFor="editTeamName">Name *</label>
                <input
                  type="text"
                  id="editTeamName"
                  name="name"
                  value={newTeamData.name}
                  onChange={handleTeamInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editTeamRole">Role *</label>
                <input
                  type="text"
                  id="editTeamRole"
                  name="role"
                  value={newTeamData.role}
                  onChange={handleTeamInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editTeamSchool">School *</label>
                <input
                  type="text"
                  id="editTeamSchool"
                  name="school"
                  value={newTeamData.school}
                  onChange={handleTeamInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editTeamSection">Section *</label>
                <select
                  id="editTeamSection"
                  name="section"
                  value={newTeamData.section}
                  onChange={handleTeamInputChange}
                  required
                >
                  <option value="leadership">Leadership</option>
                  <option value="communications">Communications</option>
                  <option value="coordinators">Coordinators</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="editTeamBio">Bio *</label>
                <textarea
                  id="editTeamBio"
                  name="bio"
                  value={newTeamData.bio}
                  onChange={handleTeamInputChange}
                  rows={4}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editTeamInstagram">Instagram URL</label>
                <input
                  type="url"
                  id="editTeamInstagram"
                  name="instagram"
                  value={newTeamData.instagram}
                  onChange={handleTeamInputChange}
                  placeholder="https://www.instagram.com/username/"
                />
              </div>
              
              <TeamPhotoField
                id="editTeamImage"
                label="Photo"
                value={newTeamData.image}
                onChange={(path) => setNewTeamData(prev => ({ ...prev, image: path }))}
              />

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditTeamModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="modal-overlay active" onClick={() => setShowEditUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button 
                className="modal-close"
                onClick={() => setShowEditUserModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="modal-form">
              <div className="form-group">
                <label htmlFor="editUsername">Username *</label>
                <input
                  type="text"
                  id="editUsername"
                  name="username"
                  value={newUserData.username}
                  onChange={handleInputChange}
                  required
                  disabled
                />
                <small>Username cannot be changed</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="editEmail">Email *</label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  value={newUserData.email}
                  onChange={handleInputChange}
                  required
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="editFirstName">First Name</label>
                  <input
                    type="text"
                    id="editFirstName"
                    name="firstName"
                    value={newUserData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="editLastName">Last Name</label>
                  <input
                    type="text"
                    id="editLastName"
                    name="lastName"
                    value={newUserData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="editRole">Role *</label>
                <select
                  id="editRole"
                  name="role"
                  value={newUserData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="editPassword">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  id="editPassword"
                  name="password"
                  value={newUserData.password}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="editConfirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="editConfirmPassword"
                  name="confirmPassword"
                  value={newUserData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditUserModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 