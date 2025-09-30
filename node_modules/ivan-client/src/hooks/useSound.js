/**
 * Custom React hook for sound management
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import soundPlayer from '../assets/sounds';

export const useSound = (options = {}) => {
  const [initialized, setInitialized] = useState(false);
  const [enabled, setEnabled] = useState(soundPlayer.enabled);
  const [globalVolume, setGlobalVolume] = useState(soundPlayer.globalVolume);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    // Initialize sound player
    const init = async () => {
      await soundPlayer.initialize();
      if (mountedRef.current) {
        setInitialized(true);
      }
    };

    init();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Update settings
  useEffect(() => {
    if (options.enabled !== undefined) {
      soundPlayer.setEnabled(options.enabled);
      setEnabled(options.enabled);
    }
  }, [options.enabled]);

  useEffect(() => {
    if (options.volume !== undefined) {
      soundPlayer.setGlobalVolume(options.volume);
      setGlobalVolume(options.volume);
    }
  }, [options.volume]);

  // Play methods
  const playSound = useCallback((category, soundName, playOptions = {}) => {
    return soundPlayer.play(category, soundName, playOptions);
  }, []);

  const playNotification = useCallback((type, playOptions = {}) => {
    return soundPlayer.playNotification(type, playOptions);
  }, []);

  const playVoice = useCallback((type, playOptions = {}) => {
    return soundPlayer.playVoice(type, playOptions);
  }, []);

  const playUI = useCallback((type, playOptions = {}) => {
    return soundPlayer.playUI(type, playOptions);
  }, []);

  const playCall = useCallback((type, playOptions = {}) => {
    return soundPlayer.playCall(type, playOptions);
  }, []);

  // Settings methods
  const toggleSound = useCallback(() => {
    const newEnabled = !enabled;
    soundPlayer.setEnabled(newEnabled);
    setEnabled(newEnabled);
    return newEnabled;
  }, [enabled]);

  const updateGlobalVolume = useCallback((volume) => {
    soundPlayer.setGlobalVolume(volume);
    setGlobalVolume(volume);
  }, []);

  const setCategoryVolume = useCallback((category, volume) => {
    soundPlayer.setCategoryVolume(category, volume);
  }, []);

  const stopAll = useCallback(() => {
    soundPlayer.stopAll();
  }, []);

  return {
    initialized,
    enabled,
    globalVolume,
    playSound,
    playNotification,
    playVoice,
    playUI,
    playCall,
    toggleSound,
    setEnabled: (value) => {
      soundPlayer.setEnabled(value);
      setEnabled(value);
    },
    setGlobalVolume: updateGlobalVolume,
    setCategoryVolume,
    stopAll,
    soundPlayer
  };
};

// Hook for notification sounds
export const useNotificationSound = () => {
  const { playNotification, ...rest } = useSound();
  
  return {
    playMessage: useCallback(() => playNotification('message'), [playNotification]),
    playMention: useCallback(() => playNotification('mention'), [playNotification]),
    playDM: useCallback(() => playNotification('dm'), [playNotification]),
    playServerNotification: useCallback(() => playNotification('serverNotification'), [playNotification]),
    playAchievement: useCallback(() => playNotification('achievement'), [playNotification]),
    ...rest
  };
};

// Hook for voice sounds
export const useVoiceSound = () => {
  const { playVoice, ...rest } = useSound();
  
  return {
    playJoin: useCallback(() => playVoice('join'), [playVoice]),
    playLeave: useCallback(() => playVoice('leave'), [playVoice]),
    playMute: useCallback(() => playVoice('mute'), [playVoice]),
    playUnmute: useCallback(() => playVoice('unmute'), [playVoice]),
    playDeafen: useCallback(() => playVoice('deafen'), [playVoice]),
    playUndeafen: useCallback(() => playVoice('undeafen'), [playVoice]),
    playDisconnect: useCallback(() => playVoice('disconnect'), [playVoice]),
    playRingtone: useCallback((options) => playVoice('ringtone', options), [playVoice]),
    ...rest
  };
};

// Hook for UI sounds
export const useUISound = () => {
  const { playUI, ...rest } = useSound();
  
  return {
    playClick: useCallback(() => playUI('buttonClick'), [playUI]),
    playModalOpen: useCallback(() => playUI('modalOpen'), [playUI]),
    playModalClose: useCallback(() => playUI('modalClose'), [playUI]),
    playError: useCallback(() => playUI('error'), [playUI]),
    playSuccess: useCallback(() => playUI('success'), [playUI]),
    playTyping: useCallback(() => playUI('typing'), [playUI]),
    ...rest
  };
};

export default useSound;