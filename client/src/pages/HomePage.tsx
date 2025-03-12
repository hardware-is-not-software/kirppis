import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { getAllItems } from '../services/item.service';
import { getAllCategories } from '../services/category.service';
import { Category, Item } from '../types';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch recent items
  const { 
    data: itemsResponse, 
    isLoading: itemsLoading 
  } = useQuery({
    queryKey: ['recentItems'],
    queryFn: () => getAllItems(1, 8)
  });

  // Fetch categories
  const { 
    data: categoriesResponse, 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories
  });

  const items = itemsResponse?.items || [];
  const categories = categoriesResponse?.categories || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 mb-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Kirppis</h1>
            <p className="text-xl mb-8">
              Your company's internal marketplace for buying and selling pre-loved items.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/items"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition duration-200"
              >
                Browse Items
              </Link>
              <Link
                to="/items/new"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium transition duration-200"
              >
                Sell an Item
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Categories</h2>
          {categoriesLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category: Category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                  className={`p-4 rounded-lg text-center transition-all ${
                    category.id === selectedCategory
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Recent Items Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Items</h2>
          {itemsLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item: Item) => (
                <Link
                  to={`/items/${item.id}`}
                  key={item.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
                      <span className="font-bold text-blue-600">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'available' ? 'bg-green-100 text-green-800' :
                        item.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default HomePage; 