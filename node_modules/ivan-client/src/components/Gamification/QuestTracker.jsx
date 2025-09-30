import React, { useState, useEffect } from 'react';
import { Target, Clock, Gift, CheckCircle, Circle, ChevronRight, Flame, Star, TrendingUp } from 'lucide-react';

const QuestTracker = ({ 
  quests = [], 
  onQuestComplete, 
  onQuestClaim,
  showCompleted = false 
}) => {
  const [activeTab, setActiveTab] = useState('daily');
  const [expandedQuest, setExpandedQuest] = useState(null);

  const questTypes = [
    { id: 'daily', label: 'Daily', icon: Clock, color: 'blue' },
    { id: 'weekly', label: 'Weekly', icon: Calendar, color: 'purple' },
    { id: 'special', label: 'Special', icon: Star, color: 'yellow' },
    { id: 'achievement', label: 'Achievement', icon: Trophy, color: 'green' },
  ];

  const getQuestsByType = (type) => {
    return quests.filter(quest => {
      if (!showCompleted && quest.status === 'completed' && quest.claimed) {
        return false;
      }
      return quest.type === type;
    });
  };

  const getProgressPercentage = (current, total) => {
    return Math.min((current / total) * 100, 100);
  };

  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return null;
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      case 'legendary': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getRewardIcon = (type) => {
    switch (type) {
      case 'xp': return Star;
      case 'coins': return Gift;
      case 'badge': return Trophy;
      default: return Gift;
    }
  };

  const activeQuests = getQuestsByType(activeTab);
  const completedCount = quests.filter(q => q.status === 'completed').length;
  const totalCount = quests.length;

  return (
    <div className="quest-tracker bg-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6" />
            Quest Tracker
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {completedCount} of {totalCount} quests completed
          </p>
        </div>
        
        {/* Streak Counter */}
        <div className="flex items-center gap-2 px-3 py-2 bg-orange-500 bg-opacity-20 rounded-lg">
          <Flame className="w-5 h-5 text-orange-400" />
          <div>
            <div className="text-white font-bold">7 Day Streak</div>
            <div className="text-orange-400 text-xs">+50% XP Bonus</div>
          </div>
        </div>
      </div>

      {/* Quest Type Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        {questTypes.map(type => {
          const questCount = getQuestsByType(type.id).length;
          return (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === type.id
                  ? 'text-white border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-white'
              }`}
            >
              <type.icon className="w-4 h-4" />
              {type.label}
              {questCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-gray-700 rounded-full text-xs">
                  {questCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quest List */}
      <div className="space-y-3">
        {activeQuests.length > 0 ? (
          activeQuests.map(quest => {
            const progress = getProgressPercentage(quest.progress, quest.total);
            const isExpanded = expandedQuest === quest.id;
            const isCompleted = quest.status === 'completed';
            const canClaim = isCompleted && !quest.claimed;
            
            return (
              <div
                key={quest.id}
                className={`quest-item bg-gray-700 rounded-lg p-4 transition-all ${
                  isCompleted ? 'opacity-75' : ''
                } ${canClaim ? 'ring-2 ring-green-500 animate-pulse' : ''}`}
              >
                {/* Quest Header */}
                <div 
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setExpandedQuest(isExpanded ? null : quest.id)}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {/* Status Icon */}
                    <div className="mt-1">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {/* Quest Info */}
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isCompleted ? 'text-gray-300 line-through' : 'text-white'
                      }`}>
                        {quest.name}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {quest.description}
                      </p>

                      {/* Progress Bar */}
                      {!isCompleted && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">
                              Progress: {quest.progress}/{quest.total}
                            </span>
                            <span className="text-gray-400">{Math.round(progress)}%</span>
                          </div>
                          <div className="bg-gray-600 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Quest Details (Expanded) */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          {/* Objectives */}
                          {quest.objectives && quest.objectives.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-gray-300 text-sm font-semibold mb-2">Objectives:</h4>
                              <ul className="space-y-1">
                                {quest.objectives.map((objective, index) => (
                                  <li key={index} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className={`w-4 h-4 ${
                                      objective.completed ? 'text-green-400' : 'text-gray-500'
                                    }`} />
                                    <span className={objective.completed ? 'text-gray-400 line-through' : 'text-gray-300'}>
                                      {objective.text}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Rewards */}
                          <div>
                            <h4 className="text-gray-300 text-sm font-semibold mb-2">Rewards:</h4>
                            <div className="flex gap-2">
                              {quest.rewards.map((reward, index) => {
                                const RewardIcon = getRewardIcon(reward.type);
                                return (
                                  <div key={index} className="flex items-center gap-1 px-2 py-1 bg-gray-600 rounded">
                                    <RewardIcon className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm text-gray-300">
                                      {reward.amount} {reward.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side Info */}
                  <div className="flex flex-col items-end gap-2 ml-4">
                    {/* Difficulty */}
                    {quest.difficulty && (
                      <span className={`text-xs font-semibold uppercase ${getDifficultyColor(quest.difficulty)}`}>
                        {quest.difficulty}
                      </span>
                    )}

                    {/* Time Remaining */}
                    {quest.expiresAt && !isCompleted && (
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{getTimeRemaining(quest.expiresAt)}</span>
                      </div>
                    )}

                    {/* Claim Button */}
                    {canClaim && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuestClaim && onQuestClaim(quest.id);
                        }}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Claim
                      </button>
                    )}

                    {/* Expand Icon */}
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No {activeTab} quests available</p>
            <p className="text-gray-500 text-sm mt-1">Check back later for new quests!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestTracker;