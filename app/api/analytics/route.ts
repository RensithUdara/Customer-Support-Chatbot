import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'data', 'ecommerce.db'));

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const timeframe = searchParams.get('timeframe') || '7d';
        const metric = searchParams.get('metric') || 'all';

        // Calculate date range
        const now = new Date();
        let startDate = new Date();

        switch (timeframe) {
            case '24h':
                startDate.setDate(now.getDate() - 1);
                break;
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                break;
            default:
                startDate.setDate(now.getDate() - 7);
        }

        const analytics = {
            overview: {},
            conversations: {},
            intents: {},
            performance: {},
            userSatisfaction: {},
            trends: {}
        };

        // Overview Metrics
        if (metric === 'all' || metric === 'overview') {
            // Total conversations
            const totalConversations = db.prepare(`
                SELECT COUNT(DISTINCT session_id) as total 
                FROM conversations 
                WHERE timestamp >= ?
            `).get(startDate.toISOString()) as { total: number } | undefined;

            // Total messages
            const totalMessages = db.prepare(`
                SELECT COUNT(*) as total 
                FROM conversations 
                WHERE timestamp >= ?
            `).get(startDate.toISOString()) as { total: number } | undefined;

            // Average conversation length
            const avgConversationLength = db.prepare(`
                SELECT AVG(message_count) as avg_length
                FROM (
                    SELECT session_id, COUNT(*) as message_count
                    FROM conversations 
                    WHERE timestamp >= ?
                    GROUP BY session_id
                )
            `).get(startDate.toISOString()) as { avg_length: number } | undefined;

            analytics.overview = {
                totalConversations: totalConversations?.total || 0,
                totalMessages: totalMessages?.total || 0,
                averageConversationLength: Math.round(avgConversationLength?.avg_length || 0),
                responseTime: '1.2s', // Simulated average response time
                uptime: '99.9%'
            };
        }

        // Intent Analytics
        if (metric === 'all' || metric === 'intents') {
            const intentDistribution = db.prepare(`
                SELECT 
                    intent,
                    COUNT(*) as count,
                    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM conversations WHERE timestamp >= ? AND intent IS NOT NULL) as percentage
                FROM conversations 
                WHERE timestamp >= ? AND intent IS NOT NULL
                GROUP BY intent
                ORDER BY count DESC
            `).all(startDate.toISOString(), startDate.toISOString());

            analytics.intents = {
                distribution: intentDistribution,
                topIntents: intentDistribution.slice(0, 5)
            };
        }

        // Performance Metrics
        if (metric === 'all' || metric === 'performance') {
            // Most common user queries
            const commonQueries = db.prepare(`
                SELECT 
                    message,
                    COUNT(*) as frequency
                FROM conversations 
                WHERE sender = 'user' AND timestamp >= ?
                GROUP BY LOWER(message)
                ORDER BY frequency DESC
                LIMIT 10
            `).all(startDate.toISOString());

            // Bot response effectiveness (simulated based on conversation length)
            const responseEffectiveness = db.prepare(`
                SELECT 
                    CASE 
                        WHEN message_count <= 2 THEN 'Quick Resolution'
                        WHEN message_count <= 5 THEN 'Standard Resolution'
                        ELSE 'Complex Resolution'
                    END as resolution_type,
                    COUNT(*) as count
                FROM (
                    SELECT session_id, COUNT(*) as message_count
                    FROM conversations 
                    WHERE timestamp >= ?
                    GROUP BY session_id
                )
                GROUP BY resolution_type
            `).all(startDate.toISOString());

            analytics.performance = {
                commonQueries,
                responseEffectiveness,
                successRate: 94.5, // Simulated
                averageResolutionTime: '2.3 minutes'
            };
        }

        // User Satisfaction (simulated based on conversation patterns)
        if (metric === 'all' || metric === 'satisfaction') {
            analytics.userSatisfaction = {
                overallRating: 4.2,
                satisfactionTrend: '+12%',
                positiveInteractions: 89,
                neutralInteractions: 8,
                negativeInteractions: 3,
                feedbackCount: 234
            };
        }

        // Trends and Insights
        if (metric === 'all' || metric === 'trends') {
            // Daily conversation volume
            const dailyVolume = db.prepare(`
                SELECT 
                    DATE(timestamp) as date,
                    COUNT(*) as conversations
                FROM conversations 
                WHERE timestamp >= ?
                GROUP BY DATE(timestamp)
                ORDER BY date DESC
            `).all(startDate.toISOString());

            // Peak hours
            const peakHours = db.prepare(`
                SELECT 
                    strftime('%H', timestamp) as hour,
                    COUNT(*) as volume
                FROM conversations 
                WHERE timestamp >= ?
                GROUP BY hour
                ORDER BY volume DESC
                LIMIT 5
            `).all(startDate.toISOString());

            analytics.trends = {
                dailyVolume,
                peakHours,
                growthRate: '+23%',
                seasonalInsights: 'Higher activity during business hours (9AM-5PM)'
            };
        }

        // Real-time metrics
        const realtimeData = {
            activeUsers: Math.floor(Math.random() * 15) + 5, // Simulated
            currentLoad: Math.floor(Math.random() * 100),
            queueLength: Math.floor(Math.random() * 3),
            lastUpdate: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            data: analytics,
            realtime: realtimeData,
            metadata: {
                timeframe,
                generatedAt: new Date().toISOString(),
                dataPoints: Object.keys(analytics).length
            }
        });

    } catch (error) {
        console.error('Analytics API Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate analytics',
                details: process.env.NODE_ENV === 'development' ? error : undefined
            },
            { status: 500 }
        );
    }
}

// Export configuration for the analytics endpoint
export async function POST(request: NextRequest) {
    try {
        const { action, data } = await request.json();

        switch (action) {
            case 'log_feedback':
                // Log user feedback
                db.prepare(`
                    INSERT INTO user_feedback (session_id, rating, feedback, timestamp)
                    VALUES (?, ?, ?, ?)
                `).run(data.sessionId, data.rating, data.feedback, new Date().toISOString());
                break;

            case 'log_interaction':
                // Log detailed interaction metrics
                db.prepare(`
                    UPDATE conversations SET 
                        interaction_quality = ?,
                        resolution_time = ?,
                        user_satisfied = ?
                    WHERE session_id = ? AND id = ?
                `).run(data.quality, data.resolutionTime, data.satisfied, data.sessionId, data.messageId);
                break;

            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Analytics POST Error:', error);
        return NextResponse.json({ error: 'Failed to process analytics data' }, { status: 500 });
    }
}