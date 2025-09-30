// server/bot/BotFramework.js
import EventEmitter from 'events';
import { RateLimiter } from 'limiter';

export class BotFramework extends EventEmitter {
  constructor(token, options = {}) {
    super();
    this.token = token;
    this.commands = new Map();
    this.middleware = [];
    this.rateLimiter = new RateLimiter({
      tokensPerInterval: options.rateLimit || 10,
      interval: 'second',
    });
    this.prefix = options.prefix || '/';
  }

  // Register a command
  command(name, description, handler) {
    this.commands.set(name, {
      name,
      description,
      handler,
      aliases: [],
      permissions: [],
      cooldown: 0,
    });
    return this;
  }

  // Register middleware
  use(middleware) {
    this.middleware.push(middleware);
    return this;
  }

  // Process incoming message
  async processMessage(message) {
    // Rate limiting
    if (!await this.rateLimiter.tryRemoveTokens(1)) {
      return this.emit('rateLimit', message);
    }

    // Run middleware
    for (const mw of this.middleware) {
      const result = await mw(message, this);
      if (result === false) return;
    }

    // Check if message is a command
    if (!message.content.startsWith(this.prefix)) return;

    const args = message.content.slice(this.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = this.commands.get(commandName);

    if (!command) {
      return this.emit('unknownCommand', commandName, message);
    }

    try {
      await command.handler({
        message,
        args,
        bot: this,
        reply: (content) => this.sendMessage(message.channel, content),
        react: (emoji) => this.addReaction(message, emoji),
      });
    } catch (error) {
      this.emit('commandError', error, command, message);
    }
  }

  // Send a message
  async sendMessage(channelId, content, options = {}) {
    // Implementation for sending messages
    const message = {
      channelId,
      content,
      embed: options.embed,
      attachments: options.attachments,
      botId: this.botId,
    };

    // Emit to socket or API
    this.emit('sendMessage', message);
    return message;
  }

  // Add reaction to message
  async addReaction(message, emoji) {
    this.emit('addReaction', { messageId: message._id, emoji });
  }

  // Create an embed
  createEmbed() {
    return new MessageEmbed();
  }
}

// Message Embed Builder
export class MessageEmbed {
  constructor() {
    this.data = {
      title: null,
      description: null,
      color: null,
      fields: [],
      thumbnail: null,
      image: null,
      footer: null,
      timestamp: null,
    };
  }

  setTitle(title) {
    this.data.title = title;
    return this;
  }

  setDescription(description) {
    this.data.description = description;
    return this;
  }

  setColor(color) {
    this.data.color = color;
    return this;
  }

  addField(name, value, inline = false) {
    this.data.fields.push({ name, value, inline });
    return this;
  }

  setThumbnail(url) {
    this.data.thumbnail = url;
    return this;
  }

  setImage(url) {
    this.data.image = url;
    return this;
  }

  setFooter(text, iconUrl) {
    this.data.footer = { text, iconUrl };
    return this;
  }

  setTimestamp(timestamp = Date.now()) {
    this.data.timestamp = timestamp;
    return this;
  }

  toJSON() {
    return this.data;
  }
}