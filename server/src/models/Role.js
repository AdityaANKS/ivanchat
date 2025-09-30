import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  server: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server',
    required: true,
  },
  color: {
    type: String,
    default: '#99AAB5',
  },
  icon: String,
  position: {
    type: Number,
    default: 0,
  },
  permissions: {
    // General Permissions
    administrator: { type: Boolean, default: false },
    viewChannels: { type: Boolean, default: true },
    manageChannels: { type: Boolean, default: false },
    manageRoles: { type: Boolean, default: false },
    manageServer: { type: Boolean, default: false },
    createInvite: { type: Boolean, default: true },
    changeNickname: { type: Boolean, default: true },
    manageNicknames: { type: Boolean, default: false },
    kickMembers: { type: Boolean, default: false },
    banMembers: { type: Boolean, default: false },
    
    // Text Permissions
    sendMessages: { type: Boolean, default: true },
    sendTTSMessages: { type: Boolean, default: false },
    manageMessages: { type: Boolean, default: false },
    embedLinks: { type: Boolean, default: true },
    attachFiles: { type: Boolean, default: true },
    readMessageHistory: { type: Boolean, default: true },
    mentionEveryone: { type: Boolean, default: false },
    useExternalEmojis: { type: Boolean, default: true },
    addReactions: { type: Boolean, default: true },
    
    // Voice Permissions
    connect: { type: Boolean, default: true },
    speak: { type: Boolean, default: true },
    muteMembers: { type: Boolean, default: false },
    deafenMembers: { type: Boolean, default: false },
    moveMembers: { type: Boolean, default: false },
    useVAD: { type: Boolean, default: true }, // Voice Activity Detection
    prioritySpeaker: { type: Boolean, default: false },
    stream: { type: Boolean, default: true },
  },
  mentionable: {
    type: Boolean,
    default: true,
  },
  hoist: {
    type: Boolean,
    default: false, // Display role members separately
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

roleSchema.index({ server: 1, position: 1 });
roleSchema.index({ server: 1, name: 1 });

export default mongoose.model('Role', roleSchema);