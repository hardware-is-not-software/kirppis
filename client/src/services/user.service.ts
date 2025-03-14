import api from './api';
import { User } from '../types';

export interface UsersResponse {
  status: string;
  results: number;
  users: User[];
}

export interface UserResponse {
  status: string;
  data: {
    user: User;
  };
}

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (): Promise<UsersResponse> => {
  try {
    const response = await api.get<UsersResponse>('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<UserResponse> => {
  try {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

/**
 * Update user
 */
export const updateUser = async (id: string, userData: Partial<User>): Promise<UserResponse> => {
  try {
    const response = await api.patch<UserResponse>(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

/**
 * Delete user
 */
export const deleteUser = async (id: string): Promise<{ status: string; message: string }> => {
  try {
    const response = await api.delete<{ status: string; message: string }>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

/**
 * Change user role (admin only)
 */
export const changeUserRole = async (id: string, role: string): Promise<UserResponse> => {
  try {
    const response = await api.patch<UserResponse>(`/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    console.error(`Error changing role for user ${id}:`, error);
    throw error;
  }
}; 