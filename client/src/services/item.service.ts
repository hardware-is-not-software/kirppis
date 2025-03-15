import { Item, ItemsResponse, ItemResponse } from '../types';
import api from './api';

/**
 * Helper function to ensure image URLs are properly formatted
 */
const formatImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  // If it's already a full URL, return it as is
  if (url.startsWith('http')) return url;
  
  // If it doesn't start with a slash, add one
  if (!url.startsWith('/')) return `/${url}`;
  
  // Otherwise, return the URL as is
  return url;
};

/**
 * Upload an image file
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('image', file);
    
    console.log('Uploading image:', file.name);
    
    // Send the file to the server
    const response = await api.post<{ status: string; data: { imageUrl: string } }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Upload response:', response.data);
    
    // Return the URL of the uploaded image
    const imageUrl = response.data.data.imageUrl;
    console.log('Final image URL to be returned:', imageUrl);
    
    // Ensure the URL is properly formatted
    return formatImageUrl(imageUrl);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get all items with optional pagination, sorting, and filtering
export const getAllItems = async (
  page = 1, 
  limit = 10
): Promise<ItemsResponse> => {
  try {
    const response = await api.get<any>(`/items?page=${page}&limit=${limit}`);
    console.log('Get all items response:', response.data);
    
    // Transform the response to match our expected format
    const transformedItems = response.data.data.items.map((item: any) => ({
      id: item._id || item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      condition: item.condition,
      categoryId: typeof item.category === 'object' ? item.category._id : item.category,
      userId: typeof item.seller === 'object' ? item.seller._id : item.seller,
      imageUrl: formatImageUrl(item.images?.[0] || ''),
      imageUrls: item.images?.map((img: string) => formatImageUrl(img)) || [],
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    
    return {
      items: transformedItems,
      total: response.data.results || transformedItems.length,
      page: page,
      limit: limit
    };
  } catch (error: any) {
    console.error('Error fetching items:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};

// Get items for the current user
export const getUserItems = async (
  page = 1, 
  limit = 10
): Promise<ItemsResponse> => {
  try {
    // Get the current user from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('User not found in localStorage');
    }
    
    const user = JSON.parse(userStr);
    console.log('Current user:', user);
    
    // Use the regular items endpoint with a filter for the seller
    const response = await api.get<any>(`/items?seller=${user._id}&page=${page}&limit=${limit}`);
    console.log('Get user items response:', response.data);
    
    // Transform the response to match our expected format
    const transformedItems = response.data.data.items.map((item: any) => ({
      id: item._id || item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      condition: item.condition,
      categoryId: typeof item.category === 'object' ? item.category._id : item.category,
      userId: typeof item.seller === 'object' ? item.seller._id : item.seller,
      imageUrl: formatImageUrl(item.images?.[0] || ''),
      imageUrls: item.images?.map((img: string) => formatImageUrl(img)) || [],
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    
    return {
      items: transformedItems,
      total: response.data.results || transformedItems.length,
      page: page,
      limit: limit
    };
  } catch (error: any) {
    console.error('Error fetching user items:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};

// Get a single item by ID
export const getItemById = async (id: string): Promise<ItemResponse> => {
  try {
    const response = await api.get<any>(`/items/${id}`);
    console.log('Get item by ID response:', response.data);
    
    // Transform the response to match our expected format
    const item = response.data.data.item;
    const transformedResponse: ItemResponse = {
      item: {
        id: item._id || item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        condition: item.condition,
        categoryId: typeof item.category === 'object' ? item.category._id : item.category,
        userId: typeof item.seller === 'object' ? item.seller._id : item.seller,
        imageUrl: formatImageUrl(item.images?.[0] || ''),
        imageUrls: item.images?.map((img: string) => formatImageUrl(img)) || [],
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    };
    
    return transformedResponse;
  } catch (error) {
    console.error(`Error fetching item with ID ${id}:`, error);
    throw error;
  }
};

// Create a new item
export const createItem = async (itemData: Partial<Item>): Promise<ItemResponse> => {
  try {
    // Ensure imageUrl is properly formatted
    let imageUrl = formatImageUrl(itemData.imageUrl);
    
    // Handle imageUrls array
    let imageUrls = itemData.imageUrls?.map(url => formatImageUrl(url)) || [];
    
    // If we have imageUrls but no imageUrl, use the first image as imageUrl
    if (!imageUrl && imageUrls.length > 0) {
      imageUrl = imageUrls[0];
    }
    
    // If we have imageUrl but no imageUrls, add imageUrl to imageUrls
    if (imageUrl && imageUrls.length === 0) {
      imageUrls = [imageUrl];
    }
    
    // Check for blob URLs
    if (imageUrl && imageUrl.startsWith('blob:')) {
      console.warn('Attempted to save blob URL as image URL. This is likely an error.');
      imageUrl = '';
    }
    
    // Filter out any blob URLs from imageUrls
    imageUrls = imageUrls.filter(url => !url.startsWith('blob:'));
    
    // Map client-side field names to server-side field names
    const serverItemData = {
      ...itemData,
      category: itemData.categoryId, // Map categoryId to category for the server
      images: imageUrls, // Use the imageUrls array for images
    };
    
    console.log('Creating item with data:', serverItemData);
    const response = await api.post<any>('/items', serverItemData);
    console.log('Create item response:', response.data);
    
    // Transform the response to match our expected format
    const item = response.data.data.item;
    const transformedResponse: ItemResponse = {
      item: {
        id: item._id || item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        condition: item.condition,
        categoryId: typeof item.category === 'object' ? item.category._id : item.category,
        userId: typeof item.seller === 'object' ? item.seller._id : item.seller,
        imageUrl: formatImageUrl(item.images?.[0] || ''),
        imageUrls: item.images?.map((img: string) => formatImageUrl(img)) || [],
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    };
    
    return transformedResponse;
  } catch (error: any) {
    console.error('Error creating item:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};

// Update an existing item
export const updateItem = async (id: string, itemData: Partial<Item>): Promise<ItemResponse> => {
  try {
    // Ensure imageUrl is properly formatted
    let imageUrl = formatImageUrl(itemData.imageUrl);
    
    // Handle imageUrls array
    let imageUrls = itemData.imageUrls?.map(url => formatImageUrl(url)) || [];
    
    // If we have imageUrls but no imageUrl, use the first image as imageUrl
    if (!imageUrl && imageUrls.length > 0) {
      imageUrl = imageUrls[0];
    }
    
    // If we have imageUrl but no imageUrls, add imageUrl to imageUrls
    if (imageUrl && imageUrls.length === 0) {
      imageUrls = [imageUrl];
    }
    
    // Check for blob URLs
    if (imageUrl && imageUrl.startsWith('blob:')) {
      console.warn('Attempted to save blob URL as image URL. This is likely an error.');
      imageUrl = '';
    }
    
    // Filter out any blob URLs from imageUrls
    imageUrls = imageUrls.filter(url => !url.startsWith('blob:'));
    
    // Map client-side field names to server-side field names
    const serverItemData = {
      ...itemData,
      category: itemData.categoryId, // Map categoryId to category for the server
      images: imageUrls, // Use the imageUrls array for images
    };
    
    console.log('Updating item with data:', serverItemData);
    const response = await api.patch<any>(`/items/${id}`, serverItemData);
    console.log('Update item response:', response.data);
    
    // Transform the response to match our expected format
    const item = response.data.data.item;
    const transformedResponse: ItemResponse = {
      item: {
        id: item._id || item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        condition: item.condition,
        categoryId: typeof item.category === 'object' ? item.category._id : item.category,
        userId: typeof item.seller === 'object' ? item.seller._id : item.seller,
        imageUrl: formatImageUrl(item.images?.[0] || ''),
        imageUrls: item.images?.map((img: string) => formatImageUrl(img)) || [],
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    };
    
    return transformedResponse;
  } catch (error: any) {
    console.error(`Error updating item with ID ${id}:`, error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};

/**
 * Update item status
 */
