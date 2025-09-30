// server/services/GamificationService.js
export class GamificationService {
  constructor() {
    this.experienceCurve = this.generateExperienceCurve();
    this.badges = this.loadBadgeDefinitions();
    this.ranks = this.loadRankDefinitions();
    this.quests = this.loadQuestTemplates();
  }

  generateExperienceCurve() {
    const curve = [];
    for (let level = 1; level <= 100; level++) {
      curve[level] = Math.floor(100 * Math.pow(1.5, level - 1));
    }
    return curve;
  }

  loadBadgeDefinitions() {
    return {
      firstMessage: {
        id: 'first_message',
        name: 'First Steps',
        description: 'Send your first message',
        icon: '👋',
        rarity: 'common',
        requirements: { messagesSent: 1 },
      },
      centurion: {
        id: 'centurion',
        name: 'Centurion',
        description: 'Send 100 messages',
        icon: '💯',
        rarity: 'common',
        requirements: { messagesSent: 100 },
      },
      socialButterfly: {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Join 10 servers',
        icon: '🦋',
        rarity: 'rare',
        requirements: { serversJoined: 10 },
      },
      nightOwl: {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Be active between 2 AM and 5 AM',
        icon: '🦉',
        rarity: 'rare',
        requirements: { custom: 'nightActivity' },
      },
      helpful: {
        id: 'helpful',
        name: 'Helpful Hero',
        description: 'Receive 50 thanks reactions',
        icon: '🦸',
        rarity: 'epic',
        requirements: { reactionsReceived: 50, reactionType: 'thanks' },
      },
      yearVeteran: {
        id: 'year_veteran',
        name: 'Veteran',
        description: 'Active member for 1 year',
        icon: '🎖️',
        rarity: 'epic',
        requirements: { accountAge: 365 },
      },
      legendary: {
        id: 'legendary',
        name: 'Legend',
        description: 'Reach level 50',
        icon: '👑',
        rarity: 'legendary',
        requirements: { level: 50 },
      },
    };
  }

  loadRankDefinitions() {
    return [
      { name: 'Newcomer', icon: '🌱', minLevel: 1 },
      { name: 'Member', icon: '🌿', minLevel: 5 },
      { name: 'Regular', icon: '🌳', minLevel: 10 },
      { name: 'Contributor', icon: '⭐', minLevel: 20 },
      { name: 'Expert', icon: '🌟', minLevel: 30 },
      { name: 'Master', icon: '✨', minLevel: 40 },
      { name: 'Grand Master', icon: '💫', minLevel: 50 },
      { name: 'Legend', icon: '👑', minLevel: 75 },
      { name: 'Mythic', icon: '🔮', minLevel: 100 },
    ];
  }

  loadQuestTemplates() {
    return {
      daily: [
        {
          id: 'daily_messages',
          name: 'Daily Chatter',
          description: 'Send 10 messages today',
          requirements: [{ type: 'messages', target: 10 }],
          rewards: { experience: 50 },
        },
        {
          id: 'daily_reactions',
          name: 'Spread the Love',
          description: 'React to 5 messages',
          requirements: [{ type: 'reactions', target: 5 }],
          rewards: { experience: 30 },
        },
        {
          id: 'daily_voice',
          name: 'Voice Activity',
          description: 'Spend 15 minutes in voice channels',
          requirements: [{ type: 'voice_minutes', target: 15 }],
          rewards: { experience: 75 },
        },
      ],
      weekly: [
        {
          id: 'weekly_helper',
          name: 'Community Helper',
          description: 'Help 10 different users',
          requirements: [{ type: 'helpful_messages', target: 10 }],
          rewards: { experience: 500, badges: ['helper'] },
        },
        {
          id: 'weekly_explorer',
          name: 'Channel Explorer',
          description: 'Be active in 5 different channels',
          requirements: [{ type: 'unique_channels', target: 5 }],
          rewards: { experience: 300 },
        },
      ],
      special: [
        {
          id: 'event_halloween',
          name: 'Spooky Season',
          description: 'Collect 100 pumpkin reactions',
          requirements: [{ type: 'specific_reaction', emoji: '🎃', target: 100 }],
          rewards: { experience: 1000, badges: ['halloween_2024'], items: ['spooky_frame'] },
        },
      ],
    };
  }

