const API_BASE_URL = 'http://localhost:3001/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  password: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
}

export interface TimelineEvent {
  id: string;
  name: string;
  date: string;
  category: string;
  location?: string;
  time?: string;
  attendees?: string;
  performers?: string;
  duration?: string;
  description?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEventRequest {
  name: string;
  date: string;
  category: string;
  location?: string;
  time?: string;
  attendees?: string;
  performers?: string;
  duration?: string;
  description?: string;
  photo_url?: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details: string;
  ip_address?: string;
  timestamp: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/me');
  }

  // User Management
  async getUsers(): Promise<ApiResponse<{ users: User[] }>> {
    return this.request<{ users: User[] }>('/users');
  }

  async getUser(userId: string): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>(`/users/${userId}`);
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<{ userId: string; message: string }>> {
    return this.request<{ userId: string; message: string }>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getUserActivity(userId: string): Promise<ApiResponse<{ logs: ActivityLog[] }>> {
    return this.request<{ logs: ActivityLog[] }>(`/users/${userId}/activity`);
  }

  // Timeline Events
  async getEvents(): Promise<ApiResponse<{ events: TimelineEvent[] }>> {
    return this.request<{ events: TimelineEvent[] }>('/timeline/events');
  }

  async getEvent(eventId: string): Promise<ApiResponse<{ event: TimelineEvent }>> {
    return this.request<{ event: TimelineEvent }>(`/timeline/events/${eventId}`);
  }

  async getEventsByCategory(category: string): Promise<ApiResponse<{ events: TimelineEvent[] }>> {
    return this.request<{ events: TimelineEvent[] }>(`/timeline/events/category/${category}`);
  }

  async createEvent(eventData: CreateEventRequest): Promise<ApiResponse<{ id: string; message: string }>> {
    return this.request<{ id: string; message: string }>('/timeline/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(eventId: string, eventData: CreateEventRequest): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/timeline/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(eventId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/timeline/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  // File Upload
  async uploadImage(file: File): Promise<ApiResponse<{ filePath: string; filename: string; originalName: string; size: number }>> {
    const formData = new FormData();
    formData.append('photo', file);

    const url = `${API_BASE_URL}/upload/images`;
    const token = this.getToken();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    const response = await fetch('http://localhost:3001/health');
    const data = await response.json();
    
    return {
      success: response.ok,
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : 'Health check failed',
    };
  }
}

export const apiService = new ApiService(); 