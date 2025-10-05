// shared/src/constants/roles.ts

/**
 * System-wide roles
 */
export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest',
  BOT: 'bot',
} as const;

/**
 * Server-specific roles
 */
export const SERVER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  MEMBER: 'member',
  VIP: 'vip',
  BOOSTER: 'booster',
  BOT: 'bot',
} as const;

/**
 * Channel-specific permissions
 * Using BigInt for bitwise safety on large permission sets
 */
export const PERMISSIONS = {
  // General
  VIEW_CHANNEL: 1n << 0n,
  SEND_MESSAGES: 1n << 1n,
  SEND_TTS_MESSAGES: 1n << 2n,
  MANAGE_MESSAGES: 1n << 3n,
  EMBED_LINKS: 1n << 4n,
  ATTACH_FILES: 1n << 5n,
  READ_MESSAGE_HISTORY: 1n << 6n,
  MENTION_EVERYONE: 1n << 7n,
  USE_EXTERNAL_EMOJIS: 1n << 8n,
  VIEW_INSIGHTS: 1n << 9n,

  // Voice
  CONNECT: 1n << 10n,
  SPEAK: 1n << 11n,
  MUTE_MEMBERS: 1n << 12n,
  DEAFEN_MEMBERS: 1n << 13n,
  MOVE_MEMBERS: 1n << 14n,
  USE_VAD: 1n << 15n,
  PRIORITY_SPEAKER: 1n << 16n,
  STREAM: 1n << 17n,

  // Channel Management
  MANAGE_CHANNELS: 1n << 18n,
  MANAGE_PERMISSIONS: 1n << 19n,
  MANAGE_WEBHOOKS: 1n << 20n,
  CREATE_INSTANT_INVITE: 1n << 21n,

  // Server Management
  KICK_MEMBERS: 1n << 22n,
  BAN_MEMBERS: 1n << 23n,
  ADMINISTRATOR: 1n << 24n,
  MANAGE_SERVER: 1n << 25n,
  MANAGE_ROLES: 1n << 26n,
  MANAGE_EMOJIS: 1n << 27n,
  AUDIT_LOG_VIEW: 1n << 28n,
  SERVER_INSIGHTS_VIEW: 1n << 29n,

  // Advanced
  MANAGE_NICKNAMES: 1n << 30n,
  CHANGE_NICKNAME: 1n << 31n,
  ADD_REACTIONS: 1n << 32n,
  USE_SLASH_COMMANDS: 1n << 33n,
  REQUEST_TO_SPEAK: 1n << 34n,
  MANAGE_EVENTS: 1n << 35n,
  MANAGE_THREADS: 1n << 36n,
  CREATE_PUBLIC_THREADS: 1n << 37n,
  CREATE_PRIVATE_THREADS: 1n << 38n,
  USE_EXTERNAL_STICKERS: 1n << 39n,
  SEND_MESSAGES_IN_THREADS: 1n << 40n,
  START_EMBEDDED_ACTIVITIES: 1n << 41n,
  MODERATE_MEMBERS: 1n << 42n,
} as const;

/**
 * Role hierarchy levels (higher number = higher authority)
 */
export const ROLE_HIERARCHY = {
  [SYSTEM_ROLES.SUPER_ADMIN]: 1000,
  [SYSTEM_ROLES.ADMIN]: 900,
  [SYSTEM_ROLES.MODERATOR]: 800,
  [SYSTEM_ROLES.USER]: 100,
  [SYSTEM_ROLES.GUEST]: 10,
  [SYSTEM_ROLES.BOT]: 500,
} as const;

/**
 * Default permissions for each role
 */
export const DEFAULT_ROLE_PERMISSIONS = {
  [SERVER_ROLES.OWNER]: Object.values(PERMISSIONS).reduce(
    (acc, val) => acc | val,
    0n
  ),
  [SERVER_ROLES.ADMIN]:
    PERMISSIONS.VIEW_CHANNEL |
    PERMISSIONS.SEND_MESSAGES |
    PERMISSIONS.MANAGE_MESSAGES |
    PERMISSIONS.MANAGE_CHANNELS |
    PERMISSIONS.KICK_MEMBERS |
    PERMISSIONS.BAN_MEMBERS |
    PERMISSIONS.MANAGE_ROLES |
    PERMISSIONS.MANAGE_SERVER,
  [SERVER_ROLES.MODERATOR]:
    PERMISSIONS.VIEW_CHANNEL |
    PERMISSIONS.SEND_MESSAGES |
    PERMISSIONS.MANAGE_MESSAGES |
    PERMISSIONS.KICK_MEMBERS |
    PERMISSIONS.MUTE_MEMBERS |
    PERMISSIONS.MODERATE_MEMBERS,
  [SERVER_ROLES.MEMBER]:
    PERMISSIONS.VIEW_CHANNEL |
    PERMISSIONS.SEND_MESSAGES |
    PERMISSIONS.READ_MESSAGE_HISTORY |
    PERMISSIONS.CONNECT |
    PERMISSIONS.SPEAK |
    PERMISSIONS.ADD_REACTIONS |
    PERMISSIONS.USE_SLASH_COMMANDS,
  [SERVER_ROLES.VIP]:
    PERMISSIONS.VIEW_CHANNEL |
    PERMISSIONS.SEND_MESSAGES |
    PERMISSIONS.ATTACH_FILES |
    PERMISSIONS.EMBED_LINKS |
    PERMISSIONS.USE_EXTERNAL_EMOJIS |
    PERMISSIONS.PRIORITY_SPEAKER,
  [SERVER_ROLES.BOT]:
    PERMISSIONS.VIEW_CHANNEL |
    PERMISSIONS.SEND_MESSAGES |
    PERMISSIONS.EMBED_LINKS |
    PERMISSIONS.MANAGE_MESSAGES |
    PERMISSIONS.ADD_REACTIONS,
} as const;

/**
 * Check if a role has a specific permission
 */
export function hasPermission(permissions: bigint, permission: bigint): boolean {
  return (permissions & permission) === permission;
}

/**
 * Add a permission to existing permissions
 */
export function addPermission(permissions: bigint, permission: bigint): bigint {
  return permissions | permission;
}

/**
 * Remove a permission from existing permissions
 */
export function removePermission(permissions: bigint, permission: bigint): bigint {
  return permissions & ~permission;
}

/**
 * Check if user can perform action based on role hierarchy
 */
export function canManageRole(userRole: string, targetRole: string): boolean {
  const userLevel =
    ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] ?? 0;
  const targetLevel =
    ROLE_HIERARCHY[targetRole as keyof typeof ROLE_HIERARCHY] ?? 0;
  return userLevel > targetLevel;
}

/**
 * Get human-readable permission names
 */
export function getPermissionNames(permissions: bigint): string[] {
  const names: string[] = [];
  for (const [name, value] of Object.entries(PERMISSIONS)) {
    if (hasPermission(permissions, value)) {
      names.push(name);
    }
  }
  return names;
}

// Type exports
export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];
export type ServerRole = (typeof SERVER_ROLES)[keyof typeof SERVER_ROLES];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
