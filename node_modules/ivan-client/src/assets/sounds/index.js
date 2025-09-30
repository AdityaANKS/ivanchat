/**
 * Sound Assets Manager
 * Auto-generated - DO NOT EDIT MANUALLY
 */

// Sound configuration
export const sounds = {
  notifications: {
    message: { src: './notifications/message.mp3', volume: 0.5 },
    mention: { src: './notifications/mention.mp3', volume: 0.7 },
    dm: { src: './notifications/dm.mp3', volume: 0.6 },
    serverNotification: { src: './notifications/server-notification.mp3', volume: 0.5 },
    achievement: { src: './notifications/achievement.mp3', volume: 0.8 }
  },
  voice: {
    join: { src: './voice/join.mp3', volume: 0.4 },
    leave: { src: './voice/leave.mp3', volume: 0.4 },
    mute: { src: './voice/mute.mp3', volume: 0.3 },
    unmute: { src: './voice/unmute.mp3', volume: 0.3 },
    deafen: { src: './voice/deafen.mp3', volume: 0.3 },
    undeafen: { src: './voice/undeafen.mp3', volume: 0.3 },
    disconnect: { src: './voice/disconnect.mp3', volume: 0.5 },
    ringtone: { src: './voice/ringtone.mp3', volume: 0.7 }
  },
  ui: {
    buttonClick: { src: './ui/button-click.mp3', volume: 0.2 },
    modalOpen: { src: './ui/modal-open.mp3', volume: 0.3 },
    modalClose: { src: './ui/modal-close.mp3', volume: 0.3 },
    error: { src: './ui/error.mp3', volume: 0.5 },
    success: { src: './ui/success.mp3', volume: 0.4 },
    typing: { src: './ui/typing.mp3', volume: 0.1 }
  },
  calls: {
    incomingCall: { src: './calls/incoming-call.mp3', volume: 0.8 },
    outgoingCall: { src: './calls/outgoing-call.mp3', volume: 0.5 },
    callEnd: { src: './calls/call-end.mp3', volume: 0.4 },
    callBusy: { src: './calls/call-busy.mp3', volume: 0.5 }
  }
};

// Simple sound player
export class SoundPlayer {
  constructor() {
    this.enabled = true;
    this.globalVolume = 1.0;
    this.audioCache = new Map();
  }

  play(category, soundName, options = {}) {
    if (!this.enabled) return null;
    
    const soundConfig = sounds[category]?.[soundName];
    if (!soundConfig) {
      console.warn(`Sound not found: ${category}.${soundName}`);
      return null;
    }

    try {
      const audio = new Audio(soundConfig.src);
      audio.volume = Math.min(1, this.globalVolume * (soundConfig.volume || 1));
      
      if (options.loop) {
        audio.loop = true;
      }
      
      audio.play().catch(err => {
        console.error('Error playing sound:', err);
      });
      
      return audio;
    } catch (error) {
      console.error('Error creating audio:', error);
      return null;
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  setGlobalVolume(volume) {
    this.globalVolume = Math.max(0, Math.min(1, volume));
  }
}

const soundPlayer = new SoundPlayer();
export default soundPlayer;
