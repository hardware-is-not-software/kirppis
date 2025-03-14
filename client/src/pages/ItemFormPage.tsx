import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { getItemById, createItem, updateItem } from '../services/item.service';
import { getAllCategories } from '../services/category.service';
import { useAuth } from '../context/AuthContext';
import { Item, Category } from '../types';

const DEFAULT_LOCATIONS = ['Main Office', 'Branch Office', 'Remote'];

const ItemFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState<Partial<Item>>({
    title: '',
    description: '',
    price: 0,
    condition: 'new',
    categoryId: '',
    imageUrl: '',
    status: 'available',
    location: DEFAULT_LOCATIONS[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch item data if in edit mode
  const { 
    data: itemResponse,
    isLoading: isItemLoading
  } = useQuery({
    queryKey: ['item', id],
    queryFn: () => getItemById(id as string),
    enabled: isEditMode
  });

  // Update form data when item data is loaded
  useEffect(() => {
    if (isEditMode && itemResponse?.item) {
      setFormData(itemResponse.item);
      if (itemResponse.item.imageUrl) {
        setPreviewImage(itemResponse.item.imageUrl);
      }
    }
  }, [isEditMode, itemResponse]);

  // Fetch categories
  const { 
    data: categoriesResponse,
    isLoading: categoriesLoading
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories
  });

  const categories = categoriesResponse?.categories || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Handle price as a number
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      // Handle other fields
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, just use a placeholder or URL.createObjectURL
      // In a real app, you'd upload this to a server
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData({
        ...formData,
        imageUrl: '/images/No_Image_Available.jpg' // Placeholder until we implement file uploads
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.price === undefined || formData.price === null || formData.price === '') {
      newErrors.price = 'Price is required';
    } else if (Number(formData.price) < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode) {
        // Update existing item
        await updateItem(id as string, formData);
        navigate(`/items/${id}`);
      } else {
        // Create new item
        const response = await createItem({
          ...formData,
          userId: user?.id // Set the current user as the owner
        });
        navigate(`/items/${response.item.id}`);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      setErrors({
        ...errors,
        form: 'Failed to save item. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold text-center">
            {isEditMode ? 'Edit Item' : 'Sell an Item'}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          {isItemLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errors.form && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {errors.form}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="What are you selling?"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price === 0 ? '' : formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className={`w-full pl-8 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                    )}
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId || ''}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.categoryId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categoriesLoading ? (
                        <option disabled>Loading categories...</option>
                      ) : (
                        categories.map((category: Category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      )}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
                    )}
                  </div>
                  
                  {/* Condition */}
                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition || 'new'}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="new">New</option>
                      <option value="like_new">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a location</option>
                      {DEFAULT_LOCATIONS.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                    )}
                  </div>
                </div>
                
                {/* Right column */}
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Describe your item in detail"
                    ></textarea>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>
                  
                  {/* Image upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <div className="mt-1 flex flex-col items-center">
                      <div className="w-full h-40 mb-3 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center overflow-hidden bg-gray-50">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <p className="mt-1 text-sm text-gray-500">
                              Click to upload an image
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="image"
                        className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        {previewImage ? 'Change Image' : 'Upload Image'}
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG or GIF up to 5MB
                      </p>
                    </div>
                  </div>
                  
                  {/* Status (only for edit mode) */}
                  {isEditMode && (
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status || 'available'}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Form actions */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isEditMode ? 'Update Item' : 'Create Item'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ItemFormPage; 