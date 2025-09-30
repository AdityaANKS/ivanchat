import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import { AnimatePresence, motion } from 'framer-motion';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';

// Components
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import MessageSkeleton from '../common/MessageSkeleton';
import ScrollToBottom from '../common/ScrollToBottom';
import NewMessageDivider from '../common/NewMessageDivider';
import WelcomeMessage from './WelcomeMessage';
import LoadingSpinner from '../common/LoadingSpinner';

// Hooks
import { useSocket } from '../../hooks/useSocket';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useMessageCache } from '../../hooks/useMessageCache';
import { useScrollPosition } from '../../hooks/useScrollPosition';

// Services
import { messageService } from '../../services/messages';

// Utils
import { groupMessagesByDate, shouldGroupMessages } from '../../utils/messages';
import { playSound } from '../../utils/audio';

// Styles
import styles from './MessageList.module.css';

const MessageList = ({ channelId, serverId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const listRef = useRef(null);
  const outerRef = useRef(null);
  const messageRefs = useRef({});
  const lastReadRef = useRef(null);
  
  // Redux state
  const { user } = useSelector(state => state.auth);
  const { messages: cachedMessages, editingMessageId } = useSelector(state => state.chat);
  const { typingUsers } = useSelector(state => state.chat.typing);
  const { lastReadMessageId, unreadCount } = useSelector(state => state.notifications);
  const { settings } = useSelector(state => state.user);
  
  // Local state
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [jumpToMessageId, setJumpToMessageId] = useState(null);
  const [messageHeights, setMessageHeights] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Socket connection
  const socket = useSocket();
  
  // Custom hooks
  const { cacheMessage, getCachedMessages } = useMessageCache();
  const { saveScrollPosition, restoreScrollPosition } = useScrollPosition(channelId);
  
  // Fetch messages with infinite scroll
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery({
    queryKey: ['messages', channelId],
    queryFn: ({ pageParam = null }) => 
      messageService.getMessages(channelId, { 
        before: pageParam, 
        limit: 50 
      }),
    getNextPageParam: (lastPage) => 
      lastPage.messages.length === 50 ? lastPage.messages[0]?.id : undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!channelId
  });
  
  // Flatten and process messages
  const messages = useMemo(() => {
    if (!data?.pages) return [];
    
    const allMessages = data.pages.flatMap(page => page.messages).reverse();
    
    // Group messages by date and sender
    return groupMessagesByDate(allMessages).map((message, index) => {
      const prevMessage = allMessages[index - 1];
      const nextMessage = allMessages[index + 1];
      
      return {
        ...message,
        isGrouped: shouldGroupMessages(prevMessage, message),
        isLastInGroup: !shouldGroupMessages(message, nextMessage),
        showDateDivider: !prevMessage || !isSameDay(
          new Date(message.createdAt),
          new Date(prevMessage.createdAt)
        )
      };
    });
  }, [data]);
  
  // Socket event handlers
  useEffect(() => {
    if (!socket || !channelId) return;
    
    const handleNewMessage = (message) => {
      if (message.channelId !== channelId) return;
      
      // Add message to cache
      queryClient.setQueryData(['messages', channelId], (old) => {
        if (!old) return old;
        
        const newPages = [...old.pages];
        const lastPage = newPages[newPages.length - 1];
        lastPage.messages.push(message);
        
        return { ...old, pages: newPages };
      });
      
      // Play sound if not from current user
      if (message.authorId !== user.id && settings.soundEnabled) {
        playSound('message');
      }
      
      // Show new message indicator if not at bottom
      if (!isNearBottom && message.authorId !== user.id) {
        setShowNewMessageIndicator(true);
      }
      
      // Auto-scroll if near bottom or own message
      if (isNearBottom || message.authorId === user.id) {
        scrollToBottom();
      }
    };
    
    const handleMessageUpdate = (message) => {
      queryClient.setQueryData(['messages', channelId], (old) => {
        if (!old) return old;
        
        const newPages = old.pages.map(page => ({
          ...page,
          messages: page.messages.map(msg => 
            msg.id === message.id ? { ...msg, ...message } : msg
          )
        }));
        
        return { ...old, pages: newPages };
      });
    };
    
    const handleMessageDelete = (messageId) => {
      queryClient.setQueryData(['messages', channelId], (old) => {
        if (!old) return old;
        
        const newPages = old.pages.map(page => ({
          ...page,
          messages: page.messages.filter(msg => msg.id !== messageId)
        }));
        
        return { ...old, pages: newPages };
      });
    };
    
    const handleReactionAdd = ({ messageId, reaction, userId }) => {
      queryClient.setQueryData(['messages', channelId], (old) => {
        if (!old) return old;
        
        const newPages = old.pages.map(page => ({
          ...page,
          messages: page.messages.map(msg => {
            if (msg.id !== messageId) return msg;
            
            const existingReaction = msg.reactions?.find(r => r.emoji === reaction);
            if (existingReaction) {
              existingReaction.count++;
              existingReaction.users.push(userId);
            } else {
              msg.reactions = [...(msg.reactions || []), {
                emoji: reaction,
                count: 1,
                users: [userId]
              }];
            }
            
            return msg;
          })
        }));
        
        return { ...old, pages: newPages };
      });
    };
    
    const handleReactionRemove = ({ messageId, reaction, userId }) => {
      queryClient.setQueryData(['messages', channelId], (old) => {
        if (!old) return old;
        
        const newPages = old.pages.map(page => ({
          ...page,
          messages: page.messages.map(msg => {
            if (msg.id !== messageId) return msg;
            
            const existingReaction = msg.reactions?.find(r => r.emoji === reaction);
            if (existingReaction) {
              existingReaction.count--;
              existingReaction.users = existingReaction.users.filter(id => id !== userId);
              
              if (existingReaction.count === 0) {
                msg.reactions = msg.reactions.filter(r => r.emoji !== reaction);
              }
            }
            
            return msg;
          })
        }));
        
        return { ...old, pages: newPages };
      });
    };
    
    socket.on('message:new', handleNewMessage);
    socket.on('message:update', handleMessageUpdate);
    socket.on('message:delete', handleMessageDelete);
    socket.on('reaction:add', handleReactionAdd);
    socket.on('reaction:remove', handleReactionRemove);
    
    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('message:update', handleMessageUpdate);
      socket.off('message:delete', handleMessageDelete);
      socket.off('reaction:add', handleReactionAdd);
      socket.off('reaction:remove', handleReactionRemove);
    };
  }, [socket, channelId, user.id, isNearBottom, queryClient, settings.soundEnabled]);
  
  // Scroll handling
  const handleScroll = useCallback(({ scrollOffset, scrollDirection }) => {
    const list = outerRef.current;
    if (!list) return;
    
    const scrollHeight = list.scrollHeight;
    const clientHeight = list.clientHeight;
    const scrollTop = scrollOffset;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // Check if near bottom (within 100px)
    const nearBottom = distanceFromBottom < 100;
    setIsNearBottom(nearBottom);
    
    if (nearBottom) {
      setShowNewMessageIndicator(false);
    }
    
    // Save scroll position for restoration
    saveScrollPosition(scrollTop);
    
    // Load more messages when scrolling to top
    if (scrollTop < 500 && hasNextPage && !isFetchingNextPage && scrollDirection === 'backward') {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, saveScrollPosition]);
  
  // Calculate item size
  const getItemSize = useCallback((index) => {
    const message = messages[index];
    if (!message) return 80; // Default height
    
    // Calculate height based on content
    let height = 48; // Base height
    
    // Add height for date divider
    if (message.showDateDivider) height += 40;
    
    // Add height for content
    const contentLines = Math.ceil((message.content?.length || 0) / 100);
    height += contentLines * 20;
    
    // Add height for embeds
    if (message.embeds?.length) height += 200;
    
    // Add height for attachments
    if (message.attachments?.length) height += 300;
    
    // Add height for reactions
    if (message.reactions?.length) height += 32;
    
    // Cache the calculated height
    if (messageHeights[message.id] !== height) {
      setMessageHeights(prev => ({ ...prev, [message.id]: height }));
    }
    
    return messageHeights[message.id] || height;
  }, [messages, messageHeights]);
  
  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
  }, [messages.length]);
  
  // Jump to message
  const jumpToMessage = useCallback((messageId) => {
    const index = messages.findIndex(msg => msg.id === messageId);
    if (index !== -1 && listRef.current) {
      listRef.current.scrollToItem(index, 'center');
      
      // Highlight the message temporarily
      setJumpToMessageId(messageId);
      setTimeout(() => setJumpToMessageId(null), 2000);
    }
  }, [messages]);
  
  // Mark messages as read
  useEffect(() => {
    if (messages.length > 0 && isNearBottom) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.id !== lastReadMessageId) {
        dispatch({
          type: 'notifications/markChannelRead',
          payload: { channelId, messageId: lastMessage.id }
        });
      }
    }
  }, [messages, isNearBottom, channelId, lastReadMessageId, dispatch]);
  
  // Render message item
  const renderMessage = useCallback(({ index, style }) => {
    const message = messages[index];
    if (!message) return null;
    
    return (
      <div style={style}>
        {message.showDateDivider && (
          <div className={styles.dateDivider}>
            <span>{formatMessageDate(message.createdAt)}</span>
          </div>
        )}
        
        <Message
          key={message.id}
          message={message}
          isGrouped={message.isGrouped}
          isLastInGroup={message.isLastInGroup}
          isHighlighted={jumpToMessageId === message.id}
          isSelected={selectedMessages.has(message.id)}
          isEditing={editingMessageId === message.id}
          isUnread={message.id === lastReadMessageId}
          onSelect={(selected) => {
            if (selected) {
              setSelectedMessages(prev => new Set([...prev, message.id]));
            } else {
              setSelectedMessages(prev => {
                const next = new Set(prev);
                next.delete(message.id);
                return next;
              });
            }
          }}
          onReply={() => {
            dispatch({ type: 'chat/setReplyingTo', payload: message });
          }}
          onEdit={() => {
            dispatch({ type: 'chat/setEditingMessage', payload: message.id });
          }}
          onJumpToReply={(replyId) => jumpToMessage(replyId)}
          ref={(el) => {
            if (el) messageRefs.current[message.id] = el;
          }}
        />
      </div>
    );
  }, [messages, jumpToMessageId, selectedMessages, editingMessageId, lastReadMessageId, dispatch, jumpToMessage]);
  
  // Format date for divider
  const formatMessageDate = (date) => {
    const messageDate = new Date(date);
    
    if (isToday(messageDate)) {
      return 'Today';
    } else if (isYesterday(messageDate)) {
      return 'Yesterday';
    } else {
      return format(messageDate, 'MMMM d, yyyy');
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <MessageSkeleton count={10} />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Failed to load messages</h3>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }
  
  // Empty state
  if (messages.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <WelcomeMessage channel={{ id: channelId }} />
      </div>
    );
  }
  
  return (
    <div className={styles.messageList}>
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            isItemLoaded={(index) => index < messages.length}
            itemCount={hasNextPage ? messages.length + 1 : messages.length}
            loadMoreItems={fetchNextPage}
          >
            {({ onItemsRendered, ref }) => (
              <List
                ref={(list) => {
                  ref(list);
                  listRef.current = list;
                }}
                outerRef={outerRef}
                height={height}
                width={width}
                itemCount={messages.length}
                itemSize={getItemSize}
                onScroll={handleScroll}
                onItemsRendered={onItemsRendered}
                overscanCount={5}
                className={styles.virtualList}
              >
                {renderMessage}
              </List>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
      
      {/* New messages indicator */}
      <AnimatePresence>
        {showNewMessageIndicator && (
          <motion.div
            className={styles.newMessageIndicator}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => scrollToBottom()}
          >
            <span>New messages</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scroll to bottom button */}
      <AnimatePresence>
        {!isNearBottom && (
          <ScrollToBottom onClick={() => scrollToBottom()} />
        )}
      </AnimatePresence>
      
      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className={styles.typingContainer}>
          <TypingIndicator users={typingUsers} />
        </div>
      )}
      
      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className={styles.loadingMore}>
          <LoadingSpinner size="small" />
          <span>Loading more messages...</span>
        </div>
      )}
    </div>
  );
};

export default MessageList;