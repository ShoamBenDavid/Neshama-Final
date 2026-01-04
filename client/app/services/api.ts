import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../config/api';

// Use the centralized API configuration
const API_BASE_URL = API_CONFIG.BASE_URL;

// Token storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  errors?: Array<{ msg: string; path: string }>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Helper function to get stored token
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Helper function to store token
export const storeToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Helper function to store user data
export const storeUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
  }
};

// Helper function to get stored user
export const getStoredUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Helper function to clear auth data
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

// API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = await getStoredToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
};

// Auth API functions
export const authAPI = {
  // Register a new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      await storeToken(response.data.token);
      await storeUser(response.data.user);
    }

    return response;
  },

  // Login user
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      await storeToken(response.data.token);
      await storeUser(response.data.user);
    }

    return response;
  },

  // Get current user
  getMe: async (): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/me');
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Logout
  logout: async (): Promise<void> => {
    await clearAuthData();
  },

  // Check if user is logged in
  checkAuthStatus: async (): Promise<{ isAuthenticated: boolean; user: User | null }> => {
    const token = await getStoredToken();
    const user = await getStoredUser();
    
    if (!token || !user) {
      return { isAuthenticated: false, user: null };
    }

    try {
      // Verify token is still valid by calling getMe
      const response = await authAPI.getMe();
      if (response.success && response.data) {
        return { isAuthenticated: true, user: response.data.user };
      }
    } catch (error) {
      // Token is invalid, clear storage
      await clearAuthData();
    }

    return { isAuthenticated: false, user: null };
  },
};

export default authAPI;

