import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMic,
  FiMicOff,
  FiHeadphones,
  FiSettings,
  FiVolume2,
  FiVolumeX,
  FiPhoneOff,
  FiVideo,
  FiVideoOff,
  FiMonitor,
  FiCopy,
  FiUser,
  FiWifi,
  FiWifiOff
} from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

// Components
import StatusSelector from '../User/StatusSelector';
import VoiceSettings from '../Voice/VoiceSettings';

// Hooks
import { useVoice } from '../../hooks/useVoice';
import { useConnection } from '../../hooks/useConnection';

// Utils
import { formatDuration } from '../../utils/time';
import { copyToClipboard } from '../../utils/clipboard';

// Styles
import styles from './Footer.module.css';

const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const footerRef = useRef(null);
  
  // Redux state
  const { user } = useSelector(state => state.auth);
  const { 
    isConnected: voiceConnected,
    currentChannel: voiceChannel,
    isMuted,
    isDeafened,
    isVideo,
    isScreenSharing,
    connectionQuality,
    ping
  } = useSelector(state => state.voice);
  const { connectionStatus, latency } = useSelector(state => state.connection);
  
  // Local state
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Custom hooks
  const { 
    toggleMute,
    toggleDeafen,
    toggleVideo,
    toggleScreenShare,
    disconnect
  } = useVoice();
  const { isOnline, reconnect } = useConnection();
  
  // Voice timer
  useEffect(() => {
    let interval;
    if (voiceConnected) {
      interval = setInterval(() => {
        setVoiceDuration(prev => prev + 1);
      }, 1000);
    } else {
      setVoiceDuration(0);
    }
    
    return () => clearInterval(interval);
  }, [voiceConnected]);
  
  // Handlers
  const handleMicToggle = () => {
    toggleMute();
    
    // Show notification
    dispatch({
      type: 'notifications/show',
      payload: {
        type: 'info',
        message: isMuted ? 'Microphone unmuted' : 'Microphone muted',
        duration: 2000
      }
    });
  };
  
  const handleDeafenToggle = () => {
    toggleDeafen();
    
    dispatch({
      type: 'notifications/show',
      payload: {
        type: 'info',
        message: isDeafened ? 'Audio undeafened' : 'Audio deafened',
        duration: 2000
      }
    });
  };
  
  const handleVideoToggle = () => {
    toggleVideo();
  };
  
  const handleScreenShareToggle = () => {
    toggleScreenShare();
  };
  
  const handleDisconnect = () => {
    disconnect();
    dispatch({
      type: 'notifications/show',
      payload: {
        type: 'info',
        message: 'Disconnected from voice channel',
        duration: 2000
      }
    });
  };
  
  const handleCopyUserId = () => {
    copyToClipboard(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleUserSettings = () => {
    navigate('/settings/profile');
  };
  
  const handleVoiceSettingsClick = () => {
    setShowVoiceSettings(!showVoiceSettings);
  };
  
  // Connection quality indicator
  const getConnectionQualityIcon = () => {
    if (!isOnline) return <FiWifiOff className={styles.connectionBad} />;
    if (connectionQuality === 'excellent') return <FiWifi className={styles.connectionExcellent} />;
    if (connectionQuality === 'good') return <FiWifi className={styles.connectionGood} />;
    if (connectionQuality === 'poor') return <FiWifi className={styles.connectionPoor} />;
    return <FiWifi className={styles.connectionFair} />;
  };
  
  return (
    <footer ref={footerRef} className={styles.footer}>
      {/* Voice Connection Info */}
      {voiceConnected && voiceChannel && (
        <div className={styles.voiceConnection}>
          <div className={styles.voiceInfo}>
            <div className={styles.voiceStatus}>
              <span className={styles.voiceIndicator} />
              <span className={styles.voiceLabel}>Voice Connected</span>
            </div>
            <div className={styles.voiceChannel}>
              <FiVolume2 className={styles.channelIcon} />
              <span className={styles.channelName}>{voiceChannel.name}</span>
              <span className={styles.voiceDuration}>{formatDuration(voiceDuration)}</span>
            </div>
          </div>
          
          <div className={styles.voiceControls}>
            {/* Connection Quality */}
            <div 
              className={styles.connectionQuality}
              data-tooltip-id="quality-tooltip"
              data-tooltip-content={`Connection: ${connectionQuality} (${ping}ms)`}
            >
              {getConnectionQualityIcon()}
            </div>
            
            {/* Video Toggle */}
            {voiceChannel.type === 'video' && (
              <button
                className={`${styles.controlButton} ${isVideo ? '' : styles.disabled}`}
                onClick={handleVideoToggle}
                data-tooltip-id="video-tooltip"
                data-tooltip-content={isVideo ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideo ? <FiVideo /> : <FiVideoOff />}
              </button>
            )}
            
            {/* Screen Share */}
            <button
              className={`${styles.controlButton} ${isScreenSharing ? styles.active : ''}`}
              onClick={handleScreenShareToggle}
              data-tooltip-id="screen-tooltip"
              data-tooltip-content={isScreenSharing ? 'Stop sharing' : 'Share screen'}
            >
              <FiMonitor />
            </button>
            
            {/* Disconnect */}
            <button
              className={`${styles.controlButton} ${styles.disconnect}`}
              onClick={handleDisconnect}
              data-tooltip-id="disconnect-tooltip"
              data-tooltip-content="Disconnect"
            >
              <FiPhoneOff />
            </button>
          </div>
        </div>
      )}
      
      {/* User Section */}
      <div className={styles.userSection}>
        <button
          className={styles.userInfo}
          onClick={() => setShowStatusMenu(!showStatusMenu)}
        >
          <div className={styles.avatarWrapper}>
            <img 
              src={user?.avatar || '/default-avatar.png'} 
              alt={user?.username}
              className={styles.userAvatar}
            />
            <span 
              className={styles.statusDot} 
              data-status={user?.status || 'offline'}
            />
          </div>
          
          <div className={styles.userDetails}>
            <span className={styles.username}>{user?.username}</span>
            <span className={styles.userStatus}>
              {user?.customStatus || user?.status || 'offline'}
            </span>
          </div>
        </button>
        
        {/* User Controls */}
        <div className={styles.userControls}>
          {/* Mic Toggle */}
          <button
            className={`${styles.controlButton} ${isMuted ? styles.muted : ''}`}
            onClick={handleMicToggle}
            data-tooltip-id="mic-tooltip"
            data-tooltip-content={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <FiMicOff /> : <FiMic />}
          </button>
          
          {/* Deafen Toggle */}
          <button
            className={`${styles.controlButton} ${isDeafened ? styles.deafened : ''}`}
            onClick={handleDeafenToggle}
            data-tooltip-id="deafen-tooltip"
            data-tooltip-content={isDeafened ? 'Undeafen' : 'Deafen'}
          >
            {isDeafened ? <FiVolumeX /> : <FiHeadphones />}
          </button>
          
          {/* Settings */}
          <button
            className={styles.controlButton}
            onClick={handleUserSettings}
            data-tooltip-id="settings-tooltip"
            data-tooltip-content="User Settings"
          >
            <FiSettings />
          </button>
        </div>
      </div>
      
      {/* Connection Status */}
      <div className={styles.connectionStatus}>
        {!isOnline ? (
          <button 
            className={styles.reconnectButton}
            onClick={reconnect}
          >
            <FiWifiOff />
            <span>Reconnect</span>
          </button>
        ) : (
          <div 
            className={styles.connectionInfo}
            data-tooltip-id="connection-tooltip"
            data-tooltip-content={`Latency: ${latency}ms`}
          >
            <FiWifi className={styles.connectionIcon} />
            <span className={styles.latency}>{latency}ms</span>
          </div>
        )}
      </div>
      
      {/* User ID Copy */}
      <div className={styles.userIdSection}>
        <button
          className={styles.copyButton}
          onClick={handleCopyUserId}
          data-tooltip-id="copy-tooltip"
          data-tooltip-content={copied ? 'Copied!' : `Copy User ID: ${user?.id}`}
        >
          {copied ? '✓' : <FiCopy />}
        </button>
      </div>
      
      {/* Modals */}
      <AnimatePresence>
        {showStatusMenu && (
          <motion.div
            className={styles.statusMenu}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <StatusSelector onClose={() => setShowStatusMenu(false)} />
          </motion.div>
        )}
        
        {showVoiceSettings && (
          <motion.div
            className={styles.voiceSettingsModal}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <VoiceSettings onClose={() => setShowVoiceSettings(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tooltips */}
      <Tooltip id="quality-tooltip" />
      <Tooltip id="video-tooltip" />
      <Tooltip id="screen-tooltip" />
      <Tooltip id="disconnect-tooltip" />
      <Tooltip id="mic-tooltip" />
      <Tooltip id="deafen-tooltip" />
      <Tooltip id="settings-tooltip" />
      <Tooltip id="connection-tooltip" />
      <Tooltip id="copy-tooltip" />
    </footer>
  );
};

export default Footer;