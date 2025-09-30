import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Bell, Shield, Palette, Volume2, Globe, CreditCard,
  Key, Database, LogOut, Trash2, Moon, Sun, Monitor
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import api from '../services/api';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [activeSection, setActiveSection] = useState('account');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'audio', label: 'Audio & Video', icon: Volume2 },
    { id: 'language', label: 'Language & Region', icon: Globe },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'advanced', label: 'Advanced', icon: Database },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (section, data) => {
    try {
      setSaving(true);
      await api.put(`/users/settings/${section}`, data);
      // Show success notification
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user.email) return;
    
    try {
      await api.delete('/users/account');
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={settings?.email || ''}
            onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input
            label="Username"
            value={settings?.username || ''}
            onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
          />
          <Button
            variant="primary"
            onClick={() => saveSettings('account', { 
              email: settings.email, 
              username: settings.username 
            })}
            loading={saving}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Password</h3>
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            icon={Key}
          />
          <Input
            label="New Password"
            type="password"
            icon={Key}
          />
          <Input
            label="Confirm New Password"
            type="password"
            icon={Key}
          />
          <Button variant="primary">Update Password</Button>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
        <p className="text-gray-400 mb-4">
          Add an extra layer of security to your account
        </p>
        <Button variant="secondary">Enable 2FA</Button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
      
      <div className="space-y-4">
        {[
          { id: 'messages', label: 'Direct Messages', description: 'Receive notifications for new messages' },
          { id: 'mentions', label: 'Mentions', description: 'Get notified when someone mentions you' },
          { id: 'servers', label: 'Server Updates', description: 'Updates from servers you\'re in' },
          { id: 'friends', label: 'Friend Requests', description: 'Notifications for friend requests' },
          { id: 'events', label: 'Events', description: 'Reminders for upcoming events' },
        ].map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.notifications?.[item.id] ?? true}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    [item.id]: e.target.checked
                  }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={() => saveSettings('notifications', settings.notifications)}
        loading={saving}
      >
        Save Notification Settings
      </Button>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">Theme</label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'auto', label: 'Auto', icon: Monitor },
          ].map(theme => (
            <button
              key={theme.id}
              onClick={() => setSettings(prev => ({ ...prev, theme: theme.id }))}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings?.theme === theme.id
                  ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <theme.icon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-white">{theme.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">Accent Color</label>
        <div className="flex gap-3">
          {['blue', 'green', 'purple', 'red', 'orange', 'pink'].map(color => (
            <button
              key={color}
              onClick={() => setSettings(prev => ({ ...prev, accentColor: color }))}
              className={`w-10 h-10 rounded-full bg-${color}-500 ${
                settings?.accentColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Font Size</label>
        <input
          type="range"
          min="12"
          max="20"
          value={settings?.fontSize || 16}
          onChange={(e) => setSettings(prev => ({ ...prev, fontSize: e.target.value }))}
          className="w-full"
        />
        <div className="flex justify-between text-gray-400 text-sm mt-1">
          <span>Small</span>
          <span>Large</span>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={() => saveSettings('appearance', {
          theme: settings.theme,
          accentColor: settings.accentColor,
          fontSize: settings.fontSize
        })}
        loading={saving}
      >
        Save Appearance Settings
      </Button>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return <div className="text-white">Settings for {activeSection}</div>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
          
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <nav className="space-y-1">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full px-4 py-3 flex items-center gap-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    {section.label}
                  </button>
                ))}
                
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full px-4 py-3 flex items-center gap-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full px-4 py-3 flex items-center gap-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Account
                  </button>
                </div>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 bg-gray-800 rounded-lg p-8">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Logout Modal */}
        <Modal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          title="Log Out"
        >
          <p className="text-gray-300 mb-6">
            Are you sure you want to log out?
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleLogout}
              fullWidth
            >
              Log Out
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowLogoutModal(false)}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </Modal>

        {/* Delete Account Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account"
        >
          <div className="space-y-4">
            <div className="p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">
                Warning: This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
            <p className="text-gray-300">
              To confirm, please type your email address: <strong>{user?.email}</strong>
            </p>
            <Input
              placeholder="Type your email to confirm"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== user?.email}
                fullWidth
              >
                Delete Account
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                fullWidth
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Settings;