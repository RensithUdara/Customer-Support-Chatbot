import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, getOrderById, getOrdersByCustomerEmail } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const orderId = searchParams.get('orderId');
        const email = searchParams.get('email');

        if (orderId) {
            // Get specific order by ID
            const order = getOrderById(orderId);
            if (order) {
                return NextResponse.json({ success: true, order });
            } else {
                return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
            }
        } else if (email) {
            // Get all orders for a customer by email
            const orders = getOrdersByCustomerEmail(email);
            return NextResponse.json({ success: true, orders, count: orders?.length || 0 });
        } else {
            // Get all orders (for admin/testing purposes)
            const orders = getAllOrders();
            return NextResponse.json({ success: true, orders, count: orders?.length || 0 });
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
