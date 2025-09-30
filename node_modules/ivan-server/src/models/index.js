// Export all models from a single entry point
export { default as User } from './User.js';
export { default as Message } from './Message.js';
export { default as Channel } from './Channel.js';
export { default as Server } from './Server.js';
export { default as Role } from './Role.js';
export { default as Category } from './Category.js';
export { default as Thread } from './Thread.js';
export { default as DirectMessage } from './DirectMessage.js';
export { default as ScheduledMessage } from './ScheduledMessage.js';
export { default as UserGamification } from './UserGamification.js';
export { default as ChannelDiscovery } from './ChannelDiscovery.js';
export { default as ServerTemplate } from './ServerTemplate.js';
export { default as MarketplaceItem } from './MarketplaceItem.js';
export { default as Webhook } from './Webhook.js';

// Helper function to initialize all models
export async function initializeModels() {
  console.log('📦 Models initialized');
}