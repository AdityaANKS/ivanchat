import React from 'react';

const Loader = ({
  size = 'medium',
  color = 'blue',
  variant = 'spinner',
  text,
  fullScreen = false,
  className = '',
}) => {
  const sizes = {
    small: { spinner: 'w-6 h-6', dots: 'w-2 h-2', bars: 'w-1 h-4' },
    medium: { spinner: 'w-10 h-10', dots: 'w-3 h-3', bars: 'w-2 h-6' },
    large: { spinner: 'w-16 h-16', dots: 'w-4 h-4', bars: 'w-3 h-8' },
  };

  const colors = {
    blue: 'border-blue-500',
    white: 'border-white',
    gray: 'border-gray-500',
    green: 'border-green-500',
    red: 'border-red-500',
    purple: 'border-purple-500',
  };

  const dotColors = {
    blue: 'bg-blue-500',
    white: 'bg-white',
    gray: 'bg-gray-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  const renderSpinner = () => (
    <div
      className={`
        ${sizes[size].spinner}
        border-4 ${colors[color]} border-t-transparent
        rounded-full animate-spin
      `}
    />
  );

  const renderDots = () => (
    <div className="flex items-center gap-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`
            ${sizes[size].dots}
            ${dotColors[color]}
            rounded-full animate-bounce
          `}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const renderBars = () => (
    <div className="flex items-end gap-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`
            ${sizes[size].bars}
            ${dotColors[color]}
            animate-pulse
          `}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: `${(i + 1) * 20}%`,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className="relative">
      <div
        className={`
          ${sizes[size].spinner}
          ${dotColors[color]}
          rounded-full animate-ping absolute
        `}
      />
      <div
        className={`
          ${sizes[size].spinner}
          ${dotColors[color]}
          rounded-full
        `}
      />
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'bars':
        return renderBars();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {renderLoader()}
      {text && (
        <p className="text-gray-400 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;