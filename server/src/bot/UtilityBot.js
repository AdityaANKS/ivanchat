const { EventEmitter } = require('events');
const cron = require('node-cron');
const axios = require('axios');
const moment = require('moment-timezone');
const Redis = require('ioredis');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const translate = require('@vitalets/google-translate-api');
const weather = require('weather-js');
const Parser = require('rss-parser');

// Initialize Redis
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  keyPrefix: 'utilitybot:'
});

class UtilityBot extends EventEmitter {
  constructor() {
    super();
    this.commands = new Map();
    this.reminders = new Map();
    this.polls = new Map();
    this.timers = new Map();
    this.scheduledTasks = new Map();
    this.rssFeeds = new Map();
    
    this.initializeBot();
  }

  async initializeBot() {
    // Register commands
    this.registerCommands();
    
    // Load saved data
    await this.loadSavedData();
    
    // Start scheduled task processor
    this.startScheduledTaskProcessor();
    
    // Start RSS feed checker
    this.startRSSFeedChecker();
    
    console.log('Utility Bot initialized');
  }

  // ========================
  // Command Registration
  // ========================

  registerCommands() {
    // Information Commands
    this.registerCommand('help', this.helpCommand.bind(this));
    this.registerCommand('ping', this.pingCommand.bind(this));
    this.registerCommand('serverinfo', this.serverInfoCommand.bind(this));
    this.registerCommand('userinfo', this.userInfoCommand.bind(this));
    this.registerCommand('avatar', this.avatarCommand.bind(this));
    
    // Utility Commands
    this.registerCommand('remind', this.remindCommand.bind(this));
    this.registerCommand('poll', this.pollCommand.bind(this));
    this.registerCommand('timer', this.timerCommand.bind(this));
    this.registerCommand('calculate', this.calculateCommand.bind(this));
    this.registerCommand('translate', this.translateCommand.bind(this));
    this.registerCommand('weather', this.weatherCommand.bind(this));
    this.registerCommand('time', this.timeCommand.bind(this));
    this.registerCommand('roll', this.rollCommand.bind(this));
    this.registerCommand('choose', this.chooseCommand.bind(this));
    this.registerCommand('8ball', this.eightBallCommand.bind(this));
    
    // Productivity Commands
    this.registerCommand('todo', this.todoCommand.bind(this));
    this.registerCommand('note', this.noteCommand.bind(this));
    this.registerCommand('bookmark', this.bookmarkCommand.bind(this));
    this.registerCommand('schedule', this.scheduleCommand.bind(this));
    
    // Fun Commands
    this.registerCommand('joke', this.jokeCommand.bind(this));
    this.registerCommand('fact', this.factCommand.bind(this));
    this.registerCommand('quote', this.quoteCommand.bind(this));
    this.registerCommand('meme', this.memeCommand.bind(this));
    this.registerCommand('gif', this.gifCommand.bind(this));
    
    // Search Commands
    this.registerCommand('google', this.googleCommand.bind(this));
    this.registerCommand('wikipedia', this.wikipediaCommand.bind(this));
    this.registerCommand('define', this.defineCommand.bind(this));
    this.registerCommand('urban', this.urbanCommand.bind(this));
    
    // Server Management
    this.registerCommand('announce', this.announceCommand.bind(this));
    this.registerCommand('welcomemsg', this.welcomeMessageCommand.bind(this));
    this.registerCommand('autorole', this.autoRoleCommand.bind(this));
    this.registerCommand('reactionrole', this.reactionRoleCommand.bind(this));
    
    // RSS & Notifications
    this.registerCommand('rss', this.rssCommand.bind(this));
    this.registerCommand('subscribe', this.subscribeCommand.bind(this));
    this.registerCommand('notify', this.notifyCommand.bind(this));
  }

  registerCommand(name, handler) {
    this.commands.set(name, {
      name,
      handler,
      description: handler.description || 'No description provided',
      usage: handler.usage || `!${name}`,
      category: handler.category || 'general'
    });
  }

  // ========================
  // Command Handlers
  // ========================

