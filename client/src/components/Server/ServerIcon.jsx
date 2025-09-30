import React, { useState, useRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import styles from './ServerIcon.module.css';

const ServerIcon = ({
  server,
  isActive,
  hasUnread,
  mentions = 0,
  onClick,
  isDraggable = false,
  index = 0
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const iconRef = useRef(null);
  
  // Get server initials as fallback
  const getInitials = () => {
    return server.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Server icon content
  const iconContent = (
    <motion.div
      ref={iconRef}
      className={`${styles.serverIcon} ${isActive ? styles.active : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      data-tooltip-id={`server-${server.id}`}
      data-tooltip-content={server.name}
    >
      {/* Active/Unread indicator */}
      <div 
        className={styles.indicator}
        data-active={isActive}
        data-unread={hasUnread}
      />
      
      {/* Server icon/avatar */}
      <div className={styles.iconWrapper}>
        {!imageError && server.icon ? (
          <img
            src={server.icon}
            alt={server.name}
            className={styles.iconImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.iconFallback}>
            {getInitials()}
          </div>
        )}
        
        {/* Special badges */}
        {server.verified && (
          <span className={styles.verifiedBadge}>✓</span>
        )}
        
        {server.partnered && (
          <span className={styles.partneredBadge}>👥</span>
        )}
        
        {/* Mention count */}
        {mentions > 0 && (
          <span className={styles.mentionBadge}>
            {mentions > 99 ? '99+' : mentions}
          </span>
        )}
      </div>
      
      {/* Boost indicator */}
      {server.boosted && (
        <div className={styles.boostIndicator}>
          <span className={styles.boostIcon}>🚀</span>
        </div>
      )}
      
      {/* Tooltip */}
      <Tooltip 
        id={`server-${server.id}`}
        place="right"
        className={styles.tooltip}
      />
    </motion.div>
  );
  
  // If draggable, wrap in Draggable component
  if (isDraggable) {
    return (
      <Draggable draggableId={server.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.5 : 1
            }}
          >
            {iconContent}
          </div>
        )}
      </Draggable>
    );
  }
  
  return iconContent;
};

export default ServerIcon;