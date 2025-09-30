import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Paperclip, Smile, Mic, Video, Phone, MoreVertical, Search, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { useChat } from '../hooks/useChat';
import Layout from '../components/Layout/Layout';
import ServerSidebar from '../components/Server/ServerSidebar';
import ChannelSidebar from '../components/Channel/ChannelSidebar';
import MessageList from '../components/Chat/MessageList';
import MessageInput from '../components/Chat/MessageInput';
import MembersList from '../components/User/MembersList';
import VoiceChannel from '../components/Voice/VoiceChannel';
import Loader from '../components/common/Loader';

const Chat = () => {
  const { serverId, channelId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const {
    messages,
    channels,
    activeChannel,
    members,
    loading,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    joinChannel,
    leaveChannel,
    fetchMessages,
    fetchChannels,
    fetchMembers
  } = useChat();

  const [showMembers, setShowMembers] = useState(true);
  const [showServerList, setShowServerList] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVoiceChannel, setShowVoiceChannel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (channelId) {
      joinChannel(channelId);
      fetchMessages(channelId);
      fetchMembers(channelId);
    }

    return () => {
      if (channelId) {
        leaveChannel(channelId);
      }
    };
  }, [channelId, user]);

  useEffect(() => {
    if (serverId) {
      fetchChannels(serverId);
    }
  }, [serverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);

    return () => {
      socket.off('user_typing');
      socket.off('user_stop_typing');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, [socket]);

  const handleUserTyping = ({ userId, username }) => {
    setTypingUsers(prev => {
      if (!prev.find(u => u.userId === userId)) {
        return [...prev, { userId, username }];
      }
      return prev;
    });
  };

  const handleUserStopTyping = ({ userId }) => {
    setTypingUsers(prev => prev.filter(u => u.userId !== userId));
  };

  const handleUserJoined = ({ user }) => {
    fetchMembers(channelId);
  };

  const handleUserLeft = ({ userId }) => {
    fetchMembers(channelId);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() && attachments.length === 0) return;

    const messageData = {
      content: messageInput,
      channelId,
      attachments,
      replyTo: replyTo?.id
    };

    if (editingMessage) {
      await editMessage(editingMessage.id, messageInput);
      setEditingMessage(null);
    } else {
      await sendMessage(messageData);
    }

    setMessageInput('');
    setAttachments([]);
    setReplyTo(null);
    setShowEmojiPicker(false);
    handleStopTyping();
  };

  const handleTyping = (value) => {
    setMessageInput(value);

    if (!isTyping) {
      setIsTyping(true);
      socket?.emit('typing_start', { channelId });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 3000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      socket?.emit('typing_stop', { channelId });
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const handleEmojiSelect = (emoji) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleStartVoiceCall = () => {
    setShowVoiceChannel(true);
    // Initialize voice call
  };

  const handleStartVideoCall = () => {
    setShowVoiceChannel(true);
    // Initialize video call with video enabled
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search functionality
  };

  if (loading) {
    return <Loader fullScreen text="Loading chat..." />;
  }

  return (
    <Layout>
      <div className="flex h-screen bg-gray-900">
        {/* Server Sidebar */}
        {showServerList && (
          <div className="w-20 bg-gray-950 flex-shrink-0">
            <ServerSidebar />
          </div>
        )}

        {/* Channel Sidebar */}
        <div className="w-60 bg-gray-800 flex-shrink-0">
          <ChannelSidebar
            serverId={serverId}
            channels={channels}
            activeChannelId={channelId}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Channel Header */}
          <div className="h-14 bg-gray-800 border-b border-gray-700 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-white font-semibold text-lg">
                # {activeChannel?.name || 'Select a channel'}
              </h2>
              {activeChannel?.description && (
                <span className="text-gray-400 text-sm">{activeChannel.description}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={handleStartVoiceCall}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button
                onClick={handleStartVideoCall}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Video className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowMembers(!showMembers)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="bg-gray-800 border-b border-gray-700 p-3">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Voice Channel */}
          {showVoiceChannel && (
            <VoiceChannel
              channelId={channelId}
              onClose={() => setShowVoiceChannel(false)}
            />
          )}

          <div className="flex-1 flex">
            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {channelId ? (
                <>
                  <MessageList
                    messages={messages}
                    currentUserId={user?.id}
                    onEdit={setEditingMessage}
                    onDelete={deleteMessage}
                    onReply={setReplyTo}
                    onReaction={addReaction}
                    typingUsers={typingUsers}
                  />
                  <div ref={messageEndRef} />
                  
                  <MessageInput
                    value={messageInput}
                    onChange={handleTyping}
                    onSend={handleSendMessage}
                    onFileSelect={handleFileSelect}
                    attachments={attachments}
                    replyTo={replyTo}
                    onCancelReply={() => setReplyTo(null)}
                    editingMessage={editingMessage}
                    onCancelEdit={() => setEditingMessage(null)}
                    showEmojiPicker={showEmojiPicker}
                    onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
                    onEmojiSelect={handleEmojiSelect}
                  />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-400 mb-2">
                      Welcome to Ivan Chat
                    </h3>
                    <p className="text-gray-500">
                      Select a channel to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Members Sidebar */}
            {showMembers && channelId && (
              <div className="w-60 bg-gray-800 border-l border-gray-700">
                <MembersList
                  members={members}
                  currentUserId={user?.id}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;