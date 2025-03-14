import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getAllItems } from '../services/item.service';
import { getAllCategories } from '../services/category.service';
import { Item, Category } from '../types';

const DEFAULT_LOCATIONS = ['Main Office', 'Branch Office', 'Remote'];

const ItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const locationParam = searchParams.get('location');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(locationParam || '');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['available']);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(true);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (selectedLocation) {
      params.set('location', selectedLocation);
    } else {
      params.delete('location');
    }
    
    setSearchParams(params, { replace: true });
  }, [selectedLocation, setSearchParams]);

  // Update location filter when URL changes
  useEffect(() => {
    if (locationParam) {
      setSelectedLocation(locationParam);
    }
  }, [locationParam]);

  // Fetch items
  const { 
    data: itemsResponse, 
    isLoading: itemsLoading, 
    error: itemsError 
  } = useQuery({
    queryKey: ['items'],
    queryFn: () => getAllItems()
  });

  const items: Item[] = itemsResponse?.items || [];

  // Fetch categories
  const { 
    data: categoriesResponse, 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getAllCategories()
  });

  const categories: Category[] = categoriesResponse?.categories || [];

  // Handle status filter change
  const handleStatusChange = (status: string) => {
    if (selectedStatuses.includes(status)) {
      // Remove status if already selected
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      // Add status if not selected
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // Filter and sort items
  const filteredItems = items.filter((item: Item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? item.categoryId === selectedCategory : true;
    const matchesStatus = selectedStatuses.includes(item.status);
    const matchesLocation = selectedLocation ? (item.location === selectedLocation) : true;
    const matchesMinPrice = priceRange.min ? item.price >= Number(priceRange.min) : true;
    const matchesMaxPrice = priceRange.max ? item.price <= Number(priceRange.max) : true;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation && matchesMinPrice && matchesMaxPrice;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a: Item, b: Item) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === 'priceAsc') {
      return a.price - b.price;
    } else if (sortBy === 'priceDesc') {
      return b.price - a.price;
    }
    return 0;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSelectedStatuses(['available']);
    setSortBy('newest');
    setPriceRange({ min: '', max: '' });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Browse Items</h1>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-white transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden transition-all duration-300">
            <div className="p-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search items..."
                    className="pl-12 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category filter */}
                <div className="filter-group">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                    >
                      <option value="">All Categories</option>
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
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Location filter */}
                <div className="filter-group">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <select
                      id="location"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full p-3 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                    >
                      <option value="">All Locations</option>
                      {DEFAULT_LOCATIONS.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Status filter */}
                <div className="filter-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusChange('available')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedStatuses.includes('available')
                          ? 'bg-green-500 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Available
                    </button>
                    <button
                      onClick={() => handleStatusChange('reserved')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedStatuses.includes('reserved')
                          ? 'bg-yellow-500 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Reserved
                    </button>
                    <button
                      onClick={() => handleStatusChange('sold')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedStatuses.includes('sold')
                          ? 'bg-red-500 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Sold
                    </button>
                  </div>
                </div>
                
                {/* Price range */}
                <div className="filter-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        placeholder="Min"
                        className="pl-8 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                      />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        placeholder="Max"
                        className="pl-8 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Sort by */}
                <div className="filter-group">
                  <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      id="sortBy"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-3 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="priceAsc">Price: Low to High</option>
                      <option value="priceDesc">Price: High to Low</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Filter actions */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            
            {/* Filter summary */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{sortedItems.length}</span> items found
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-blue-100 text-blue-800">
                      Search: {searchTerm}
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-blue-100 text-blue-800">
                      Category: {categories.find(c => c.id === selectedCategory)?.name}
                      <button 
                        onClick={() => setSelectedCategory('')}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  {selectedLocation && (
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-blue-100 text-blue-800">
                      Location: {selectedLocation}
                      <button 
                        onClick={() => setSelectedLocation('')}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  {(priceRange.min || priceRange.max) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-blue-100 text-blue-800">
                      Price: {priceRange.min ? `$${priceRange.min}` : '$0'} - {priceRange.max ? `$${priceRange.max}` : 'Any'}
                      <button 
                        onClick={() => setPriceRange({ min: '', max: '' })}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Items grid */}
        {itemsLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : itemsError ? (
          <div className="text-center text-red-500 py-8">
            Error loading items. Please try again later.
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg mb-4">No items found matching your criteria.</p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedItems.map((item: Item) => (
              <Link 
                to={`/items/${item.id}`} 
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.imageUrl || '/images/No_Image_Available.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold mb-1 truncate">{item.title}</h3>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-xl flex-shrink-0 ${
                      item.status === 'available' ? 'bg-green-500 text-white' :
                      item.status === 'reserved' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-blue-600 font-bold mb-2">${item.price.toFixed(2)}</p>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">{item.description}</p>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    {item.location && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-xl">
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ItemsPage; 