  async awardExperience(userId, amount, reason) {
    const gamification = await UserGamification.findOne({ user: userId });
    if (!gamification) return;

    gamification.level.experience += amount;

    // Check for level up
    while (gamification.level.experience >= gamification.level.experienceToNext) {
      gamification.level.experience -= gamification.level.experienceToNext;
      gamification.level.current++;
      gamification.level.experienceToNext = this.experienceCurve[gamification.level.current];
      
      // Trigger level up event
      this.emitLevelUp(userId, gamification.level.current);
      
      // Check for rank up
      await this.checkRankUp(gamification);
    }

    await gamification.save();
    
    // Update leaderboards
    await this.updateLeaderboards(userId, gamification);
  }

  async checkBadgeProgress(userId, action, data) {
    const gamification = await UserGamification.findOne({ user: userId });
    if (!gamification) return;

    for (const [badgeId, badge] of Object.entries(this.badges)) {
      // Skip if already unlocked
      if (gamification.badges.find(b => b.id === badgeId)) continue;

      // Check requirements
      let qualified = true;
      for (const [requirement, value] of Object.entries(badge.requirements)) {
        if (requirement === 'custom') {
          qualified = await this.checkCustomRequirement(value, userId, data);
        } else if (gamification.stats[requirement] < value) {
          qualified = false;
        }
      }

      if (qualified) {
        gamification.badges.push({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          rarity: badge.rarity,
          unlockedAt: new Date(),
        });

        // Notify user
        this.emitBadgeUnlocked(userId, badge);
      }
    }

    await gamification.save();
  }

  async generateDailyQuests(userId) {
    const gamification = await UserGamification.findOne({ user: userId });
    if (!gamification) return;

    // Clear expired quests
    gamification.quests = gamification.quests.filter(q => 
      q.expiresAt > new Date() && !q.completedAt
    );

    // Add new daily quests (max 3)
    const dailyQuests = this.getRandomQuests('daily', 3);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    for (const quest of dailyQuests) {
      gamification.quests.push({
        ...quest,
        expiresAt: tomorrow,
        requirements: quest.requirements.map(r => ({ ...r, current: 0 })),
      });
    }

    await gamification.save();
  }

  async updateQuestProgress(userId, action, amount = 1) {
    const gamification = await UserGamification.findOne({ user: userId });
    if (!gamification) return;

    for (const quest of gamification.quests) {
      if (quest.completedAt) continue;

      for (const requirement of quest.requirements) {
        if (requirement.type === action) {
          requirement.current += amount;

          // Check if quest is complete
          if (quest.requirements.every(r => r.current >= r.target)) {
            quest.completedAt = new Date();
            
            // Award rewards
            await this.awardQuestRewards(userId, quest.rewards);
            
            // Notify user
            this.emitQuestCompleted(userId, quest);
          }
        }
      }
    }

    await gamification.save();
  }

  getRandomQuests(type, count) {
    const available = this.quests[type];
    const selected = [];
    const used = new Set();

    while (selected.length < count && selected.length < available.length) {
      const index = Math.floor(Math.random() * available.length);
      if (!used.has(index)) {
        selected.push(available[index]);
        used.add(index);
      }
    }

    return selected;
  }

  async updateLeaderboards(userId, gamification) {
    // Update global leaderboard
    const globalRank = await UserGamification.countDocuments({
      'level.current': { $gt: gamification.level.current },
    }) + 1;
    
    gamification.leaderboard.global = globalRank;

    // Update weekly/monthly leaderboards
    // Implementation depends on tracking system
  }

  emitLevelUp(userId, newLevel) {
    io.to(userId).emit('level-up', { newLevel });
  }

  emitBadgeUnlocked(userId, badge) {
    io.to(userId).emit('badge-unlocked', badge);
  }

  emitQuestCompleted(userId, quest) {
    io.to(userId).emit('quest-completed', quest);
  }
}