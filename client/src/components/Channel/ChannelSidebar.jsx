import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
  FiChevronDown,
  FiChevronRight,
  FiPlus,
  FiSettings,
  FiUsers,
  FiUserPlus,
  FiBell,
  FiSearch
} from 'react-icons/fi';

// Components
import ChannelList from './ChannelList';
import CreateChannelModal from './CreateChannelModal';
import ServerSettings from '../Server/ServerSettings';
import InviteModal from '../Server/InviteModal';
import SearchModal from '../common/SearchModal';

// Hooks
import { useChannels } from '../../hooks/useChannels';
import { usePermissions } from '../../hooks/usePermissions';
import { useContextMenu } from '../../hooks/useContextMenu';

// Utils
import { sortChannels, groupChannelsByCategory } from '../../utils/channels';
import { playSound } from '../../utils/audio';

// Styles
import styles from './ChannelSidebar.module.css';

const ChannelSidebar = ({ server, collapsed = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serverId, channelId } = useParams();
  
  // Redux state
  const { user } = useSelector(state => state.auth);
  const { 
    channels,
    categories,
    voiceStates,
    activeVoiceChannels 
  } = useSelector(state => state.channels);
  const { onlineMembers, totalMembers } = useSelector(state => state.servers[serverId] || {});
  const { unreadChannels, mentionCounts } = useSelector(state => state.notifications);
  
  // Local state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Hooks
  const { canManageChannels, canInviteMembers } = usePermissions(serverId);
  const { showContextMenu } = useContextMenu();
  const { sortedChannels, channelsByCategory } = useChannels(serverId);
  
  // Group and sort channels
  const organizedChannels = useMemo(() => {
    if (!channels || !server) return {};
    
    const serverChannels = channels.filter(ch => ch.serverId === serverId);
    return groupChannelsByCategory(sortChannels(serverChannels), categories);
  }, [channels, categories, serverId, server]);
  
  // Filter channels based on search
  const filteredChannels = useMemo(() => {
    if (!searchQuery) return organizedChannels;
    
    const filtered = {};
    Object.entries(organizedChannels).forEach(([categoryId, categoryChannels]) => {
      const matchingChannels = categoryChannels.filter(channel =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchingChannels.length > 0) {
        filtered[categoryId] = matchingChannels;
      }
    });
    
    return filtered;
  }, [organizedChannels, searchQuery]);
  
  // Handle category collapse
  const toggleCategory = useCallback((categoryId) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
    playSound('click');
  }, []);
  
  // Handle channel drag and drop
  const handleDragEnd = useCallback((result) => {
    if (!result.destination || !canManageChannels) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      // Moving between categories
      dispatch({
        type: 'channels/moveChannel',
        payload: {
          channelId: draggableId,
          fromCategory: source.droppableId,
          toCategory: destination.droppableId,
          toIndex: destination.index
        }
      });
    } else if (source.index !== destination.index) {
      // Reordering within category
      dispatch({
        type: 'channels/reorderChannel',
        payload: {
          channelId: draggableId,
          categoryId: source.droppableId,
          fromIndex: source.index,
          toIndex: destination.index
        }
      });
    }
    
    setIsDragging(false);
  }, [canManageChannels, dispatch]);
  
  // Handle server header context menu
  const handleServerContextMenu = useCallback((event) => {
    event.preventDefault();
    
    showContextMenu(event, [
      {
        label: 'Server Settings',
        icon: <FiSettings />,
        onClick: () => setShowSettingsModal(true),
        disabled: !user?.id === server?.ownerId
      },
      {
        label: 'Create Channel',
        icon: <FiPlus />,
        onClick: () => setShowCreateModal(true),
        disabled: !canManageChannels
      },
      {
        label: 'Create Category',
        icon: <FiPlus />,
        onClick: () => dispatch({ 
          type: 'ui/showModal', 
          payload: { type: 'createCategory', serverId } 
        }),
        disabled: !canManageChannels
      },
      { type: 'separator' },
      {
        label: 'Invite People',
        icon: <FiUserPlus />,
        onClick: () => setShowInviteModal(true),
        disabled: !canInviteMembers
      },
      {
        label: 'Server Boost',
        onClick: () => navigate(`/servers/${serverId}/boost`)
      },
      { type: 'separator' },
      {
        label: 'Notification Settings',
        icon: <FiBell />,
        onClick: () => navigate(`/servers/${serverId}/notifications`)
      },
      {
        label: 'Privacy Settings',
        onClick: () => navigate(`/servers/${serverId}/privacy`)
      },
      { type: 'separator' },
      {
        label: 'Leave Server',
        onClick: () => dispatch({ 
          type: 'ui/showModal', 
          payload: { type: 'leaveServer', serverId } 
        }),
        danger: true
      }
    ]);
  }, [server, user, serverId, canManageChannels, canInviteMembers, dispatch, navigate, showContextMenu]);
  
  if (collapsed) {
    return (
      <div className={styles.collapsedSidebar}>
        <div className={styles.collapsedHeader}>
          <span className={styles.serverInitial}>
            {server?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.channelSidebar}>
      {/* Server Header */}
      <header 
        className={styles.serverHeader}
        onContextMenu={handleServerContextMenu}
      >
        <div className={styles.serverInfo}>
          <h2 className={styles.serverName}>{server?.name}</h2>
          {server?.verified && (
            <span className={styles.verifiedBadge} title="Verified Server">
              ✓
            </span>
          )}
          {server?.partnered && (
            <span className={styles.partneredBadge} title="Partnered Server">
              👥
            </span>
          )}
        </div>
        
        <button 
          className={styles.dropdownButton}
          onClick={handleServerContextMenu}
        >
          <FiChevronDown />
        </button>
      </header>
      
      {/* Server Banner */}
      {server?.banner && (
        <div className={styles.serverBanner}>
          <img src={server.banner} alt="" />
          <div className={styles.bannerOverlay} />
        </div>
      )}
      
      {/* Boost Progress */}
      {server?.boostLevel !== undefined && (
        <div className={styles.boostProgress}>
          <div className={styles.boostInfo}>
            <span className={styles.boostIcon}>🚀</span>
            <span className={styles.boostLevel}>Level {server.boostLevel}</span>
            <span className={styles.boostCount}>{server.boostCount} Boosts</span>
          </div>
          <div className={styles.boostBar}>
            <div 
              className={styles.boostFill}
              style={{ width: `${(server.boostCount / (server.boostLevel + 1) * 15) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button
          className={styles.quickAction}
          onClick={() => setShowSearchModal(true)}
          title="Search"
        >
          <FiSearch />
          <span>Search</span>
        </button>
        
        {canInviteMembers && (
          <button
            className={styles.quickAction}
            onClick={() => setShowInviteModal(true)}
            title="Invite People"
          >
            <FiUserPlus />
            <span>Invite</span>
          </button>
        )}
        
        <button
          className={styles.quickAction}
          onClick={() => navigate(`/servers/${serverId}/members`)}
          title="Member List"
        >
          <FiUsers />
          <span>{onlineMembers}/{totalMembers}</span>
        </button>
      </div>
      
      {/* Channel List */}
      <DragDropContext 
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        <div className={`${styles.channelList} ${isDragging ? styles.dragging : ''}`}>
          {/* Channels without category */}
          {filteredChannels['uncategorized'] && (
            <Droppable droppableId="uncategorized">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${styles.category} ${snapshot.isDraggingOver ? styles.dragOver : ''}`}
                >
                  <ChannelList
                    channels={filteredChannels['uncategorized']}
                    serverId={serverId}
                    currentChannelId={channelId}
                    canManageChannels={canManageChannels}
                    voiceStates={voiceStates}
                    isDraggable={canManageChannels}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
          
          {/* Categorized channels */}
          {categories.map(category => {
            const categoryChannels = filteredChannels[category.id];
            if (!categoryChannels || categoryChannels.length === 0) return null;
            
            const isCollapsed = collapsedCategories.has(category.id);
            const hasUnread = categoryChannels.some(ch => unreadChannels.includes(ch.id));
            
            return (
              <div key={category.id} className={styles.categoryContainer}>
                <div 
                  className={styles.categoryHeader}
                  onClick={() => toggleCategory(category.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    showContextMenu(e, [
                      {
                        label: 'Create Channel',
                        onClick: () => setShowCreateModal(true),
                        disabled: !canManageChannels
                      },
                      {
                        label: 'Edit Category',
                        onClick: () => dispatch({
                          type: 'ui/showModal',
                          payload: { type: 'editCategory', category }
                        }),
                        disabled: !canManageChannels
                      },
                      {
                        label: 'Delete Category',
                        onClick: () => dispatch({
                          type: 'ui/showModal',
                          payload: { type: 'deleteCategory', category }
                        }),
                        disabled: !canManageChannels,
                        danger: true
                      }
                    ]);
                  }}
                >
                  <span className={styles.categoryToggle}>
                    {isCollapsed ? <FiChevronRight /> : <FiChevronDown />}
                  </span>
                  <span className={styles.categoryName}>
                    {category.name.toUpperCase()}
                  </span>
                  {hasUnread && <span className={styles.unreadIndicator} />}
                  
                  {canManageChannels && (
                    <button
                      className={styles.addChannelButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCreateModal(true);
                      }}
                    >
                      <FiPlus />
                    </button>
                  )}
                </div>
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Droppable droppableId={category.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`${styles.category} ${snapshot.isDraggingOver ? styles.dragOver : ''}`}
                          >
                            <ChannelList
                              channels={categoryChannels}
                              serverId={serverId}
                              currentChannelId={channelId}
                              canManageChannels={canManageChannels}
                              voiceStates={voiceStates}
                              isDraggable={canManageChannels}
                            />
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          
          {/* Create channel prompt for empty servers */}
          {Object.keys(filteredChannels).length === 0 && !searchQuery && (
            <div className={styles.emptyState}>
              <p>No channels yet</p>
              {canManageChannels && (
                <button
                  className={styles.createFirstChannel}
                  onClick={() => setShowCreateModal(true)}
                >
                  <FiPlus />
                  Create a channel
                </button>
              )}
            </div>
          )}
          
          {/* No search results */}
          {Object.keys(filteredChannels).length === 0 && searchQuery && (
            <div className={styles.noResults}>
              <p>No channels found</p>
              <span>Try a different search term</span>
            </div>
          )}
        </div>
      </DragDropContext>
      
      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateChannelModal
            serverId={serverId}
            onClose={() => setShowCreateModal(false)}
          />
        )}
        
        {showInviteModal && (
          <InviteModal
            serverId={serverId}
            onClose={() => setShowInviteModal(false)}
          />
        )}
        
        {showSettingsModal && (
          <ServerSettings
            server={server}
            onClose={() => setShowSettingsModal(false)}
          />
        )}
        
        {showSearchModal && (
          <SearchModal
            serverId={serverId}
            onClose={() => setShowSearchModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChannelSidebar;