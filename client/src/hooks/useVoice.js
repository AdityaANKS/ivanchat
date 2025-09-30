import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';

export const useVoice = (channelId = null) => {
  const { user } = useAuth();
  const { socket, emit } = useSocket();
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [volume, setVolume] = useState(100);
  const [participants, setParticipants] = useState([]);
  const [activeStream, setActiveStream] = useState(null);
  const [error, setError] = useState(null);
  const [audioQuality, setAudioQuality] = useState('high');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef(new Map());
  const remoteStreamsRef = useRef(new Map());
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // WebRTC configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      // Add TURN servers for better connectivity
      {
        urls: 'turn:turn.example.com:3478',
        username: 'user',
        credential: 'pass'
      }
    ],
    iceCandidatePoolSize: 10
  };

  // Audio constraints based on quality setting
  const getAudioConstraints = useCallback(() => {
    const constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000
      },
      video: false
    };
    
    switch (audioQuality) {
      case 'low':
        constraints.audio.sampleRate = 16000;
        break;
      case 'medium':
        constraints.audio.sampleRate = 32000;
        break;
      case 'high':
      default:
        constraints.audio.sampleRate = 48000;
    }
    
    return constraints;
  }, [audioQuality]);

  // Connect to voice channel
  const connect = useCallback(async (channelId) => {
    if (isConnected || isConnecting) return;
    
    try {
      setIsConnecting(true);
      setError(null);
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia(getAudioConstraints());
      localStreamRef.current = stream;
      setActiveStream(stream);
      
      // Initialize audio context for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      // Join voice channel via socket
      emit('voice:join', { channelId, userId: user.id }, (response) => {
        if (response.error) {
          throw new Error(response.error);
        }
        
        setParticipants(response.participants || []);
        setIsConnected(true);
        setIsConnecting(false);
        
        // Connect to existing participants
        response.participants.forEach(participant => {
          if (participant.id !== user.id) {
            createPeerConnection(participant.id, true);
          }
        });
      });
      
    } catch (err) {
      console.error('Failed to connect to voice channel:', err);
      setError(err.message);
      setIsConnecting(false);
      disconnect();
    }
  }, [isConnected, isConnecting, user, emit, getAudioConstraints]);

  // Disconnect from voice channel
  const disconnect = useCallback(() => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    // Close peer connections
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
    
    // Clear remote streams
    remoteStreamsRef.current.clear();
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    // Leave voice channel
    if (channelId && socket) {
      emit('voice:leave', { channelId });
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    setActiveStream(null);
    setParticipants([]);
    setIsScreenSharing(false);
  }, [channelId, socket, emit]);

  // Create peer connection
  const createPeerConnection = useCallback(async (participantId, createOffer = false) => {
    try {
      const pc = new RTCPeerConnection(rtcConfig);
      
      // Add local stream tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current);
        });
      }
      
      // Handle remote stream
      pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        remoteStreamsRef.current.set(participantId, remoteStream);
        
        // Update participant with stream
        setParticipants(prev => 
          prev.map(p => 
            p.id === participantId ? { ...p, stream: remoteStream } : p
          )
        );
      };
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          emit('voice:ice_candidate', {
            targetId: participantId,
            candidate: event.candidate
          });
        }
      };
      
      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log(`Connection state with ${participantId}: ${pc.connectionState}`);
        
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          // Attempt to reconnect
          handlePeerDisconnect(participantId);
        }
      };
      
      peerConnectionsRef.current.set(participantId, pc);
      
      // Create and send offer if initiating
      if (createOffer) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        emit('voice:offer', {
          targetId: participantId,
          offer: offer
        });
      }
      
      return pc;
    } catch (err) {
      console.error('Failed to create peer connection:', err);
      throw err;
    }
  }, [emit]);

  // Handle peer disconnect
  const handlePeerDisconnect = useCallback((participantId) => {
    const pc = peerConnectionsRef.current.get(participantId);
    if (pc) {
      pc.close();
      peerConnectionsRef.current.delete(participantId);
    }
    
    remoteStreamsRef.current.delete(participantId);
    
    setParticipants(prev => prev.filter(p => p.id !== participantId));
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!localStreamRef.current) return;
    
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = isMuted;
      setIsMuted(!isMuted);
      
      emit('voice:mute', { muted: !isMuted });
    }
  }, [isMuted, emit]);

  // Toggle deafen
  const toggleDeafen = useCallback(() => {
    setIsDeafened(!isDeafened);
    
    // Mute all remote audio
    remoteStreamsRef.current.forEach(stream => {
      stream.getAudioTracks().forEach(track => {
        track.enabled = isDeafened;
      });
    });
    
    // Also mute self when deafened
    if (!isDeafened && !isMuted) {
      toggleMute();
    }
    
    emit('voice:deafen', { deafened: !isDeafened });
  }, [isDeafened, isMuted, toggleMute, emit]);

  // Set user volume
  const setUserVolume = useCallback((userId, volume) => {
    const stream = remoteStreamsRef.current.get(userId);
    if (!stream) return;
    
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      // Volume control would require Web Audio API manipulation
      // This is a simplified version
      const audioElement = document.getElementById(`audio-${userId}`);
      if (audioElement) {
        audioElement.volume = volume / 100;
      }
    }
  }, []);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });
      
      const videoTrack = screenStream.getVideoTracks()[0];
      
      // Replace video track in peer connections
      peerConnectionsRef.current.forEach(pc => {
        const sender = pc.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        } else {
          pc.addTrack(videoTrack, screenStream);
        }
      });
      
      // Handle screen share ending
      videoTrack.onended = () => {
        stopScreenShare();
      };
      
      setIsScreenSharing(true);
      emit('voice:screen_share', { sharing: true });
      
      return screenStream;
    } catch (err) {
      console.error('Failed to start screen share:', err);
      throw err;
    }
  }, [emit]);

  // Stop screen sharing
  const stopScreenShare = useCallback(() => {
    // Remove video tracks from peer connections
    peerConnectionsRef.current.forEach(pc => {
      const sender = pc.getSenders().find(s => s.track?.kind === 'video');
      if (sender) {
        pc.removeTrack(sender);
      }
    });
    
    setIsScreenSharing(false);
    emit('voice:screen_share', { sharing: false });
  }, [emit]);

  // Get audio levels
  const getAudioLevel = useCallback(() => {
    if (!analyserRef.current) return 0;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    return average / 255; // Normalize to 0-1
  }, []);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;
    
    const handleUserJoined = async ({ userId }) => {
      setParticipants(prev => [...prev, { id: userId }]);
      // Create peer connection for new user
      await createPeerConnection(userId, true);
    };
    
    const handleUserLeft = ({ userId }) => {
      handlePeerDisconnect(userId);
    };
    
    const handleOffer = async ({ userId, offer }) => {
      const pc = await createPeerConnection(userId, false);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      emit('voice:answer', {
        targetId: userId,
        answer: answer
      });
    };
    
    const handleAnswer = async ({ userId, answer }) => {
      const pc = peerConnectionsRef.current.get(userId);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    };
    
    const handleIceCandidate = async ({ userId, candidate }) => {
      const pc = peerConnectionsRef.current.get(userId);
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };
    
    socket.on('voice:user_joined', handleUserJoined);
    socket.on('voice:user_left', handleUserLeft);
    socket.on('voice:offer', handleOffer);
    socket.on('voice:answer', handleAnswer);
    socket.on('voice:ice_candidate', handleIceCandidate);
    
    return () => {
      socket.off('voice:user_joined', handleUserJoined);
      socket.off('voice:user_left', handleUserLeft);
      socket.off('voice:offer', handleOffer);
      socket.off('voice:answer', handleAnswer);
      socket.off('voice:ice_candidate', handleIceCandidate);
    };
  }, [socket, emit, createPeerConnection, handlePeerDisconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    isMuted,
    isDeafened,
    volume,
    participants,
    activeStream,
    error,
    audioQuality,
    isScreenSharing,
    connect,
    disconnect,
    toggleMute,
    toggleDeafen,
    setVolume,
    setUserVolume,
    setAudioQuality,
    startScreenShare,
    stopScreenShare,
    getAudioLevel
  };
};

