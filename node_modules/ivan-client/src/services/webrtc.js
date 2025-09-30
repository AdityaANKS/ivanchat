class WebRTCService {
  constructor() {
    this.peerConnections = new Map();
    this.localStream = null;
    this.remoteStreams = new Map();
    this.configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        {
          urls: 'turn:turn.example.com:3478',
          username: 'user',
          credential: 'pass'
        }
      ],
      iceCandidatePoolSize: 10,
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    };
    this.constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000
      },
      video: {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
        frameRate: { ideal: 30, max: 60 }
      }
    };
  }

  // Initialize local media stream
  async initializeLocalStream(audio = true, video = false) {
    try {
      const constraints = {
        audio: audio ? this.constraints.audio : false,
        video: video ? this.constraints.video : false
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      return this.localStream;
    } catch (error) {
      console.error('Failed to get local stream:', error);
      throw error;
    }
  }

  // Create peer connection
  createPeerConnection(peerId, isInitiator = false) {
    if (this.peerConnections.has(peerId)) {
      return this.peerConnections.get(peerId);
    }

    const pc = new RTCPeerConnection(this.configuration);

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream);
      });
    }

    // Set up event handlers
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.onIceCandidate(peerId, event.candidate);
      }
    };

    pc.ontrack = (event) => {
      this.handleRemoteStream(peerId, event.streams[0]);
    };

    pc.oniceconnectionstatechange = () => {
      this.handleConnectionStateChange(peerId, pc.iceConnectionState);
    };

    pc.onnegotiationneeded = async () => {
      if (isInitiator) {
        await this.createOffer(peerId);
      }
    };

    pc.ondatachannel = (event) => {
      this.handleDataChannel(peerId, event.channel);
    };

    this.peerConnections.set(peerId, pc);
    
    return pc;
  }

  // Create offer
  async createOffer(peerId) {
    const pc = this.peerConnections.get(peerId);
    if (!pc) throw new Error('Peer connection not found');

    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await pc.setLocalDescription(offer);
      
      return offer;
    } catch (error) {
      console.error('Failed to create offer:', error);
      throw error;
    }
  }

  // Create answer
  async createAnswer(peerId, offer) {
    const pc = this.peerConnections.get(peerId) || this.createPeerConnection(peerId);

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      return answer;
    } catch (error) {
      console.error('Failed to create answer:', error);
      throw error;
    }
  }

  // Handle answer
  async handleAnswer(peerId, answer) {
    const pc = this.peerConnections.get(peerId);
    if (!pc) throw new Error('Peer connection not found');

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Failed to set remote description:', error);
      throw error;
    }
  }

  // Add ICE candidate
  async addIceCandidate(peerId, candidate) {
    const pc = this.peerConnections.get(peerId);
    if (!pc) throw new Error('Peer connection not found');

    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Failed to add ICE candidate:', error);
      throw error;
    }
  }

  // Handle remote stream
  handleRemoteStream(peerId, stream) {
    this.remoteStreams.set(peerId, stream);
    
    if (this.onRemoteStream) {
      this.onRemoteStream(peerId, stream);
    }
  }

  // Handle connection state change
  handleConnectionStateChange(peerId, state) {
    console.log(`Connection state for ${peerId}: ${state}`);
    
    if (state === 'failed' || state === 'disconnected') {
      this.reconnectPeer(peerId);
    } else if (state === 'closed') {
      this.removePeer(peerId);
    }
    
    if (this.onConnectionStateChange) {
      this.onConnectionStateChange(peerId, state);
    }
  }

  // Reconnect peer
  async reconnectPeer(peerId) {
    const pc = this.peerConnections.get(peerId);
    if (!pc) return;

    try {
      // Create new offer for reconnection
      await this.createOffer(peerId);
    } catch (error) {
      console.error('Failed to reconnect peer:', error);
    }
  }

  // Remove peer
  removePeer(peerId) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerId);
    }
    
    this.remoteStreams.delete(peerId);
  }

  // Create data channel
  createDataChannel(peerId, label = 'data', options = {}) {
    const pc = this.peerConnections.get(peerId);
    if (!pc) throw new Error('Peer connection not found');

    const channel = pc.createDataChannel(label, {
      ordered: true,
      ...options
    });

    channel.onopen = () => {
      console.log(`Data channel ${label} opened with ${peerId}`);
    };

    channel.onmessage = (event) => {
      if (this.onDataChannelMessage) {
        this.onDataChannelMessage(peerId, event.data);
      }
    };

    channel.onerror = (error) => {
      console.error(`Data channel error with ${peerId}:`, error);
    };

    return channel;
  }

  // Handle data channel
  handleDataChannel(peerId, channel) {
    channel.onmessage = (event) => {
      if (this.onDataChannelMessage) {
        this.onDataChannelMessage(peerId, event.data);
      }
    };
  }

  // Toggle audio
  toggleAudio(enabled = null) {
    if (!this.localStream) return false;

    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = enabled !== null ? enabled : !audioTrack.enabled;
      return audioTrack.enabled;
    }
    
    return false;
  }

  // Toggle video
  toggleVideo(enabled = null) {
    if (!this.localStream) return false;

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = enabled !== null ? enabled : !videoTrack.enabled;
      return videoTrack.enabled;
    }
    
    return false;
  }

  // Replace track (for screen sharing)
  async replaceTrack(peerId, newTrack, trackKind = 'video') {
    const pc = this.peerConnections.get(peerId);
    if (!pc) throw new Error('Peer connection not found');

    const sender = pc.getSenders().find(s => s.track?.kind === trackKind);
    if (sender) {
      await sender.replaceTrack(newTrack);
    }
  }

  // Start screen share
  async startScreenShare() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      const videoTrack = stream.getVideoTracks()[0];
      
      // Replace video track for all peers
      for (const [peerId] of this.peerConnections) {
        await this.replaceTrack(peerId, videoTrack);
      }

      // Handle screen share ending
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      return stream;
    } catch (error) {
      console.error('Failed to start screen share:', error);
      throw error;
    }
  }

  // Stop screen share
  async stopScreenShare() {
    // Restore original video track for all peers
    const videoTrack = this.localStream?.getVideoTracks()[0];
    
    if (videoTrack) {
      for (const [peerId] of this.peerConnections) {
        await this.replaceTrack(peerId, videoTrack);
      }
    }
  }

  // Get connection stats
  async getStats(peerId) {
    const pc = this.peerConnections.get(peerId);
    if (!pc) return null;

    const stats = await pc.getStats();
    const report = {};

    stats.forEach(stat => {
      if (stat.type === 'inbound-rtp' || stat.type === 'outbound-rtp') {
        report[stat.type] = {
          bytesReceived: stat.bytesReceived,
          bytesSent: stat.bytesSent,
          packetsLost: stat.packetsLost,
          jitter: stat.jitter,
          roundTripTime: stat.roundTripTime
        };
      }
    });

    return report;
  }

  // Clean up
  cleanup() {
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Close all peer connections
    this.peerConnections.forEach(pc => pc.close());
    this.peerConnections.clear();
    
    // Clear remote streams
    this.remoteStreams.clear();
  }

  // Event handlers (to be set by consumer)
  onIceCandidate(peerId, candidate) {}
  onRemoteStream(peerId, stream) {}
  onConnectionStateChange(peerId, state) {}
  onDataChannelMessage(peerId, data) {}
}

// Create singleton instance
const webRTCService = new WebRTCService();

export default webRTCService;