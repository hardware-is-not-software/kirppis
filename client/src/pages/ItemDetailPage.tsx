import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { getItemById } from '../services/item.service';
import { useAuth } from '../context/AuthContext';
import { ItemResponse } from '../types';

const ItemDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showContactInfo, setShowContactInfo] = useState(false);

  const { 
    data: itemResponse, 
    isLoading, 
    error 
  } = useQuery<ItemResponse>({
    queryKey: ['item', id],
    queryFn: () => getItemById(id as string),
    enabled: !!id
  });

  const item = itemResponse?.item;

  const handleReserveItem = () => {
    if (!user) {
      navigate('/login', { state: { from: `/items/${id}` } });
      return;
    }
    // In a real app, this would call an API to reserve the item
    setShowContactInfo(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500 py-8">
            Error loading item. Please try again later.
          </div>
          <div className="text-center mt-4">
            <Link to="/items" className="text-blue-500 hover:underline">
              Back to Items
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link to="/items" className="text-blue-500 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Items
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={item.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={item.title}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item.status === 'available' ? 'bg-green-100 text-green-800' :
                  item.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
              
              <p className="text-2xl text-blue-600 font-bold mb-4">${item.price.toFixed(2)}</p>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Condition</h3>
                  <p className="text-gray-900">{item.condition}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Listed</h3>
                  <p className="text-gray-900">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {item.status === 'available' && (
                <div className="mt-6">
                  <button
                    onClick={handleReserveItem}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    I'm Interested
                  </button>
                </div>
              )}
              
              {showContactInfo && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                  <p className="mb-1">
                    <span className="font-medium">Email:</span> seller@example.com
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> (123) 456-7890
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Please mention that you found this item on Kirppis when contacting the seller.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Similar Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* This would be populated with actual similar items in a real app */}
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
              <p className="text-gray-500">Similar items will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetailPage; 