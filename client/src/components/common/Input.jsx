import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  helperText,
  icon: Icon,
  disabled = false,
  required = false,
  fullWidth = true,
  size = 'medium',
  className = '',
  inputClassName = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg',
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const getInputClasses = () => {
    const base = `
      bg-gray-700 text-white placeholder-gray-400 
      rounded-lg transition-all duration-200
      focus:outline-none focus:ring-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${sizes[size]}
      ${Icon ? 'pl-10' : ''}
      ${type === 'password' ? 'pr-10' : ''}
      ${fullWidth ? 'w-full' : ''}
    `;

    if (error) {
      return `${base} border-2 border-red-500 focus:ring-red-500`;
    }
    if (success) {
      return `${base} border-2 border-green-500 focus:ring-green-500`;
    }
    return `${base} border border-gray-600 focus:border-blue-500 focus:ring-blue-500`;
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSizes[size]}`} />
        )}

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`${getInputClasses()} ${inputClassName}`}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? (
              <EyeOff className={iconSizes[size]} />
            ) : (
              <Eye className={iconSizes[size]} />
            )}
          </button>
        )}

        {error && (
          <AlertCircle className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 ${iconSizes[size]}`} />
        )}

        {success && !error && (
          <CheckCircle className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 ${iconSizes[size]}`} />
        )}
      </div>

      {(error || success || helperText) && (
        <p className={`mt-2 text-sm ${
          error ? 'text-red-500' : success ? 'text-green-500' : 'text-gray-400'
        }`}>
          {error || success || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;