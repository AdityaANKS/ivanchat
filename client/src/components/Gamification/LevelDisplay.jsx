import React, { useMemo } from 'react';
import { Trophy, Star, TrendingUp, Award, Zap } from 'lucide-react';

const LevelDisplay = ({ 
  level = 1, 
  currentXP = 0, 
  requiredXP = 100, 
  rank = null,
  showProgress = true,
  size = 'medium',
  animated = true 
}) => {
  const progress = useMemo(() => {
    return Math.min((currentXP / requiredXP) * 100, 100);
  }, [currentXP, requiredXP]);

  const getRankColor = (level) => {
    if (level >= 100) return 'from-yellow-400 to-yellow-600'; // Legendary
    if (level >= 75) return 'from-purple-400 to-purple-600';  // Epic
    if (level >= 50) return 'from-blue-400 to-blue-600';      // Rare
    if (level >= 25) return 'from-green-400 to-green-600';    // Uncommon
    return 'from-gray-400 to-gray-600';                        // Common
  };

  const getRankTitle = (level) => {
    if (level >= 100) return 'Legendary';
    if (level >= 75) return 'Epic';
    if (level >= 50) return 'Rare';
    if (level >= 25) return 'Uncommon';
    return 'Beginner';
  };

  const getRankIcon = (level) => {
    if (level >= 100) return Trophy;
    if (level >= 75) return Award;
    if (level >= 50) return Star;
    if (level >= 25) return Zap;
    return TrendingUp;
  };

  const sizeClasses = {
    small: {
      container: 'p-3',
      level: 'text-2xl',
      title: 'text-xs',
      progress: 'h-2',
      icon: 'w-4 h-4',
      badge: 'w-12 h-12'
    },
    medium: {
      container: 'p-4',
      level: 'text-3xl',
      title: 'text-sm',
      progress: 'h-3',
      icon: 'w-5 h-5',
      badge: 'w-16 h-16'
    },
    large: {
      container: 'p-6',
      level: 'text-4xl',
      title: 'text-base',
      progress: 'h-4',
      icon: 'w-6 h-6',
      badge: 'w-20 h-20'
    }
  };

  const sizes = sizeClasses[size];
  const RankIcon = getRankIcon(level);

  return (
    <div className={`level-display bg-gray-800 rounded-lg ${sizes.container}`}>
      <div className="flex items-center gap-4">
        {/* Level Badge */}
        <div className={`relative ${sizes.badge}`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${getRankColor(level)} rounded-full ${
            animated ? 'animate-pulse' : ''
          }`} />
          <div className="relative w-full h-full bg-gray-900 rounded-full flex items-center justify-center border-2 border-gray-700">
            <div className="text-center">
              <div className={`font-bold text-white ${sizes.level}`}>
                {level}
              </div>
              <div className={`text-gray-400 ${sizes.title} -mt-1`}>
                LEVEL
              </div>
            </div>
          </div>
        </div>

        {/* Level Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <RankIcon className={`${sizes.icon} text-yellow-400`} />
            <h3 className="text-white font-semibold">
              {getRankTitle(level)} {rank && `• Rank #${rank}`}
            </h3>
          </div>

          {showProgress && (
            <>
              {/* XP Progress Bar */}
              <div className={`bg-gray-700 rounded-full overflow-hidden ${sizes.progress} mb-2`}>
                <div 
                  className={`h-full bg-gradient-to-r ${getRankColor(level)} transition-all duration-500 ease-out`}
                  style={{ width: `${progress}%` }}
                >
                  {animated && (
                    <div className="h-full bg-white opacity-20 animate-shimmer" />
                  )}
                </div>
              </div>

              {/* XP Text */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">
                  {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
                </span>
                <span className="text-gray-400">
                  {(requiredXP - currentXP).toLocaleString()} to next level
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Next Rewards Preview */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Next level rewards:</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-gray-300">+100 coins</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded">
              <Trophy className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-gray-300">New badge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelDisplay;