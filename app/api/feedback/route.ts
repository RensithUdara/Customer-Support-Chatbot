import { NextRequest, NextResponse } from 'next/server';
import { saveFeedback, getFeedbackStats, getSessionFeedback } from '@/lib/db';

/**
 * POST /api/feedback
 * Save user feedback for a chatbot response
 * 
 * Request body:
 * {
 *   session_id: string,
 *   message_id: string,
 *   bot_response?: string,
 *   feedback_type: 'like' | 'dislike',
 *   feedback_rating?: number (1-5),
 *   user_comment?: string,
 *   intent?: string,
 *   confidence?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.session_id || !body.message_id || !body.feedback_type) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id, message_id, feedback_type' },
        { status: 400 }
      );
    }

    // Validate feedback_type
    if (!['like', 'dislike'].includes(body.feedback_type)) {
      return NextResponse.json(
        { error: 'Invalid feedback_type. Must be "like" or "dislike"' },
        { status: 400 }
      );
    }

    // Save feedback to database
    const success = saveFeedback({
      session_id: body.session_id,
      message_id: body.message_id,
      bot_response: body.bot_response,
      feedback_type: body.feedback_type,
      feedback_rating: body.feedback_rating,
      user_comment: body.user_comment,
      intent: body.intent,
      confidence: body.confidence
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Feedback saved successfully',
        data: {
          session_id: body.session_id,
          message_id: body.message_id,
          feedback_type: body.feedback_type,
          timestamp: new Date().toISOString()
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in feedback API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback?sessionId=...
 * Get feedback statistics for a session
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const action = searchParams.get('action');

    if (action === 'stats') {
      const stats = getFeedbackStats(sessionId || undefined);
      return NextResponse.json({ success: true, data: stats });
    }

    if (action === 'list' && sessionId) {
      const feedbacks = getSessionFeedback(sessionId);
      return NextResponse.json({ success: true, data: feedbacks });
    }

    // Default: return stats
    const stats = getFeedbackStats(sessionId || undefined);
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error in feedback GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
