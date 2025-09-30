import React, { useState } from 'react';
import { Users, Hash, Volume2, Lock, Globe, Star, TrendingUp, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChannelCard = ({ channel, onJoin, onLeave, isJoined }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const {
    id,
    name,
    description,
    banner,
    icon,
    type,
    memberCount,
    activeMembers,
    isPrivate,
    isVerified,
    tags = [],
    category,
    rating,
    growth,
  } = channel;

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (isJoined) {
      onLeave(id);
    } else {
      onJoin(id);
    }
  };

  const handleCardClick = () => {
    if (isJoined) {
      navigate(`/channels/${id}`);
    }
  };

  const formatMemberCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const TypeIcon = type === 'voice' ? Volume2 : Hash;

  return (
    <div 
      className="channel-card bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {/* Banner */}
      <div className="relative h-32 bg-gradient-to-br from-blue-600 to-purple-600">
        {banner && !imageError ? (
          <img 
            src={banner} 
            alt={`${name} banner`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TypeIcon className="w-12 h-12 text-white opacity-50" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-2">
          {isVerified && (
            <div className="bg-blue-500 rounded-full p-1">
              <Shield className="w-4 h-4 text-white" />
            </div>
          )}
          {isPrivate && (
            <div className="bg-gray-700 rounded-full p-1">
              <Lock className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Channel Icon */}
        <div className="absolute -bottom-6 left-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full border-4 border-gray-800 flex items-center justify-center">
            {icon ? (
              <img 
                src={icon} 
                alt={name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <TypeIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-8">
        {/* Title and Type */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg truncate flex items-center gap-2">
              {name}
              {isVerified && <Shield className="w-4 h-4 text-blue-500" />}
            </h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <TypeIcon className="w-4 h-4" />
              <span className="capitalize">{type} Channel</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {description || 'No description available'}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 text-gray-400 text-xs">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-gray-400">
              <Users className="w-4 h-4" />
              <span>{formatMemberCount(memberCount)}</span>
            </div>
            {activeMembers > 0 && (
              <div className="flex items-center gap-1 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>{activeMembers} online</span>
              </div>
            )}
          </div>
          {growth > 0 && (
            <div className="flex items-center gap-1 text-green-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>+{growth}%</span>
            </div>
          )}
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-600'
                }`}
              />
            ))}
            <span className="text-gray-400 text-sm ml-1">({rating.toFixed(1)})</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleActionClick}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
            isJoined
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isJoined ? 'Joined' : 'Join Channel'}
        </button>
      </div>
    </div>
  );
};

export default ChannelCard;