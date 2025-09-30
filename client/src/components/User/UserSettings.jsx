import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser,
  FiLock,
  FiShield,
  FiMic,
  FiVideo,
  FiMonitor,
  FiBell,
  FiGlobe,
  FiMessageSquare,
  FiCreditCard,
  FiActivity,
  FiDatabase,
  FiKey,
  FiLogOut,
  FiTrash2,
  FiX
} from 'react-icons/fi';

// Components
import ProfileSettings from './settings/ProfileSettings';
import AccountSettings from './settings/AccountSettings';
import PrivacySettings from './settings/PrivacySettings';
import VoiceVideoSettings from './settings/VoiceVideoSettings';
import NotificationSettings from './settings/NotificationSettings';
import AppearanceSettings from './settings/AppearanceSettings';
import LanguageSettings from './settings/LanguageSettings';
import StreamerModeSettings from './settings/StreamerModeSettings';
import KeybindSettings from './settings/KeybindSettings';
import ActivitySettings from './settings/ActivitySettings';
import BillingSettings from './settings/BillingSettings';
import DataSettings from './settings/DataSettings';
import DeveloperSettings from './settings/DeveloperSettings';

// Services
import { userService } from '../../services/users';

// Styles
import styles from './UserSettings.module.css';

const UserSettings = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { user } = useSelector(state => state.auth);
  const { settings } = useSelector(state => state.user);
  
  // Local state
  const [activeCategory, setActiveCategory] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  
  // Settings categories
  const categories = [
    {
      id: 'user-settings',
      label: 'User Settings',
      items: [
        { id: 'profile', label: 'My Profile', icon: <FiUser /> },
        { id: 'account', label: 'Account', icon: <FiLock /> },
        { id: 'privacy', label: 'Privacy & Safety', icon: <FiShield /> },
        { id: 'authorized-apps', label: 'Authorized Apps', icon: <FiKey /> }
      ]
    },
    {
      id: 'app-settings',
      label: 'App Settings',
      items: [
        { id: 'appearance', label: 'Appearance', icon: <FiMonitor /> },
        { id: 'voice-video', label: 'Voice & Video', icon: <FiMic /> },
        { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
        { id: 'keybinds', label: 'Keybinds', icon: <FiKey /> },
        { id: 'language', label: 'Language', icon: <FiGlobe /> },
        { id: 'streamer-mode', label: 'Streamer Mode', icon: <FiVideo /> }
      ]
    },
    {
      id: 'activity-settings',
      label: 'Activity Settings',
      items: [
        { id: 'activity-status', label: 'Activity Status', icon: <FiActivity /> },
        { id: 'game-activity', label: 'Game Activity', icon: <FiActivity /> }
      ]
    },
    {
      id: 'billing',
      label: 'Billing',
      items: [
        { id: 'subscriptions', label: 'Subscriptions', icon: <FiCreditCard /> },
        { id: 'billing', label: 'Billing', icon: <FiCreditCard /> }
      ]
    },
    {
      id: 'advanced',
      label: 'Advanced',
      items: [
        { id: 'developer', label: 'Developer Mode', icon: <FiDatabase /> },
        { id: 'data', label: 'Data & Storage', icon: <FiDatabase /> }
      ]
    }
  ];
  
  // Handle settings change
  const handleSettingChange = useCallback((key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  }, []);
  
  // Save settings
  const handleSave = useCallback(async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    try {
      await userService.updateSettings(localSettings);
      dispatch({
        type: 'user/updateSettings',
        payload: localSettings
      });
      
      dispatch({
        type: 'notifications/show',
        payload: {
          type: 'success',
          message: 'Settings saved successfully'
        }
      });
      
      setHasChanges(false);
    } catch (error) {
      dispatch({
        type: 'notifications/show',
        payload: {
          type: 'error',
          message: 'Failed to save settings'
        }
      });
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, localSettings, dispatch]);
  
  // Reset settings
  const handleReset = useCallback(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);
  
  // Handle close with unsaved changes
  const handleClose = useCallback(() => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Do you want to discard them?')) {
        onClose();
      }
    } else {
      onClose();
    }
  }, [hasChanges, onClose]);
  
  // Handle logout
  const handleLogout = useCallback(() => {
    if (confirm('Are you sure you want to log out?')) {
      dispatch({ type: 'auth/logout' });
      navigate('/login');
    }
  }, [dispatch, navigate]);
  
  // Handle account deletion
  const handleDeleteAccount = useCallback(() => {
    dispatch({
      type: 'ui/showModal',
      payload: {
        type: 'deleteAccount',
        onConfirm: async () => {
          await userService.deleteAccount();
          dispatch({ type: 'auth/logout' });
          navigate('/');
        }
      }
    });
  }, [dispatch, navigate]);
  
  // Render settings content
  const renderContent = () => {
    switch (activeCategory) {
      case 'profile':
        return (
          <ProfileSettings
            user={user}
            settings={localSettings}
            onChange={handleSettingChange}
          />
        );
      
      case 'account':
        return (
          <AccountSettings
            user={user}
            settings={localSettings}
            onChange={handleSettingChange}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        );
      
      case 'privacy':
        return (
          <PrivacySettings
            settings={localSettings}
            onChange={handleSettingChange}
          />
        );
      
      case 'voice-video':
        return (
          <VoiceVideoSettings
            settings={localSettings}
            onChange={handleSettingChange}
          />
        );
      
      case 'notifications':
        return (
          <NotificationSettings
            settings={localSettings}
            onChange={handleSettingChange}
          />
        );
      
      case 'appearance':
        return (
          <AppearanceSettings
            settings={localSettings}
            onChange={handleSettingChange}
          />
        );
      
      case 'language':
        return (
          <LanguageSettings
            settings={localSettings}
            onChange={handleSettingChange}
          />
        );
      
      case 'streamer-mode':
        return (
          <StreamerModeSettings
            settings={localSettings}
            onChange={handleSettingChange}
          />
        );
      
      case 'keybinds':
        return (
          <KeybindSettings
            settings={localSettings}
            onChange={handleSettingChange}
          />
        );
      
      case 'activity-status':
      case 'game-activity':
        return (
          <ActivitySettings
            type={activeCategory}
            settings={localSettings}
            onChange={handleSettingChange}
          />
        );
      
      case 'subscriptions':
      case 'billing':
        return (
          <BillingSettings
            type={activeCategory}
            user={user}
            settings={localSettings}
            onChange={handleSettingChange}
          />
        );
      
      case 'data':
        return (
          <DataSettings
            settings={localSettings}
            onChange={handleSettingChange}
          />
        );
      
      case 'developer':
        return (
          <DeveloperSettings
            settings={localSettings}
            onChange={handleSettingChange}
          />
        );
      
      default:
        return <div>Select a category</div>;
    }
  };
  
  return (
    <motion.div
      className={styles.userSettings}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.container}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            {categories.map(category => (
              <div key={category.id} className={styles.category}>
                <h3 className={styles.categoryLabel}>{category.label}</h3>
                {category.items.map(item => (
                  <button
                    key={item.id}
                    className={`${styles.categoryItem} ${
                      activeCategory === item.id ? styles.active : ''
                    }`}
                    onClick={() => setActiveCategory(item.id)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
            
            <div className={styles.category}>
              <button
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                <FiLogOut />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>
        
        {/* Content */}
        <main className={styles.content}>
          <div className={styles.contentHeader}>
            <h2>{categories
              .flatMap(c => c.items)
              .find(i => i.id === activeCategory)?.label}</h2>
            
            <button
              className={styles.closeButton}
              onClick={handleClose}
            >
              <FiX />
            </button>
          </div>
          
          <div className={styles.contentBody}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer with save/reset buttons */}
          {hasChanges && (
            <motion.div
              className={styles.footer}
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
            >
              <span className={styles.unsavedChanges}>
                You have unsaved changes
              </span>
              
              <div className={styles.footerButtons}>
                <button
                  className={styles.resetButton}
                  onClick={handleReset}
                >
                  Reset
                </button>
                
                <button
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </motion.div>
  );
};

export default UserSettings;