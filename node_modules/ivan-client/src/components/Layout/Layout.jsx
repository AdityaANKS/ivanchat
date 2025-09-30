import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import classNames from 'classnames';

// Components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ServerSidebar from '../Server/ServerSidebar';
import ChannelSidebar from '../Channel/ChannelSidebar';
import MembersList from '../User/MembersList';
import VoiceConnection from '../Voice/VoiceConnection';
import NotificationToast from '../common/NotificationToast';
import ContextMenu from '../common/ContextMenu';
import CommandPalette from '../common/CommandPalette';
import QuickSwitcher from '../common/QuickSwitcher';

// Hooks
import { useSocket } from '../../hooks/useSocket';
import { useTheme } from '../../hooks/useTheme';
import { useHotkeys } from '../../hooks/useHotkeys';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useIdleDetection } from '../../hooks/useIdleDetection';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

// Styles
import styles from './Layout.module.css';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  
  // Redux state
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { currentServer, currentChannel } = useSelector(state => state.chat);
  const { isConnected: voiceConnected, currentVoiceChannel } = useSelector(state => state.voice);
  const { theme, sidebarCollapsed, rightSidebarVisible } = useSelector(state => state.ui);
  const { unreadCount, notifications } = useSelector(state => state.notifications);
  
  // Local state
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showQuickSwitcher, setShowQuickSwitcher] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [layoutMode, setLayoutMode] = useState('default'); // default, compact, cozy
  const [focusMode, setFocusMode] = useState(false);
  
  // Custom hooks
  const socket = useSocket();
  const { isDarkMode, toggleTheme } = useTheme();
  const breakpoint = useBreakpoint();
  const isOnline = useOnlineStatus();
  const isIdle = useIdleDetection(5 * 60 * 1000); // 5 minutes
  
  // Responsive layout
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl';
  
  // Calculate layout dimensions
  const sidebarWidth = sidebarCollapsed ? 72 : 240;
  const serverListWidth = 72;
  const membersListWidth = rightSidebarVisible ? 240 : 0;
  
  // Keyboard shortcuts
  useHotkeys([
    ['cmd+k, ctrl+k', () => setShowCommandPalette(true)],
    ['cmd+shift+k, ctrl+shift+k', () => setShowQuickSwitcher(true)],
    ['cmd+shift+m, ctrl+shift+m', () => dispatch({ type: 'ui/toggleRightSidebar' })],
    ['cmd+b, ctrl+b', () => dispatch({ type: 'ui/toggleSidebar' })],
    ['cmd+/, ctrl+/', () => navigate('/search')],
    ['alt+up', () => navigateChannel('previous')],
    ['alt+down', () => navigateChannel('next')],
    ['cmd+shift+t, ctrl+shift+t', () => toggleTheme()],
    ['f11', () => toggleFullscreen()],
    ['esc', () => handleEscape()]
  ]);
  
  // Effects
  useEffect(() => {
    // Update user status based on idle state
    if (isIdle && user?.status === 'online') {
      dispatch({ type: 'user/updateStatus', payload: 'idle' });
    } else if (!isIdle && user?.status === 'idle') {
      dispatch({ type: 'user/updateStatus', payload: 'online' });
    }
  }, [isIdle, user?.status, dispatch]);
  
  useEffect(() => {
    // Handle online/offline status
    if (!isOnline) {
      dispatch({ 
        type: 'notifications/show', 
        payload: {
          type: 'warning',
          title: 'Connection Lost',
          message: 'You are currently offline. Some features may be unavailable.'
        }
      });
    }
  }, [isOnline, dispatch]);
  
  useEffect(() => {
    // Update page title based on current location
    const channelName = currentChannel?.name || '';
    const serverName = currentServer?.name || '';
    const unreadSuffix = unreadCount > 0 ? ` (${unreadCount})` : '';
    
    let title = 'Ivan';
    if (channelName && serverName) {
      title = `#${channelName} - ${serverName}${unreadSuffix} | Ivan`;
    } else if (serverName) {
      title = `${serverName}${unreadSuffix} | Ivan`;
    }
    
    document.title = title;
  }, [currentChannel, currentServer, unreadCount]);
  
  // Handlers
  const handleContextMenu = useCallback((event, data) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      data
    });
  }, []);
  
  const handleEscape = useCallback(() => {
    if (showCommandPalette) setShowCommandPalette(false);
    else if (showQuickSwitcher) setShowQuickSwitcher(false);
    else if (contextMenu) setContextMenu(null);
    else if (focusMode) setFocusMode(false);
  }, [showCommandPalette, showQuickSwitcher, contextMenu, focusMode]);
  
  const navigateChannel = useCallback((direction) => {
    // Navigate to previous/next channel
    const channels = currentServer?.channels || [];
    const currentIndex = channels.findIndex(ch => ch.id === currentChannel?.id);
    
    if (currentIndex !== -1) {
      const nextIndex = direction === 'next' 
        ? (currentIndex + 1) % channels.length
        : (currentIndex - 1 + channels.length) % channels.length;
      
      const nextChannel = channels[nextIndex];
      if (nextChannel) {
        navigate(`/channels/${currentServer.id}/${nextChannel.id}`);
      }
    }
  }, [currentServer, currentChannel, navigate]);
  
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);
  
  // Layout classes
  const layoutClasses = classNames(styles.layout, {
    [styles.darkMode]: isDarkMode,
    [styles.lightMode]: !isDarkMode,
    [styles.mobile]: isMobile,
    [styles.tablet]: isTablet,
    [styles.desktop]: isDesktop,
    [styles.focusMode]: focusMode,
    [styles.compactMode]: layoutMode === 'compact',
    [styles.cozyMode]: layoutMode === 'cozy',
    [styles.sidebarCollapsed]: sidebarCollapsed,
    [styles.rightSidebarVisible]: rightSidebarVisible,
    [styles.voiceConnected]: voiceConnected
  });
  
  // Render loading state
  if (!isAuthenticated) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading Ivan...</p>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <body className={isDarkMode ? 'theme-dark' : 'theme-light'} />
      </Helmet>
      
      <div ref={containerRef} className={layoutClasses}>
        {/* Server List Sidebar */}
        <aside 
          className={styles.serverList}
          style={{ width: serverListWidth }}
        >
          <Sidebar />
        </aside>
        
        {/* Channel Sidebar */}
        <AnimatePresence mode="wait">
          {currentServer && (
            <motion.aside
              key={currentServer.id}
              className={styles.channelSidebar}
              style={{ width: sidebarWidth }}
              initial={{ x: -sidebarWidth }}
              animate={{ x: 0 }}
              exit={{ x: -sidebarWidth }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <ServerSidebar 
                server={currentServer}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => dispatch({ type: 'ui/toggleSidebar' })}
              />
              <ChannelSidebar 
                server={currentServer}
                collapsed={sidebarCollapsed}
              />
              <Footer />
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Main Content Area */}
        <div className={styles.mainContainer}>
          {/* Header */}
          <Header 
            onMenuClick={() => setShowMobileMenu(!showMobileMenu)}
            onSearchClick={() => navigate('/search')}
            onToggleFocusMode={() => setFocusMode(!focusMode)}
          />
          
          {/* Content */}
          <main className={styles.content}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={styles.contentWrapper}
              >
                <Outlet context={{ layoutMode, focusMode }} />
              </motion.div>
            </AnimatePresence>
          </main>
          
          {/* Voice Connection Bar */}
          {voiceConnected && currentVoiceChannel && (
            <VoiceConnection 
              channel={currentVoiceChannel}
              onDisconnect={() => dispatch({ type: 'voice/disconnect' })}
            />
          )}
        </div>
        
        {/* Members List (Right Sidebar) */}
        <AnimatePresence>
          {rightSidebarVisible && currentChannel && (
            <motion.aside
              className={styles.membersList}
              style={{ width: membersListWidth }}
              initial={{ x: membersListWidth }}
              animate={{ x: 0 }}
              exit={{ x: membersListWidth }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <MembersList 
                channel={currentChannel}
                server={currentServer}
              />
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobile && showMobileMenu && (
            <motion.div
              className={styles.mobileMenuOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
            >
              <motion.div
                className={styles.mobileMenu}
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                onClick={e => e.stopPropagation()}
              >
                <Sidebar />
                {currentServer && (
                  <>
                    <ServerSidebar server={currentServer} />
                    <ChannelSidebar server={currentServer} />
                  </>
                )}
                <Footer />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Modals and Overlays */}
        <AnimatePresence>
          {showCommandPalette && (
            <CommandPalette onClose={() => setShowCommandPalette(false)} />
          )}
          
          {showQuickSwitcher && (
            <QuickSwitcher onClose={() => setShowQuickSwitcher(false)} />
          )}
          
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              data={contextMenu.data}
              onClose={() => setContextMenu(null)}
            />
          )}
        </AnimatePresence>
        
        {/* Notification Toasts */}
        <NotificationToast />
        
        {/* Offline Indicator */}
        {!isOnline && (
          <div className={styles.offlineIndicator}>
            <span>🔌 No internet connection</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Layout;