export const up = async (db) => {
  // Create indexes
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  await db.collection('users').createIndex({ createdAt: -1 });
  
  await db.collection('messages').createIndex({ channel: 1, createdAt: -1 });
  await db.collection('messages').createIndex({ author: 1 });
  await db.collection('messages').createIndex({ 
    content: 'text',
    'embeds.title': 'text',
    'embeds.description': 'text',
  });
  
  await db.collection('channels').createIndex({ server: 1 });
  await db.collection('channels').createIndex({ type: 1 });
  
  await db.collection('servers').createIndex({ owner: 1 });
  await db.collection('servers').createIndex({ 'members.user': 1 });
  await db.collection('servers').createIndex({ isPublic: 1 });
  
  console.log('Initial indexes created');
};

export const down = async (db) => {
  // Drop indexes if needed
  await db.collection('users').dropIndexes();
  await db.collection('messages').dropIndexes();
  await db.collection('channels').dropIndexes();
  await db.collection('servers').dropIndexes();
};