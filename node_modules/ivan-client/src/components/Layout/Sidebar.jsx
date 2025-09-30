import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  FiPlus, 
  FiCompass, 
  FiDownload,
  FiSettings,
  FiLogOut,
  FiHome,
  FiMic,
  FiMicOff,
  FiHeadphones,
  FiVolume2
} from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

// Components
import ServerIcon from '../Server/ServerIcon';
import CreateServerModal from '../Server/CreateServerModal';
import JoinServerModal from '../Server/JoinServerModal';

// Hooks
import { useServers } from '../../hooks/useServers';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useContextMenu } from '../../hooks/useContextMenu';

// Utils
import { playSound } from '../../utils/audio';

// Styles
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  
  // Redux state
  const { user } = useSelector(state => state.auth);
  const { servers, currentServerId } = useSelector(state => state.servers);
  const { unreadCounts, mentions } = useSelector(state => state.notifications);
  const { isMuted, isDeafened } = useSelector(state => state.voice);
  
  // Local state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [serverOrder, setServerOrder] = useState([]);
  const [hoveredServer, setHoveredServer] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  
  // Custom hooks
  const { sortedServers, serverFolders } = useServers();
  const { isDragging, handleDragStart, handleDragEnd } = useDragAndDrop();
  const { showContextMenu } = useContextMenu();
  
  // Initialize server order
  useEffect(() => {
    if (servers.length > 0 && serverOrder.length === 0) {
      setServerOrder(servers.map(s => s.id));
    }
  }, [servers, serverOrder.length]);
  
  // Handlers
  const handleServerClick = useCallback((serverId) => {
    dispatch({ type: 'servers/setCurrentServer', payload: serverId });
    navigate(`/channels/${serverId}`);
    playSound('navigate');
  }, [dispatch, navigate]);
  
  const handleHomeClick = () => {
    navigate('/channels/@me');
    dispatch({ type: 'servers/clearCurrentServer' });
  };
  
  const handleExploreClick = () => {
    navigate('/explore');
  };
  
  const handleServerContextMenu = useCallback((event, server) => {
    event.preventDefault();
    
    showContextMenu(event, [
      {
        label: 'Mark as Read',
        onClick: () => dispatch({ type: 'notifications/markServerRead', payload: server.id }),
        disabled: !unreadCounts[server.id]
      },
      {
        label: 'Invite People',
        onClick: () => navigate(`/servers/${server.id}/invite`),
        icon: <FiPlus />
      },
      { type: 'separator' },
      {
        label: 'Server Settings',
        onClick: () => navigate(`/servers/${server.id}/settings`),
        icon: <FiSettings />,
        disabled: server.ownerId !== user.id && !server.permissions?.includes('MANAGE_SERVER')
      },
      {
        label: 'Create Category',
        onClick: () => dispatch({ type: 'ui/showModal', payload: { type: 'createCategory', serverId: server.id } })
      },
      {
        label: 'Create Channel',
        onClick: () => dispatch({ type: 'ui/showModal', payload: { type: 'createChannel', serverId: server.id } })
      },
      { type: 'separator' },
      {
        label: 'Notification Settings',
        onClick: () => navigate(`/servers/${server.id}/notifications`)
      },
      {
        label: 'Privacy Settings',
        onClick: () => navigate(`/servers/${server.id}/privacy`)
      },
      { type: 'separator' },
      {
        label: server.muted ? 'Unmute Server' : 'Mute Server',
        onClick: () => dispatch({ type: 'servers/toggleMute', payload: server.id })
      },
      {
        label: 'Leave Server',
        onClick: () => dispatch({ type: 'ui/showModal', payload: { type: 'leaveServer', server } }),
        danger: true
      }
    ]);
  }, [showContextMenu, dispatch, navigate, user.id, unreadCounts]);
  
  const handleCreateServer = () => {
    setShowCreateModal(true);
    playSound('open');
  };
  
  const handleJoinServer = () => {
    setShowJoinModal(true);
    playSound('open');
  };
  
  const handleReorder = (newOrder) => {
    setServerOrder(newOrder);
    dispatch({ type: 'servers/reorderServers', payload: newOrder });
  };
  
  const handleMicToggle = () => {
    dispatch({ type: 'voice/toggleMute' });
    playSound(isMuted ? 'unmute' : 'mute');
  };
  
  const handleDeafenToggle = () => {
    dispatch({ type: 'voice/toggleDeafen' });
    playSound('toggle');
  };
  
  // Server folders support
  const renderServerOrFolder = (item) => {
    if (item.type === 'folder') {
      return (
        <div
          key={item.id}
          className={styles.serverFolder}
          data-expanded={selectedFolder === item.id}
        >
          <button
            className={styles.folderButton}
            onClick={() => setSelectedFolder(selectedFolder === item.id ? null : item.id)}
          >
            <div className={styles.folderIcon}>
              {item.servers.slice(0, 4).map((serverId, index) => {
                const server = servers.find(s => s.id === serverId);
                return server ? (
                  <img
                    key={serverId}
                    src={server.icon}
                    alt=""
                    className={styles.folderServerIcon}
                    style={{
                      top: `${Math.floor(index / 2) * 12}px`,
                      left: `${(index % 2) * 12}px`
                    }}
                  />
                ) : null;
              })}
            </div>
          </button>
          
          <AnimatePresence>
            {selectedFolder === item.id && (
              <motion.div
                className={styles.folderServers}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                {item.servers.map(serverId => {
                  const server = servers.find(s => s.id === serverId);
                  return server ? renderServer(server) : null;
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }
    
    return renderServer(item);
  };
  
  const renderServer = (server) => {
    const isActive = currentServerId === server.id;
    const hasUnread = unreadCounts[server.id] > 0;
    const hasMentions = mentions[server.id] > 0;
    
    return (
      <Reorder.Item
        key={server.id}
        value={server.id}
        className={styles.serverItem}
        onContextMenu={(e) => handleServerContextMenu(e, server)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={styles.serverPill} data-active={isActive} data-unread={hasUnread} />
        
        <ServerIcon
          server={server}
          isActive={isActive}
          hasUnread={hasUnread}
          hasMentions={hasMentions}
          onClick={() => handleServerClick(server.id)}
          onMouseEnter={() => setHoveredServer(server.id)}
          onMouseLeave={() => setHoveredServer(null)}
        />
        
        {hasMentions && (
          <span className={styles.mentionBadge}>
            {mentions[server.id] > 99 ? '99+' : mentions[server.id]}
          </span>
        )}
        
        {/* Server name tooltip */}
        {hoveredServer === server.id && (
          <div className={styles.serverTooltip}>
            <span>{server.name}</span>
            {hasUnread && <span className={styles.unreadCount}>({unreadCounts[server.id]} unread)</span>}
          </div>
        )}
      </Reorder.Item>
    );
  };
  
  return (
    <div ref={sidebarRef} className={styles.sidebar}>
      {/* Home Button */}
      <div className={styles.homeSection}>
        <button
          className={`${styles.homeButton} ${location.pathname.includes('@me') ? styles.active : ''}`}
          onClick={handleHomeClick}
          data-tooltip-id="home-tooltip"
          data-tooltip-content="Direct Messages"
        >
          <FiHome />
          {unreadCounts['@me'] > 0 && (
            <span className={styles.dmBadge}>{unreadCounts['@me']}</span>
          )}
        </button>
      </div>
      
      <div className={styles.separator} />
      
      {/* Servers List */}
      <Reorder.Group
        axis="y"
        values={serverOrder}
        onReorder={handleReorder}
        className={styles.serversList}
      >
        {sortedServers.map(item => renderServerOrFolder(item))}
      </Reorder.Group>
      
      {/* Add Server Button */}
      <div className={styles.addServerSection}>
        <button
          className={styles.addServerButton}
          onClick={handleCreateServer}
          data-tooltip-id="create-tooltip"
          data-tooltip-content="Add a Server"
        >
          <FiPlus />
        </button>
        
        <button
          className={styles.exploreButton}
          onClick={handleExploreClick}
          data-tooltip-id="explore-tooltip"
          data-tooltip-content="Explore Public Servers"
        >
          <FiCompass />
        </button>
      </div>
      
      <div className={styles.separator} />
      
      {/* Download App */}
      <div className={styles.downloadSection}>
        <button
          className={styles.downloadButton}
          onClick={() => navigate('/download')}
          data-tooltip-id="download-tooltip"
          data-tooltip-content="Download Apps"
        >
          <FiDownload />
        </button>
      </div>
      
      {/* Voice Controls (Fixed at bottom) */}
      <div className={styles.voiceControls}>
        <button
          className={`${styles.voiceButton} ${isMuted ? styles.muted : ''}`}
          onClick={handleMicToggle}
          data-tooltip-id="mic-tooltip"
          data-tooltip-content={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FiMicOff /> : <FiMic />}
        </button>
        
        <button
          className={`${styles.voiceButton} ${isDeafened ? styles.deafened : ''}`}
          onClick={handleDeafenToggle}
          data-tooltip-id="deafen-tooltip"
          data-tooltip-content={isDeafened ? 'Undeafen' : 'Deafen'}
        >
          {isDeafened ? <FiVolume2 className={styles.deafenedIcon} /> : <FiHeadphones />}
        </button>
      </div>
      
      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateServerModal onClose={() => setShowCreateModal(false)} />
        )}
        
        {showJoinModal && (
          <JoinServerModal onClose={() => setShowJoinModal(false)} />
        )}
      </AnimatePresence>
      
      {/* Tooltips */}
      <Tooltip id="home-tooltip" place="right" />
      <Tooltip id="create-tooltip" place="right" />
      <Tooltip id="explore-tooltip" place="right" />
      <Tooltip id="download-tooltip" place="right" />
      <Tooltip id="mic-tooltip" place="top" />
      <Tooltip id="deafen-tooltip" place="top" />
    </div>
  );
};

export default Sidebar;