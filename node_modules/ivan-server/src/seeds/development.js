import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import Server from '../src/models/Server.js';
import Channel from '../src/models/Channel.js';
import Message from '../src/models/Message.js';
import Role from '../src/models/Role.js';

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ivan_dev');
    
    // Clear existing data
    await User.deleteMany({});
    await Server.deleteMany({});
    await Channel.deleteMany({});
    await Message.deleteMany({});
    await Role.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = await User.create([
      {
        email: 'admin@ivan.app',
        username: 'admin',
        password: hashedPassword,
        verified: true,
        roles: ['admin'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      },
      {
        email: 'john@example.com',
        username: 'john_doe',
        password: hashedPassword,
        verified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
      {
        email: 'jane@example.com',
        username: 'jane_smith',
        password: hashedPassword,
        verified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      },
      {
        email: 'bob@example.com',
        username: 'bob_wilson',
        password: hashedPassword,
        verified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      },
    ]);
    
    console.log('Created users');
    
    // Create servers
    const server1 = await Server.create({
      name: 'Ivan Community',
      description: 'The official Ivan community server',
      owner: users[0]._id,
      icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=ivan',
      isPublic: true,
      members: users.map(u => ({
        user: u._id,
        joinedAt: new Date(),
      })),
    });
    
    const server2 = await Server.create({
      name: 'Gaming Hub',
      description: 'A place for gamers to connect',
      owner: users[1]._id,
      icon: 'https://api.dicebear.com/7.x/identicon/svg?seed=gaming',
      isPublic: true,
      members: users.slice(1).map(u => ({
        user: u._id,
        joinedAt: new Date(),
      })),
    });
    
    console.log('Created servers');
    
    // Create roles
    const everyoneRole1 = await Role.create({
      name: '@everyone',
      server: server1._id,
      isDefault: true,
      permissions: {
        viewChannels: true,
        sendMessages: true,
        addReactions: true,
      },
    });
    
    const adminRole = await Role.create({
      name: 'Admin',
      server: server1._id,
      color: '#ff0000',
      permissions: {
        administrator: true,
      },
      members: [users[0]._id],
    });
    
    console.log('Created roles');
    
    // Create channels
    const channels = await Channel.create([
      {
        name: 'welcome',
        type: 'text',
        server: server1._id,
        topic: 'Welcome to Ivan Community!',
      },
      {
        name: 'general',
        type: 'text',
        server: server1._id,
        topic: 'General discussion',
      },
      {
        name: 'General Voice',
        type: 'voice',
        server: server1._id,
      },
      {
        name: 'announcements',
        type: 'announcement',
        server: server1._id,
        topic: 'Important announcements',
      },
      {
        name: 'general',
        type: 'text',
        server: server2._id,
        topic: 'General gaming discussion',
      },
    ]);
    
    console.log('Created channels');
    
    // Create messages
    const messages = [
      {
        content: 'Welcome to Ivan Community! 🎉',
        author: users[0]._id,
        channel: channels[0]._id,
        pinned: true,
      },
      {
        content: 'Hey everyone! Excited to be here!',
        author: users[1]._id,
        channel: channels[1]._id,
      },
      {
        content: 'Hello! How is everyone doing today?',
        author: users[2]._id,
        channel: channels[1]._id,
      },
      {
        content: 'Great! Just working on some new features for Ivan.',
        author: users[0]._id,
        channel: channels[1]._id,
      },
      {
        content: 'That sounds awesome! Can\'t wait to see them.',
        author: users[3]._id,
        channel: channels[1]._id,
      },
    ];
    
    for (const messageData of messages) {
      await Message.create(messageData);
    }
    
    console.log('Created messages');
    
    // Update server with channels
    server1.channels = channels.filter(c => c.server.equals(server1._id)).map(c => c._id);
    server1.roles = [everyoneRole1._id, adminRole._id];
    await server1.save();
    
    server2.channels = channels.filter(c => c.server.equals(server2._id)).map(c => c._id);
    await server2.save();
    
    console.log('✅ Database seeded successfully!');
    
    // Disconnect
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();