# Sound Assets

This directory contains all audio files for the Ivan chat application.

## Directory Structure

- `/notifications` - Message and mention notifications
- `/voice` - Voice channel sounds
- `/ui` - User interface feedback sounds  
- `/calls` - Call-related sounds

## Setup

1. Run `npm run setup:sounds` to create directory structure
2. Replace placeholder files with actual sound assets

## Usage

```javascript
import soundPlayer from '@/assets/sounds';

// Play a sound
soundPlayer.play('notifications', 'message');
```

## Adding New Sounds

1. Add the MP3 file to the appropriate directory
2. Update the sounds configuration in index.js
3. Test the sound using the SoundSettings component

## Sound Sources

- freesound.org
- zapsplat.com
- soundbible.com
