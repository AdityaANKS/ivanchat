import React, { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiMicOff,
  FiCrown,
  FiShield,
  FiUser
} from 'react-icons/fi';

// Hooks
import { useContextMenu } from '../../hooks/useContextMenu';
import { usePermissions } from '../../hooks/usePermissions';

// Utils
import { groupMembersByRole } from '../../utils/members';

// Styles
import styles from './MembersList.module.css';

const MembersList = ({ serverId, channelId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { members, roles } = useSelector(state => state.servers[serverId] || {});
  const { user: currentUser } = useSelector(state => state.auth);
  const { onlineMembers } = useSelector(state => state.presence);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState(null);
  const [showOffline, setShowOffline] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Hooks
  const { showContextMenu } = useContextMenu();
  const { canKickMembers, canBanMembers, canManageRoles } = usePermissions(serverId);
  
  // Filter and group members
  const filteredMembers = useMemo(() => {
    if (!members) return [];
    
    let filtered = members;
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(member =>
        member.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Role filter
    if (filterRole) {
      filtered = filtered.filter(member =>
        member.roles?.includes(filterRole)
      );
    }
    
    // Online/offline filter
    if (!showOffline) {
      filtered = filtered.filter(member =>
        onlineMembers.includes(member.id)
      );
    }
    
    return filtered;
  }, [members, searchQuery, filterRole, showOffline, onlineMembers]);
  
  // Group members by role
  const groupedMembers = useMemo(() => {
    if (!roles || !filteredMembers) return {};
    
    return groupMembersByRole(filteredMembers, roles);
  }, [filteredMembers, roles]);
  
  // Handle member context menu
  const handleMemberContextMenu = useCallback((event, member) => {
    event.preventDefault();
    
    const menuItems = [
      {
        label: 'View Profile',
        onClick: () => navigate(`/users/${member.id}`)
      },
      {
        label: 'Send Message',
        onClick: () => navigate(`/channels/@me/${member.id}`)
      },
      { type: 'separator' }
    ];
    
    // Moderation options
    if (canManageRoles) {
      menuItems.push({
        label: 'Manage Roles',
        onClick: () => dispatch({
          type: 'ui/showModal',
          payload: { type: 'manageRoles', member, serverId }
        })
      });
    }
    
    if (canKickMembers && member.id !== currentUser.id) {
      menuItems.push({
        label: 'Kick Member',
        onClick: () => dispatch({
          type: 'ui/showModal',
          payload: { type: 'kickMember', member, serverId }
        }),
        danger: true
      });
    }
    
    if (canBanMembers && member.id !== currentUser.id) {
      menuItems.push({
        label: 'Ban Member',
        onClick: () => dispatch({
          type: 'ui/showModal',
          payload: { type: 'banMember', member, serverId }
        }),
        danger: true
      });
    }
    
    showContextMenu(event, menuItems);
  }, [canManageRoles, canKickMembers, canBanMembers, currentUser.id, serverId, dispatch, navigate, showContextMenu]);
  
  // Handle member click
  const handleMemberClick = useCallback((member) => {
    setSelectedMember(member.id === selectedMember ? null : member.id);
  }, [selectedMember]);
  
  // Get member status
  const getMemberStatus = useCallback((memberId) => {
    if (onlineMembers.includes(memberId)) {
      return 'online';
    }
    return 'offline';
  }, [onlineMembers]);
  
  // Count online members
  const onlineCount = members?.filter(m => onlineMembers.includes(m.id)).length || 0;
  const totalCount = members?.length || 0;
  
  return (
    <div className={styles.membersList}>
      {/* Header */}
      <div className={styles.header}>
        <h3>Members — {onlineCount}/{totalCount}</h3>
        
        <div className={styles.headerActions}>
          <button
            className={styles.filterButton}
            onClick={() => setShowOffline(!showOffline)}
            title={showOffline ? 'Hide Offline' : 'Show Offline'}
          >
            <FiFilter />
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className={styles.searchContainer}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      
      {/* Members list */}
      <div className={styles.membersContainer}>
        {Object.entries(groupedMembers).map(([roleId, roleMembers]) => {
          const role = roles?.find(r => r.id === roleId);
          if (!role || roleMembers.length === 0) return null;
          
          return (
            <div key={roleId} className={styles.roleGroup}>
              <div className={styles.roleHeader}>
                <span 
                  className={styles.roleName}
                  style={{ color: role.color }}
                >
                  {role.name} — {roleMembers.length}
                </span>
              </div>
              
              <div className={styles.roleMembers}>
                {roleMembers.map(member => {
                  const status = getMemberStatus(member.id);
                  const isSelected = selectedMember === member.id;
                  
                  return (
                    <motion.div
                      key={member.id}
                      className={`${styles.member} ${isSelected ? styles.selected : ''}`}
                      onClick={() => handleMemberClick(member)}
                      onContextMenu={(e) => handleMemberContextMenu(e, member)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: status === 'offline' ? 0.4 : 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <div className={styles.memberAvatar}>
                        <img
                          src={member.avatar || '/default-avatar.png'}
                          alt={member.username}
                        />
                        <span 
                          className={styles.statusIndicator}
                          data-status={status}
                        />
                      </div>
                      
                      <div className={styles.memberInfo}>
                        <span className={styles.memberName}>
                          {member.nickname || member.username}
                          
                          {member.bot && (
                            <span className={styles.botTag}>BOT</span>
                          )}
                        </span>
                        
                        {member.customStatus && (
                          <span className={styles.customStatus}>
                            {member.customStatus}
                          </span>
                        )}
                        
                        {member.activity && (
                          <span className={styles.activity}>
                            {member.activity.type === 'playing' && '🎮'}
                            {member.activity.type === 'streaming' && '📺'}
                            {member.activity.type === 'listening' && '🎵'}
                            {member.activity.type === 'watching' && '📺'}
                            {member.activity.name}
                          </span>
                        )}
                      </div>
                      
                      <div className={styles.memberBadges}>
                        {member.isOwner && (
                          <span className={styles.badge} title="Server Owner">
                            <FiCrown />
                          </span>
                        )}
                        
                        {member.isAdmin && (
                          <span className={styles.badge} title="Administrator">
                            <FiShield />
                          </span>
                        )}
                        
                        {member.isMuted && (
                          <span className={styles.badge} title="Muted">
                            <FiMicOff />
                          </span>
                        )}
                        
                        {member.boosting && (
                          <span className={styles.boostBadge} title="Server Booster">
                            🚀
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {/* No members found */}
        {Object.keys(groupedMembers).length === 0 && (
          <div className={styles.noMembers}>
            <FiUser />
            <p>No members found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersList;