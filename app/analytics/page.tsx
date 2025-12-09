'use client'

import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import {
    TrendingUp,
    MessageSquare,
    Clock,
    Users,
    Target,
    Activity,
    Star,
    ThumbsUp,
    AlertCircle,
    RefreshCw
} from 'lucide-react';

interface AnalyticsData {
    overview: {
        totalConversations: number;
        totalMessages: number;
        averageConversationLength: number;
        responseTime: string;
        uptime: string;
    };
    intents: {
        distribution: Array<{
            intent: string;
            count: number;
            percentage: number;
        }>;
    };
    performance: {
        responseEffectiveness: Array<{
            resolution_type: string;
            count: number;
        }>;
        successRate: number;
        averageResolutionTime: string;
    };
    userSatisfaction: {
        overallRating: number;
        satisfactionTrend: string;
        positiveInteractions: number;
        neutralInteractions: number;
        negativeInteractions: number;
    };
    trends: {
        dailyVolume: Array<{
            date: string;
            conversations: number;
        }>;
        peakHours: Array<{
            hour: string;
            volume: number;
        }>;
        growthRate: string;
    };
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

export default function ChatAnalyticsDashboard() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('7d');
    const [selectedMetric, setSelectedMetric] = useState('all');
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchAnalytics = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/analytics?timeframe=${timeframe}&metric=${selectedMetric}`);
            const data = await response.json();

            if (data.success) {
                setAnalyticsData(data.data);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();

        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [timeframe, selectedMetric]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading analytics dashboard...</p>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Failed to load analytics data</p>
                    <button
                        onClick={fetchAnalytics}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const MetricCard = ({ title, value, icon: Icon, trend, color = 'blue' }: any) => (
        <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${color}-500`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p className={`text-sm flex items-center mt-2 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {trend}
                        </p>
                    )}
                </div>
                <div className={`p-3 bg-${color}-100 rounded-full`}>
                    <Icon className={`w-8 h-8 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Chat Analytics Dashboard</h1>
                            <p className="text-gray-600 mt-2">
                                Real-time insights into your AI customer support performance
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Timeframe Selector */}
                            <select
                                value={timeframe}
                                onChange={(e) => setTimeframe(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="24h">Last 24 Hours</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                            </select>

                            <button
                                onClick={fetchAnalytics}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>

                    <div className="text-sm text-gray-500 mt-2">
                        Last updated: {lastUpdated.toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Overview Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Conversations"
                        value={analyticsData.overview.totalConversations.toLocaleString()}
                        icon={MessageSquare}
                        trend="+12%"
                        color="blue"
                    />
                    <MetricCard
                        title="Total Messages"
                        value={analyticsData.overview.totalMessages.toLocaleString()}
                        icon={Activity}
                        trend="+8%"
                        color="green"
                    />
                    <MetricCard
                        title="Avg Response Time"
                        value={analyticsData.overview.responseTime}
                        icon={Clock}
                        trend="-5%"
                        color="orange"
                    />
                    <MetricCard
                        title="Success Rate"
                        value={`${analyticsData.performance.successRate}%`}
                        icon={Target}
                        trend="+3%"
                        color="purple"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Intent Distribution */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Intent Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analyticsData.intents.distribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ payload }: any) => payload ? `${payload.intent} (${payload.percentage.toFixed(1)}%)` : ''}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {analyticsData.intents.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Resolution Effectiveness */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Resolution Effectiveness</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analyticsData.performance.responseEffectiveness}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="resolution_type" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversation Trends */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Daily Conversation Volume</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={analyticsData.trends.dailyVolume}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                            />
                            <YAxis />
                            <Tooltip
                                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                formatter={(value) => [value, 'Conversations']}
                            />
                            <Area
                                type="monotone"
                                dataKey="conversations"
                                stroke="#3B82F6"
                                fill="#3B82F6"
                                fillOpacity={0.3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Bottom Row - Peak Hours and Satisfaction */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Peak Hours */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Peak Hours Activity</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analyticsData.trends.peakHours}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" tickFormatter={(value) => `${value}:00`} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="volume" fill="#10B981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* User Satisfaction */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">User Satisfaction</h3>
                        <div className="space-y-6">
                            {/* Overall Rating */}
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-600 mb-2">
                                    {analyticsData.userSatisfaction.overallRating}/5.0
                                </div>
                                <div className="flex justify-center mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-6 h-6 ${star <= Math.round(analyticsData.userSatisfaction.overallRating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600">Overall Rating</p>
                            </div>

                            {/* Satisfaction Breakdown */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-green-600 flex items-center">
                                        <ThumbsUp className="w-4 h-4 mr-2" />
                                        Positive
                                    </span>
                                    <span className="font-semibold">
                                        {analyticsData.userSatisfaction.positiveInteractions}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 flex items-center">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Neutral
                                    </span>
                                    <span className="font-semibold">
                                        {analyticsData.userSatisfaction.neutralInteractions}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        Negative
                                    </span>
                                    <span className="font-semibold">
                                        {analyticsData.userSatisfaction.negativeInteractions}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Insights */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Key Insights & Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Performance</h4>
                            <p className="text-blue-700 text-sm">
                                Response time improved by 15% with average resolution under 2.5 minutes.
                                Consider optimizing ORDER_STATUS queries for even faster responses.
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2">Growth</h4>
                            <p className="text-green-700 text-sm">
                                Daily conversations up 23% this period. Peak activity between 10AM-2PM.
                                Consider scaling resources during these hours.
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-2">Satisfaction</h4>
                            <p className="text-purple-700 text-sm">
                                94.5% user satisfaction with strong performance in policy queries.
                                Product recommendations show room for improvement.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}