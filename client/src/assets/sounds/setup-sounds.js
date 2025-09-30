/**
 * Setup script to create sound directories and placeholder files
 */

const fs = require('fs');
const path = require('path');

// Directory structure
const soundDirectories = [
  'notifications',
  'voice', 
  'ui',
  'calls'
];

// Sound files to create
const soundFiles = {
  notifications: [
    'message.mp3',
    'mention.mp3',
    'dm.mp3',
    'server-notification.mp3',
    'achievement.mp3'
  ],
  voice: [
    'join.mp3',
    'leave.mp3',
    'mute.mp3',
    'unmute.mp3',
    'deafen.mp3',
    'undeafen.mp3',
    'disconnect.mp3',
    'ringtone.mp3'
  ],
  ui: [
    'button-click.mp3',
    'modal-open.mp3',
    'modal-close.mp3',
    'error.mp3',
    'success.mp3',
    'typing.mp3'
  ],
  calls: [
    'incoming-call.mp3',
    'outgoing-call.mp3',
    'call-end.mp3',
    'call-busy.mp3'
  ]
};

// Create directories
function createDirectories() {
  soundDirectories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } else {
      console.log(`📁 Directory exists: ${dir}`);
    }
  });
}

// Create placeholder files
function createPlaceholderFiles() {
  for (const [category, files] of Object.entries(soundFiles)) {
    console.log(`\n📁 Creating ${category} sound placeholders...`);
    
    files.forEach(filename => {
      const filePath = path.join(__dirname, category, filename);
      
      if (fs.existsSync(filePath)) {
        console.log(`⏭️  ${filename} already exists`);
      } else {
        // Create empty placeholder file
        fs.writeFileSync(filePath, '');
        console.log(`📄 Created placeholder: ${filename}`);
      }
    });
  }
}

// Create index.js file
function createIndexFile() {
  const indexPath = path.join(__dirname, 'index.js');
  
  const indexContent = `/**
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
      console.warn(\`Sound not found: \${category}.\${soundName}\`);
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
`;

  fs.writeFileSync(indexPath, indexContent);
  console.log('\n✅ Created index.js');
}

// Create README file
function createReadme() {
  const readmePath = path.join(__dirname, 'README.md');
  
  const readmeContent = `# Sound Assets

This directory contains all audio files for the Ivan chat application.

## Directory Structure

- \`/notifications\` - Message and mention notifications
- \`/voice\` - Voice channel sounds
- \`/ui\` - User interface feedback sounds  
- \`/calls\` - Call-related sounds

## Setup

1. Run \`npm run setup:sounds\` to create directory structure
2. Replace placeholder files with actual sound assets

## Usage

\`\`\`javascript
import soundPlayer from '@/assets/sounds';

// Play a sound
soundPlayer.play('notifications', 'message');
\`\`\`

## Adding New Sounds

1. Add the MP3 file to the appropriate directory
2. Update the sounds configuration in index.js
3. Test the sound using the SoundSettings component

## Sound Sources

- freesound.org
- zapsplat.com
- soundbible.com
`;

  fs.writeFileSync(readmePath, readmeContent);
  console.log('✅ Created README.md');
}

// Main setup function
function setup() {
  console.log('🎵 Setting up sound assets...\n');
  
  try {
    createDirectories();
    createPlaceholderFiles();
    createIndexFile();
    createReadme();
    
    console.log('\n✨ Sound setup complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Replace placeholder MP3 files with actual sounds');
    console.log('   2. You can find free sounds at:');
    console.log('      - freesound.org');
    console.log('      - zapsplat.com');
    console.log('      - soundbible.com');
    console.log('      - notificationsounds.com\n');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup
setup();