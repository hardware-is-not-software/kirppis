import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getAllItems } from '../services/item.service';
import { Item } from '../types';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'items' | 'settings'>('items');

  // Fetch user's items
  const { 
    data: itemsResponse, 
    isLoading: itemsLoading, 
    error: itemsError 
  } = useQuery({
    queryKey: ['userItems', user?.email],
    queryFn: () => getAllItems(),
    enabled: !!user
  });

  // Filter items to only show the current user's items
  // In a real app, we would have a proper userId to filter by
  // For now, we'll just show all items as if they belong to the user
  const userItems = itemsResponse?.items || [];

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="mb-4">You need to be logged in to view your profile.</p>
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-2xl font-bold mr-4">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-blue-100">{user.email}</p>
                  <p className="text-blue-100 text-sm">Member since {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'items'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('items')}
              >
                My Items
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                Account Settings
              </button>
            </nav>
          </div>
          
          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'items' ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Items</h2>
                  <Link
                    to="/items/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Sell New Item
                  </Link>
                </div>
                
                {itemsLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : itemsError ? (
                  <div className="text-center text-red-500 py-8">
                    Error loading your items. Please try again later.
                  </div>
                ) : userItems.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">You haven't listed any items yet.</p>
                    <Link
                      to="/items/new"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Sell Your First Item
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userItems.map((item: Item) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-40 overflow-hidden">
                          <img
                            src={item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold truncate">{item.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.status === 'available' ? 'bg-green-100 text-green-800' :
                              item.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-blue-600 font-bold mb-2">${item.price.toFixed(2)}</p>
                          <p className="text-gray-500 text-sm mb-4">
                            Listed on {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex space-x-2">
                            <Link
                              to={`/items/${item.id}`}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                            >
                              View
                            </Link>
                            <Link
                              to={`/items/${item.id}/edit`}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                
                <div className="max-w-md">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={user.name}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={user.email}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                          type="text"
                          value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          readOnly
                          className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      To update your personal information, please contact an administrator.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Password</h3>
                    <button
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                      onClick={() => alert('Password change functionality would be implemented here')}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage; 