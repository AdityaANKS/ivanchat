const { expect } = require('chai');
const sinon = require('sinon');
const ModerationBot = require('../../server/src/bot/ModerationBot');

describe('Unit: ModerationBot', () => {
  let moderationBot;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    moderationBot = Object.create(ModerationBot);
    moderationBot.autoModRules = new Map();
    moderationBot.messageCache = new Map();
    moderationBot.initializeAutoModRules();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Profanity Check', () => {
    it('should detect profanity', async () => {
      const message = {
        content: 'This is a damn test message',
        userId: 'user123',
        channelId: 'channel123'
      };

      const result = await moderationBot.checkProfanity(message, {}, {
        enabled: true,
        bannedWords: ['test-word']
      });

      expect(result.violated).to.be.true;
      expect(result.reason).to.include('profanity');
      expect(result.action).to.equal('delete');
    });

    it('should detect custom banned words', async () => {
      const message = {
        content: 'This contains a forbidden word',
        userId: 'user123'
      };

      const result = await moderationBot.checkProfanity(message, {}, {
        bannedWords: ['forbidden']
      });

      expect(result.violated).to.be.true;
      expect(result.reason).to.include('banned word');
    });

    it('should pass clean messages', async () => {
      const message = {
        content: 'This is a clean message',
        userId: 'user123'
      };

      const result = await moderationBot.checkProfanity(message, {}, {});

      expect(result.violated).to.be.false;
    });
  });

  describe('Spam Detection', () => {
    it('should detect rapid message spam', async () => {
      const userId = 'spammer123';
      const now = Date.now();

      // Simulate rapid messages
      const messages = [];
      for (let i = 0; i < 6; i++) {
        messages.push({
          content: `Message ${i}`,
          timestamp: now - (i * 500), // 500ms apart
          channelId: 'channel123'
        });
      }

      moderationBot.messageCache.set(userId, messages);

      const result = await moderationBot.checkSpam(
        { userId, content: 'Another message', channelId: 'channel123' },
        {},
        { maxMessages: 5, timeWindow: 5000 }
      );

      expect(result.violated).to.be.true;
      expect(result.severity).to.equal('high');
      expect(result.reason).to.include('too quickly');
      expect(result.action).to.equal('timeout');
    });

    it('should detect duplicate message spam', async () => {
      const userId = 'spammer123';
      const duplicateContent = 'Buy now! Limited offer!';

      const messages = Array(4).fill(null).map((_, i) => ({
        content: duplicateContent,
        timestamp: Date.now() - (i * 1000),
        channelId: 'channel123'
      }));

      moderationBot.messageCache.set(userId, messages);

      const result = await moderationBot.checkSpam(
        { userId, content: duplicateContent, channelId: 'channel123' },
        {},
        {}
      );

      expect(result.violated).to.be.true;
      expect(result.reason).to.include('duplicate');
      expect(result.action).to.equal('delete');
    });

    it('should detect channel hopping spam', async () => {
      const userId = 'spammer123';
      const messages = [];

      for (let i = 0; i < 6; i++) {
        messages.push({
          content: 'Spam message',
          timestamp: Date.now() - (i * 100),
          channelId: `channel${i}`
        });
      }

      moderationBot.messageCache.set(userId, messages);

      const result = await moderationBot.checkSpam(
        { userId, content: 'More spam', channelId: 'channel7' },
        {},
        {}
      );

      expect(result.violated).to.be.true;
      expect(result.reason).to.include('multiple channels');
      expect(result.action).to.equal('timeout');
    });
  });

  describe('Caps Lock Detection', () => {
    it('should detect excessive caps', async () => {
      const message = {
        content: 'THIS IS ALL IN CAPS AND IS ANNOYING'
      };

      const result = await moderationBot.checkCaps(message, {}, {
        minLength: 10,
        maxPercentage: 70
      });

      expect(result.violated).to.be.true;
      expect(result.severity).to.equal('low');
      expect(result.action).to.equal('warn');
    });

    it('should allow normal caps usage', async () => {
      const message = {
        content: 'This is a Normal Message with Some Caps'
      };

      const result = await moderationBot.checkCaps(message, {}, {
        minLength: 10,
        maxPercentage: 70
      });

      expect(result.violated).to.be.false;
    });

    it('should ignore short messages', async () => {
      const message = {
        content: 'HELLO'
      };

      const result = await moderationBot.checkCaps(message, {}, {
        minLength: 10,
        maxPercentage: 70
      });

      expect(result.violated).to.be.false;
    });
  });

  describe('Link Detection', () => {
    it('should detect unauthorized links', async () => {
      const message = {
        content: 'Check out this site: https://spam-site.com'
      };

      const result = await moderationBot.checkLinks(message, {}, {
        blockAllLinks: false,
        allowedDomains: ['github.com', 'youtube.com']
      });

      expect(result.violated).to.be.true;
      expect(result.reason).to.include('unauthorized domain');
      expect(result.action).to.equal('delete');
    });

    it('should allow whitelisted domains', async () => {
      const message = {
        content: 'Here is the repo: https://github.com/user/repo'
      };

      const result = await moderationBot.checkLinks(message, {}, {
        allowedDomains: ['github.com']
      });

      expect(result.violated).to.be.false;
    });

    it('should block all links when configured', async () => {
      const message = {
        content: 'Any link: https://allowed-site.com'
      };

      const result = await moderationBot.checkLinks(message, {}, {
        blockAllLinks: true
      });

      expect(result.violated).to.be.true;
      expect(result.reason).to.include('not allowed');
    });
  });

  describe('Mention Spam Detection', () => {
    it('should detect mass user mentions', async () => {
      const message = {
        content: '<@123> <@456> <@789> <@012> <@345> <@678> check this out!'
      };

      const result = await moderationBot.checkMentions(message, {}, {
        maxMentions: 5
      });

      expect(result.violated).to.be.true;
      expect(result.reason).to.include('Too many user mentions');
      expect(result.action).to.equal('delete');
    });

    it('should detect unauthorized @everyone', async () => {
      const message = {
        content: '@everyone Important announcement!'
      };

      const result = await moderationBot.checkMentions(
        message,
        { canMentionEveryone: false },
        {}
      );

      expect(result.violated).to.be.true;
      expect(result.severity).to.equal('high');
      expect(result.reason).to.include('@everyone');
    });

    it('should allow authorized @everyone', async () => {
      const message = {
        content: '@everyone Server maintenance'
      };

      const result = await moderationBot.checkMentions(
        message,
        { canMentionEveryone: true },
        {}
      );

      expect(result.violated).to.be.false;
    });
  });

  describe('Invite Detection', () => {
    it('should detect Discord invites', async () => {
      const message = {
        content: 'Join my server: discord.gg/abc123'
      };

      const result = await moderationBot.checkInvites(message, {}, {});

      expect(result.violated).to.be.true;
      expect(result.severity).to.equal('high');
      expect(result.reason).to.include('External server invites');
      expect(result.action).to.equal('delete');
    });

    it('should detect various invite formats', async () => {
      const inviteFormats = [
        'discord.gg/test',
        'discord.io/test',
        'discord.me/test',
        'discordapp.com/invite/test'
      ];

      for (const invite of inviteFormats) {
        const result = await moderationBot.checkInvites(
          { content: `Join: ${invite}` },
          {},
          {}
        );
        expect(result.violated).to.be.true;
      }
    });
  });

  describe('Raid Detection', () => {
    it('should detect raid patterns', async () => {
      const serverId = 'server123';
      const now = Date.now();

      // Simulate raid
      const raidData = {
        users: new Map([
          ['user1', now],
          ['user2', now],
          ['user3', now],
          ['user4', now],
          ['user5', now]
        ]),
        messageCount: 25,
        startTime: now
      };

      moderationBot.raidProtection.set(serverId, raidData);

      const result = await moderationBot.checkRaid(
        { serverId, userId: 'user6' },
        {},
        { userThreshold: 5, messageThreshold: 20, timeWindow: 10000 }
      );

      expect(result.violated).to.be.true;
      expect(result.severity).to.equal('critical');
      expect(result.reason).to.include('Raid detected');
      expect(result.action).to.equal('lockdown');
    });

    it('should not trigger on normal activity', async () => {
      const serverId = 'server123';
      
      const result = await moderationBot.checkRaid(
        { serverId, userId: 'user1' },
        {},
        { userThreshold: 10, messageThreshold: 50 }
      );

      expect(result.violated).to.be.false;
    });
  });

  describe('Phishing Detection', () => {
    it('should detect phishing patterns', async () => {
      const message = {
        content: 'FREE NITRO! Click here to claim: http://fake-discord.com'
      };

      sandbox.stub(moderationBot, 'checkPhishingDatabase').resolves(true);

      const result = await moderationBot.checkPhishing(message, {}, {});

      expect(result.violated).to.be.true;
      expect(result.severity).to.equal('critical');
      expect(result.reason).to.include('Phishing');
      expect(result.action).to.equal('ban');
    });

    it('should detect suspicious patterns without links', async () => {
      const message = {
        content: 'Verify your account immediately or it will be deleted!'
      };

      const result = await moderationBot.checkPhishing(message, {}, {});

      expect(result.violated).to.be.true;
      expect(result.severity).to.equal('high');
      expect(result.reason).to.include('Suspicious phishing pattern');
    });
  });

  describe('Toxicity Detection', () => {
    it('should detect toxic content', async () => {
      const message = {
        content: 'I hate you, you stupid idiot!'
      };

      sandbox.stub(moderationBot, 'checkToxicityAPI').resolves(0.9);

      const result = await moderationBot.checkToxicity(message, {}, {
        threshold: 0.7
      });

      expect(result.violated).to.be.true;
      expect(result.severity).to.equal('high');
      expect(result.reason).to.include('Toxic behavior');
      expect(result.action).to.equal('timeout');
    });

    it('should detect severe toxic patterns', async () => {
      const message = {
        content: 'kys'
      };

      const result = await moderationBot.checkToxicity(message, {}, {});

      expect(result.violated).to.be.true;
      expect(result.severity).to.equal('high');
    });
  });

  describe('Violation Handling', () => {
    it('should escalate punishments', async () => {
      const userId = 'repeat-offender';
      const serverId = 'server123';

      // First warning
      await moderationBot.warnUser(userId, serverId, 'First offense');
      expect(moderationBot.warnings.get(userId)).to.have.lengthOf(1);

      // Second warning
      await moderationBot.warnUser(userId, serverId, 'Second offense');
      expect(moderationBot.warnings.get(userId)).to.have.lengthOf(2);

      // Third warning should trigger timeout
      const timeoutSpy = sandbox.spy(moderationBot, 'timeoutUser');
      await moderationBot.warnUser(userId, serverId, 'Third offense');
      
      expect(timeoutSpy.calledOnce).to.be.true;
      expect(timeoutSpy.calledWith(userId, serverId, 3600000)).to.be.true;
    });

    it('should execute appropriate actions', async () => {
      const message = { userId: 'user123', serverId: 'server123', channelId: 'channel123' };
      const violations = [
        { rule: 'spam', severity: 'high', reason: 'Spamming', action: 'timeout' }
      ];

      const result = await moderationBot.executeAction('timeout', message, {}, violations);

      expect(result.allowed).to.be.false;
      expect(result.delete).to.be.true;
      expect(result.timeout).to.be.true;
      expect(result.duration).to.equal(600000);
    });

    it('should handle multiple violations', async () => {
      const violations = [
        { severity: 'low', action: 'warn' },
        { severity: 'medium', action: 'delete' },
        { severity: 'high', action: 'timeout' }
      ];

      const message = { userId: 'user123', serverId: 'server123' };
      const result = await moderationBot.handleViolations(violations, message, {});

      // Should execute strongest action
      expect(result.timeout).to.be.true;
    });
  });
});