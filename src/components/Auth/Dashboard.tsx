import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTimelineStore } from '../../store/timelineStore';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isOpen, onClose }) => {
  const { users, activityLogs, user: currentUser, hasPermission } = useAuthStore();
  const { events } = useTimelineStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  if (!isOpen) return null;

  // Analytics calculations
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const totalEvents = events.length;
  const recentLogs = activityLogs.slice(0, 10);

  // User role distribution
  const roleStats = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent activity stats
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const monthlyActivity = activityLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= monthStart && logDate <= monthEnd;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserName = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    return currentUser?.username || 'User';
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return 'fas fa-sign-in-alt';
      case 'logout': return 'fas fa-sign-out-alt';
      case 'create_user': return 'fas fa-user-plus';
      case 'delete_user': return 'fas fa-user-times';
      case 'change_role': return 'fas fa-user-shield';
      default: return 'fas fa-info-circle';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return '#27ae60';
      case 'logout': return '#3498db';
      case 'create_user': return '#2ecc71';
      case 'delete_user': return '#e74c3c';
      case 'change_role': return '#f39c12';
      default: return '#7f8c8d';
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-content dashboard-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </h2>
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h3>{getGreeting()}, {getUserName()}!</h3>
            <p>Here's what's happening with OneKey today.</p>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users" style={{ color: '#3498db' }}></i>
              </div>
              <div className="stat-content">
                <h4>{totalUsers}</h4>
                <p>Total Users</p>
                <small>{activeUsers} active</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-calendar-check" style={{ color: '#27ae60' }}></i>
              </div>
              <div className="stat-content">
                <h4>{totalEvents}</h4>
                <p>Timeline Events</p>
                <small>All categories</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-chart-line" style={{ color: '#f39c12' }}></i>
              </div>
              <div className="stat-content">
                <h4>{monthlyActivity.length}</h4>
                <p>This Month</p>
                <small>User activities</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-user-shield" style={{ color: '#9b59b6' }}></i>
              </div>
              <div className="stat-content">
                <h4>{roleStats.admin || 0}</h4>
                <p>Admins</p>
                <small>Administrators</small>
              </div>
            </div>
          </div>

          {/* Role Distribution */}
          <div className="dashboard-section">
            <h4><i className="fas fa-chart-pie"></i> User Role Distribution</h4>
            <div className="role-distribution">
              <div className="role-bar">
                <div className="role-item">
                  <span className="role-label">Administrators</span>
                  <div className="role-progress">
                    <div 
                      className="role-fill admin" 
                      style={{ 
                        width: `${((roleStats.super_admin || 0) + (roleStats.admin || 0)) / totalUsers * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="role-count">{(roleStats.super_admin || 0) + (roleStats.admin || 0)}</span>
                </div>
                <div className="role-item">
                  <span className="role-label">Users</span>
                  <div className="role-progress">
                    <div 
                      className="role-fill user" 
                      style={{ width: `${(roleStats.user || 0) / totalUsers * 100}%` }}
                    ></div>
                  </div>
                  <span className="role-count">{roleStats.user || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {hasPermission('view_activity_logs') && (
            <div className="dashboard-section">
              <h4><i className="fas fa-clock"></i> Recent Activity</h4>
              <div className="recent-activity">
                {recentLogs.length === 0 ? (
                  <div className="empty-activity">
                    <i className="fas fa-info-circle"></i>
                    <p>No recent activity</p>
                  </div>
                ) : (
                  <div className="activity-list">
                    {recentLogs.map((log) => (
                      <div key={log.id} className="activity-item">
                        <div className="activity-icon">
                          <i 
                            className={getActionIcon(log.action)} 
                            style={{ color: getActionColor(log.action) }}
                          ></i>
                        </div>
                        <div className="activity-details">
                          <p>{log.details}</p>
                          <small>{format(new Date(log.timestamp), 'MMM dd, HH:mm')}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h4><i className="fas fa-bolt"></i> Quick Actions</h4>
            <div className="quick-actions">
              {hasPermission('manage_timeline') && (
                <button className="action-card">
                  <i className="fas fa-plus"></i>
                  <span>Add Event</span>
                </button>
              )}
              {hasPermission('manage_users') && (
                <button className="action-card">
                  <i className="fas fa-user-plus"></i>
                  <span>Add User</span>
                </button>
              )}
              <button className="action-card">
                <i className="fas fa-user-edit"></i>
                <span>Edit Profile</span>
              </button>
              {hasPermission('view_activity_logs') && (
                <button className="action-card">
                  <i className="fas fa-download"></i>
                  <span>Export Logs</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 