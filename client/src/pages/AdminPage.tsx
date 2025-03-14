import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getAllItems, deleteItem, updateItemStatus } from '../services/item.service';
import { getAllUsers, deleteUser, changeUserRole } from '../services/user.service';
import { Item, User } from '../types';

const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'items' | 'users'>('dashboard');
  const queryClient = useQueryClient();

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

  // Fetch all users
  const {
    data: usersResponse,
    isLoading: usersLoading,
    error: usersError
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => getAllUsers(),
    enabled: !!user && user.role === 'admin'
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) => deleteItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminItems'] });
    }
  });

  // Update item status mutation
  const updateItemStatusMutation = useMutation({
    mutationFn: ({ itemId, status }: { itemId: string; status: string }) => 
      updateItemStatus(itemId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminItems'] });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  });

  // Change user role mutation
  const changeUserRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => 
      changeUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  });

  const items = itemsResponse?.items || [];
  const users = usersResponse?.users || [];

  // Calculate stats from real data
  const stats = {
    totalUsers: users.length,
    activeUsers: users.length, // Assuming all users are active for now
    totalItems: items.length,
    availableItems: items.filter(item => item.status === 'available').length,
    soldItems: items.filter(item => item.status === 'sold').length,
    reservedItems: items.filter(item => item.status === 'reserved').length,
  };

  // Handle item deletion
  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItemMutation.mutate(itemId);
    }
  };

  // Handle item status change
  const handleStatusChange = (itemId: string, status: string) => {
    updateItemStatusMutation.mutate({ itemId, status });
  };

  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  // Handle user role change
  const handleRoleChange = (userId: string, role: string) => {
    changeUserRoleMutation.mutate({ userId, role });
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
                
                {/* Recent activity */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Items</h3>
                  
                  {itemsLoading ? (
                    <p className="text-gray-500">Loading items...</p>
                  ) : itemsError ? (
                    <p className="text-red-500">Error loading items</p>
                  ) : items.length === 0 ? (
                    <p className="text-gray-500">No items found</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {items.slice(0, 5).map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.status === 'available' 
                                    ? 'bg-green-100 text-green-800' 
                                    : item.status === 'sold' 
                                    ? 'bg-gray-100 text-gray-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'items' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Manage Items</h2>
                
                {itemsLoading ? (
                  <p className="text-gray-500">Loading items...</p>
                ) : itemsError ? (
                  <p className="text-red-500">Error loading items</p>
                ) : items.length === 0 ? (
                  <p className="text-gray-500">No items found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                className="text-sm border-gray-300 rounded-md"
                              >
                                <option value="available">Available</option>
                                <option value="reserved">Reserved</option>
                                <option value="sold">Sold</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link 
                                to={`/items/${item.id}`} 
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
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
                <h2 className="text-xl font-semibold mb-6">Manage Users</h2>
                
                {usersLoading ? (
                  <p className="text-gray-500">Loading users...</p>
                ) : usersError ? (
                  <p className="text-red-500">Error loading users</p>
                ) : users.length === 0 ? (
                  <p className="text-gray-500">No users found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                className="text-sm border-gray-300 rounded-md"
                                disabled={user.id === user.id} // Can't change own role
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                                disabled={user.id === user.id} // Can't delete yourself
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage; 