export const updateItemStatus = async (id: string, status: string): Promise<ItemResponse> => {
  try {
    console.log('Updating item status:', id, status);
    // Use the regular update endpoint with just the status field
    const response = await api.patch<any>(`/items/${id}`, { status });
    console.log('Update item status response:', response.data);
    
    // Transform the response to match our expected format
    const item = response.data.data.item;
    const transformedResponse: ItemResponse = {
      item: {
        id: item._id || item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        condition: item.condition,
        categoryId: typeof item.category === 'object' ? item.category._id : item.category,
        userId: typeof item.seller === 'object' ? item.seller._id : item.seller,
        imageUrl: item.images?.[0] || '',
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    };
    
    return transformedResponse;
  } catch (error: any) {
    console.error(`Error updating item status ${id}:`, error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};

/**
 * Delete item
 */
export const deleteItem = async (id: string): Promise<{ status: string; message: string }> => {
  try {
    const response = await api.delete<{ status: string; message: string }>(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting item ${id}:`, error);
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
      condition: 'good',
      categoryId: `category-${Math.floor(Math.random() * 5) + 1}`,
      userId: `user-${Math.floor(Math.random() * 3) + 1}`,
      imageUrl: '/images/No_Image_Available.jpg',
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
      condition: 'good',
      categoryId: `category-1`,
      userId: `user-1`,
      imageUrl: '/images/No_Image_Available.jpg',
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
      condition: 'good',
      categoryId: `category-1`,
      userId: `user-1`,
      imageUrl: '/images/No_Image_Available.jpg',
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
      condition: 'good',
      categoryId: `category-${Math.floor(Math.random() * 5) + 1}`,
      userId: `user-${Math.floor(Math.random() * 3) + 1}`,
      imageUrl: '/images/No_Image_Available.jpg',
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