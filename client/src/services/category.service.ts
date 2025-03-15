import { Category, CategoriesResponse, CategoryResponse } from '../types';
import api from './api';

// Get all categories
export const getAllCategories = async (): Promise<CategoriesResponse> => {
  try {
    console.log('getAllCategories called');
    const response = await api.get<any>('/categories');
    console.log('Get all categories response:', response.data);
    
    // Check if the response has the expected structure
    if (!response.data || !response.data.data || !response.data.data.categories) {
      console.error('Unexpected API response structure:', response.data);
      return { categories: [] };
    }
    
    // Transform the response to match our expected format
    const transformedCategories: Category[] = response.data.data.categories.map((category: any) => ({
      id: category._id,
      name: category.name || 'Unnamed Category',
      description: category.description || '',
      createdAt: category.createdAt || new Date().toISOString(),
      updatedAt: category.updatedAt || new Date().toISOString()
    }));
    
    console.log('Transformed categories:', transformedCategories);
    
    return {
      categories: transformedCategories
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return an empty array instead of throwing an error
    return { categories: [] };
  }
};

// Get a category by ID
export const getCategoryById = async (id: string): Promise<CategoryResponse> => {
  try {
    // In a real app, this would be an actual API call
    // For now, we'll return mock data
    const mockCategory: Category = {
      id,
      name: `Category ${id}`,
      description: `Description for category ${id}`,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      category: mockCategory
    };
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (categoryData: Partial<Category>): Promise<CategoryResponse> => {
  try {
    // In a real app, this would be an actual API call
    // For now, we'll return mock data
    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: categoryData.name || '',
      description: categoryData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      category: newCategory
    };
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Update a category
export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<CategoryResponse> => {
  try {
    // In a real app, this would be an actual API call
    // For now, we'll return mock data
    const updatedCategory: Category = {
      id,
      name: categoryData.name || `Category ${id}`,
      description: categoryData.description || `Description for category ${id}`,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      category: updatedCategory
    };
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<{ success: boolean }> => {
  try {
    // In a real app, this would be an actual API call
    return { success: true };
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw error;
  }
}; 