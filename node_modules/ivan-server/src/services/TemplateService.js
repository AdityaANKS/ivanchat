// server/services/TemplateService.js
export class TemplateService {
  async createServerFromTemplate(templateId, ownerId, customization = {}) {
    const template = await ServerTemplate.findById(templateId);
    if (!template) throw new Error('Template not found');

    // Increment usage count
    await ServerTemplate.findByIdAndUpdate(templateId, {
      $inc: { usageCount: 1 },
    });

    // Create server
    const server = new Server({
      name: customization.name || template.name,
      owner: ownerId,
      icon: customization.icon || template.icon,
      banner: customization.banner || template.banner,
      settings: { ...template.settings, ...customization.settings },
    });

    await server.save();

    // Create roles
    const roleMap = new Map();
    for (const roleTemplate of template.structure.roles) {
      const role = new Role({
        server: server._id,
        name: roleTemplate.name,
        color: roleTemplate.color,
        permissions: roleTemplate.permissions,
        position: roleTemplate.position,
        mentionable: roleTemplate.mentionable,
      });
      await role.save();
      roleMap.set(roleTemplate.name, role._id);
    }

    // Create categories
    const categoryMap = new Map();
    for (const categoryTemplate of template.structure.categories) {
      const category = new Category({
        server: server._id,
        name: categoryTemplate.name,
        position: categoryTemplate.position,
        permissions: this.mapPermissions(categoryTemplate.permissions, roleMap),
      });
      await category.save();
      categoryMap.set(categoryTemplate.name, category._id);
    }

    // Create channels
    for (const channelTemplate of template.structure.channels) {
      const channel = new Channel({
        server: server._id,
        name: channelTemplate.name,
        type: channelTemplate.type,
        category: categoryMap.get(channelTemplate.category),
        position: channelTemplate.position,
        topic: channelTemplate.topic,
        permissions: this.mapPermissions(channelTemplate.permissions, roleMap),
        slowMode: channelTemplate.settings?.slowMode,
        nsfw: channelTemplate.settings?.nsfw,
      });
      await channel.save();
    }

    // Setup widgets
    for (const widgetTemplate of template.widgets) {
      await this.createWidget(server._id, widgetTemplate);
    }

    // Setup automations
    for (const automation of template.automations) {
      await this.createAutomation(server._id, automation);
    }

    return server;
  }

  async getOfficialTemplates() {
    return ServerTemplate.find({ official: true })
      .sort({ usageCount: -1 });
  }

  async getCommunityTemplates(category = null) {
    const query = { official: false };
    if (category) query.category = category;
    
    return ServerTemplate.find(query)
      .sort({ featured: -1, usageCount: -1 })
      .limit(50);
  }

  mapPermissions(permissions, roleMap) {
    if (!permissions) return {};
    
    const mapped = {};
    for (const [key, value] of Object.entries(permissions)) {
      if (roleMap.has(key)) {
        mapped[roleMap.get(key)] = value;
      } else {
        mapped[key] = value;
      }
    }
    return mapped;
  }

  async createWidget(serverId, widgetConfig) {
    // Implementation for creating server widgets
  }

  async createAutomation(serverId, automation) {
    // Implementation for creating server automations
  }
}