import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPaperclip,
  FiGift,
  FiSmile,
  FiAtSign,
  FiX,
  FiCornerUpLeft,
  FiEdit2,
  FiSend,
  FiMic
} from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';

// Components
import FileUpload from '../common/FileUpload';
import GifPicker from '../common/GifPicker';
import StickerPicker from '../common/StickerPicker';
import CommandAutocomplete from '../common/CommandAutocomplete';

// Hooks
import { useSocket } from '../../hooks/useSocket';
import { useHotkeys } from '../../hooks/useHotkeys';
import { useTyping } from '../../hooks/useTyping';
import { usePermissions } from '../../hooks/usePermissions';

// Services
import { messageService } from '../../services/messages';
import { uploadService } from '../../services/upload';

// Utils
import { parseCommand, isCommand } from '../../utils/commands';
import { formatBytes } from '../../utils/format';
import { playSound } from '../../utils/audio';

// Config
import config from '../../config/env';

// Styles
import styles from './MessageInput.module.css';

// Dummy translate function (replace with your API call)
const translateMessage = async (text) => {
  // Add your translation logic here
  return text;
};

const MessageInput = ({ channelId, channelType = 'text', placeholder }) => {
  const dispatch = useDispatch();
  const { serverId } = useParams();
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Redux state
  const { user } = useSelector(state => state.auth);
  const {
    replyingTo,
    editingMessage,
    editingMessageId
  } = useSelector(state => state.chat);
  const { currentChannel, currentServer } = useSelector(state => state.chat);
  const { slowMode, slowModeInterval } = useSelector(state => state.chat.channels[channelId] || {});

  // Local state
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [slowModeRemaining, setSlowModeRemaining] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [commandSuggestions, setCommandSuggestions] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);

  // Socket and hooks
  const socket = useSocket();
  const { startTyping, stopTyping } = useTyping(channelId);
  const { canSendMessages, canAttachFiles } = usePermissions(serverId);

  // Default placeholder
  const defaultPlaceholder =
    channelType === 'announcement'
      ? `Message #${currentChannel?.name} (Announcement Channel)`
      : `Message #${currentChannel?.name || 'channel'}`;

  // Initialize edit mode
  useEffect(() => {
    if (editingMessage && editingMessageId) {
      setContent(editingMessage.content);
      inputRef.current?.focus();
    }
  }, [editingMessage, editingMessageId]);

  // Slow mode timer
  useEffect(() => {
    if (slowMode && slowModeRemaining > 0) {
      const timer = setTimeout(() => {
        setSlowModeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [slowMode, slowModeRemaining]);

  // Keyboard shortcuts
  useHotkeys([
    ['mod+enter', () => handleSend()],
    ['escape', () => handleCancel()],
    ['mod+shift+e', () => setShowEmojiPicker(!showEmojiPicker)],
    ['mod+shift+g', () => setShowGifPicker(!showGifPicker)],
    ['mod+u', () => fileInputRef.current?.click()]
  ]);

  // Handlers
  const handleSend = useCallback(async () => {
    // Env rate-limit check
    if (content.length > config.rateLimit.message) {
      dispatch({
        type: 'notifications/show',
        payload: {
          type: 'error',
          message: `Message too long. Max ${config.rateLimit.message} characters.`
        }
      });
      return;
    }

    if (!content.trim() && attachments.length === 0) return;
    if (!canSendMessages) return;
    if (slowMode && slowModeRemaining > 0) return;

    try {
      let finalContent = content.trim();

      // Translate if enabled
      if (config.features.translation && isTranslating) {
        finalContent = await translateMessage(finalContent);
      }

      const messageData = {
        content: finalContent,
        channelId,
        attachments: attachments.map(a => a.id),
        replyTo: replyingTo?.id
      };

      if (editingMessageId) {
        await messageService.editMessage(editingMessageId, {
          content: finalContent
        });
        dispatch({ type: 'chat/clearEditingMessage' });
      } else {
        await messageService.sendMessage(messageData);
        if (slowMode) setSlowModeRemaining(slowModeInterval);
      }

      setContent('');
      setAttachments([]);
      dispatch({ type: 'chat/clearReplyingTo' });
      playSound('send');
      stopTyping();
    } catch (error) {
      dispatch({
        type: 'notifications/show',
        payload: {
          type: 'error',
          message: 'Failed to send message'
        }
      });
    }
  }, [
    content,
    attachments,
    canSendMessages,
    slowMode,
    slowModeRemaining,
    slowModeInterval,
    channelId,
    replyingTo,
    editingMessageId,
    dispatch,
    stopTyping,
    isTranslating
  ]);

  const handleCancel = useCallback(() => {
    if (editingMessageId) {
      dispatch({ type: 'chat/clearEditingMessage' });
      setContent('');
    } else if (replyingTo) {
      dispatch({ type: 'chat/clearReplyingTo' });
    } else if (attachments.length > 0) {
      setAttachments([]);
    }
  }, [editingMessageId, replyingTo, attachments.length, dispatch]);

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setContent(value);

      if (isCommand(value)) {
        const command = parseCommand(value);
        if (command) {
          setCommandSuggestions(getCommandSuggestions(command));
        }
      } else {
        setCommandSuggestions([]);
      }

      if (value.length > 0) {
        startTyping();
      } else {
        stopTyping();
      }
    },
    [startTyping, stopTyping]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    },
    [handleSend, handleCancel]
  );

  const handleFileSelect = useCallback(
    async (files) => {
      if (!canAttachFiles) {
        dispatch({
          type: 'notifications/show',
          payload: {
            type: 'error',
            message: 'You do not have permission to upload files'
          }
        });
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const uploadPromises = Array.from(files).map(file =>
          uploadService.uploadFile(file, {
            onProgress: (progress) => {
              setUploadProgress(progress);
            }
          })
        );

        const uploaded = await Promise.all(uploadPromises);
        setAttachments(prev => [...prev, ...uploaded]);
        playSound('upload');
      } catch (error) {
        dispatch({
          type: 'notifications/show',
          payload: {
            type: 'error',
            message: 'Failed to upload files'
          }
        });
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [canAttachFiles, dispatch]
  );

  const handleRemoveAttachment = useCallback((attachmentId) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  }, []);

  const handleEmojiSelect = useCallback(
    (emoji) => {
      const position = inputRef.current?.selectionStart || content.length;
      const newContent =
        content.slice(0, position) +
        emoji.emoji +
        content.slice(position);

      setContent(newContent);
      setShowEmojiPicker(false);
      inputRef.current?.focus();
    },
    [content]
  );

  const handleGifSelect = useCallback(
    (gif) => {
      messageService.sendMessage({
        channelId,
        content: gif.url,
        type: 'gif'
      });

      setShowGifPicker(false);
      playSound('send');
    },
    [channelId]
  );

  const handleStickerSelect = useCallback(
    (sticker) => {
      messageService.sendMessage({
        channelId,
        stickerId: sticker.id
      });

      setShowStickerPicker(false);
      playSound('send');
    },
    [channelId]
  );

  // Command suggestions helper
  const getCommandSuggestions = (command) => {
    const commands = [
      { name: 'help', description: 'Show help message' },
      { name: 'nick', description: 'Change your nickname' },
      { name: 'me', description: 'Send an action message' },
      { name: 'shrug', description: '¯\\_(ツ)_/¯' },
      { name: 'tableflip', description: '(╯°□°）╯︵ ┻━┻' },
      { name: 'spoiler', description: 'Mark text as spoiler' }
    ];
    return commands.filter(cmd =>
      cmd.name.startsWith(command.name.toLowerCase())
    );
  };

  const canSend = content.trim() || attachments.length > 0;
  const isDisabled = !canSendMessages || (slowMode && slowModeRemaining > 0) || isUploading;

  return (
    <div className={styles.messageInput}>
      {/* Reply indicator */}
      {replyingTo && (
        <div className={styles.replyIndicator}>
          <FiCornerUpLeft className={styles.replyIcon} />
          <span className={styles.replyText}>
            Replying to <strong>{replyingTo.author?.username}</strong>
          </span>
          <button
            className={styles.cancelReply}
            onClick={() => dispatch({ type: 'chat/clearReplyingTo' })}
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Edit indicator */}
      {editingMessageId && (
        <div className={styles.editIndicator}>
          <FiEdit2 className={styles.editIcon} />
          <span className={styles.editText}>Editing message</span>
          <button
            className={styles.cancelEdit}
            onClick={() => dispatch({ type: 'chat/clearEditingMessage' })}
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className={styles.attachments}>
          {attachments.map(attachment => (
            <div key={attachment.id} className={styles.attachment}>
              {attachment.type.startsWith('image/') ? (
                <img src={attachment.url} alt={attachment.name || 'Attachment'} />
              ) : (
                <div className={styles.fileAttachment}>
                  <FiPaperclip />
                  <span>{attachment.name}</span>
                  <span className={styles.fileSize}>
                    {formatBytes(attachment.size)}
                  </span>
                </div>
              )}
              <button
                className={styles.removeAttachment}
                onClick={() => handleRemoveAttachment(attachment.id)}
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload progress */}
      {isUploading && (
        <div className={styles.uploadProgress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Input container */}
      <div className={styles.inputContainer}>
        {/* File upload button */}
        <button
          className={styles.attachButton}
          onClick={() => fileInputRef.current?.click()}
          disabled={!canAttachFiles || isDisabled}
          title="Attach files"
        >
          <FiPaperclip />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        {/* Text input */}
        <div className={styles.textInputWrapper}>
          <TextareaAutosize
            ref={inputRef}
            className={styles.textInput}
            placeholder={placeholder || defaultPlaceholder}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            maxRows={10}
          />

          {/* Command autocomplete */}
          {commandSuggestions.length > 0 && (
            <CommandAutocomplete
              suggestions={commandSuggestions}
              onSelect={(command) => {
                setContent(`/${command.name} `);
                setCommandSuggestions([]);
              }}
            />
          )}
        </div>

        {/* Right side buttons */}
        <div className={styles.rightButtons}>
          {/* Translate toggle */}
          {config.features.translation && (
            <button
              className={styles.translateButton}
              type="button"
              onClick={() => setIsTranslating(!isTranslating)}
              title={isTranslating ? 'Translation enabled' : 'Enable translation'}
            >
              🌐
            </button>
          )}

          {/* Gift/Nitro button */}
          <button
            className={styles.giftButton}
            title="Send a gift"
          >
            <FiGift />
          </button>

          {/* GIF button */}
          <button
            className={styles.gifButton}
            onClick={() => setShowGifPicker(!showGifPicker)}
            title="Send a GIF"
          >
            GIF
          </button>

          {/* Sticker button */}
          <button
            className={styles.stickerButton}
            onClick={() => setShowStickerPicker(!showStickerPicker)}
            title="Send a sticker"
          >
            🎨
          </button>

          {/* Emoji button */}
          <button
            className={styles.emojiButton}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Add emoji"
          >
            <FiSmile />
          </button>

          {/* Send/Voice button */}
          {canSend ? (
            <button
              className={styles.sendButton}
              onClick={handleSend}
              disabled={isDisabled}
              title="Send message"
            >
              <FiSend />
            </button>
          ) : (
            <button
              className={styles.voiceButton}
              onClick={() => setIsRecording(!isRecording)}
              title="Send voice message"
            >
              <FiMic />
            </button>
          )}
        </div>
      </div>

      {/* Slow mode indicator */}
      {slowMode && slowModeRemaining > 0 && (
        <div className={styles.slowModeIndicator}>
          <span>Slow mode is enabled. Wait {slowModeRemaining}s</span>
        </div>
      )}

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            className={styles.emojiPicker}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <EmojiPicker
              onEmojiClick={handleEmojiSelect}
              theme={user?.theme || 'dark'}
              searchPlaceholder="Search emojis..."
              width={350}
              height={400}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* GIF picker */}
      <AnimatePresence>
        {showGifPicker && (
          <GifPicker
            onSelect={handleGifSelect}
            onClose={() => setShowGifPicker(false)}
          />
        )}
      </AnimatePresence>

      {/* Sticker picker */}
      <AnimatePresence>
        {showStickerPicker && (
          <StickerPicker
            onSelect={handleStickerSelect}
            onClose={() => setShowStickerPicker(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageInput;