// Hook for video calls
export const useVideo = (channelId = null) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [videoQuality, setVideoQuality] = useState('720p');
  
  const getVideoConstraints = useCallback(() => {
    const constraints = {
      video: {
        facingMode: 'user'
      }
    };
    
    switch (videoQuality) {
      case '360p':
        constraints.video.width = { ideal: 640 };
        constraints.video.height = { ideal: 360 };
        break;
      case '720p':
        constraints.video.width = { ideal: 1280 };
        constraints.video.height = { ideal: 720 };
        break;
      case '1080p':
        constraints.video.width = { ideal: 1920 };
        constraints.video.height = { ideal: 1080 };
        break;
      default:
        constraints.video.width = { ideal: 1280 };
        constraints.video.height = { ideal: 720 };
    }
    
    return constraints;
  }, [videoQuality]);
  
  const enableVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(getVideoConstraints());
      setVideoStream(stream);
      setIsVideoEnabled(true);
      return stream;
    } catch (err) {
      console.error('Failed to enable video:', err);
      throw err;
    }
  }, [getVideoConstraints]);
  
  const disableVideo = useCallback(() => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setIsVideoEnabled(false);
  }, [videoStream]);
  
  const toggleVideo = useCallback(() => {
    if (isVideoEnabled) {
      disableVideo();
    } else {
      enableVideo();
    }
  }, [isVideoEnabled, enableVideo, disableVideo]);
  
  return {
    isVideoEnabled,
    videoStream,
    videoQuality,
    setVideoQuality,
    enableVideo,
    disableVideo,
    toggleVideo
  };
};