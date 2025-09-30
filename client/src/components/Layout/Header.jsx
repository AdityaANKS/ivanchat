import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiHash,
  FiAtSign,
  FiBell,
  FiPin,
  FiUsers,
  FiPhone,
  FiVideo,
  FiMoreVertical,
  FiMenu,
  FiInbox,
  FiHelpCircle,
  FiSettings,
  FiMaximize,
  FiMinimize,
  FiVolume2,
  FiVolumeX
} from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

// Components
import SearchBar from '../common/SearchBar';
import NotificationPanel from '../Notification/NotificationPanel';
import UserMenu from '../User/UserMenu';
import Breadcrumbs from '../common/Breadcrumbs';

// Hooks
import { useChannel } from '../../hooks/useChannel';
import { useHotkeys } from '../../hooks/useHotkeys';

// Styles
import styles from './Header.module.css';

const Header = ({ onMenuClick, onSearchClick, onToggleFocusMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  
  // Redux state
  const { currentChannel, currentServer } = useSelector(state => state.chat);
  const { user } = useSelector(state => state.auth);
  const { unreadCount, hasNotifications } = useSelector(state => state.notifications);
  const { isInVoiceChannel, isMuted } = useSelector(state => state.voice);
  const { rightSidebarVisible, focusMode } = useSelector(state => state.ui);
  
  // Local state
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChannelMenu, setShowChannelMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Channel data
  const { channelType, isPrivate, topic, memberCount } = useChannel(currentChannel?.id);
  
  // Keyboard shortcuts
  useHotkeys([
    ['cmd+f, ctrl+f', () => setShowSearch(true)],
    ['esc', () => setShowSearch(false)]
  ]);
  
  // Effects
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Handlers
  const handleVoiceToggle = () => {
    if (isInVoiceChannel) {
      dispatch({ type: 'voice/toggleMute' });
    } else if (currentChannel?.type === 'voice') {
      dispatch({ type: 'voice/joinChannel', payload: currentChannel });
    }
  };
  
  const handleVideoToggle = () => {
    if (currentChannel?.type === 'voice' || currentChannel?.type === 'video') {
      dispatch({ type: 'voice/toggleVideo' });
    }
  };
  
  const handlePinClick = () => {
    navigate(`/channels/${currentServer?.id}/${currentChannel?.id}/pins`);
  };
  
  const handleMembersToggle = () => {
    dispatch({ type: 'ui/toggleRightSidebar' });
  };
  
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      dispatch({ type: 'notifications/markAllRead' });
    }
  };
  
  // Render channel icon based on type
  const renderChannelIcon = () => {
    if (isPrivate) {
      return <FiAtSign className={styles.channelIcon} />;
    }
    
    switch (channelType) {
      case 'voice':
        return <FiVolume2 className={styles.channelIcon} />;
      case 'announcement':
        return <FiBell className={styles.channelIcon} />;
      default:
        return <FiHash className={styles.channelIcon} />;
    }
  };
  
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <FiMenu />
        </button>
        
        {/* Channel Info */}
        {currentChannel ? (
          <div className={styles.channelInfo}>
            {renderChannelIcon()}
            <h1 className={styles.channelName}>
              {currentChannel.name}
            </h1>
            
            {topic && (
              <>
                <div className={styles.divider} />
                <p className={styles.channelTopic}>{topic}</p>
              </>
            )}
          </div>
        ) : (
          <Breadcrumbs />
        )}
      </div>
      
      <div className={styles.rightSection}>
        {/* Channel Actions */}
        {currentChannel && (
          <div className={styles.channelActions}>
            {/* Voice/Video Call Buttons */}
            {(channelType === 'voice' || channelType === 'video') && (
              <>
                <button
                  className={styles.iconButton}
                  onClick={handleVoiceToggle}
                  data-tooltip-id="voice-tooltip"
                  data-tooltip-content={isInVoiceChannel ? (isMuted ? 'Unmute' : 'Mute') : 'Join Voice'}
                >
                  {isInVoiceChannel && isMuted ? <FiVolumeX /> : <FiPhone />}
                </button>
                
                <button
                  className={styles.iconButton}
                  onClick={handleVideoToggle}
                  data-tooltip-id="video-tooltip"
                  data-tooltip-content="Start Video"
                >
                  <FiVideo />
                </button>
              </>
            )}
            
            {/* Pinned Messages */}
            <button
              className={styles.iconButton}
              onClick={handlePinClick}
              data-tooltip-id="pins-tooltip"
              data-tooltip-content="Pinned Messages"
            >
              <FiPin />
            </button>
            
            {/* Toggle Members List */}
            <button
              className={`${styles.iconButton} ${rightSidebarVisible ? styles.active : ''}`}
              onClick={handleMembersToggle}
              data-tooltip-id="members-tooltip"
              data-tooltip-content={rightSidebarVisible ? 'Hide Member List' : 'Show Member List'}
            >
              <FiUsers />
              {memberCount > 0 && (
                <span className={styles.memberCount}>{memberCount}</span>
              )}
            </button>
          </div>
        )}
        
        {/* Search */}
        <div className={styles.searchContainer}>
          {showSearch ? (
            <SearchBar
              ref={searchRef}
              onClose={() => setShowSearch(false)}
              placeholder="Search messages, files, and more..."
              autoFocus
            />
          ) : (
            <button
              className={styles.iconButton}
              onClick={() => setShowSearch(true)}
              data-tooltip-id="search-tooltip"
              data-tooltip-content="Search (Ctrl+F)"
            >
              <FiSearch />
            </button>
          )}
        </div>
        
        {/* Inbox */}
        <button
          className={styles.iconButton}
          onClick={() => navigate('/inbox')}
          data-tooltip-id="inbox-tooltip"
          data-tooltip-content="Inbox"
        >
          <FiInbox />
          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
          )}
        </button>
        
        {/* Notifications */}
        <div className={styles.notificationsContainer}>
          <button
            className={`${styles.iconButton} ${hasNotifications ? styles.hasNotifications : ''}`}
            onClick={handleNotificationClick}
            data-tooltip-id="notifications-tooltip"
            data-tooltip-content="Notifications"
          >
            <FiBell />
            {hasNotifications && <span className={styles.notificationDot} />}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className={styles.notificationPanel}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <NotificationPanel onClose={() => setShowNotifications(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Help */}
        <button
          className={styles.iconButton}
          onClick={() => navigate('/help')}
          data-tooltip-id="help-tooltip"
          data-tooltip-content="Help"
        >
          <FiHelpCircle />
        </button>
        
        {/* View Options */}
        <div className={styles.viewOptions}>
          <button
            className={styles.iconButton}
            onClick={handleFullscreenToggle}
            data-tooltip-id="fullscreen-tooltip"
            data-tooltip-content={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <FiMinimize /> : <FiMaximize />}
          </button>
          
          <button
            className={styles.iconButton}
            onClick={onToggleFocusMode}
            data-tooltip-id="focus-tooltip"
            data-tooltip-content={focusMode ? 'Exit Focus Mode' : 'Focus Mode'}
          >
            {focusMode ? <FiMinimize /> : <FiMaximize />}
          </button>
        </div>
        
        {/* User Menu */}
        <div className={styles.userMenuContainer}>
          <button
            className={styles.userMenuButton}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <img 
              src={user?.avatar || '/default-avatar.png'} 
              alt={user?.username}
              className={styles.userAvatar}
            />
            <span className={styles.statusIndicator} data-status={user?.status} />
          </button>
          
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                className={styles.userMenuDropdown}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <UserMenu onClose={() => setShowUserMenu(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Tooltips */}
      <Tooltip id="voice-tooltip" />
      <Tooltip id="video-tooltip" />
      <Tooltip id="pins-tooltip" />
      <Tooltip id="members-tooltip" />
      <Tooltip id="search-tooltip" />
      <Tooltip id="inbox-tooltip" />
      <Tooltip id="notifications-tooltip" />
      <Tooltip id="help-tooltip" />
      <Tooltip id="fullscreen-tooltip" />
      <Tooltip id="focus-tooltip" />
    </header>
  );
};

export default Header;