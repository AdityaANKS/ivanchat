import config from '../config/env';

export const useFeatureFlag = (feature) => {
  return config.features[feature] || false;
};

// Usage in component
const MyComponent = () => {
  const isGamificationEnabled = useFeatureFlag('gamification');
  const isMarketplaceEnabled = useFeatureFlag('marketplace');

  return (
    <div>
      {isGamificationEnabled && <GamificationBadges />}
      {isMarketplaceEnabled && <MarketplaceButton />}
    </div>
  );
};