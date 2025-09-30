import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiClock, FiSmile, FiHeart, FiX } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import { useSelector } from 'react-redux';
import { useClickOutside } from '../../hooks/useClickOutside';
import styles from './ReactionPicker.module.css';

const ReactionPicker = ({ onSelect, onClose, position = 'top' }) => {
  const pickerRef = useRef(null);
  const searchRef = useRef(null);
  
  // Redux state
  const { user } = useSelector(state => state.auth);
  const { currentServer } = useSelector(state => state.chat);
  const recentEmojis = useSelector(state => state.user.recentEmojis || []);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('frequent');
  const [customEmojis, setCustomEmojis] = useState([]);
  
  // Close on outside click
  useClickOutside(pickerRef, onClose);
  
  // Focus search on mount
  useEffect(() => {
    searchRef.current?.focus();
  }, []);
  
  // Load custom server emojis
  useEffect(() => {
    if (currentServer?.emojis) {
      setCustomEmojis(currentServer.emojis);
    }
  }, [currentServer]);
  
  // Frequent emojis
  const frequentEmojis = [
    '👍', '❤️', '😂', '😍', '😭', '😊', '🔥', '✨',
    '👏', '💯', '🎉', '😎', '👀', '🤔', '😅', '😁'
  ];
  
  // Quick reactions for easy access
  const quickReactions = recentEmojis.length > 0 
    ? recentEmojis.slice(0, 8)
    : frequentEmojis.slice(0, 8);
  
  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    onSelect(emoji);
    onClose();
  };
  
  // Filter emojis based on search
  const filteredCustomEmojis = customEmojis.filter(emoji =>
    emoji.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <motion.div
      ref={pickerRef}
      className={`${styles.reactionPicker} ${styles[position]}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
    >
      {/* Quick reactions bar */}
      <div className={styles.quickReactions}>
        {quickReactions.map((emoji) => (
          <button
            key={emoji}
            className={styles.quickReaction}
            onClick={() => handleEmojiSelect(emoji)}
            title="Quick reaction"
          >
            {emoji}
          </button>
        ))}
      </div>
      
      <div className={styles.divider} />
      
      {/* Search bar */}
      <div className={styles.searchBar}>
        <FiSearch className={styles.searchIcon} />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search emojis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        {searchQuery && (
          <button
            className={styles.clearSearch}
            onClick={() => setSearchQuery('')}
          >
            <FiX />
          </button>
        )}
      </div>
      
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'frequent' ? styles.active : ''}`}
          onClick={() => setActiveTab('frequent')}
          title="Frequently used"
        >
          <FiClock />
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'emoji' ? styles.active : ''}`}
          onClick={() => setActiveTab('emoji')}
          title="Emoji"
        >
          <FiSmile />
        </button>
        {customEmojis.length > 0 && (
          <button
            className={`${styles.tab} ${activeTab === 'custom' ? styles.active : ''}`}
            onClick={() => setActiveTab('custom')}
            title="Server emojis"
          >
            <img 
              src={currentServer?.icon} 
              alt="" 
              className={styles.serverIcon}
            />
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'frequent' && (
          <div className={styles.frequentEmojis}>
            <h3 className={styles.sectionTitle}>Frequently Used</h3>
            <div className={styles.emojiGrid}>
              {(recentEmojis.length > 0 ? recentEmojis : frequentEmojis).map((emoji) => (
                <button
                  key={emoji}
                  className={styles.emojiButton}
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'emoji' && (
          <div className={styles.emojiPickerWrapper}>
            <EmojiPicker
              onEmojiClick={(emojiData) => handleEmojiSelect(emojiData.emoji)}
              searchPlaceholder="Search..."
              theme={user?.theme || 'dark'}
              width="100%"
              height={300}
              previewConfig={{ showPreview: false }}
              skinTonesDisabled={false}
              searchDisabled={true} // We use our own search
              lazyLoadEmojis={true}
            />
          </div>
        )}
        
        {activeTab === 'custom' && (
          <div className={styles.customEmojis}>
            <h3 className={styles.sectionTitle}>
              {currentServer?.name} Emojis
            </h3>
            
            {filteredCustomEmojis.length > 0 ? (
              <div className={styles.customEmojiGrid}>
                {filteredCustomEmojis.map((emoji) => (
                  <button
                    key={emoji.id}
                    className={styles.customEmojiButton}
                    onClick={() => handleEmojiSelect(`:${emoji.name}:`)}
                    title={`:${emoji.name}:`}
                  >
                    <img src={emoji.url} alt={emoji.name} />
                  </button>
                ))}
              </div>
            ) : searchQuery ? (
              <div className={styles.noResults}>
                No emojis found matching "{searchQuery}"
              </div>
            ) : (
              <div className={styles.noCustomEmojis}>
                No custom emojis in this server
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Categories for standard emoji picker */}
      {activeTab === 'emoji' && (
        <div className={styles.categories}>
          <button className={styles.categoryButton} title="People">
            😀
          </button>
          <button className={styles.categoryButton} title="Nature">
            🌿
          </button>
          <button className={styles.categoryButton} title="Food">
            🍔
          </button>
          <button className={styles.categoryButton} title="Activity">
            ⚽
          </button>
          <button className={styles.categoryButton} title="Travel">
            ✈️
          </button>
          <button className={styles.categoryButton} title="Objects">
            💡
          </button>
          <button className={styles.categoryButton} title="Symbols">
            ❤️
          </button>
          <button className={styles.categoryButton} title="Flags">
            🏳️
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ReactionPicker;