import React, { useState } from 'react';
import { useSound } from '../../hooks/useSound';
import './SoundSettings.css';

const SoundSettings = () => {
  const {
    enabled,
    globalVolume,
    setEnabled,
    setGlobalVolume,
    setCategoryVolume,
    playNotification,
    playVoice,
    playUI,
    playCall
  } = useSound();

  const [categoryVolumes, setCategoryVolumesState] = useState({
    notifications: 1.0,
    voice: 1.0,
    ui: 1.0,
    calls: 1.0
  });

  const handleGlobalVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    setGlobalVolume(volume);
  };

  const handleCategoryVolumeChange = (category, value) => {
    const volume = parseFloat(value);
    setCategoryVolume(category, volume);
    setCategoryVolumesState(prev => ({
      ...prev,
      [category]: volume
    }));
  };

  const testSound = (category, sound) => {
    switch(category) {
      case 'notifications':
        playNotification(sound);
        break;
      case 'voice':
        playVoice(sound);
        break;
      case 'ui':
        playUI(sound);
        break;
      case 'calls':
        playCall(sound);
        break;
      default:
        break;
    }
  };

  const soundCategories = {
    notifications: {
      title: 'Notifications',
      sounds: ['message', 'mention', 'dm', 'serverNotification', 'achievement']
    },
    voice: {
      title: 'Voice',
      sounds: ['join', 'leave', 'mute', 'unmute', 'deafen', 'undeafen', 'disconnect', 'ringtone']
    },
    ui: {
      title: 'User Interface',
      sounds: ['buttonClick', 'modalOpen', 'modalClose', 'error', 'success', 'typing']
    },
    calls: {
      title: 'Calls',
      sounds: ['incomingCall', 'outgoingCall', 'callEnd', 'callBusy']
    }
  };

  return (
    <div className="sound-settings">
      <h2>Sound Settings</h2>
      
      <div className="setting-group">
        <label className="setting-toggle">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          <span>Enable Sounds</span>
        </label>
      </div>

      <div className="setting-group">
        <label>
          <span>Master Volume: {Math.round(globalVolume * 100)}%</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={globalVolume}
            onChange={handleGlobalVolumeChange}
            disabled={!enabled}
          />
        </label>
      </div>

      {Object.entries(soundCategories).map(([category, config]) => (
        <div key={category} className="category-group">
          <h3>{config.title}</h3>
          <label>
            <span>Volume: {Math.round(categoryVolumes[category] * 100)}%</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={categoryVolumes[category]}
              onChange={(e) => handleCategoryVolumeChange(category, e.target.value)}
              disabled={!enabled}
            />
          </label>
          
          <div className="sound-tests">
            {config.sounds.map(sound => (
              <button
                key={sound}
                onClick={() => testSound(category, sound)}
                disabled={!enabled}
                className="test-sound-btn"
              >
                Test {sound}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SoundSettings;