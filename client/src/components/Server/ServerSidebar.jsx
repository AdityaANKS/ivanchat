import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronDown,
  FiSettings,
  FiUserPlus,
  FiBell,
  FiFolder,
  FiShield,
  FiStar,
  FiLogOut,
  FiEdit2,
  FiUsers,
  FiZap,
  FiTrendingUp
} from 'react-icons/fi';

// Components
import ServerBoostModal from './ServerBoostModal';
import ServerSettingsModal from './ServerSettingsModal';
import InviteModal from './InviteModal';

// Hooks
import { usePermissions } from '../../hooks/usePermissions';
import { useContextMenu } from '../../hooks/useContextMenu';

// Utils
import { formatNumber } from '../../utils/format';

// Styles
import styles from './ServerSidebar.module.css';

const ServerSidebar = ({ server, collapsed = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serverId } = useParams();
  
  // Redux state
  const { user } = useSelector(state => state.auth);
  const { serverStats, serverEvents } = useSelector(state => state.servers[serverId] || {});
  const { activeEvent } = useSelector(state => state.events);
  
  // Local state
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Permissions
  const {
    isOwner,
    isAdmin,
    canManageServer,
    canManageRoles,
    canManageChannels,
    canInviteMembers,
    canViewAuditLog,
    canViewInsights
  } = usePermissions(serverId);
  
  // Context menu
  const { showContextMenu } = useContextMenu();
  
  // Handle dropdown toggle
  const handleDropdownToggle = useCallback((e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  }, [showDropdown]);
  
  // Handle server menu item click
  const handleMenuItemClick = useCallback((action) => {
    setShowDropdown(false);
    
    switch (action) {
      case 'invite':
        setShowInviteModal(true);
        break;
      case 'settings':
        if (canManageServer) {
          setShowSettingsModal(true);
        }
        break;
      case 'insights':
        if (canViewInsights) {
          navigate(`/servers/${serverId}/insights`);
        }
        break;
      case 'members':
        navigate(`/servers/${serverId}/members`);
        break;
      case 'roles':
        if (canManageRoles) {
          navigate(`/servers/${serverId}/roles`);
        }
        break;
      case 'audit-log':
        if (canViewAuditLog) {
          navigate(`/servers/${serverId}/audit-log`);
        }
        break;
      case 'boost':
        setShowBoostModal(true);
        break;
      case 'notifications':
        navigate(`/servers/${serverId}/notifications`);
        break;
      case 'privacy':
        navigate(`/servers/${serverId}/privacy`);
        break;
      case 'leave':
        dispatch({
          type: 'ui/showModal',
          payload: {
            type: 'confirm',
            title: 'Leave Server',
            message: `Are you sure you want to leave ${server?.name}?`,
            onConfirm: () => dispatch({ type: 'servers/leave', payload: serverId })
          }
        });
        break;
      default:
        break;
    }
  }, [canManageServer, canManageRoles, canViewAuditLog, canViewInsights, serverId, server, dispatch, navigate]);
  
  if (collapsed) {
    return null;
  }
  
  return (
    <div className={styles.serverSidebar}>
      {/* Server Header with Dropdown */}
      <div 
        className={styles.serverHeader}
        onClick={handleDropdownToggle}
      >
        <div className={styles.serverInfo}>
          <h2 className={styles.serverName}>
            {server?.name}
            {server?.verified && (
              <span className={styles.verifiedBadge} title="Verified">
                ✓
              </span>
            )}
          </h2>
          {server?.premium && (
            <span className={styles.premiumBadge}>PREMIUM</span>
          )}
        </div>
        <button className={`${styles.dropdownIcon} ${showDropdown ? styles.open : ''}`}>
          <FiChevronDown />
        </button>
      </div>
      
      {/* Dropdown Menu */}
      <AnimatePresence>
        {showDropdown && (
          <>
            <div 
              className={styles.dropdownOverlay}
              onClick={() => setShowDropdown(false)}
            />
            <motion.div
              className={styles.dropdownMenu}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Server Boost */}
              <button
                className={styles.dropdownItem}
                onClick={() => handleMenuItemClick('boost')}
              >
                <div className={styles.boostItem}>
                  <FiZap className={styles.boostIcon} />
                  <div className={styles.boostInfo}>
                    <span>Server Boost</span>
                    <span className={styles.boostLevel}>
                      Level {server?.boostLevel || 0} - {server?.boostCount || 0} Boosts
                    </span>
                  </div>
                </div>
              </button>
              
              <div className={styles.dropdownDivider} />
              
              {/* Invite People */}
              {canInviteMembers && (
                <button
                  className={`${styles.dropdownItem} ${styles.inviteItem}`}
                  onClick={() => handleMenuItemClick('invite')}
                >
                  <FiUserPlus />
                  <span>Invite People</span>
                </button>
              )}
              
              {/* Server Settings */}
              {canManageServer && (
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleMenuItemClick('settings')}
                >
                  <FiSettings />
                  <span>Server Settings</span>
                </button>
              )}
              
              {/* Server Insights */}
              {canViewInsights && (
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleMenuItemClick('insights')}
                >
                  <FiTrendingUp />
                  <span>Server Insights</span>
                </button>
              )}
              
              {/* Members */}
              <button
                className={styles.dropdownItem}
                onClick={() => handleMenuItemClick('members')}
              >
                <FiUsers />
                <span>Members</span>
              </button>
              
              {/* Roles */}
              {canManageRoles && (
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleMenuItemClick('roles')}
                >
                  <FiShield />
                  <span>Roles</span>
                </button>
              )}
              
              {/* Audit Log */}
              {canViewAuditLog && (
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleMenuItemClick('audit-log')}
                >
                  <FiFolder />
                  <span>Audit Log</span>
                </button>
              )}
              
              <div className={styles.dropdownDivider} />
              
              {/* Notification Settings */}
              <button
                className={styles.dropdownItem}
                onClick={() => handleMenuItemClick('notifications')}
              >
                <FiBell />
                <span>Notification Settings</span>
              </button>
              
              {/* Privacy Settings */}
              <button
                className={styles.dropdownItem}
                onClick={() => handleMenuItemClick('privacy')}
              >
                <FiShield />
                <span>Privacy Settings</span>
              </button>
              
              <div className={styles.dropdownDivider} />
              
              {/* Leave Server */}
              {!isOwner && (
                <button
                  className={`${styles.dropdownItem} ${styles.dangerItem}`}
                  onClick={() => handleMenuItemClick('leave')}
                >
                  <FiLogOut />
                  <span>Leave Server</span>
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Active Event */}
      {activeEvent && (
        <div className={styles.activeEvent}>
          <div className={styles.eventHeader}>
            <span className={styles.eventBadge}>LIVE</span>
            <span className={styles.eventName}>{activeEvent.name}</span>
          </div>
          <div className={styles.eventInfo}>
            <span className={styles.eventParticipants}>
              {formatNumber(activeEvent.participants)} participating
            </span>
            <button
              className={styles.eventJoin}
              onClick={() => navigate(`/servers/${serverId}/events/${activeEvent.id}`)}
            >
              Join
            </button>
          </div>
        </div>
      )}
      
      {/* Server Stats */}
      {serverStats && (
        <div className={styles.serverStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Members</span>
            <span className={styles.statValue}>
              {formatNumber(serverStats.totalMembers)}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Online</span>
            <span className={styles.statValue}>
              {formatNumber(serverStats.onlineMembers)}
            </span>
          </div>
          {server?.boostLevel > 0 && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Boosts</span>
              <span className={styles.statValue}>
                {server.boostCount}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Modals */}
      <AnimatePresence>
        {showBoostModal && (
          <ServerBoostModal
            server={server}
            onClose={() => setShowBoostModal(false)}
          />
        )}
        
        {showSettingsModal && (
          <ServerSettingsModal
            server={server}
            onClose={() => setShowSettingsModal(false)}
          />
        )}
        
        {showInviteModal && (
          <InviteModal
            serverId={serverId}
            onClose={() => setShowInviteModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServerSidebar;