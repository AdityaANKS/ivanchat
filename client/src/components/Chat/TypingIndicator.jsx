import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './TypingIndicator.module.css';

const TypingIndicator = ({ users = [] }) => {
  // Format typing users text
  const typingText = useMemo(() => {
    if (users.length === 0) return '';
    
    if (users.length === 1) {
      return `${users[0].username} is typing`;
    }
    
    if (users.length === 2) {
      return `${users[0].username} and ${users[1].username} are typing`;
    }
    
    if (users.length === 3) {
      return `${users[0].username}, ${users[1].username}, and ${users[2].username} are typing`;
    }
    
    return `${users[0].username} and ${users.length - 1} others are typing`;
  }, [users]);
  
  if (users.length === 0) return null;
  
  return (
    <motion.div
      className={styles.typingIndicator}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className={styles.typingDots}>
        <span className={styles.dot} style={{ animationDelay: '0ms' }} />
        <span className={styles.dot} style={{ animationDelay: '200ms' }} />
        <span className={styles.dot} style={{ animationDelay: '400ms' }} />
      </div>
      <span className={styles.typingText}>{typingText}</span>
    </motion.div>
  );
};

export default TypingIndicator;