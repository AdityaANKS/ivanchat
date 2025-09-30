import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiActivity,
  FiAward,
  FiGithub,
  FiTwitter,
  FiGlobe,
  FiMessageSquare,
  FiUserPlus,
  FiUserMinus,
  FiMoreVertical,
  FiEdit2,
  FiFlag,
  FiShield,
  FiStar
} from 'react-icons/fi';

// Components
import BadgeList from './BadgeList';
import ActivityGraph from './ActivityGraph';
import MutualServers from './MutualServers';
import UserNotes from './UserNotes';

// Hooks
import { useUser } from '../../hooks/useUser';
import { useFriendship } from '../../hooks/useFriendship';

// Services
import { userService } from '../../services/users';

// Styles
import styles from './UserProfile.module.css';

const UserProfile = ({ userId: propUserId, isModal = false }) => {
  const { userId: routeUserId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const userId = propUserId || routeUserId;
  
  // Redux state
  const { user: currentUser } = useSelector(state => state.auth);
  const { theme } = useSelector(state => state.ui);
  
  // Local state
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
  // Hooks
  const { userData, isOnline, lastSeen } = useUser(userId);
  const { isFriend, isPending, isBlocked, sendRequest, removeFriend, blockUser } = useFriendship(userId);
  
  const isOwnProfile = currentUser?.id === userId;
  
  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const data = await userService.getUserProfile(userId);
        setProfile(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      loadProfile();
    }
  }, [userId]);
  
  // Handlers
  const handleSendMessage = () => {
    navigate(`/channels/@me/${userId}`);
  };
  
  const handleAddFriend = async () => {
    await sendRequest();
    dispatch({
      type: 'notifications/show',
      payload: {
        type: 'success',
        message: 'Friend request sent'
      }
    });
  };
  
  const handleRemoveFriend = async () => {
    if (confirm('Are you sure you want to remove this friend?')) {
      await removeFriend();
    }
  };
  
  const handleBlock = async () => {
    if (confirm('Are you sure you want to block this user?')) {
      await blockUser();
    }
  };
  
  const handleReport = () => {
    dispatch({
      type: 'ui/showModal',
      payload: {
        type: 'report',
        data: { userId, type: 'user' }
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className={styles.notFound}>
        <h2>User not found</h2>
        <p>This user doesn't exist or you don't have permission to view their profile.</p>
      </div>
    );
  }
  
  return (
    <div className={`${styles.userProfile} ${isModal ? styles.modal : ''}`}>
      {/* Banner */}
      <div 
        className={styles.banner}
        style={{ 
          backgroundImage: profile.banner ? `url(${profile.banner})` : 
            `linear-gradient(135deg, ${profile.accentColor || '#5865F2'} 0%, #2d3748 100%)`
        }}
      >
        {profile.isPremium && (
          <div className={styles.premiumBadge}>
            <FiStar /> Premium
          </div>
        )}
      </div>
      
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            <img
              src={profile.avatar || '/default-avatar.png'}
              alt={profile.username}
              className={styles.avatar}
            />
            <span 
              className={styles.statusIndicator}
              data-status={isOnline ? profile.status : 'offline'}
            />
          </div>
          
          {profile.badges && profile.badges.length > 0 && (
            <div className={styles.badges}>
              <BadgeList badges={profile.badges} />
            </div>
          )}
        </div>
        
        <div className={styles.userInfo}>
          <div className={styles.nameSection}>
            <h1 className={styles.username}>
              {profile.displayName || profile.username}
            </h1>
            <span className={styles.discriminator}>
              #{profile.discriminator}
            </span>
            
            {profile.bot && (
              <span className={styles.botTag}>BOT</span>
            )}
            
            {profile.verified && (
              <span className={styles.verifiedBadge} title="Verified">
                ✓
              </span>
            )}
          </div>
          
          {profile.customStatus && (
            <div className={styles.customStatus}>
              {profile.customStatus.emoji && (
                <span className={styles.statusEmoji}>
                  {profile.customStatus.emoji}
                </span>
              )}
              <span className={styles.statusText}>
                {profile.customStatus.text}
              </span>
            </div>
          )}
          
          <div className={styles.userMeta}>
            <span className={styles.metaItem}>
              <FiCalendar />
              Member since {format(new Date(profile.createdAt), 'MMMM yyyy')}
            </span>
            
            {lastSeen && !isOnline && (
              <span className={styles.metaItem}>
                <FiActivity />
                Last seen {format(new Date(lastSeen), 'PPp')}
              </span>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        {!isOwnProfile && (
          <div className={styles.actions}>
            <button
              className={styles.primaryButton}
              onClick={handleSendMessage}
            >
              <FiMessageSquare />
              Send Message
            </button>
            
            {!isFriend && !isPending && !isBlocked && (
              <button
                className={styles.secondaryButton}
                onClick={handleAddFriend}
              >
                <FiUserPlus />
                Add Friend
              </button>
            )}
            
            {isFriend && (
              <button
                className={styles.secondaryButton}
                onClick={handleRemoveFriend}
              >
                <FiUserMinus />
                Remove Friend
              </button>
            )}
            
            {isPending && (
              <button className={styles.secondaryButton} disabled>
                Pending
              </button>
            )}
            
            <button
              className={styles.moreButton}
              onClick={() => setShowMoreOptions(!showMoreOptions)}
            >
              <FiMoreVertical />
            </button>
            
            {showMoreOptions && (
              <div className={styles.moreOptions}>
                {!isBlocked && (
                  <button onClick={handleBlock}>
                    <FiShield /> Block
                  </button>
                )}
                <button onClick={handleReport}>
                  <FiFlag /> Report
                </button>
              </div>
            )}
          </div>
        )}
        
        {isOwnProfile && (
          <button
            className={styles.editButton}
            onClick={() => navigate('/settings/profile')}
          >
            <FiEdit2 />
            Edit Profile
          </button>
        )}
      </div>
      
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'activity' ? styles.active : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'mutual' ? styles.active : ''}`}
          onClick={() => setActiveTab('mutual')}
        >
          Mutual Servers
        </button>
        {(isOwnProfile || isFriend) && (
          <button
            className={`${styles.tab} ${activeTab === 'notes' ? styles.active : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        )}
      </div>
      
      {/* Tab Content */}
      <div className={styles.tabContent}>
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.overviewTab}
            >
              {/* About section */}
              {profile.bio && (
                <section className={styles.section}>
                  <h3>About</h3>
                  <p className={styles.bio}>{profile.bio}</p>
                </section>
              )}
              
              {/* Social links */}
              {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
                <section className={styles.section}>
                  <h3>Social</h3>
                  <div className={styles.socialLinks}>
                    {profile.socialLinks.github && (
                      <a
                        href={`https://github.com/${profile.socialLinks.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        <FiGithub />
                        {profile.socialLinks.github}
                      </a>
                    )}
                    {profile.socialLinks.twitter && (
                      <a
                        href={`https://twitter.com/${profile.socialLinks.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        <FiTwitter />
                        {profile.socialLinks.twitter}
                      </a>
                    )}
                    {profile.socialLinks.website && (
                      <a
                        href={profile.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        <FiGlobe />
                        Website
                      </a>
                    )}
                  </div>
                </section>
              )}
              
              {/* Roles in mutual servers */}
              {profile.mutualServers && profile.mutualServers.length > 0 && (
                <section className={styles.section}>
                  <h3>Roles</h3>
                  <div className={styles.rolesList}>
                    {profile.mutualServers.map(server => (
                      <div key={server.id} className={styles.serverRoles}>
                        <span className={styles.serverName}>{server.name}</span>
                        <div className={styles.roles}>
                          {server.roles.map(role => (
                            <span
                              key={role.id}
                              className={styles.role}
                              style={{ backgroundColor: role.color }}
                            >
                              {role.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}
          
          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.activityTab}
            >
              <ActivityGraph userId={userId} />
              
              {/* Recent activity */}
              <section className={styles.section}>
                <h3>Recent Activity</h3>
                {profile.recentActivity && profile.recentActivity.length > 0 ? (
                  <div className={styles.activityList}>
                    {profile.recentActivity.map(activity => (
                      <div key={activity.id} className={styles.activityItem}>
                        <span className={styles.activityTime}>
                          {format(new Date(activity.timestamp), 'p')}
                        </span>
                        <span className={styles.activityText}>
                          {activity.description}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noActivity}>No recent activity</p>
                )}
              </section>
            </motion.div>
          )}
          
          {activeTab === 'mutual' && (
            <motion.div
              key="mutual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.mutualTab}
            >
              <MutualServers userId={userId} currentUserId={currentUser.id} />
            </motion.div>
          )}
          
          {activeTab === 'notes' && (isOwnProfile || isFriend) && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.notesTab}
            >
              <UserNotes userId={userId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;