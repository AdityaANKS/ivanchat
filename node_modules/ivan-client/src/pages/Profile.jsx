import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Mail, Calendar, MapPin, Link as LinkIcon, Twitter, Github,
  Edit, Settings, Award, TrendingUp, MessageSquare, Users, Camera
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout/Layout';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import LevelDisplay from '../components/Gamification/LevelDisplay';
import BadgeList from '../components/Gamification/BadgeList';
import api from '../services/api';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const isOwnProfile = !userId || userId === currentUser?.id;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'activity', label: 'Activity', icon: TrendingUp },
    { id: 'servers', label: 'Servers', icon: Users },
  ];

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileId = userId || currentUser?.id;
      const response = await api.get(`/users/${profileId}/profile`);
      setProfile(response.data);
      setEditFormData({
        username: response.data.username,
        bio: response.data.bio || '',
        location: response.data.location || '',
        website: response.data.website || '',
        twitter: response.data.socialLinks?.twitter || '',
        github: response.data.socialLinks?.github || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      const formData = new FormData();
      Object.keys(editFormData).forEach(key => {
        formData.append(key, editFormData[key]);
      });
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      if (bannerFile) {
        formData.append('banner', bannerFile);
      }

      await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setShowEditModal(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader size="large" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold text-white mb-4">Profile not found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        {/* Banner */}
        <div className="relative h-64 bg-gradient-to-br from-blue-600 to-purple-600">
          {profile.banner && (
            <img
              src={profile.banner}
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
          )}
          {isOwnProfile && (
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-lg text-white hover:bg-opacity-70 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-20 mb-8">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={profile.avatar || '/default-avatar.png'}
                    alt={profile.username}
                    className="w-32 h-32 rounded-full border-4 border-gray-800"
                  />
                  {profile.status === 'online' && (
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800" />
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        {profile.username}
                        {profile.isVerified && (
                          <span className="text-blue-500">✓</span>
                        )}
                      </h1>
                      <p className="text-gray-400">@{profile.username}</p>
                      {profile.bio && (
                        <p className="text-gray-300 mt-3 max-w-2xl">{profile.bio}</p>
                      )}
                    </div>

                    {isOwnProfile && (
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          icon={Edit}
                          onClick={() => setShowEditModal(true)}
                        >
                          Edit Profile
                        </Button>
                        <Button
                          variant="secondary"
                          icon={Settings}
                          onClick={() => navigate('/settings')}
                        >
                          Settings
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        {profile.website}
                      </a>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(profile.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Social Links */}
                  {(profile.socialLinks?.twitter || profile.socialLinks?.github) && (
                    <div className="flex gap-3 mt-4">
                      {profile.socialLinks.twitter && (
                        <a
                          href={`https://twitter.com/${profile.socialLinks.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-600 transition-all"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {profile.socialLinks.github && (
                        <a
                          href={`https://github.com/${profile.socialLinks.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-600 transition-all"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {profile.stats?.messageCount || 0}
                    </p>
                    <p className="text-gray-400 text-sm">Messages</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {profile.stats?.serverCount || 0}
                    </p>
                    <p className="text-gray-400 text-sm">Servers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {profile.stats?.friendCount || 0}
                    </p>
                    <p className="text-gray-400 text-sm">Friends</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Level Display */}
          <div className="mb-8">
            <LevelDisplay
              level={profile.level || 1}
              currentXP={profile.currentXP || 0}
              requiredXP={profile.requiredXP || 100}
              rank={profile.rank}
              size="large"
            />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700 mb-8">
            <div className="flex gap-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-blue-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="pb-8">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                  {/* Add recent activity component */}
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Featured Badges</h3>
                  {/* Add featured badges */}
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <BadgeList
                badges={profile.badges || []}
                unlockedBadges={profile.unlockedBadges || []}
              />
            )}

            {activeTab === 'activity' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Activity History</h3>
                {/* Add activity history component */}
              </div>
            )}

            {activeTab === 'servers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Add server list */}
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <Modal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            title="Edit Profile"
            size="large"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full text-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Banner
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="w-full text-gray-300"
                />
              </div>

              <Input
                label="Username"
                value={editFormData.username}
                onChange={(e) => setEditFormData(prev => ({ ...prev, username: e.target.value }))}
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <Input
                label="Location"
                value={editFormData.location}
                onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                icon={MapPin}
              />

              <Input
                label="Website"
                value={editFormData.website}
                onChange={(e) => setEditFormData(prev => ({ ...prev, website: e.target.value }))}
                icon={LinkIcon}
              />

              <Input
                label="Twitter Username"
                value={editFormData.twitter}
                onChange={(e) => setEditFormData(prev => ({ ...prev, twitter: e.target.value }))}
                icon={Twitter}
              />

              <Input
                label="GitHub Username"
                value={editFormData.github}
                onChange={(e) => setEditFormData(prev => ({ ...prev, github: e.target.value }))}
                icon={Github}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  onClick={handleEditProfile}
                  fullWidth
                >
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Profile;