  async handleCommand(message, command, args, context) {
    const cmd = this.commands.get(command.toLowerCase());
    
    if (!cmd) {
      return {
        success: false,
        error: 'Command not found'
      };
    }
    
    try {
      const result = await cmd.handler(message, args, context);
      
      // Log command usage
      await this.logCommandUsage(command, context.userId, context.serverId);
      
      return {
        success: true,
        result
      };
    } catch (error) {
      console.error(`Error executing command ${command}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ========================
  // Information Commands
  // ========================

  async helpCommand(message, args, context) {
    if (args.length > 0) {
      const commandName = args[0].toLowerCase();
      const command = this.commands.get(commandName);
      
      if (command) {
        return {
          type: 'embed',
          embed: {
            title: `Help: ${command.name}`,
            description: command.description,
            fields: [
              { name: 'Usage', value: command.usage },
              { name: 'Category', value: command.category }
            ],
            color: 0x00ff00
          }
        };
      }
    }
    
    // Group commands by category
    const categories = {};
    for (const cmd of this.commands.values()) {
      if (!categories[cmd.category]) {
        categories[cmd.category] = [];
      }
      categories[cmd.category].push(cmd.name);
    }
    
    const fields = Object.entries(categories).map(([category, commands]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: commands.join(', '),
      inline: true
    }));
    
    return {
      type: 'embed',
      embed: {
        title: 'Utility Bot Commands',
        description: 'Use `!help <command>` for detailed information',
        fields,
        color: 0x00ff00
      }
    };
  }

  async pingCommand(message, args, context) {
    const startTime = Date.now();
    
    return {
      type: 'message',
      content: `🏓 Pong! Latency: ${Date.now() - startTime}ms`
    };
  }

  async serverInfoCommand(message, args, context) {
    const server = await this.getServerInfo(context.serverId);
    
    return {
      type: 'embed',
      embed: {
        title: server.name,
        thumbnail: { url: server.icon },
        fields: [
          { name: 'Owner', value: `<@${server.ownerId}>`, inline: true },
          { name: 'Members', value: server.memberCount, inline: true },
          { name: 'Channels', value: server.channelCount, inline: true },
          { name: 'Roles', value: server.roleCount, inline: true },
          { name: 'Created', value: moment(server.createdAt).format('MMMM Do YYYY'), inline: true },
          { name: 'Region', value: server.region, inline: true },
          { name: 'Boost Level', value: server.boostLevel || 0, inline: true },
          { name: 'Verification Level', value: server.verificationLevel, inline: true }
        ],
        color: 0x7289da,
        footer: { text: `Server ID: ${server.id}` }
      }
    };
  }

  async userInfoCommand(message, args, context) {
    const userId = args[0] ? this.parseUserId(args[0]) : context.userId;
    const user = await this.getUserInfo(userId);
    
    return {
      type: 'embed',
      embed: {
        title: `${user.username}#${user.discriminator}`,
        thumbnail: { url: user.avatar },
        fields: [
          { name: 'ID', value: user.id, inline: true },
          { name: 'Status', value: user.status, inline: true },
          { name: 'Created', value: moment(user.createdAt).format('MMMM Do YYYY'), inline: true },
          { name: 'Joined', value: moment(user.joinedAt).format('MMMM Do YYYY'), inline: true },
          { name: 'Roles', value: user.roles.join(', ') || 'None', inline: false }
        ],
        color: this.getUserColor(user.status)
      }
    };
  }

  // ========================
  // Utility Commands
  // ========================

  async remindCommand(message, args, context) {
    if (args.length < 2) {
      return {
        type: 'message',
        content: 'Usage: !remind <time> <message>\nExample: !remind 30m Check the oven'
      };
    }
    
    const timeStr = args[0];
    const reminderText = args.slice(1).join(' ');
    const delay = this.parseTime(timeStr);
    
    if (!delay) {
      return {
        type: 'message',
        content: 'Invalid time format. Use formats like: 30s, 5m, 2h, 1d'
      };
    }
    
    const reminderId = uuidv4();
    const reminder = {
      id: reminderId,
      userId: context.userId,
      channelId: context.channelId,
      message: reminderText,
      createdAt: Date.now(),
      triggerAt: Date.now() + delay
    };
    
    // Save reminder
    await redisClient.setex(
      `reminder:${reminderId}`,
      Math.ceil(delay / 1000),
      JSON.stringify(reminder)
    );
    
    // Schedule reminder
    setTimeout(async () => {
      await this.triggerReminder(reminder);
    }, delay);
    
    this.reminders.set(reminderId, reminder);
    
    return {
      type: 'message',
      content: `✅ Reminder set! I'll remind you in ${timeStr}: "${reminderText}"`
    };
  }

  async pollCommand(message, args, context) {
    if (args.length < 3) {
      return {
        type: 'message',
        content: 'Usage: !poll "Question" "Option 1" "Option 2" ...\nMax 10 options'
      };
    }
    
    // Parse question and options from quoted strings
    const parts = args.join(' ').match(/"([^"]+)"/g);
    if (!parts || parts.length < 3) {
      return {
        type: 'message',
        content: 'Please wrap your question and options in quotes'
      };
    }
    
    const question = parts[0].replace(/"/g, '');
    const options = parts.slice(1).map(opt => opt.replace(/"/g, '')).slice(0, 10);
    
    const pollId = uuidv4();
    const poll = {
      id: pollId,
      question,
      options: options.map((opt, i) => ({
        id: i,
        text: opt,
        votes: []
      })),
      createdBy: context.userId,
      createdAt: Date.now(),
      active: true
    };
    
    // Save poll
    await redisClient.set(`poll:${pollId}`, JSON.stringify(poll));
    this.polls.set(pollId, poll);
    
    // Create poll embed with reactions
    const embed = this.createPollEmbed(poll);
    
    return {
      type: 'poll',
      poll: {
        ...embed,
        pollId,
        reactions: options.map((_, i) => this.getNumberEmoji(i))
      }
    };
  }

  async calculateCommand(message, args, context) {
    if (args.length === 0) {
      return {
        type: 'message',
        content: 'Usage: !calculate <expression>\nExample: !calculate 2 + 2 * 3'
      };
    }
    
    const expression = args.join(' ');
    
    try {
      // Use mathjs for safe expression evaluation
      const math = require('mathjs');
      const result = math.evaluate(expression);
      
      return {
        type: 'embed',
        embed: {
          title: '🧮 Calculator',
          fields: [
            { name: 'Expression', value: `\`${expression}\`` },
            { name: 'Result', value: `\`${result}\`` }
          ],
          color: 0x00ff00
        }
      };
    } catch (error) {
      return {
        type: 'message',
        content: `❌ Invalid expression: ${error.message}`
      };
    }
  }

  async translateCommand(message, args, context) {
    if (args.length < 3) {
      return {
        type: 'message',
        content: 'Usage: !translate <from> <to> <text>\nExample: !translate en es Hello world'
      };
    }
    
    const fromLang = args[0];
    const toLang = args[1];
    const text = args.slice(2).join(' ');
    
    try {
      const result = await translate(text, { from: fromLang, to: toLang });
      
      return {
        type: 'embed',
        embed: {
          title: '🌐 Translation',
          fields: [
            { name: `From (${fromLang})`, value: text },
            { name: `To (${toLang})`, value: result.text }
          ],
          color: 0x4285f4
        }
      };
    } catch (error) {
      return {
        type: 'message',
        content: `❌ Translation failed: ${error.message}`
      };
    }
  }

  async weatherCommand(message, args, context) {
    if (args.length === 0) {
      return {
        type: 'message',
        content: 'Usage: !weather <location>\nExample: !weather New York'
      };
    }
    
    const location = args.join(' ');
    
    return new Promise((resolve) => {
      weather.find({ search: location, degreeType: 'C' }, (err, result) => {
        if (err || !result || result.length === 0) {
          resolve({
            type: 'message',
            content: `❌ Could not find weather for "${location}"`
          });
          return;
        }
        
        const current = result[0].current;
        const loc = result[0].location;
        
        resolve({
          type: 'embed',
          embed: {
            title: `🌤️ Weather in ${loc.name}`,
            description: current.skytext,
            fields: [
              { name: 'Temperature', value: `${current.temperature}°C`, inline: true },
              { name: 'Feels Like', value: `${current.feelslike}°C`, inline: true },
              { name: 'Humidity', value: `${current.humidity}%`, inline: true },
              { name: 'Wind', value: current.winddisplay, inline: true },
              { name: 'Observation Time', value: current.observationtime, inline: true }
            ],
            thumbnail: { url: current.imageUrl },
            color: 0x00aaff,
            footer: { text: `${loc.lat}, ${loc.long}` }
          }
        });
      });
    });
  }

  // ========================
  // Productivity Commands
  // ========================

  async todoCommand(message, args, context) {
    const subCommand = args[0]?.toLowerCase();
    const userId = context.userId;
    
    switch (subCommand) {
      case 'add':
        return await this.addTodo(userId, args.slice(1).join(' '));
      
      case 'remove':
      case 'delete':
        return await this.removeTodo(userId, parseInt(args[1]));
      
      case 'complete':
      case 'done':
        return await this.completeTodo(userId, parseInt(args[1]));
      
      case 'list':
      default:
        return await this.listTodos(userId);
    }
  }

  async addTodo(userId, task) {
    if (!task) {
      return {
        type: 'message',
        content: 'Please provide a task to add'
      };
    }
    
    const todos = await this.getUserTodos(userId);
    todos.push({
      id: todos.length + 1,
      task,
      completed: false,
      createdAt: Date.now()
    });
    
    await redisClient.set(`todos:${userId}`, JSON.stringify(todos));
    
    return {
      type: 'message',
      content: `✅ Added to your todo list: "${task}"`
    };
  }

  async listTodos(userId) {
    const todos = await this.getUserTodos(userId);
    
    if (todos.length === 0) {
      return {
        type: 'message',
        content: 'Your todo list is empty! Use `!todo add <task>` to add items.'
      };
    }
    
    const todoList = todos.map(todo => 
      `${todo.id}. ${todo.completed ? '~~' : ''}${todo.task}${todo.completed ? '~~' : ''} ${todo.completed ? '✅' : '⬜'}`
    ).join('\n');
    
    return {
      type: 'embed',
      embed: {
        title: '📝 Your Todo List',
        description: todoList,
        color: 0x00ff00,
        footer: { text: 'Use !todo complete <number> to mark as done' }
      }
    };
  }

  // ========================
  // Fun Commands
  // ========================

  async jokeCommand(message, args, context) {
    try {
      const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      const joke = response.data;
      
      return {
        type: 'embed',
        embed: {
          title: '😂 Random Joke',
          description: joke.setup,
          fields: [
            { name: 'Punchline', value: `||${joke.punchline}||` }
          ],
          color: 0xffff00
        }
      };
    } catch (error) {
      return {
        type: 'message',
        content: '❌ Failed to fetch joke'
      };
    }
  }

  async factCommand(message, args, context) {
    try {
      const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
      const fact = response.data;
      
      return {
        type: 'embed',
        embed: {
          title: '🧠 Random Fact',
          description: fact.text,
          color: 0x00ffff,
          footer: { text: fact.source || 'Unknown source' }
        }
      };
    } catch (error) {
      return {
        type: 'message',
        content: '❌ Failed to fetch fact'
      };
    }
  }

  async eightBallCommand(message, args, context) {
    if (args.length === 0) {
      return {
        type: 'message',
        content: 'Please ask a question!'
      };
    }
    
    const responses = [
      'It is certain.',
      'It is decidedly so.',
      'Without a doubt.',
      'Yes - definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'Yes.',
      'Signs point to yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now.',
      'Cannot predict now.',
      'Concentrate and ask again.',
      "Don't count on it.",
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.'
    ];
    
    const question = args.join(' ');
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      type: 'embed',
      embed: {
        title: '🎱 Magic 8-Ball',
        fields: [
          { name: 'Question', value: question },
          { name: 'Answer', value: response }
        ],
        color: 0x000000
      }
    };
  }

  // ========================
  // Server Management
  // ========================

  async announceCommand(message, args, context) {
    if (!context.isAdmin) {
      return {
        type: 'message',
        content: '❌ You need administrator permissions to use this command'
      };
    }
    
    if (args.length === 0) {
      return {
        type: 'message',
        content: 'Usage: !announce <message>'
      };
    }
    
    const announcement = args.join(' ');
    
    return {
      type: 'embed',
      embed: {
        title: '📢 Announcement',
        description: announcement,
        color: 0xff0000,
        author: {
          name: context.userName,
          icon_url: context.userAvatar
        },
        timestamp: new Date().toISOString()
      }
    };
  }

  async welcomeMessageCommand(message, args, context) {
    if (!context.isAdmin) {
      return {
        type: 'message',
        content: '❌ You need administrator permissions to use this command'
      };
    }
    
    const subCommand = args[0]?.toLowerCase();
    
    switch (subCommand) {
      case 'set':
        const welcomeMessage = args.slice(1).join(' ');
        await redisClient.set(
          `welcome:${context.serverId}`,
          JSON.stringify({
            message: welcomeMessage,
            channelId: context.channelId,
            enabled: true
          })
        );
        
        return {
          type: 'message',
          content: '✅ Welcome message has been set!'
        };
      
      case 'disable':
        await redisClient.del(`welcome:${context.serverId}`);
        return {
          type: 'message',
          content: '✅ Welcome message has been disabled'
        };
      
      default:
        return {
          type: 'message',
          content: 'Usage: !welcomemsg set <message> | !welcomemsg disable\nUse {user} to mention the user, {server} for server name'
        };
    }
  }

  // ========================
  // RSS & Notifications
  // ========================

  async rssCommand(message, args, context) {
    const subCommand = args[0]?.toLowerCase();
    
    switch (subCommand) {
      case 'add':
        return await this.addRSSFeed(context.channelId, args[1], args.slice(2).join(' '));
      
      case 'remove':
        return await this.removeRSSFeed(context.channelId, args[1]);
      
      case 'list':
      default:
        return await this.listRSSFeeds(context.channelId);
    }
  }

  async addRSSFeed(channelId, url, name) {
    if (!url) {
      return {
        type: 'message',
        content: 'Please provide an RSS feed URL'
      };
    }
    
    const feedId = uuidv4();
    const feed = {
      id: feedId,
      url,
      name: name || url,
      channelId,
      lastCheck: Date.now(),
      enabled: true
    };
    
    await redisClient.set(`rssfeed:${feedId}`, JSON.stringify(feed));
    this.rssFeeds.set(feedId, feed);
    
    return {
      type: 'message',
      content: `✅ RSS feed added: ${name || url}`
    };
  }

  // ========================
  // Scheduled Tasks
  // ========================

  startScheduledTaskProcessor() {
    // Check for scheduled tasks every minute
    cron.schedule('* * * * *', async () => {
      await this.processScheduledTasks();
    });
  }

  async processScheduledTasks() {
    const now = Date.now();
    
    // Process reminders
    for (const [id, reminder] of this.reminders) {
      if (reminder.triggerAt <= now) {
        await this.triggerReminder(reminder);
        this.reminders.delete(id);
      }
    }
    
    // Process scheduled messages
    for (const [id, task] of this.scheduledTasks) {
      if (task.triggerAt <= now && task.type === 'message') {
        await this.sendScheduledMessage(task);
        this.scheduledTasks.delete(id);
      }
    }
  }

  async triggerReminder(reminder) {
    this.emit('reminder', {
      channelId: reminder.channelId,
      userId: reminder.userId,
      message: `⏰ <@${reminder.userId}> Reminder: ${reminder.message}`
    });
    
    await redisClient.del(`reminder:${reminder.id}`);
  }

  // ========================
  // RSS Feed Checker
  // ========================

  startRSSFeedChecker() {
    // Check RSS feeds every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.checkRSSFeeds();
    });
  }

  async checkRSSFeeds() {
    const parser = new Parser();
    
    for (const [id, feed] of this.rssFeeds) {
      if (!feed.enabled) continue;
      
      try {
        const parsedFeed = await parser.parseURL(feed.url);
        const lastCheck = feed.lastCheck;
        
        // Get new items since last check
        const newItems = parsedFeed.items.filter(item => {
          const pubDate = new Date(item.pubDate || item.isoDate).getTime();
          return pubDate > lastCheck;
        });
        
        if (newItems.length > 0) {
          // Send new items to channel
          for (const item of newItems.slice(0, 3)) { // Limit to 3 items
            this.emit('rss:newItem', {
              channelId: feed.channelId,
              feed: feed.name,
              title: item.title,
              link: item.link,
              description: item.contentSnippet || item.description,
              pubDate: item.pubDate
            });
          }
        }
        
        // Update last check time
        feed.lastCheck = Date.now();
        await redisClient.set(`rssfeed:${id}`, JSON.stringify(feed));
      } catch (error) {
        console.error(`Error checking RSS feed ${feed.url}:`, error);
      }
    }
  }

  // ========================
  // Utility Methods
  // ========================

  parseTime(timeStr) {
    const regex = /^(\d+)([smhd])$/;
    const match = timeStr.match(regex);
    
    if (!match) return null;
    
    const [, amount, unit] = match;
    const multipliers = {
      s: 1000,
      m: 60000,
      h: 3600000,
      d: 86400000
    };
    
    return parseInt(amount) * multipliers[unit];
  }

  parseUserId(input) {
    // Parse user mention or ID
    const match = input.match(/^<@!?(\d+)>$/);
    return match ? match[1] : input;
  }

  getUserColor(status) {
    const colors = {
      online: 0x00ff00,
      idle: 0xffaa00,
      dnd: 0xff0000,
      offline: 0x808080
    };
    return colors[status] || 0x808080;
  }

  getNumberEmoji(number) {
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    return emojis[number] || '❓';
  }

  createPollEmbed(poll) {
    const options = poll.options.map((opt, i) => 
      `${this.getNumberEmoji(i)} ${opt.text} (${opt.votes.length} votes)`
    ).join('\n');
    
    return {
      type: 'embed',
      embed: {
        title: `📊 Poll: ${poll.question}`,
        description: options,
        color: 0x3498db,
        footer: { text: `Poll ID: ${poll.id}` },
        timestamp: new Date(poll.createdAt).toISOString()
      }
    };
  }

  async getUserTodos(userId) {
    const todos = await redisClient.get(`todos:${userId}`);
    return todos ? JSON.parse(todos) : [];
  }

  async getServerInfo(serverId) {
    // This would typically fetch from database
    return {
      id: serverId,
      name: 'Server Name',
      icon: 'https://example.com/icon.png',
      ownerId: '123456789',
      memberCount: 100,
      channelCount: 20,
      roleCount: 10,
      createdAt: Date.now() - 86400000 * 30,
      region: 'us-east',
      boostLevel: 2,
      verificationLevel: 'medium'
    };
  }

  async getUserInfo(userId) {
    // This would typically fetch from database
    return {
      id: userId,
      username: 'Username',
      discriminator: '0001',
      avatar: 'https://example.com/avatar.png',
      status: 'online',
      createdAt: Date.now() - 86400000 * 90,
      joinedAt: Date.now() - 86400000 * 30,
      roles: ['Member', 'Contributor']
    };
  }

  async logCommandUsage(command, userId, serverId) {
    await redisClient.hincrby('command:usage', command, 1);
    await redisClient.hincrby(`command:usage:${serverId}`, command, 1);
    await redisClient.zadd('command:users', Date.now(), `${userId}:${command}`);
  }

  async loadSavedData() {
    // Load reminders
    const reminderKeys = await redisClient.keys('reminder:*');
    for (const key of reminderKeys) {
      const reminder = JSON.parse(await redisClient.get(key));
      this.reminders.set(reminder.id, reminder);
      
      // Re-schedule if still valid
      const timeLeft = reminder.triggerAt - Date.now();
      if (timeLeft > 0) {
        setTimeout(async () => {
          await this.triggerReminder(reminder);
          this.reminders.delete(reminder.id);
        }, timeLeft);
      }
    }
    
    // Load RSS feeds
    const feedKeys = await redisClient.keys('rssfeed:*');
    for (const key of feedKeys) {
      const feed = JSON.parse(await redisClient.get(key));
      this.rssFeeds.set(feed.id, feed);
    }
    
    console.log(`Loaded ${this.reminders.size} reminders and ${this.rssFeeds.size} RSS feeds`);
  }
}

// Create singleton instance
const utilityBot = new UtilityBot();

module.exports = utilityBot;