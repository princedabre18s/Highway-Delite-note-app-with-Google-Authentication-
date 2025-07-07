import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteData {
  title: string;
  content?: string;
  category?: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  category?: string;
  is_archived?: boolean;
}

export const noteService = {
  getNotes: async (archived = false, search = '', category = ''): Promise<Note[]> => {
    const params = new URLSearchParams();
    params.append('archived', archived.toString());
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    
    const response = await api.get(`/notes?${params.toString()}`);
    return response.data.notes;
  },

  getNote: async (id: number): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data.note;
  },

  createNote: async (data: CreateNoteData): Promise<Note> => {
    const response = await api.post('/notes', data);
    return response.data.note;
  },

  updateNote: async (id: number, data: UpdateNoteData): Promise<Note> => {
    const response = await api.put(`/notes/${id}`, data);
    return response.data.note;
  },

  deleteNote: async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};
