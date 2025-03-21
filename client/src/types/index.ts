// User types
export interface User {
  id: string;
  _id?: string; // MongoDB ID
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Item types
export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  categoryId: string;
  userId: string;
  imageUrl?: string;
  imageUrls?: string[];
  status: 'available' | 'sold' | 'reserved';
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemsResponse {
  items: Item[];
  total: number;
  page: number;
  limit: number;
}

export interface ItemResponse {
  item: Item;
}

// Category types
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface CategoryResponse {
  category: Category;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API response types
export interface ApiError {
  message: string;
  status: number;
} 