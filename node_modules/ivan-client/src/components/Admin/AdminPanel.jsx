import React, { useState, useEffect } from 'react';
import { 
  Users, BarChart3, Shield, Settings, Server, MessageSquare, 
  AlertTriangle, Activity, Database, Cpu, HardDrive, Wifi,
  TrendingUp, TrendingDown, Clock, Ban, UserCheck, Globe
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import Loader from '../common/Loader';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [realtimeMetrics, setRealtimeMetrics] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'servers', label: 'Servers', icon: Server },
    { id: 'moderation', label: 'Moderation', icon: Shield },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'system', label: 'System Health', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    fetchAdminData();
    const interval = setInterval(fetchRealtimeMetrics, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, healthRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/system-health')
      ]);
      setStats(statsRes.data);
      setSystemHealth(healthRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeMetrics = async () => {
    try {
      const response = await api.get('/admin/realtime-metrics');
      setRealtimeMetrics(response.data);
    } catch (error) {
      console.error('Failed to fetch realtime metrics:', error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          change={stats?.userGrowth || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          subtitle="Last 24 hours"
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Total Messages"
          value={stats?.totalMessages || 0}
          change={stats?.messageGrowth || 0}
          icon={MessageSquare}
          color="purple"
        />
        <StatCard
          title="Total Servers"
          value={stats?.totalServers || 0}
          change={stats?.serverGrowth || 0}
          icon={Server}
          color="orange"
        />
      </div>

      {/* System Health */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          System Health
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HealthMetric
            label="CPU Usage"
            value={systemHealth?.cpu || 0}
            icon={Cpu}
            status={getHealthStatus(systemHealth?.cpu)}
          />
          <HealthMetric
            label="Memory Usage"
            value={systemHealth?.memory || 0}
            icon={HardDrive}
            status={getHealthStatus(systemHealth?.memory)}
          />
          <HealthMetric
            label="Network Latency"
            value={systemHealth?.latency || 0}
            unit="ms"
            icon={Wifi}
            status={systemHealth?.latency < 100 ? 'good' : 'warning'}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <ActivityFeed activities={stats?.recentActivities || []} />
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction
            label="Broadcast Message"
            icon={MessageSquare}
            onClick={() => handleQuickAction('broadcast')}
          />
          <QuickAction
            label="Clear Cache"
            icon={Database}
            onClick={() => handleQuickAction('clearCache')}
          />
          <QuickAction
            label="Export Reports"
            icon={BarChart3}
            onClick={() => handleQuickAction('export')}
          />
          <QuickAction
            label="System Backup"
            icon={Server}
            onClick={() => handleQuickAction('backup')}
          />
        </div>
      </div>
    </div>
  );

  const handleQuickAction = async (action) => {
    try {
      await api.post(`/admin/actions/${action}`);
      // Show success notification
    } catch (error) {
      console.error(`Failed to execute ${action}:`, error);
    }
  };

  const getHealthStatus = (value) => {
    if (value < 50) return 'good';
    if (value < 80) return 'warning';
    return 'critical';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <Analytics />;
      case 'servers':
        return <ServerManagement />;
      case 'moderation':
        return <ModerationPanel />;
      case 'messages':
        return <MessageManagement />;
      case 'system':
        return <SystemHealth health={systemHealth} metrics={realtimeMetrics} />;
      case 'settings':
        return <AdminSettings />;
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="admin-panel flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-4">
          <h2 className="text-xl font-bold text-white mb-2">Admin Panel</h2>
          <p className="text-gray-400 text-sm">System Management</p>
        </div>
        
        <nav className="mt-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-gray-700 text-white border-l-4 border-blue-500'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Admin Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user?.username}</p>
              <p className="text-gray-400 text-xs">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white capitalize">
              {activeSection.replace('-', ' ')}
            </h1>
            <p className="text-gray-400 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Sub-components
const StatCard = ({ title, value, change, subtitle, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]} bg-opacity-20`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            change >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-white mt-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );
};

const HealthMetric = ({ label, value, unit = '%', icon: Icon, status }) => {
  const statusColors = {
    good: 'text-green-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400',
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{label}</span>
        <Icon className={`w-4 h-4 ${statusColors[status]}`} />
      </div>
      <div className="flex items-end gap-1">
        <span className={`text-2xl font-bold ${statusColors[status]}`}>
          {value}
        </span>
        <span className="text-gray-400 text-sm mb-1">{unit}</span>
      </div>
      <div className="mt-2 bg-gray-600 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${
            status === 'good' ? 'bg-green-500' :
            status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities }) => (
  <div className="space-y-3">
    {activities.map((activity, index) => (
      <div key={index} className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
        <div className="flex-1">
          <p className="text-white text-sm">{activity.message}</p>
          <p className="text-gray-400 text-xs mt-1">
            {activity.user} • {activity.time}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const QuickAction = ({ label, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex flex-col items-center gap-2"
  >
    <Icon className="w-6 h-6 text-blue-400" />
    <span className="text-white text-sm">{label}</span>
  </button>
);

// Placeholder components for other sections
const ServerManagement = () => <div className="text-white">Server Management</div>;
const ModerationPanel = () => <div className="text-white">Moderation Panel</div>;
const MessageManagement = () => <div className="text-white">Message Management</div>;
const SystemHealth = ({ health, metrics }) => <div className="text-white">System Health Details</div>;
const AdminSettings = () => <div className="text-white">Admin Settings</div>;

export default AdminPanel;