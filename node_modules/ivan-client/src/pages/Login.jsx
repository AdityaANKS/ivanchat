import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Github, Chrome, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithProvider, user, loading: authLoading } = useAuth();

  const from = location.state?.from?.pathname || '/chat';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Invalid email or password'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      await loginWithProvider(provider);
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({
        general: `Failed to login with ${provider}`
      });
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (authLoading) {
    return <Loader fullScreen text="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-gray-400">Login to continue to Ivan Chat</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-500 text-sm">{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              icon={Mail}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              icon={Lock}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-300 text-sm">Remember me</span>
              </label>
              
              <Link
                to="/forgot-password"
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              icon={Chrome}
            >
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('github')}
              icon={Github}
            >
              GitHub
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up for free
              </Link>
            </span>
          </div>
        </div>

        {/* Demo Account Info */}
        <div className="mt-4 p-4 bg-blue-600 bg-opacity-10 border border-blue-600 rounded-lg">
          <p className="text-blue-400 text-sm text-center">
            <strong>Demo Account:</strong> demo@example.com / demo123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;