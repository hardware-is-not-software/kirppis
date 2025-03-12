import { Item, ItemsResponse, ItemResponse } from '../types';

// Get all items with optional pagination, sorting, and filtering
export const getAllItems = async (
  page = 1, 
  limit = 10
): Promise<ItemsResponse> => {
  try {
    // In a real app, this would be an actual API call
    // For now, we'll return mock data
    const mockItems: Item[] = Array.from({ length: 12 }, (_, i) => ({
      id: `item-${i + 1}`,
      title: `Item ${i + 1}`,
      description: `This is a description for item ${i + 1}. It contains details about the condition, features, and other relevant information.`,
      price: Math.floor(Math.random() * 100) + 5,
      condition: ['New', 'Like New', 'Good', 'Fair'][Math.floor(Math.random() * 4)],
      categoryId: `category-${Math.floor(Math.random() * 5) + 1}`,
      userId: `user-${Math.floor(Math.random() * 3) + 1}`,
      imageUrl: `https://picsum.photos/seed/${i + 1}/300/200`,
      status: ['available', 'sold', 'reserved'][Math.floor(Math.random() * 3)] as 'available' | 'sold' | 'reserved',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return {
      items: mockItems,
      total: 50, // Mock total count
      page,
      limit
    };
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

// Get a single item by ID
export const getItemById = async (id: string): Promise<ItemResponse> => {
  try {
    // In a real app, this would be an actual API call
    // For now, we'll return mock data
    const mockItem: Item = {
      id,
      title: `Item ${id}`,
      description: `This is a detailed description for item ${id}. It contains comprehensive information about the condition, features, history, and other relevant details that a potential buyer might want to know.`,
      price: Math.floor(Math.random() * 100) + 5,
      condition: ['New', 'Like New', 'Good', 'Fair'][Math.floor(Math.random() * 4)],
      categoryId: `category-${Math.floor(Math.random() * 5) + 1}`,
      userId: `user-${Math.floor(Math.random() * 3) + 1}`,
      imageUrl: `https://picsum.photos/seed/${id}/600/400`,
      status: ['available', 'sold', 'reserved'][Math.floor(Math.random() * 3)] as 'available' | 'sold' | 'reserved',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      item: mockItem
    };
  } catch (error) {
    console.error(`Error fetching item with ID ${id}:`, error);
    throw error;
  }
};

// Create a new item
export const createItem = async (itemData: Partial<Item>): Promise<ItemResponse> => {
  try {
    // In a real app, this would be an actual API call
    // For now, we'll return mock data
    const newItem: Item = {
      id: `item-${Date.now()}`,
      title: itemData.title || '',
      description: itemData.description || '',
      price: itemData.price || 0,
      condition: itemData.condition || 'New',
      categoryId: itemData.categoryId || '',
      userId: 'current-user-id', // In a real app, this would be the current user's ID
      imageUrl: itemData.imageUrl,
      status: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      item: newItem
    };
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

// Update an existing item
export const updateItem = async (id: string, itemData: Partial<Item>): Promise<ItemResponse> => {
  try {
    // In a real app, this would be an actual API call
    // For now, we'll return mock data
    const updatedItem: Item = {
      id,
      title: itemData.title || `Item ${id}`,
      description: itemData.description || `Description for item ${id}`,
      price: itemData.price || 0,
      condition: itemData.condition || 'New',
      categoryId: itemData.categoryId || '',
      userId: 'current-user-id',
      imageUrl: itemData.imageUrl,
      status: itemData.status || 'available',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      updatedAt: new Date().toISOString(),
    };

    return {
      item: updatedItem
    };
  } catch (error) {
    console.error(`Error updating item with ID ${id}:`, error);
    throw error;
  }
};

// Delete an item
export const deleteItem = async (id: string): Promise<{ success: boolean }> => {
  try {
    // In a real app, this would be an actual API call
    return { success: true };
  } catch (error) {
    console.error(`Error deleting item with ID ${id}:`, error);
    throw error;
  }
};

// Reserve an item
export const reserveItem = async (itemId: string): Promise<ItemResponse> => {
  try {
    // In a real app, this would be an API call
    // For now, we'll simulate it
    const mockItem: Item = {
      id: itemId,
      title: `Item ${itemId}`,
      description: `This is a description for item ${itemId}. It contains details about the condition, features, and other relevant information.`,
      price: Math.floor(Math.random() * 100) + 5,
      condition: 'Good',
      categoryId: `category-${Math.floor(Math.random() * 5) + 1}`,
      userId: `user-${Math.floor(Math.random() * 3) + 1}`,
      imageUrl: `https://picsum.photos/seed/${itemId}/300/200`,
      status: 'reserved',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      item: mockItem
    };
  } catch (error) {
    console.error('Error reserving item:', error);
    throw error;
  }
};

// Cancel reservation
export const cancelReservation = async (id: string): Promise<ItemResponse> => {
  try {
    // In a real app, this would be an actual API call
    const mockItem: Item = {
      id,
      title: `Item ${id}`,
      description: `Description for item ${id}`,
      price: Math.floor(Math.random() * 100) + 5,
      condition: 'Good',
      categoryId: `category-1`,
      userId: `user-1`,
      imageUrl: `https://picsum.photos/seed/${id}/600/400`,
      status: 'available',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      item: mockItem
    };
  } catch (error) {
    console.error(`Error canceling reservation for item with ID ${id}:`, error);
    throw error;
  }
};

// Mark item as sold
export const markItemAsSold = async (id: string): Promise<ItemResponse> => {
  try {
    // In a real app, this would be an actual API call
    const mockItem: Item = {
      id,
      title: `Item ${id}`,
      description: `Description for item ${id}`,
      price: Math.floor(Math.random() * 100) + 5,
      condition: 'Good',
      categoryId: `category-1`,
      userId: `user-1`,
      imageUrl: `https://picsum.photos/seed/${id}/600/400`,
      status: 'sold',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      item: mockItem
    };
  } catch (error) {
    console.error(`Error marking item with ID ${id} as sold:`, error);
    throw error;
  }
};

// Buy an item
export const buyItem = async (itemId: string): Promise<ItemResponse> => {
  try {
    // In a real app, this would be an API call
    // For now, we'll simulate it
    const mockItem: Item = {
      id: itemId,
      title: `Item ${itemId}`,
      description: `This is a description for item ${itemId}. It contains details about the condition, features, and other relevant information.`,
      price: Math.floor(Math.random() * 100) + 5,
      condition: 'Good',
      categoryId: `category-${Math.floor(Math.random() * 5) + 1}`,
      userId: `user-${Math.floor(Math.random() * 3) + 1}`,
      imageUrl: `https://picsum.photos/seed/${itemId}/300/200`,
      status: 'sold',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      item: mockItem
    };
  } catch (error) {
    console.error('Error buying item:', error);
    throw error;
  }
}; 