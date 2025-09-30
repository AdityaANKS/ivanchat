import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHash,
  FiVolume2,
  FiLock,
  FiVideo,
  FiMic,
  FiMicOff,
  FiSettings,
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiBell,
  FiBellOff,
  FiCopy,
  FiMessageSquare,
  FiUsers
} from 'react-icons/fi';

// Hooks
import { useContextMenu } from '../../hooks/useContextMenu';
import { usePermissions } from '../../hooks/usePermissions';

// Utils
import { playSound } from '../../utils/audio';
import { copyToClipboard } from '../../utils/clipboard';

// Styles
import styles from './ChannelItem.module.css';

const ChannelItem = ({
  channel,
  serverId,
  isActive,
  isDragging,
  canManage,
  voiceStates = []
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { user } = useSelector(state => state.auth);
  const { unreadChannels, mentionCounts } = useSelector(state => state.notifications);
  const { mutedChannels } = useSelector(state => state.settings);
  const { currentVoiceChannelId, connectedUsers } = useSelector(state => state.voice);
  
  // Local state
  const [isHovered, setIsHovered] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Hooks
  const { showContextMenu } = useContextMenu();
  const { canViewChannel, canConnect } = usePermissions(serverId);
  
  // Computed properties
  const hasUnread = unreadChannels.includes(channel.id);
  const mentions = mentionCounts[channel.id] || 0;
  const isMuted = mutedChannels.includes(channel.id);
  const isVoiceChannel = channel.type === 'voice' || channel.type === 'stage';
  const isTextChannel = channel.type === 'text' || channel.type === 'announcement';
  const isPrivate = channel.private || channel.type === 'private';
  const isLocked = !canViewChannel(channel.id);
  const isConnected = currentVoiceChannelId === channel.id;
  const userCount = voiceStates?.length || 0;
  const userLimit = channel.userLimit || 0;
  const isFull = userLimit > 0 && userCount >= userLimit;
  
  // Channel icon
  const getChannelIcon = () => {
    if (isLocked) return <FiLock />;
    
    switch (channel.type) {
      case 'voice':
        return <FiVolume2 />;
      case 'stage':
        return <FiMic />;
      case 'video':
        return <FiVideo />;
      case 'announcement':
        return <FiBell />;
      case 'forum':
        return <FiMessageSquare />;
      default:
        return <FiHash />;
    }
  };
  
  // Handle channel click
  const handleClick = useCallback(() => {
    if (isLocked) {
      dispatch({
        type: 'notifications/show',
        payload: {
          type: 'error',
          message: 'You do not have permission to view this channel'
        }
      });
      return;
    }
    
    if (isTextChannel || channel.type === 'forum') {
      navigate(`/channels/${serverId}/${channel.id}`);
      dispatch({ type: 'channels/setCurrentChannel', payload: channel });
      playSound('navigate');
    } else if (isVoiceChannel) {
      if (isConnected) {
        // Disconnect if already connected
        dispatch({ type: 'voice/disconnect' });
      } else if (canConnect && !isFull) {
        // Connect to voice channel
        dispatch({ type: 'voice/connect', payload: channel });
        playSound('join');
      }
    }
  }, [
    isLocked,
    isTextChannel,
    isVoiceChannel,
    isConnected,
    canConnect,
    isFull,
    channel,
    serverId,
    navigate,
    dispatch
  ]);
  
  // Handle context menu
  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    
    const menuItems = [];
    
    // Mark as read
    if (hasUnread) {
      menuItems.push({
        label: 'Mark as Read',
        onClick: () => dispatch({ 
          type: 'notifications/markChannelRead', 
          payload: channel.id 
        })
      });
    }
    
    // Mute/Unmute
    menuItems.push({
      label: isMuted ? 'Unmute Channel' : 'Mute Channel',
      icon: isMuted ? <FiBell /> : <FiBellOff />,
      onClick: () => dispatch({ 
        type: 'settings/toggleMuteChannel', 
        payload: channel.id 
      })
    });
    
    menuItems.push({ type: 'separator' });
    
    // Invite to channel
    if (isVoiceChannel && canManage) {
      menuItems.push({
        label: 'Invite to Channel',
        icon: <FiUserPlus />,
        onClick: () => dispatch({
          type: 'ui/showModal',
          payload: { type: 'inviteToChannel', channel }
        })
      });
    }
    
    // Copy channel ID
    menuItems.push({
      label: 'Copy Channel ID',
      icon: <FiCopy />,
      onClick: () => {
        copyToClipboard(channel.id);
        dispatch({
          type: 'notifications/show',
          payload: { type: 'success', message: 'Channel ID copied' }
        });
      }
    });
    
    // Channel settings
    if (canManage) {
      menuItems.push({ type: 'separator' });
      
      menuItems.push({
        label: 'Edit Channel',
        icon: <FiEdit2 />,
        onClick: () => dispatch({
          type: 'ui/showModal',
          payload: { type: 'editChannel', channel }
        })
      });
      
      menuItems.push({
        label: 'Channel Settings',
        icon: <FiSettings />,
        onClick: () => navigate(`/channels/${serverId}/${channel.id}/settings`)
      });
      
      menuItems.push({
        label: 'Delete Channel',
        icon: <FiTrash2 />,
        onClick: () => dispatch({
          type: 'ui/showModal',
          payload: { type: 'deleteChannel', channel }
        }),
        danger: true
      });
    }
    
    showContextMenu(event, menuItems);
  }, [
    hasUnread,
    isMuted,
    isVoiceChannel,
    canManage,
    channel,
    serverId,
    dispatch,
    navigate,
    showContextMenu
  ]);
  
  return (
    <motion.div
      className={`
        ${styles.channelItem}
        ${isActive ? styles.active : ''}
        ${hasUnread ? styles.unread : ''}
        ${isDragging ? styles.dragging : ''}
        ${isLocked ? styles.locked : ''}
        ${isMuted ? styles.muted : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Channel icon */}
      <span className={styles.channelIcon}>
        {getChannelIcon()}
      </span>
      
      {/* Channel name */}
      <span className={styles.channelName}>
        {channel.name}
      </span>
      
      {/* Channel badges */}
      <div className={styles.channelBadges}>
        {/* NSFW badge */}
        {channel.nsfw && (
          <span className={styles.nsfwBadge}>NSFW</span>
        )}
        
        {/* New badge */}
        {channel.isNew && (
          <span className={styles.newBadge}>NEW</span>
        )}
        
        {/* Mention count */}
        {mentions > 0 && (
          <span className={styles.mentionBadge}>
            {mentions > 99 ? '99+' : mentions}
          </span>
        )}
        
        {/* Voice channel user count */}
        {isVoiceChannel && userCount > 0 && (
          <span className={styles.userCount}>
            {userCount}
            {userLimit > 0 && `/${userLimit}`}
          </span>
        )}
      </div>
      
      {/* Channel actions (shown on hover) */}
      <AnimatePresence>
        {isHovered && !isDragging && (
          <motion.div
            className={styles.channelActions}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isTextChannel && (
              <button
                className={styles.actionButton}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({
                    type: 'ui/showModal',
                    payload: { type: 'createInvite', channelId: channel.id }
                  });
                }}
                title="Create Invite"
              >
                <FiUserPlus />
              </button>
            )}
            
            {canManage && (
              <button
                className={styles.actionButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(true);
                }}
                title="Edit Channel"
              >
                <FiSettings />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Voice channel users */}
      {isVoiceChannel && voiceStates && voiceStates.length > 0 && (
        <div className={styles.voiceUsers}>
          {voiceStates.map(state => (
            <div key={state.userId} className={styles.voiceUser}>
              <img
                src={state.user?.avatar || '/default-avatar.png'}
                alt=""
                className={styles.voiceUserAvatar}
              />
              <span className={styles.voiceUserName}>
                {state.user?.nickname || state.user?.username}
              </span>
              <div className={styles.voiceUserStatus}>
                {state.selfMute && <FiMicOff className={styles.mutedIcon} />}
                {state.selfDeaf && <FiVolume2 className={styles.deafenedIcon} />}
                {state.streaming && <span className={styles.streamingIcon}>LIVE</span>}
                {state.video && <FiVideo className={styles.videoIcon} />}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Stage channel speakers */}
      {channel.type === 'stage' && channel.speakers && (
        <div className={styles.stageSpeakers}>
          <div className={styles.speakersHeader}>
            <FiUsers />
            <span>{channel.speakers.length} speaking</span>
          </div>
          {channel.speakers.slice(0, 3).map(speaker => (
            <div key={speaker.id} className={styles.speaker}>
              <img src={speaker.avatar} alt="" />
              <span>{speaker.username}</span>
            </div>
          ))}
          {channel.speakers.length > 3 && (
            <span className={styles.moreSpeakers}>
              +{channel.speakers.length - 3} more
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ChannelItem;