import React, { useState } from 'react';
import { Award, Lock, Star, Trophy, Shield, Zap, Heart, MessageSquare, Users, Calendar } from 'lucide-react';

const BadgeList = ({ badges = [], unlockedBadges = [], onBadgeClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredBadge, setHoveredBadge] = useState(null);

  const categories = [
    { id: 'all', label: 'All', count: badges.length },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'activity', label: 'Activity', icon: Zap },
    { id: 'special', label: 'Special', icon: Star },
    { id: 'seasonal', label: 'Seasonal', icon: Calendar },
  ];

  const badgeIcons = {
    trophy: Trophy,
    star: Star,
    shield: Shield,
    zap: Zap,
    heart: Heart,
    message: MessageSquare,
    users: Users,
    award: Award,
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'uncommon': return 'from-green-400 to-emerald-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityLabel = (rarity) => {
    return rarity ? rarity.charAt(0).toUpperCase() + rarity.slice(1) : 'Common';
  };

  const filteredBadges = badges.filter(badge => 
    selectedCategory === 'all' || badge.category === selectedCategory
  );

  const isBadgeUnlocked = (badgeId) => {
    return unlockedBadges.includes(badgeId);
  };

  return (
    <div className="badge-list bg-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Achievements</h2>
        <p className="text-gray-400">
          {unlockedBadges.length} of {badges.length} badges unlocked
        </p>
        
        {/* Progress Bar */}
        <div className="mt-3 bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(unlockedBadges.length / badges.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {category.icon && <category.icon className="w-4 h-4" />}
            {category.label}
            <span className="ml-1 px-2 py-0.5 bg-black bg-opacity-20 rounded text-xs">
              {category.count || filteredBadges.filter(b => b.category === category.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredBadges.map((badge) => {
          const isUnlocked = isBadgeUnlocked(badge.id);
          const Icon = badgeIcons[badge.icon] || Award;
          
          return (
            <div
              key={badge.id}
              className="relative group"
              onMouseEnter={() => setHoveredBadge(badge.id)}
              onMouseLeave={() => setHoveredBadge(null)}
              onClick={() => onBadgeClick && onBadgeClick(badge)}
            >
              {/* Badge Container */}
              <div className={`
                relative aspect-square rounded-lg p-4 cursor-pointer transition-all duration-300
                ${isUnlocked 
                  ? 'bg-gradient-to-br ' + getRarityColor(badge.rarity) + ' transform hover:scale-110' 
                  : 'bg-gray-700 opacity-50 hover:opacity-75'
                }
              `}>
                {/* Badge Icon */}
                <div className="w-full h-full flex items-center justify-center">
                  {isUnlocked ? (
                    <Icon className="w-8 h-8 text-white" />
                  ) : (
                    <Lock className="w-8 h-8 text-gray-500" />
                  )}
                </div>

                {/* Rarity Indicator */}
                {isUnlocked && badge.rarity && (
                  <div className="absolute top-1 right-1">
                    <div className={`w-2 h-2 rounded-full bg-white animate-pulse`} />
                  </div>
                )}

                {/* Progress (for locked badges) */}
                {!isUnlocked && badge.progress !== undefined && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-b-lg p-1">
                    <div className="bg-gray-600 rounded-full h-1 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Badge Name */}
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  isUnlocked ? 'text-white' : 'text-gray-400'
                }`}>
                  {badge.name}
                </p>
              </div>

              {/* Tooltip */}
              {hoveredBadge === badge.id && (
                <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900 rounded-lg shadow-xl pointer-events-none">
                  <div className="text-white font-semibold mb-1">{badge.name}</div>
                  <div className="text-gray-400 text-xs mb-2">{badge.description}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white`}>
                      {getRarityLabel(badge.rarity)}
                    </span>
                    {badge.points && (
                      <span className="text-yellow-400">+{badge.points} XP</span>
                    )}
                  </div>
                  {!isUnlocked && badge.requirement && (
                    <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
                      Requirement: {badge.requirement}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeList;