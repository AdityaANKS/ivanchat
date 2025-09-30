import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Users, MessageSquare, Server,
  Calendar, Download, RefreshCw, Filter, Eye, Clock,
  Activity, PieChart, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell
} from 'recharts';
import api from '../../services/api';
import Button from '../common/Button';
import Loader from '../common/Loader';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
  ];

  const metrics = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'servers', label: 'Servers', icon: Server },
    { id: 'engagement', label: 'Engagement', icon: Activity },
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, selectedMetric]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics', {
        params: { timeRange, metric: selectedMetric }
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics/export', {
        params: { timeRange, metric: selectedMetric },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${timeRange}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Failed to export analytics:', error);
    }
  };

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="analytics">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
            <p className="text-gray-400 mt-1">
              Track system performance and user engagement
            </p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <Button
              variant="secondary"
              icon={RefreshCw}
              onClick={fetchAnalytics}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              icon={Download}
              onClick={exportAnalytics}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Metric Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {metrics.map(metric => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                selectedMetric === metric.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <metric.icon className="w-4 h-4" />
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Users"
          value={analyticsData?.metrics?.totalUsers || 0}
          change={analyticsData?.metrics?.userGrowth || 0}
          icon={Users}
        />
        <MetricCard
          title="Active Users"
          value={analyticsData?.metrics?.activeUsers || 0}
          change={analyticsData?.metrics?.activeUserGrowth || 0}
          icon={Activity}
        />
        <MetricCard
          title="Messages Sent"
          value={analyticsData?.metrics?.messagesSent || 0}
          change={analyticsData?.metrics?.messageGrowth || 0}
          icon={MessageSquare}
        />
        <MetricCard
          title="Server Count"
          value={analyticsData?.metrics?.serverCount || 0}
          change={analyticsData?.metrics?.serverGrowth || 0}
          icon={Server}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <ChartCard title="User Growth" icon={Users}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData?.userGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Message Activity Chart */}
        <ChartCard title="Message Activity" icon={MessageSquare}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData?.messageActivity || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line
                type="monotone"
                dataKey="messages"
                stroke="#8B5CF6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Server Distribution */}
        <ChartCard title="Server Categories" icon={PieChart}>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={analyticsData?.serverCategories || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(analyticsData?.serverCategories || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Peak Activity Hours */}
        <ChartCard title="Peak Activity Hours" icon={Clock}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData?.peakHours || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Bar dataKey="activity" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Detailed Tables */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Servers */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Servers</h3>
          <div className="space-y-3">
            {(analyticsData?.topServers || []).map((server, index) => (
              <div key={server.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="text-white font-medium">{server.name}</p>
                    <p className="text-gray-400 text-sm">{server.memberCount} members</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white">{server.messageCount}</p>
                  <p className="text-gray-400 text-sm">messages</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trends */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Trends</h3>
          <div className="space-y-3">
            {(analyticsData?.trends || []).map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {trend.direction === 'up' ? (
                    <ArrowUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <ArrowDown className="w-5 h-5 text-red-400" />
                  )}
                  <div>
                    <p className="text-white">{trend.metric}</p>
                    <p className="text-gray-400 text-sm">{trend.description}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${
                  trend.direction === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {trend.change}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const MetricCard = ({ title, value, change, icon: Icon }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-600 bg-opacity-20 rounded-lg">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-white mt-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
};

const ChartCard = ({ title, icon: Icon, children }) => (
  <div className="bg-gray-800 rounded-lg p-6">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-gray-400" />
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

export default Analytics;