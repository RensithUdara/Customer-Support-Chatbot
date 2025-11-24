// Import comprehensive data
import * as comprehensiveData from './comprehensiveData.json';

// Convert JSON data to the format expected by our database
export const faqData = comprehensiveData.faqs.map(faq => ({
    category: faq.category,
    question_example: faq.question,
    answer_text: faq.answer
}));

export const productsData = comprehensiveData.products.map(product => ({
    name: product.name,
    category: product.category,
    brand: product.name.split(' ')[0], // Extract brand from name
    price: product.price,
    description: `High-quality ${product.category.toLowerCase()} product with latest features and excellent performance`,
    tags: `${product.category.toLowerCase()},popular,quality,reliable`
}));

export const ordersData = comprehensiveData.orders.map(order => ({
    id: order.order_id,
    customer_name: order.customer,
    product_id: order.product_id,
    order_date: order.order_date,
    delivery_date: order.delivery_date,
    status: order.status
}));

console.log(`✅ Loaded ${faqData.length} FAQs, ${productsData.length} Products, ${ordersData.length} Orders from comprehensive dataset`);