import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../../config/env';
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiMonitor,
  FiMaximize2,
  FiMinimize2,
  FiGrid,
  FiUser,
  FiVolume2,
  FiSettings,
  FiX,
  FiUserPlus,
  FiMessageSquare
} from 'react-icons/fi';

// Components
import VoiceControls from './VoiceControls';
import SpatialAudio from './SpatialAudio';
import VideoGrid from './VideoGrid';
import ScreenShare from './ScreenShare';
import ParticipantsList from './ParticipantsList';
import VoiceSettings from './VoiceSettings';
import VoiceOverlay from './VoiceOverlay';

// Hooks
import { useWebRTC } from '../../hooks/useWebRTC';
import { useMediaStream } from '../../hooks/useMediaStream';
import { useVoiceActivity } from '../../hooks/useVoiceActivity';
import { usePermissions } from '../../hooks/usePermissions';

// Services
import { voiceService } from '../../services/voice';

// Utils
import { playSound } from '../../utils/audio';

// Styles
import styles from './VoiceChannel.module.css';

const VoiceChannel = ({ channelId, serverId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  // Redux state
  const { user } = useSelector(state => state.auth);
  const { 
    currentChannel,
    participants,
    localStream,
    remoteStreams,
    connectionState,
    connectionQuality,
    speakingUsers
  } = useSelector(state => state.voice);
  const { settings } = useSelector(state => state.user);
  
  // Local state
  const [viewMode, setViewMode] = useState('grid'); // grid, speaker, focus
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [pinnedUser, setPinnedUser] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [spatialAudioEnabled, setSpatialAudioEnabled] = useState(settings.spatialAudio);
  const [noiseSuppression, setNoiseSuppression] = useState(settings.noiseSuppression);
  const [stats, setStats] = useState({});
  
  // Permissions
  const { canSpeak, canVideo, canStream, canMoveMembers } = usePermissions(serverId);
  
  // WebRTC hooks
  const {
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    setVideoQuality,
    muteParticipant,
    moveParticipant
  } = useWebRTC(channelId);
  
  const {
    localAudioStream,
    localVideoStream,
    isAudioEnabled,
    isVideoEnabled,
    error: mediaError
  } = useMediaStream({
    audio: {
      echoCancellation: true,
      noiseSuppression: noiseSuppression,
      autoGainControl: true
    },
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 }
  
    }
  });
  
  const { isSpeaking, volume } = useVoiceActivity(localAudioStream);
  

  // Use config to control voice feature
  useEffect(() => {
    if (config?.features && config.features.voiceChat === false) {
      if (config.features.debug) {
        // eslint-disable-next-line no-console
        console.log('Voice chat is disabled by config');
      }
      return;
    }
    if (channelId && !currentChannel) {
      joinChannel(channelId);
      playSound('join');
    }
    return () => {
      if (currentChannel) {
        leaveChannel();
        playSound('leave');
      }
    };
  }, [channelId, currentChannel, joinChannel, leaveChannel]);

  // Use config for ICE servers (WebRTC)
  const getIceServers = () => {
    const iceServers = [];
    if (config?.webrtc?.stunServer) {
      iceServers.push({ urls: config.webrtc.stunServer });
    }
    if (config?.webrtc?.turnServer) {
      iceServers.push({
        urls: config.webrtc.turnServer,
        username: config.webrtc.turnUsername,
        credential: config.webrtc.turnPassword,
      });
    }
    return iceServers;
  };
  
  // Update connection stats
  useEffect(() => {
    const interval = setInterval(async () => {
      if (currentChannel) {
        const newStats = await voiceService.getConnectionStats();
        setStats(newStats);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentChannel]);
  
  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);
  
  // Handle view mode change
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    
    // Update layout preferences
    dispatch({
      type: 'user/updateSettings',
      payload: { voiceViewMode: mode }
    });
  }, [dispatch]);
  
  // Handle participant actions
  const handleMuteParticipant = useCallback((userId) => {
    if (canMoveMembers) {
      muteParticipant(userId);
      dispatch({
        type: 'notifications/show',
        payload: {
          type: 'info',
          message: `Muted participant`
        }
      });
    }
  }, [canMoveMembers, muteParticipant, dispatch]);
  
  const handleMoveParticipant = useCallback((userId, targetChannelId) => {
    if (canMoveMembers) {
      moveParticipant(userId, targetChannelId);
    }
  }, [canMoveMembers, moveParticipant]);
  
  const handlePinUser = useCallback((userId) => {
    setPinnedUser(userId === pinnedUser ? null : userId);
  }, [pinnedUser]);
  
  // Handle quality change
  const handleQualityChange = useCallback((quality) => {
    setSelectedQuality(quality);
    setVideoQuality(quality);
  }, [setVideoQuality]);
  
  // Get active speaker
  const activeSpeaker = speakingUsers[0] || null;
  
  // Get video streams
  const videoParticipants = participants.filter(p => 
    remoteStreams[p.userId]?.video || (p.userId === user.id && isVideoEnabled)
  );
  
  // Screen share stream
  const screenShareStream = Object.entries(remoteStreams).find(
    ([userId, stream]) => stream.screen
  );
  

  // Show disabled message if voiceChat is off in config
  if (config?.features && config.features.voiceChat === false) {
    return (
      <div className={styles.connecting}>
        <div className={styles.spinner} />
        <p>Voice chat is disabled by configuration.</p>
      </div>
    );
  }
  if (!currentChannel) {
    return (
      <div className={styles.connecting}>
        <div className={styles.spinner} />
        <p>Connecting to voice channel...</p>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className={`${styles.voiceChannel} ${isFullscreen ? styles.fullscreen : ''}`}
    >
  {/* Header (shows config-based feature toggles) */}
      <header className={styles.header}>
        <div className={styles.channelInfo}>
          <FiVolume2 className={styles.channelIcon} />
          <h2>{currentChannel.name}</h2>
          <span className={styles.participantCount}>
            {participants.length} {participants.length === 1 ? 'participant' : 'participants'}
          </span>
          {/* Show config-based feature status */}
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            Voice: {String(!!config?.features?.voiceChat)} | Video: {String(!!config?.features?.videoChat)} | ScreenShare: {String(!!config?.features?.screenShare)}
          </div>
        </div>
        
        <div className={styles.headerActions}>
          {/* View mode selector (config.features.screenShare, videoChat) */}
          <div className={styles.viewModeSelector}>
            <button
              className={`${styles.viewModeButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('grid')}
              title="Grid View"
            >
              <FiGrid />
            </button>
            <button
              className={`${styles.viewModeButton} ${viewMode === 'speaker' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('speaker')}
              title="Speaker View"
            >
              <FiUser />
            </button>
            <button
              className={`${styles.viewModeButton} ${viewMode === 'focus' ? styles.active : ''}`}
              onClick={() => handleViewModeChange('focus')}
              title="Focus View"
            >
              <FiMaximize2 />
            </button>
          </div>

          {/* Audio/Mic/Camera/Screen Controls */}
          <button
            className={styles.headerButton}
            onClick={toggleMute}
            title={isAudioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isAudioEnabled ? <FiMic /> : <FiMicOff />}
          </button>
          <button
            className={styles.headerButton}
            onClick={toggleVideo}
            title={isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {isVideoEnabled ? <FiVideo /> : <FiVideoOff />}
          </button>
          <button
            className={styles.headerButton}
            onClick={toggleScreenShare}
            title={!!screenShareStream ? 'Stop Screen Share' : 'Start Screen Share'}
          >
            <FiMonitor />
          </button>
          
          {/* Toggle participants */}
          <button
            className={`${styles.headerButton} ${showParticipants ? styles.active : ''}`}
            onClick={() => setShowParticipants(!showParticipants)}
            title="Toggle Participants"
          >
            <FiUser />
          </button>
          
          {/* Toggle chat */}
          <button
            className={`${styles.headerButton} ${showChat ? styles.active : ''}`}
            onClick={() => setShowChat(!showChat)}
            title="Toggle Chat"
          >
            <FiMessageSquare />
          </button>
          
          {/* Invite */}
          {config?.features?.inviteToVoice !== false && (
            <button
              className={styles.headerButton}
              onClick={() => dispatch({
                type: 'ui/showModal',
                payload: { type: 'inviteToVoice', channelId }
              })}
              title="Invite to Voice"
            >
              <FiUserPlus />
            </button>
          )}
          
          {/* Settings */}
          {config?.features?.voiceSettings !== false && (
            <button
              className={styles.headerButton}
              onClick={() => setShowSettings(!showSettings)}
              title="Voice Settings"
            >
              <FiSettings />
            </button>
          )}
          
          {/* Fullscreen */}
          {config?.features?.fullscreen !== false && (
            <button
              className={styles.headerButton}
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
            </button>
          )}
        </div>
      </header>
      
      {/* Main content area */}
      <div className={styles.content}>
        {/* Video/Screen area */}
        <div className={styles.mainArea}>
          {/* Screen share display */}
          {screenShareStream && (
            <div className={styles.screenShareContainer}>
              <ScreenShare
                stream={screenShareStream[1]}
                userId={screenShareStream[0]}
                onClose={() => {/* Handle close */}}
              />
            </div>
          )}
          
          {/* Video grid */}
          {!screenShareStream && videoParticipants.length > 0 && (
            <VideoGrid
              participants={videoParticipants}
              viewMode={viewMode}
              pinnedUser={pinnedUser}
              localStream={localVideoStream}
              remoteStreams={remoteStreams}
              speakingUsers={speakingUsers}
              onPinUser={handlePinUser}
            />
          )}
          
          {/* No video placeholder */}
          {!screenShareStream && videoParticipants.length === 0 && (
            <div className={styles.noVideo}>
              <div className={styles.audioVisualization}>
                {participants.map(participant => (
                  <div
                    key={participant.userId}
                    className={`
                      ${styles.audioParticipant}
                      ${speakingUsers.includes(participant.userId) ? styles.speaking : ''}
                    `}
                  >
                    <img
                      src={participant.avatar || '/default-avatar.png'}
                      alt={participant.username}
                      className={styles.participantAvatar}
                    />
                    <span className={styles.participantName}>
                      {participant.username}
                    </span>
                    {participant.userId !== user.id && (
                      <div className={styles.participantIndicators}>
                        {participant.muted && <FiMicOff />}
                        {participant.deafened && <FiVolume2 />}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Spatial audio visualization */}
          {spatialAudioEnabled && (
            <div className={styles.spatialAudioContainer}>
              <SpatialAudio
                participants={participants}
                localUserId={user.id}
                remoteStreams={remoteStreams}
                onPositionChange={(userId, position) => {
                  dispatch({
                    type: 'voice/updateParticipantPosition',
                    payload: { userId, position }
                  });
                }}
              />
            </div>
          )}
        </div>
        
        {/* Participants sidebar */}
        <AnimatePresence>
          {showParticipants && (
            <motion.aside
              className={styles.participantsSidebar}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
            >
              <ParticipantsList
                participants={participants}
                currentUserId={user.id}
                speakingUsers={speakingUsers}
                canManage={canMoveMembers}
                onMute={handleMuteParticipant}
                onMove={handleMoveParticipant}
                onKick={(userId) => {
                  dispatch({
                    type: 'voice/kickParticipant',
                    payload: userId
                  });
                }}
              />
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Chat sidebar */}
        <AnimatePresence>
          {showChat && (
            <motion.aside
              className={styles.chatSidebar}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
            >
              <button
                className={styles.closeButton}
                onClick={() => setShowChat(false)}
                title="Close Chat"
                style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}
              >
                <FiX size={22} />
              </button>
              {/* Voice chat component would go here */}
              <div className={styles.voiceChat}>
                <h3>Voice Chat</h3>
                {/* Chat messages */}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
      
      {/* Voice controls */}
      <VoiceControls
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        isScreenSharing={!!screenShareStream}
        onToggleAudio={toggleMute}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onLeave={() => {
          leaveChannel();
          navigate(`/channels/${serverId}`);
        }}
        connectionQuality={connectionQuality}
        stats={stats}
      />
      
      {/* Settings modal */}
      <AnimatePresence>
        {showSettings && (
          <div className={styles.settingsModalWrapper}>
            <button
              className={styles.closeButton}
              onClick={() => setShowSettings(false)}
              title="Close Settings"
              style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}
            >
              <FiX size={22} />
            </button>
            <VoiceSettings
              onClose={() => setShowSettings(false)}
              spatialAudioEnabled={spatialAudioEnabled}
              onSpatialAudioChange={setSpatialAudioEnabled}
              noiseSuppression={noiseSuppression}
              onNoiseSuppressionChange={setNoiseSuppression}
              quality={selectedQuality}
              onQualityChange={handleQualityChange}
            />
          </div>
        )}
      </AnimatePresence>
      
      {/* Connection status overlay */}
      {connectionState !== 'connected' && (
        <VoiceOverlay
          state={connectionState}
          onRetry={() => joinChannel(channelId)}
        />
      )}
    </div>
  );
};

export default VoiceChannel;