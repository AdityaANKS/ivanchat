// server/services/MessageScheduler.js
import cron from 'node-cron';
import ScheduledMessage from '../models/ScheduledMessage.js';
import Message from '../models/Message.js';

export class MessageScheduler {
  constructor() {
    this.jobs = new Map();
    this.initializeScheduler();
  }

  async initializeScheduler() {
    // Check for scheduled messages every minute
    cron.schedule('* * * * *', async () => {
      await this.processScheduledMessages();
    });

    // Load recurring messages
    await this.loadRecurringMessages();
  }

  async scheduleMessage(data) {
    const scheduledMessage = new ScheduledMessage(data);
    await scheduledMessage.save();

    if (data.recurring?.enabled) {
      await this.setupRecurringJob(scheduledMessage);
    }

    return scheduledMessage;
  }

  async processScheduledMessages() {
    const now = new Date();
    const messages = await ScheduledMessage.find({
      scheduledFor: { $lte: now },
      status: 'pending',
    }).populate('author channel');

    for (const scheduled of messages) {
      try {
        await this.sendScheduledMessage(scheduled);
        
        if (scheduled.recurring?.enabled) {
          await this.scheduleNextRecurrence(scheduled);
        } else {
          scheduled.status = 'sent';
          scheduled.sentAt = new Date();
          await scheduled.save();
        }
      } catch (error) {
        console.error('Failed to send scheduled message:', error);
        scheduled.status = 'failed';
        scheduled.error = error.message;
        await scheduled.save();
      }
    }
  }

  async sendScheduledMessage(scheduled) {
    const message = new Message({
      content: scheduled.content,
      author: scheduled.author,
      channel: scheduled.channel,
      attachments: scheduled.attachments,
      embeds: scheduled.embeds,
      isScheduled: true,
    });

    await message.save();
    
    // Emit to channel
    io.to(`channel:${scheduled.channel._id}`).emit('new-message', {
      message: message.toObject(),
    });

    return message;
  }

  async setupRecurringJob(scheduled) {
    let cronPattern;
    
    switch (scheduled.recurring.pattern) {
      case 'daily':
        cronPattern = `${scheduled.scheduledFor.getMinutes()} ${scheduled.scheduledFor.getHours()} * * *`;
        break;
      case 'weekly':
        cronPattern = `${scheduled.scheduledFor.getMinutes()} ${scheduled.scheduledFor.getHours()} * * ${scheduled.scheduledFor.getDay()}`;
        break;
      case 'monthly':
        cronPattern = `${scheduled.scheduledFor.getMinutes()} ${scheduled.scheduledFor.getHours()} ${scheduled.scheduledFor.getDate()} * *`;
        break;
      case 'custom':
        cronPattern = scheduled.recurring.customPattern;
        break;
    }

    if (cronPattern) {
      const job = cron.schedule(cronPattern, async () => {
        await this.sendScheduledMessage(scheduled);
      });
      
      this.jobs.set(scheduled._id.toString(), job);
    }
  }

  async scheduleNextRecurrence(scheduled) {
    const next = this.calculateNextRun(scheduled);
    
    if (next && (!scheduled.recurring.endDate || next <= scheduled.recurring.endDate)) {
      scheduled.scheduledFor = next;
      scheduled.recurring.nextRun = next;
      scheduled.status = 'pending';
      await scheduled.save();
    } else {
      // Recurring schedule has ended
      scheduled.status = 'completed';
      await scheduled.save();
      
      // Stop the cron job
      const job = this.jobs.get(scheduled._id.toString());
      if (job) {
        job.stop();
        this.jobs.delete(scheduled._id.toString());
      }
    }
  }

  calculateNextRun(scheduled) {
    const current = scheduled.scheduledFor;
    const next = new Date(current);

    switch (scheduled.recurring.pattern) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'custom':
        // Parse cron expression to calculate next run
        // Implementation would use a cron parser library
        break;
    }

    return next;
  }

  async loadRecurringMessages() {
    const recurring = await ScheduledMessage.find({
      'recurring.enabled': true,
      status: 'pending',
    });

    for (const message of recurring) {
      await this.setupRecurringJob(message);
    }
  }

  async cancelScheduledMessage(messageId) {
    const scheduled = await ScheduledMessage.findById(messageId);
    if (!scheduled) throw new Error('Scheduled message not found');

    scheduled.status = 'cancelled';
    await scheduled.save();

    // Stop recurring job if exists
    const job = this.jobs.get(messageId);
    if (job) {
      job.stop();
      this.jobs.delete(messageId);
    }

    return scheduled;
  }
}