// server/services/SpatialAudioService.js
import { EventEmitter } from 'events';

export class SpatialAudioService extends EventEmitter {
  constructor() {
    super();
    this.spaces = new Map(); // spaceId -> SpatialSpace
    this.userPositions = new Map(); // userId -> position
  }

  createSpace(channelId, config = {}) {
    const space = new SpatialSpace(channelId, {
      dimensions: config.dimensions || { width: 100, height: 100 },
      maxDistance: config.maxDistance || 50,
      rolloffFactor: config.rolloffFactor || 1,
      refDistance: config.refDistance || 5,
      backgroundMusic: config.backgroundMusic,
      zones: config.zones || [],
    });

    this.spaces.set(channelId, space);
    return space;
  }

  updateUserPosition(userId, channelId, position) {
    const space = this.spaces.get(channelId);
    if (!space) return;

    const oldPosition = this.userPositions.get(userId);
    this.userPositions.set(userId, { ...position, channelId });

    // Calculate audio adjustments for all users in range
    const adjustments = space.calculateAudioAdjustments(userId, position);
    
    // Emit position update to relevant users
    this.emit('position-update', {
      userId,
      position,
      adjustments,
      channelId,
    });

    // Check zone transitions
    if (oldPosition) {
      const oldZone = space.getZoneAt(oldPosition);
      const newZone = space.getZoneAt(position);
      
      if (oldZone !== newZone) {
        this.emit('zone-transition', {
          userId,
          from: oldZone,
          to: newZone,
          channelId,
        });
      }
    }
  }

  getUsersInRange(userId, maxDistance = 30) {
    const userPos = this.userPositions.get(userId);
    if (!userPos) return [];

    const nearbyUsers = [];
    for (const [otherUserId, otherPos] of this.userPositions) {
      if (otherUserId === userId) continue;
      if (otherPos.channelId !== userPos.channelId) continue;

      const distance = this.calculateDistance(userPos, otherPos);
      if (distance <= maxDistance) {
        nearbyUsers.push({
          userId: otherUserId,
          distance,
          position: otherPos,
        });
      }
    }

    return nearbyUsers.sort((a, b) => a.distance - b.distance);
  }

  calculateDistance(pos1, pos2) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    const dz = (pos2.z || 0) - (pos1.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

class SpatialSpace {
  constructor(channelId, config) {
    this.channelId = channelId;
    this.config = config;
    this.users = new Map();
    this.zones = this.initializeZones(config.zones);
  }

  initializeZones(zoneConfigs) {
    return zoneConfigs.map(zone => ({
      id: zone.id,
      name: zone.name,
      boundaries: zone.boundaries,
      audioEffects: zone.audioEffects || {},
      ambientSound: zone.ambientSound,
      volumeModifier: zone.volumeModifier || 1,
    }));
  }

  calculateAudioAdjustments(userId, position) {
    const adjustments = [];
    
    for (const [otherUserId, otherData] of this.users) {
      if (otherUserId === userId) continue;

      const distance = this.calculateDistance(position, otherData.position);
      const volume = this.calculateVolume(distance);
      const pan = this.calculatePanning(position, otherData.position);
      
      adjustments.push({
        userId: otherUserId,
        volume,
        pan,
        effects: this.getZoneEffects(otherData.position),
      });
    }

    return adjustments;
  }

  calculateVolume(distance) {
    const { maxDistance, rolloffFactor, refDistance } = this.config;
    
    if (distance <= refDistance) return 1;
    if (distance >= maxDistance) return 0;

    // Logarithmic rolloff
    return Math.pow(refDistance / distance, rolloffFactor);
  }

  calculatePanning(listenerPos, sourcePos) {
    // Calculate stereo panning based on relative positions
    const angle = Math.atan2(sourcePos.y - listenerPos.y, sourcePos.x - listenerPos.x);
    return Math.sin(angle); // -1 (left) to 1 (right)
  }

  getZoneAt(position) {
    for (const zone of this.zones) {
      if (this.isPositionInZone(position, zone)) {
        return zone;
      }
    }
    return null;
  }

  isPositionInZone(position, zone) {
    const { boundaries } = zone;
    return position.x >= boundaries.minX &&
           position.x <= boundaries.maxX &&
           position.y >= boundaries.minY &&
           position.y <= boundaries.maxY;
  }

  getZoneEffects(position) {
    const zone = this.getZoneAt(position);
    return zone ? zone.audioEffects : {};
  }

  calculateDistance(pos1, pos2) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}