import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMic,
  FiMicOff,
  FiHeadphones,
  FiVideo,
  FiVideoOff,
  FiMonitor,
  FiPhoneOff,
  FiSettings,
  FiVolume2,
  FiActivity,
  FiWifi,
  FiWifiOff,
  FiChevronUp
} from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

// Components
import AudioSettings from './AudioSettings';
import VideoSettings from './VideoSettings';

// Hooks
import { useHotkeys } from '../../hooks/useHotkeys';

// Utils
import { playSound } from '../../utils/audio';

// Styles
import styles from './VoiceControls.module.css';

const VoiceControls = ({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  isDeafened = false,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleDeafen,
  onLeave,
  connectionQuality,
  stats = {}
}) => {
  const controlsRef = useRef(null);
  
  // Local state
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showVideoSettings, setShowVideoSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Keyboard shortcuts
  useHotkeys([
    ['ctrl+shift+m', () => handleToggleAudio()],
    ['ctrl+shift+v', () => handleToggleVideo()],
    ['ctrl+shift+d', () => handleToggleDeafen()],
    ['ctrl+shift+s', () => handleToggleScreenShare()],
    ['ctrl+shift+h', () => handleLeave()]
  ]);
  
  // Monitor audio level
  useEffect(() => {
    if (!isAudioEnabled) {
      setAudioLevel(0);
      return;
    }
    
    // This would connect to actual audio level monitoring
    const interval = setInterval(() => {
      // Simulate audio level
      setAudioLevel(Math.random() * 100);
    }, 100);
    
    return () => clearInterval(interval);
  }, [isAudioEnabled]);
  
  // Handlers
  const handleToggleAudio = () => {
    onToggleAudio();
    playSound(isAudioEnabled ? 'mute' : 'unmute');
  };
  
  const handleToggleVideo = () => {
    if (onToggleVideo) {
      onToggleVideo();
      playSound('toggle');
    }
  };
  
  const handleToggleScreenShare = () => {
    if (onToggleScreenShare) {
      onToggleScreenShare();
      playSound('toggle');
    }
  };
  
  const handleToggleDeafen = () => {
    if (onToggleDeafen) {
      onToggleDeafen();
      playSound('toggle');
    }
  };
  
  const handleLeave = () => {
    if (confirm('Are you sure you want to leave the voice channel?')) {
      onLeave();
      playSound('leave');
    }
  };
  
  // Get connection quality color
  const getQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return '#43b581';
      case 'good': return '#faa61a';
      case 'poor': return '#f04747';
      default: return '#747f8d';
    }
  };
  
  // Get connection icon
  const getConnectionIcon = () => {
    if (connectionQuality === 'disconnected') return <FiWifiOff />;
    return <FiWifi />;
  };
  
  if (isMinimized) {
    return (
      <motion.div
        className={styles.minimizedControls}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
      >
        <button
          className={styles.expandButton}
          onClick={() => setIsMinimized(false)}
        >
          <FiChevronUp />
        </button>
        
        <div className={styles.minimizedButtons}>
          <button
            className={`${styles.controlButton} ${!isAudioEnabled ? styles.muted : ''}`}
            onClick={handleToggleAudio}
          >
            {isAudioEnabled ? <FiMic /> : <FiMicOff />}
          </button>
          
          <button
            className={styles.leaveButton}
            onClick={handleLeave}
          >
            <FiPhoneOff />
          </button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      ref={controlsRef}
      className={styles.voiceControls}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
    >
      {/* Audio level indicator */}
      <div className={styles.audioLevelContainer}>
        <div 
          className={styles.audioLevel}
          style={{
            width: `${audioLevel}%`,
            backgroundColor: audioLevel > 80 ? '#f04747' : '#43b581'
          }}
        />
      </div>
      
      <div className={styles.controlsContent}>
        {/* Left section - Main controls */}
        <div className={styles.mainControls}>
          {/* Microphone */}
          <div className={styles.controlGroup}>
            <button
              className={`${styles.controlButton} ${!isAudioEnabled ? styles.muted : ''}`}
              onClick={handleToggleAudio}
              data-tooltip-id="mic-tooltip"
              data-tooltip-content={isAudioEnabled ? 'Mute (Ctrl+Shift+M)' : 'Unmute (Ctrl+Shift+M)'}
            >
              {isAudioEnabled ? <FiMic /> : <FiMicOff />}
            </button>
            
            <button
              className={styles.settingsButton}
              onClick={() => setShowAudioSettings(!showAudioSettings)}
              data-tooltip-id="audio-settings-tooltip"
              data-tooltip-content="Audio Settings"
            >
              <FiSettings />
            </button>
          </div>
          
          {/* Deafen */}
          <button
            className={`${styles.controlButton} ${isDeafened ? styles.deafened : ''}`}
            onClick={handleToggleDeafen}
            data-tooltip-id="deafen-tooltip"
            data-tooltip-content={isDeafened ? 'Undeafen (Ctrl+Shift+D)' : 'Deafen (Ctrl+Shift+D)'}
          >
            <FiHeadphones />
          </button>
          
          {/* Video */}
          <div className={styles.controlGroup}>
            <button
              className={`${styles.controlButton} ${!isVideoEnabled ? styles.disabled : ''}`}
              onClick={handleToggleVideo}
              data-tooltip-id="video-tooltip"
              data-tooltip-content={isVideoEnabled ? 'Turn Off Camera (Ctrl+Shift+V)' : 'Turn On Camera (Ctrl+Shift+V)'}
            >
              {isVideoEnabled ? <FiVideo /> : <FiVideoOff />}
            </button>
            
            <button
              className={styles.settingsButton}
              onClick={() => setShowVideoSettings(!showVideoSettings)}
              data-tooltip-id="video-settings-tooltip"
              data-tooltip-content="Video Settings"
            >
              <FiSettings />
            </button>
          </div>
          
          {/* Screen Share */}
          <button
            className={`${styles.controlButton} ${isScreenSharing ? styles.active : ''}`}
            onClick={handleToggleScreenShare}
            data-tooltip-id="screen-tooltip"
            data-tooltip-content={isScreenSharing ? 'Stop Sharing (Ctrl+Shift+S)' : 'Share Screen (Ctrl+Shift+S)'}
          >
            <FiMonitor />
          </button>
          
          {/* Leave */}
          <button
            className={styles.leaveButton}
            onClick={handleLeave}
            data-tooltip-id="leave-tooltip"
            data-tooltip-content="Leave Voice (Ctrl+Shift+H)"
          >
            <FiPhoneOff />
          </button>
        </div>
        
        {/* Center section - Status */}
        <div className={styles.statusSection}>
          <div className={styles.connectionStatus}>
            <span 
              className={styles.connectionIcon}
              style={{ color: getQualityColor() }}
            >
              {getConnectionIcon()}
            </span>
            <span className={styles.connectionText}>
              {connectionQuality || 'Connecting...'}
            </span>
          </div>
          
          {/* Stats button */}
          <button
            className={styles.statsButton}
            onClick={() => setShowStats(!showStats)}
            data-tooltip-id="stats-tooltip"
            data-tooltip-content="Connection Stats"
          >
            <FiActivity />
          </button>
        </div>
        
        {/* Right section - Additional controls */}
        <div className={styles.additionalControls}>
          {/* Volume control */}
          <div className={styles.volumeControl}>
            <FiVolume2 />
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="100"
              className={styles.volumeSlider}
              data-tooltip-id="volume-tooltip"
              data-tooltip-content="Output Volume"
            />
          </div>
          
          {/* Minimize button */}
          <button
            className={styles.minimizeButton}
            onClick={() => setIsMinimized(true)}
            data-tooltip-id="minimize-tooltip"
            data-tooltip-content="Minimize Controls"
          >
            <FiChevronUp style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      </div>
      
      {/* Settings panels */}
      <AnimatePresence>
        {showAudioSettings && (
          <motion.div
            className={styles.settingsPanel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <AudioSettings onClose={() => setShowAudioSettings(false)} />
          </motion.div>
        )}
        
        {showVideoSettings && (
          <motion.div
            className={styles.settingsPanel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <VideoSettings onClose={() => setShowVideoSettings(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Stats overlay */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            className={styles.statsOverlay}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <h4>Connection Statistics</h4>
            <div className={styles.statsList}>
              <div className={styles.stat}>
                <span>Ping:</span>
                <span>{stats.ping || 0}ms</span>
              </div>
              <div className={styles.stat}>
                <span>Packet Loss:</span>
                <span>{stats.packetLoss || 0}%</span>
              </div>
              <div className={styles.stat}>
                <span>Bitrate:</span>
                <span>{stats.bitrate || 0} kbps</span>
              </div>
              <div className={styles.stat}>
                <span>Codec:</span>
                <span>{stats.codec || 'opus'}</span>
              </div>
              <div className={styles.stat}>
                <span>Resolution:</span>
                <span>{stats.resolution || 'N/A'}</span>
              </div>
              <div className={styles.stat}>
                <span>FPS:</span>
                <span>{stats.fps || 'N/A'}</span>
              </div>
            </div>
            <button
              className={styles.closeStats}
              onClick={() => setShowStats(false)}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tooltips */}
      <Tooltip id="mic-tooltip" />
      <Tooltip id="audio-settings-tooltip" />
      <Tooltip id="deafen-tooltip" />
      <Tooltip id="video-tooltip" />
      <Tooltip id="video-settings-tooltip" />
      <Tooltip id="screen-tooltip" />
      <Tooltip id="leave-tooltip" />
      <Tooltip id="stats-tooltip" />
      <Tooltip id="volume-tooltip" />
      <Tooltip id="minimize-tooltip" />
    </motion.div>
  );
};

export default VoiceControls;