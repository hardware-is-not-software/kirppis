import { Category, CategoriesResponse, CategoryResponse } from '../types';

// Get all categories
export const getAllCategories = async (): Promise<CategoriesResponse> => {
  try {
    // In a real app, this would be an actual API call
    // For now, we'll return mock data
    const mockCategories: Category[] = [
      {
        id: 'category-1',
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'category-2',
        name: 'Furniture',
        description: 'Home and office furniture',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'category-3',
        name: 'Clothing',
        description: 'Apparel and accessories',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'category-4',
        name: 'Books',
        description: 'Books, textbooks, and literature',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'category-5',
        name: 'Sports & Outdoors',
        description: 'Sports equipment and outdoor gear',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'category-6',
        name: 'Home Appliances',
        description: 'Kitchen and home appliances',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'category-7',
        name: 'Toys & Games',
        description: 'Toys, games, and entertainment',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'category-8',
        name: 'Office Supplies',
        description: 'Office equipment and supplies',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    return {
      categories: mockCategories
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
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