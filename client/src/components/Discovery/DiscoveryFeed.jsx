import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, TrendingUp, Users, Hash, Volume2 } from 'lucide-react';
import ChannelCard from './ChannelCard';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import Loader from '../common/Loader';

const DiscoveryFeed = () => {
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const { user } = useAuth();

  const filters = [
    { id: 'all', label: 'All', icon: null },
    { id: 'text', label: 'Text', icon: Hash },
    { id: 'voice', label: 'Voice', icon: Volume2 },
    { id: 'gaming', label: 'Gaming', icon: null },
    { id: 'music', label: 'Music', icon: null },
    { id: 'education', label: 'Education', icon: null },
    { id: 'technology', label: 'Technology', icon: null },
  ];

  const sortOptions = [
    { value: 'trending', label: 'Trending', icon: TrendingUp },
    { value: 'members', label: 'Most Members', icon: Users },
    { value: 'newest', label: 'Newest' },
    { value: 'active', label: 'Most Active' },
  ];

  useEffect(() => {
    fetchDiscoveryChannels();
  }, [sortBy]);

  useEffect(() => {
    filterChannels();
  }, [searchTerm, activeFilter, channels]);

  const fetchDiscoveryChannels = async () => {
    try {
      setLoading(true);
      const response = await api.get('/discovery/channels', {
        params: { sortBy }
      });
      setChannels(response.data.channels);
      setFilteredChannels(response.data.channels);
    } catch (error) {
      console.error('Failed to fetch discovery channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterChannels = () => {
    let filtered = [...channels];

    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(channel => 
        channel.category === activeFilter || channel.type === activeFilter
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(channel =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        channel.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        channel.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredChannels(filtered);
  };

  const handleJoinChannel = useCallback(async (channelId) => {
    try {
      await api.post(`/channels/${channelId}/join`);
      // Update local state or refetch
      setChannels(prev => prev.map(channel => 
        channel.id === channelId 
          ? { ...channel, isJoined: true, memberCount: channel.memberCount + 1 }
          : channel
      ));
    } catch (error) {
      console.error('Failed to join channel:', error);
    }
  }, []);

  const handleLeaveChannel = useCallback(async (channelId) => {
    try {
      await api.post(`/channels/${channelId}/leave`);
      setChannels(prev => prev.map(channel => 
        channel.id === channelId 
          ? { ...channel, isJoined: false, memberCount: channel.memberCount - 1 }
          : channel
      ));
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  }, []);

  return (
    <div className="discovery-feed">
      {/* Header */}
      <div className="discovery-header bg-gray-800 p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">Discover Communities</h1>
        <p className="text-gray-400 mb-6">
          Find and join communities that match your interests
        </p>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search communities, tags, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filter.icon && <filter.icon className="w-4 h-4" />}
              {filter.label}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Sort by:</span>
          <div className="flex gap-2">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-3 py-1 rounded flex items-center gap-2 transition-all ${
                  sortBy === option.value
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {option.icon && <option.icon className="w-4 h-4" />}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : filteredChannels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredChannels.map(channel => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onJoin={handleJoinChannel}
              onLeave={handleLeaveChannel}
              isJoined={channel.isJoined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No channels found</p>
            <p className="text-sm mt-2">Try adjusting your filters or search terms</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoveryFeed;