import axios from 'axios';
import type { User, Image, Comment, PaginatedResponse, AuthResponse } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3069/api';

export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH ====================

export const authService = {
  register: async (
    email: string,
    password: string,
    ho_ten: string,
    tuoi?: number
  ): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', {
      email,
      password,
      ho_ten,
      tuoi,
    });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', {
      email,
      password,
    });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// ==================== IMAGES ====================

export const imageService = {
  getAll: async (
    page: number = 1,
    limit: number = 20,
    search: string = ''
  ): Promise<PaginatedResponse<Image>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    const { data } = await api.get(`/images?${params}`);
    return data;
  },

  getById: async (imageId: number): Promise<{ image: Image }> => {
    const { data } = await api.get(`/images/${imageId}`);
    return data;
  },

  upload: async (formData: FormData): Promise<{ image: Image }> => {
    const { data } = await api.post('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  delete: async (imageId: number): Promise<void> => {
    await api.delete(`/images/${imageId}`);
  },
};

// ==================== USER ====================

export const userService = {
  getProfile: async (): Promise<{ user: User }> => {
    const { data } = await api.get('/users');
    return data.data;
  },

  updateProfile: async (formData: FormData): Promise<{ user: User }> => {
    const { data } = await api.put('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  getCreatedImages: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Image>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const { data } = await api.get(`/users/images/created?${params}`);
    return data;
  },

  getSavedImages: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Image>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const { data } = await api.get(`/users/images/saved?${params}`);
    return data;
  },
};

// ==================== COMMENTS ====================

export const commentService = {
  getByImageId: async (imageId: number): Promise<{ comments: Comment[] }> => {
    const { data } = await api.get(`/comments/image/${imageId}`);
    return data;
  },

  add: async (imageId: number, noi_dung: string): Promise<{ comment: Comment }> => {
    const { data } = await api.post(`/comments/image/${imageId}`, {
      noi_dung,
    });
    return data;
  },

  delete: async (commentId: number): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },
};

// ==================== SAVED IMAGES ====================

export const savedService = {
  checkSaved: async (imageId: number): Promise<{ saved: boolean }> => {
    const { data } = await api.get(`/saved/check/${imageId}`);
    return data;
  },

  save: async (imageId: number): Promise<{ saved: boolean; message: string }> => {
    const { data } = await api.post(`/saved/${imageId}`);
    return data;
  },

  unsave: async (imageId: number): Promise<{ saved: boolean; message: string }> => {
    const { data } = await api.delete(`/saved/${imageId}`);
    return data;
  },

  getAll: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Image>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const { data } = await api.get(`/saved?${params}`);
    return data;
  },
};

export default api;
