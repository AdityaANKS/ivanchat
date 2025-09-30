import React, { useState, useRef, useCallback, memo, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  FiEdit2,
  FiTrash2,
  FiCornerUpLeft,
  FiMoreHorizontal,
  FiPin,
  FiCopy,
  FiShare,
  FiFlag,
  FiEye,
  FiMessageSquare,
  FiMaximize2
} from 'react-icons/fi';

// Components
import ReactionPicker from './ReactionPicker';
import MessageEmbed from './MessageEmbed';
import MessageAttachment from './MessageAttachment';
import UserPopover from '../User/UserPopover';
import ContextMenu from '../common/ContextMenu';

// Hooks
import { useContextMenu } from '../../hooks/useContextMenu';
import { usePermissions } from '../../hooks/usePermissions';

// Services
import { messageService } from '../../services/messages';

// Utils
import { parseMessageContent, extractMentions } from '../../utils/messageParser';
import { copyToClipboard } from '../../utils/clipboard';
import { playSound } from '../../utils/audio';

// Styles
import styles from './Message.module.css';

const Message = forwardRef(({
  message,
  isGrouped,
  isLastInGroup,
  isHighlighted,
  isSelected,
  isEditing,
  isUnread,
  onSelect,
  onReply,
  onEdit,
  onJumpToReply
}, ref) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { user } = useSelector(state => state.auth);
  const { currentServer, currentChannel } = useSelector(state => state.chat);
  const { theme } = useSelector(state => state.ui);
  
  // Local state
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showUserPopover, setShowUserPopover] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Refs
  const messageRef = useRef(null);
  const actionsRef = useRef(null);
  
  // Permissions
  const { canManageMessages, canPinMessages } = usePermissions(currentServer?.id);
  
  // Context menu
  const { showContextMenu } = useContextMenu();
  
  // Computed properties
  const isOwnMessage = message.authorId === user?.id;
  const canEdit = isOwnMessage && !message.system;
  const canDelete = isOwnMessage || canManageMessages;
  const hasReactions = message.reactions?.length > 0;
  const hasMentions = message.mentions?.length > 0;
  const isReply = !!message.replyTo;
  const isEdited = !!message.editedAt;
  const isPinned = !!message.pinned;
  
  // Handlers
  const handleEdit = useCallback(() => {
    if (!canEdit) return;
    onEdit();
    playSound('click');
  }, [canEdit, onEdit]);
  
  const handleDelete = useCallback(async () => {
    if (!canDelete || isDeleting) return;
    
    setIsDeleting(true);
    try {
      await messageService.deleteMessage(message.id);
      dispatch({
        type: 'notifications/show',
        payload: {
          type: 'success',
          message: 'Message deleted'
        }
      });
      playSound('delete');
    } catch (error) {
      dispatch({
        type: 'notifications/show',
        payload: {
          type: 'error',
          message: 'Failed to delete message'
        }
      });
    } finally {
      setIsDeleting(false);
    }
  }, [canDelete, isDeleting, message.id, dispatch]);
  
  const handleReply = useCallback(() => {
    onReply();
    playSound('click');
  }, [onReply]);
  
  const handleReaction = useCallback(async (emoji) => {
    try {
      await messageService.addReaction(message.id, emoji);
      setShowReactionPicker(false);
      playSound('reaction');
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  }, [message.id]);
  
  const handleRemoveReaction = useCallback(async (emoji) => {
    try {
      await messageService.removeReaction(message.id, emoji);
      playSound('click');
    } catch (error) {
      console.error('Failed to remove reaction:', error);
    }
  }, [message.id]);
  
  const handlePin = useCallback(async () => {
    if (!canPinMessages) return;
    
    try {
      if (isPinned) {
        await messageService.unpinMessage(message.id);
        dispatch({
          type: 'notifications/show',
          payload: { type: 'success', message: 'Message unpinned' }
        });
      } else {
        await messageService.pinMessage(message.id);
        dispatch({
          type: 'notifications/show',
          payload: { type: 'success', message: 'Message pinned' }
        });
      }
      playSound('success');
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  }, [canPinMessages, isPinned, message.id, dispatch]);
  
  const handleCopy = useCallback(() => {
    copyToClipboard(message.content);
    dispatch({
      type: 'notifications/show',
      payload: { type: 'success', message: 'Message copied' }
    });
  }, [message.content, dispatch]);
  
  const handleReport = useCallback(() => {
    dispatch({
      type: 'ui/showModal',
      payload: {
        type: 'report',
        data: { messageId: message.id }
      }
    });
  }, [message.id, dispatch]);
  
  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    
    const menuItems = [
      {
        label: 'Reply',
        icon: <FiCornerUpLeft />,
        onClick: handleReply
      },
      {
        label: 'Edit',
        icon: <FiEdit2 />,
        onClick: handleEdit,
        disabled: !canEdit
      },
      {
        label: 'Delete',
        icon: <FiTrash2 />,
        onClick: handleDelete,
        disabled: !canDelete,
        danger: true
      },
      { type: 'separator' },
      {
        label: isPinned ? 'Unpin' : 'Pin',
        icon: <FiPin />,
        onClick: handlePin,
        disabled: !canPinMessages
      },
      {
        label: 'Copy Text',
        icon: <FiCopy />,
        onClick: handleCopy
      },
      {
        label: 'Copy Message Link',
        icon: <FiShare />,
        onClick: () => {
          const link = `${window.location.origin}/channels/${currentChannel.id}/${message.id}`;
          copyToClipboard(link);
        }
      },
      { type: 'separator' },
      {
        label: 'Mark as Unread',
        icon: <FiEye />,
        onClick: () => {
          dispatch({
            type: 'notifications/markUnread',
            payload: { channelId: currentChannel.id, messageId: message.id }
          });
        }
      },
      {
        label: 'Create Thread',
        icon: <FiMessageSquare />,
        onClick: () => {
          dispatch({
            type: 'ui/showModal',
            payload: {
              type: 'createThread',
              data: { messageId: message.id }
            }
          });
        }
      },
      { type: 'separator' },
      {
        label: 'Report',
        icon: <FiFlag />,
        onClick: handleReport,
        danger: true
      }
    ];
    
    showContextMenu(event, menuItems);
  }, [
    handleReply,
    handleEdit,
    handleDelete,
    handlePin,
    handleCopy,
    handleReport,
    canEdit,
    canDelete,
    canPinMessages,
    isPinned,
    message.id,
    currentChannel.id,
    dispatch,
    showContextMenu
  ]);
  
  // Render message content with markdown
  const renderContent = useCallback(() => {
    const parsedContent = parseMessageContent(message.content, {
      mentions: message.mentions,
      channels: currentServer?.channels,
      emojis: currentServer?.emojis
    });
    
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={theme === 'dark' ? vscDarkPlus : undefined}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {children}
              </a>
            );
          }
        }}
      >
        {parsedContent}
      </ReactMarkdown>
    );
  }, [message.content, message.mentions, currentServer, theme]);
  
  // System message rendering
  if (message.system) {
    return (
      <div className={styles.systemMessage}>
        <span className={styles.systemIcon}>📢</span>
        <span className={styles.systemContent}>{message.content}</span>
        <time className={styles.systemTime}>
          {format(new Date(message.createdAt), 'HH:mm')}
        </time>
      </div>
    );
  }
  
  return (
    <div
      ref={ref}
      className={`
        ${styles.message}
        ${isGrouped ? styles.grouped : ''}
        ${isHighlighted ? styles.highlighted : ''}
        ${isSelected ? styles.selected : ''}
        ${isUnread ? styles.unread : ''}
        ${isPinned ? styles.pinned : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={handleContextMenu}
      data-message-id={message.id}
    >
      {/* Reply indicator */}
      {isReply && message.replyTo && (
        <div className={styles.replyIndicator}>
          <FiCornerUpLeft className={styles.replyIcon} />
          <img
            src={message.replyTo.author?.avatar}
            alt=""
            className={styles.replyAvatar}
          />
          <span
            className={styles.replyAuthor}
            style={{ color: message.replyTo.author?.color }}
          >
            {message.replyTo.author?.username}
          </span>
          <span
            className={styles.replyContent}
            onClick={() => onJumpToReply(message.replyTo.id)}
          >
            {message.replyTo.content}
          </span>
        </div>
      )}
      
      <div className={styles.messageContent}>
        {/* Avatar (only show if not grouped) */}
        {!isGrouped && (
          <div
            className={styles.avatar}
            onClick={() => setShowUserPopover(!showUserPopover)}
          >
            <img src={message.author?.avatar || '/default-avatar.png'} alt="" />
            <AnimatePresence>
              {showUserPopover && (
                <UserPopover
                  user={message.author}
                  onClose={() => setShowUserPopover(false)}
                />
              )}
            </AnimatePresence>
          </div>
        )}
        
        <div className={styles.messageBody}>
          {/* Header (only show if not grouped) */}
          {!isGrouped && (
            <div className={styles.messageHeader}>
              <span
                className={styles.authorName}
                style={{ color: message.author?.color }}
                onClick={() => navigate(`/users/${message.author.id}`)}
              >
                {message.author?.username}
              </span>
              
              {message.author?.bot && (
                <span className={styles.botTag}>BOT</span>
              )}
              
              <time
                className={styles.timestamp}
                title={format(new Date(message.createdAt), 'PPpp')}
              >
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </time>
              
              {isEdited && (
                <span className={styles.editedTag}>(edited)</span>
              )}
            </div>
          )}
          
          {/* Message content */}
          {isEditing ? (
            <div className={styles.editForm}>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    // Save edit
                  } else if (e.key === 'Escape') {
                    onEdit(); // Cancel edit
                  }
                }}
                autoFocus
              />
              <div className={styles.editActions}>
                <span className={styles.editHint}>
                  escape to <button onClick={onEdit}>cancel</button> • 
                  enter to <button>save</button>
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.messageText}>
              {renderContent()}
            </div>
          )}
          
          {/* Embeds */}
          {message.embeds?.map((embed, index) => (
            <MessageEmbed key={index} embed={embed} />
          ))}
          
          {/* Attachments */}
          {message.attachments?.map((attachment) => (
            <MessageAttachment
              key={attachment.id}
              attachment={attachment}
              onExpand={() => {
                dispatch({
                  type: 'ui/showModal',
                  payload: {
                    type: 'imageViewer',
                    data: { images: message.attachments, startIndex: 0 }
                  }
                });
              }}
            />
          ))}
          
          {/* Reactions */}
          {hasReactions && (
            <div className={styles.reactions}>
              {message.reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  className={`
                    ${styles.reaction}
                    ${reaction.users.includes(user.id) ? styles.reacted : ''}
                  `}
                  onClick={() => {
                    if (reaction.users.includes(user.id)) {
                      handleRemoveReaction(reaction.emoji);
                    } else {
                      handleReaction(reaction.emoji);
                    }
                  }}
                >
                  <span className={styles.reactionEmoji}>{reaction.emoji}</span>
                  <span className={styles.reactionCount}>{reaction.count}</span>
                </button>
              ))}
              
              <button
                className={styles.addReaction}
                onClick={() => setShowReactionPicker(!showReactionPicker)}
              >
                +
              </button>
            </div>
          )}
        </div>
        
        {/* Message actions (shown on hover) */}
        <AnimatePresence>
          {(isHovered || showReactionPicker) && !isEditing && (
            <motion.div
              ref={actionsRef}
              className={styles.messageActions}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <button
                className={styles.actionButton}
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                title="Add Reaction"
              >
                😊
              </button>
              
              <button
                className={styles.actionButton}
                onClick={handleReply}
                title="Reply"
              >
                <FiCornerUpLeft />
              </button>
              
              {canEdit && (
                <button
                  className={styles.actionButton}
                  onClick={handleEdit}
                  title="Edit"
                >
                  <FiEdit2 />
                </button>
              )}
              
              <button
                className={styles.actionButton}
                onClick={handleContextMenu}
                title="More"
              >
                <FiMoreHorizontal />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Reaction picker */}
        <AnimatePresence>
          {showReactionPicker && (
            <div className={styles.reactionPickerContainer}>
              <ReactionPicker
                onSelect={handleReaction}
                onClose={() => setShowReactionPicker(false)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

Message.displayName = 'Message';

export default memo(Message);