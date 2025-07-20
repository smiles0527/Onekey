import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTimelineStore, TimelineEvent } from '../store/timelineStore';
import { backupTimelineData } from '../utils/persistenceTest';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, hasPermission, users, activityLogs, addUser } = useAuthStore();
  const { events, addEvent, removeEvent, updateEvent } = useTimelineStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
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

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }

    if (!hasPermission('basic_admin')) {
      navigate('/');
      return;
    }

    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam && ['overview', 'users', 'logs', 'timeline'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [isAuthenticated, user, hasPermission, navigate, location.search]);

  if (!isAuthenticated || !user || !hasPermission('basic_admin')) {
    return null;
  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login': return 'fas fa-sign-in';
      case 'logout': return 'fas fa-sign-out';
      case 'create': return 'fas fa-plus';
      case 'update': return 'fas fa-edit';
      case 'delete': return 'fas fa-trash';
      default: return 'fas fa-info';
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

    try {
      await addUser({
        username: newUserData.username,
        email: newUserData.email,
        firstName: newUserData.firstName,
        lastName: newUserData.lastName,
        role: newUserData.role as 'admin' | 'user',
        password: newUserData.password
      });
      
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
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
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
    
    if (!user) return;
    
    try {
      let photoUrls: string[] = [];
      
      // Convert photo files to base64 if present
      if (newEventData.photos.length > 0) {
        for (const photo of newEventData.photos) {
          const photoUrl = await convertFileToBase64(photo);
          photoUrls.push(photoUrl);
        }
      }
      
      const newEvent = addEvent({
        ...newEventData,
        photo: photoUrls[0] || null, // Keep first photo as main photo for now
        photos: photoUrls, // Store all photos
        createdBy: user.id
      });
      
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
      
      // Create backup after adding event
      backupTimelineData();
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

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      removeEvent(eventId);
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
    
    if (!user || !editingEvent) return;
    
    try {
      let photoUrls: string[] = [];
      
      // Convert new photo files to base64 if present
      if (newEventData.photos.length > 0) {
        for (const photo of newEventData.photos) {
          const photoUrl = await convertFileToBase64(photo);
          photoUrls.push(photoUrl);
        }
      }
      
      // Keep existing photos if no new ones uploaded
      if (photoUrls.length === 0 && editingEvent.photos) {
        photoUrls = editingEvent.photos;
      }
      
      updateEvent(editingEvent.id, {
        ...newEventData,
        photo: photoUrls[0] || null,
        photos: photoUrls
      });
      
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
      
      // Create backup after updating event
      backupTimelineData();
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

  const filteredLogs = activityLogs.filter(log => {
    const user = users.find(u => u.id === log.userId);
    return user && user.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div className="admin-actions">
            <span className="text-muted">Welcome, {user.firstName || user.username}</span>
          </div>
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
            
            {hasPermission('manage_users') && (
              <button 
                className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <i className="fas fa-users"></i>
                Users
              </button>
            )}
            
            {hasPermission('view_activity_logs') && (
              <button 
                className={`sidebar-item ${activeTab === 'logs' ? 'active' : ''}`}
                onClick={() => setActiveTab('logs')}
              >
                <i className="fas fa-list"></i>
                Activity
              </button>
            )}
            
            {hasPermission('manage_timeline') && (
              <button 
                className={`sidebar-item ${activeTab === 'timeline' ? 'active' : ''}`}
                onClick={() => setActiveTab('timeline')}
              >
                <i className="fas fa-calendar"></i>
                Timeline
              </button>
            )}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="admin-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <div className="content-header">
                <h2 className="content-title">System Overview</h2>
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
          {activeTab === 'users' && hasPermission('manage_users') && (
            <>
              <div className="content-header">
                <h2 className="content-title">User Management</h2>
                <div className="content-actions">
                  {hasPermission('manage_users') && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowCreateUserModal(true)}
                    >
                      <i className="fas fa-plus"></i>
                      Add User
                    </button>
                  )}
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
                          <button className="btn btn-sm btn-icon">
                            <i className="fas fa-edit"></i>
                          </button>
                          {hasPermission('delete_users') && (
                            <button className="btn btn-sm btn-icon btn-danger">
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Activity Logs Tab */}
          {activeTab === 'logs' && hasPermission('view_activity_logs') && (
            <>
              <div className="content-header">
                <h2 className="content-title">Activity Logs</h2>
              </div>

              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{formatDate(log.timestamp)}</td>
                      <td>{users.find(u => u.id === log.userId)?.username || 'Unknown'}</td>
                      <td>
                        <span className="role-badge admin">
                          <i className={getActionIcon(log.action)}></i>
                          {log.action}
                        </span>
                      </td>
                      <td>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Timeline Management Tab */}
          {activeTab === 'timeline' && hasPermission('manage_timeline') && (
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
                    <th>Date</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.filter(event => categoryFilter === 'all' || event.category === categoryFilter).map((event) => (
                    <tr key={event.id}>
                      <td>{formatDate(event.date)}</td>
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
                          <div className="text-muted">{event.description}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${event.category}`}>
                          {event.category}
                        </span>
                      </td>
                      <td>{event.location}</td>
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
                <button type="submit" className="btn btn-primary">
                  Create Event
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
                <button type="submit" className="btn btn-primary">
                  Update Event
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