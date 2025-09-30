import User from '../models/User.js';
import Server from '../models/Server.js';
import Role from '../models/Role.js';

// Check if user has specific role
export const hasRole = (roleName) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id).populate('roles');
      
      const hasRequiredRole = user.roles.some(role => role.name === roleName);
      
      if (!hasRequiredRole) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ error: 'Failed to check permissions' });
    }
  };
};

// Check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user.roles || !req.user.roles.includes('admin')) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to check admin status' });
  }
};

// Check if user is moderator
export const isModerator = async (req, res, next) => {
  try {
    const isMod = req.user.roles && 
      (req.user.roles.includes('moderator') || req.user.roles.includes('admin'));
    
    if (!isMod) {
      return res.status(403).json({ error: 'Moderator access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to check moderator status' });
  }
};

// Check server permissions
export const checkServerPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const { serverId } = req.params;
      
      const server = await Server.findById(serverId)
        .populate('members.user')
        .populate('members.roles');
      
      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }
      
      const member = server.members.find(
        m => m.user._id.toString() === req.user._id.toString()
      );
      
      if (!member) {
        return res.status(403).json({ error: 'Not a member of this server' });
      }
      
      // Check if owner
      if (server.owner.toString() === req.user._id.toString()) {
        return next();
      }
      
      // Check role permissions
      let hasPermission = false;
      
      for (const roleId of member.roles) {
        const role = await Role.findById(roleId);
        
        if (role && (role.permissions.administrator || role.permissions[permission])) {
          hasPermission = true;
          break;
        }
      }
      
      if (!hasPermission) {
        return res.status(403).json({ error: `Missing permission: ${permission}` });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ error: 'Failed to check permissions' });
    }
  };
};

// Check channel permissions
export const checkChannelPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const { channelId } = req.params;
      
      const channel = await Channel.findById(channelId)
        .populate('server');
      
      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }
      
      // Check server membership first
      const server = await Server.findById(channel.server._id)
        .populate('members.roles');
      
      const member = server.members.find(
        m => m.user.toString() === req.user._id.toString()
      );
      
      if (!member) {
        return res.status(403).json({ error: 'Not a member of this server' });
      }
      
      // Check channel-specific permissions
      let hasPermission = false;
      
      // Check role permissions
      for (const roleId of member.roles) {
        const role = await Role.findById(roleId);
        
        if (role && (role.permissions.administrator || role.permissions[permission])) {
          hasPermission = true;
          break;
        }
      }
      
      // Check channel overrides
      for (const override of channel.permissions) {
        if (override.role && member.roles.includes(override.role)) {
          const allow = parseInt(override.allow);
          const deny = parseInt(override.deny);
          
          // Check if permission is explicitly allowed or denied
          // Implementation depends on permission bit flags
        }
      }
      
      if (!hasPermission) {
        return res.status(403).json({ error: `Missing channel permission: ${permission}` });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ error: 'Failed to check channel permissions' });
    }
  };
};