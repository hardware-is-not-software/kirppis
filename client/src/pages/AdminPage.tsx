import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getAllItems } from '../services/item.service';
import { Item } from '../types';

const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'items' | 'users'>('dashboard');

  // Fetch all items
  const { 
    data: itemsResponse, 
    isLoading: itemsLoading, 
    error: itemsError 
  } = useQuery({
    queryKey: ['adminItems'],
    queryFn: () => getAllItems(),
    enabled: !!user && user.role === 'admin'
  });

  const items = itemsResponse?.items || [];

  // Mock users data
  const users = [
    { id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
    { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
    { id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive' },
  ];

  // Mock stats data
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalItems: items.length,
    availableItems: items.filter(item => item.status === 'available').length,
    soldItems: items.filter(item => item.status === 'sold').length,
    reservedItems: items.filter(item => item.status === 'reserved').length,
  };

  if (!user || user.role !== 'admin') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p>You do not have permission to access the admin area.</p>
            <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
              Return to Home
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
          {/* Admin header */}
          <div className="bg-gray-800 text-white p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-300">Manage your marketplace</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  Admin Access
                </span>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'dashboard'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'items'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('items')}
              >
                Manage Items
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'users'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('users')}
              >
                Manage Users
              </button>
            </nav>
          </div>
          
          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Users stats */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Users</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                        <p className="text-gray-500">Total Users</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
                        <p className="text-gray-500">Active Users</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Items stats */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Items</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-3xl font-bold text-blue-600">{stats.totalItems}</p>
                        <p className="text-gray-500">Total Items</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-green-600">{stats.availableItems}</p>
                        <p className="text-gray-500">Available</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sales stats */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Sales</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-3xl font-bold text-blue-600">{stats.soldItems}</p>
                        <p className="text-gray-500">Sold Items</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-yellow-600">{stats.reservedItems}</p>
                        <p className="text-gray-500">Reserved</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
                  <p className="text-gray-500 italic">No recent activity to display.</p>
                </div>
              </div>
            )}
            
            {activeTab === 'items' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">All Items</h2>
                  <Link
                    to="/items/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add New Item
                  </Link>
                </div>
                
                {itemsLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : itemsError ? (
                  <div className="text-center text-red-500 py-8">
                    Error loading items. Please try again later.
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No items found in the system.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Listed</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {items.map((item: Item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 mr-3">
                                  <img
                                    src={item.imageUrl || 'https://via.placeholder.com/40?text=No+Image'}
                                    alt={item.title}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                </div>
                                <div className="truncate max-w-xs">
                                  <p className="font-medium text-gray-900 truncate">{item.title}</p>
                                  <p className="text-gray-500 text-sm truncate">{item.description.substring(0, 50)}...</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.status === 'available' ? 'bg-green-100 text-green-800' :
                                item.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-500">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 text-sm font-medium">
                              <div className="flex space-x-2">
                                <Link
                                  to={`/items/${item.id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  View
                                </Link>
                                <Link
                                  to={`/items/${item.id}/edit`}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => alert(`Delete item ${item.id}`)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">All Users</h2>
                  <button
                    onClick={() => alert('Add user functionality would be implemented here')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add New User
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-700 font-medium">{user.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => alert(`Edit user ${user.id}`)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </button>
                              {user.status === 'active' ? (
                                <button
                                  onClick={() => alert(`Deactivate user ${user.id}`)}
                                  className="text-yellow-600 hover:text-yellow-900"
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => alert(`Activate user ${user.id}`)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Activate
                                </button>
                              )}
                              <button
                                onClick={() => alert(`Delete user ${user.id}`)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage; 