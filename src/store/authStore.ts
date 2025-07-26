import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService, User as ApiUser, CreateUserRequest, UpdateUserRequest } from '../services/api';

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
  activityLogs: ActivityLog[];
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  addUser: (userData: CreateUserRequest) => Promise<User | null>;
  removeUser: (userId: string) => Promise<boolean>;
  updateUserRole: (userId: string, role: User['role']) => Promise<boolean>;
  updateUserStatus: (userId: string, isActive: boolean) => Promise<boolean>;
  changePassword: (userId: string, newPassword: string) => Promise<boolean>;
  logActivity: (userId: string, action: string, details: string) => void;
  getUserPermissions: (role: User['role']) => string[];
  hasPermission: (permission: string) => boolean;
  clearError: () => void;
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

const DEFAULT_USERS: User[] = [DEFAULT_ADMIN];

const DEFAULT_CREDENTIALS: UserCredentials[] = [
  {
    userId: 'admin-1',
    passwordHash: 'admin'
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
      users: [],
      activityLogs: [],
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiService.login({ username, password });
          
          if (response.success && response.data) {
            const user: User = {
              id: response.data.user.id,
              username: response.data.user.username,
              email: response.data.user.email,
              firstName: response.data.user.firstName,
              lastName: response.data.user.lastName,
              role: response.data.user.role as User['role'] || 'user',
              isActive: true,
              createdAt: new Date().toISOString(),
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              error: null
            });
            
            return true;
          } else {
            set({ 
              isLoading: false, 
              error: response.error || 'Login failed' 
            });
            return false;
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Login failed' 
          });
          return false;
        }
      },

      logout: () => {
        apiService.clearToken();
        set({ user: null, isAuthenticated: false, error: null });
      },

      getCurrentUser: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiService.getCurrentUser();
          
          if (response.success && response.data) {
            const user: User = {
              id: response.data.user.id,
              username: response.data.user.username,
              email: response.data.user.email,
              firstName: response.data.user.firstName,
              lastName: response.data.user.lastName,
              role: response.data.user.role as User['role'] || 'user',
              isActive: response.data.user.isActive,
              createdAt: response.data.user.createdAt,
              lastLoginAt: response.data.user.lastLoginAt,
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              error: null
            });
          } else {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false,
              error: response.error || 'Failed to get user'
            });
          }
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to get user'
          });
        }
      },

      fetchUsers: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiService.getUsers();
          
          if (response.success && response.data) {
            const users: User[] = response.data.users.map(apiUser => ({
              id: apiUser.id,
              username: apiUser.username,
              email: apiUser.email,
              firstName: apiUser.firstName,
              lastName: apiUser.lastName,
              role: apiUser.role as User['role'] || 'user',
              isActive: apiUser.isActive,
              createdAt: apiUser.createdAt,
              lastLoginAt: apiUser.lastLoginAt,
            }));
            
            set({ users, isLoading: false, error: null });
          } else {
            set({ 
              isLoading: false, 
              error: response.error || 'Failed to fetch users'
            });
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch users'
          });
        }
      },

      addUser: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiService.createUser(userData);
          
          if (response.success) {
            // Refresh users list
            await get().fetchUsers();
            set({ isLoading: false, error: null });
            
            // Return the created user (we'll need to fetch it)
            const newUser: User = {
              id: response.data?.userId || '',
              username: userData.username,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: userData.role as User['role'] || 'user',
              isActive: true,
              createdAt: new Date().toISOString(),
            };
            
            return newUser;
          } else {
            set({ 
              isLoading: false, 
              error: response.error || 'Failed to create user'
            });
            return null;
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to create user'
          });
          return null;
        }
      },

      removeUser: async (userId) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiService.deleteUser(userId);
          
          if (response.success) {
            // Refresh users list
            await get().fetchUsers();
            set({ isLoading: false, error: null });
            return true;
          } else {
            set({ 
              isLoading: false, 
              error: response.error || 'Failed to delete user'
            });
            return false;
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to delete user'
          });
          return false;
        }
      },

      updateUserRole: async (userId, role) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiService.updateUser(userId, { role });
          
          if (response.success) {
            // Refresh users list
            await get().fetchUsers();
            set({ isLoading: false, error: null });
            return true;
          } else {
            set({ 
              isLoading: false, 
              error: response.error || 'Failed to update user role'
            });
            return false;
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to update user role'
          });
          return false;
        }
      },

      updateUserStatus: async (userId, isActive) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiService.updateUser(userId, { isActive });
          
          if (response.success) {
            // Refresh users list
            await get().fetchUsers();
            set({ isLoading: false, error: null });
            return true;
          } else {
            set({ 
              isLoading: false, 
              error: response.error || 'Failed to update user status'
            });
            return false;
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to update user status'
          });
          return false;
        }
      },

      changePassword: async (userId, newPassword) => {
        set({ isLoading: true, error: null });
        
        try {
          // Note: Backend doesn't have a change password endpoint yet
          // This would need to be implemented in the backend
          set({ isLoading: false, error: 'Password change not implemented in backend yet' });
          return false;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to change password'
          });
          return false;
        }
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
        
        const userPermissions = PERMISSIONS[user.role] || [];
        return userPermissions.includes(permission);
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'onekey-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 