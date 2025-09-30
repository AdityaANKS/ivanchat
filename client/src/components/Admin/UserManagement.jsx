import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, MoreVertical, Ban, UserCheck, Shield, 
  Edit, Trash2, Mail, Calendar, Clock, AlertTriangle,
  Download, RefreshCw, ChevronLeft, ChevronRight, Eye
} from 'lucide-react';
import api from '../../services/api';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import Loader from '../common/Loader';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const itemsPerPage = 20;

  const userStatuses = [
    { value: 'all', label: 'All Users' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'banned', label: 'Banned' },
    { value: 'suspended', label: 'Suspended' },
  ];

  const userRoles = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'premium', label: 'Premium' },
    { value: 'user', label: 'User' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Join Date' },
    { value: 'lastActive', label: 'Last Active' },
    { value: 'username', label: 'Username' },
    { value: 'email', label: 'Email' },
  ];

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filters]);

  useEffect(() => {
    filterAndSortUsers();
  }, [searchTerm, users, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          ...filters
        }
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.includes(searchTerm)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (userId, action) => {
    try {
      await api.post(`/admin/users/${userId}/${action}`);
      fetchUsers();
      // Show success notification
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const handleBulkAction = async (action) => {
    try {
      await api.post('/admin/users/bulk-action', {
        userIds: selectedUsers,
        action
      });
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const exportUsers = async () => {
    try {
      const response = await api.get('/admin/users/export', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Failed to export users:', error);
    }
  };

  return (
    <div className="user-management">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <p className="text-gray-400 mt-1">
              Manage {users.length} registered users
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="secondary"
              icon={RefreshCw}
              onClick={fetchUsers}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              icon={Download}
              onClick={exportUsers}
            >
              Export
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setSelectedUser(null);
                setShowUserModal(true);
              }}
            >
              Add User
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by username, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {userStatuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {userRoles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-3 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-between">
            <span className="text-white">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                size="small"
                variant="secondary"
                onClick={() => handleBulkAction('suspend')}
              >
                Suspend
              </Button>
              <Button
                size="small"
                variant="danger"
                onClick={() => handleBulkAction('ban')}
              >
                Ban
              </Button>
              <Button
                size="small"
                variant="danger"
                onClick={() => handleBulkAction('delete')}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="large" />
        </div>
      ) : (
        <>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map(user => (
                  <UserRow
                    key={user.id}
                    user={user}
                    isSelected={selectedUsers.includes(user.id)}
                    onSelect={handleSelectUser}
                    onAction={handleUserAction}
                    onEdit={() => {
                      setSelectedUser(user);
                      setShowUserModal(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, users.length)} of {users.length} users
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="small"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'primary' : 'secondary'}
                      size="small"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="secondary"
                size="small"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowUserModal(false)}
          onSave={() => {
            setShowUserModal(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

// Sub-components
const UserRow = ({ user, isSelected, onSelect, onAction, onEdit }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'banned': return 'bg-red-500';
      case 'suspended': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-600';
      case 'moderator': return 'bg-blue-600';
      case 'premium': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <tr className="hover:bg-gray-700">
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(user.id)}
          className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt={user.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-white font-medium">{user.username}</p>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(user.status)}`}>
          {user.status}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getRoleBadge(user.role)}`}>
          {user.role}
        </span>
      </td>
      <td className="px-4 py-4 text-gray-400 text-sm">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-4 text-gray-400 text-sm">
        {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
      </td>
      <td className="px-4 py-4 text-right">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-gray-400 hover:text-white"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-10">
              <button
                onClick={() => onEdit()}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-600 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit User
              </button>
              <button
                onClick={() => onAction(user.id, 'suspend')}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-600 flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Suspend
              </button>
              <button
                onClick={() => onAction(user.id, 'ban')}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-600 flex items-center gap-2"
              >
                <Ban className="w-4 h-4" />
                Ban User
              </button>
              <button
                onClick={() => onAction(user.id, 'delete')}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-600 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete User
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    role: user?.role || 'user',
    status: user?.status || 'active',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        await api.put(`/admin/users/${user.id}`, formData);
      } else {
        await api.post('/admin/users', formData);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={user ? 'Edit User' : 'Add New User'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="user">User</option>
            <option value="premium">Premium</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
            {user ? 'Update User' : 'Create User'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserManagement;